"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Points,
  Quaternion,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { generateTopology, VIEW, type Tone } from "./topology";

export interface PointerState {
  /** Normalized device coordinates relative to the canvas (-1..1). */
  x: number;
  y: number;
  inside: boolean;
}

/** Shared between the DOM (HeroNetwork) and the render loop; mutated in place, never via React state. */
export interface InteractionState {
  /** Hub index of the locked-in domain, or null. */
  selected: number | null;
  /** Hub index under the pointer, or -1. Written by the render loop. */
  hovered: number;
  /** Label elements for each hub, positioned from the render loop. */
  labels: (HTMLElement | null)[];
}

const TONES: Record<Tone, Color> = {
  blue: new Color("#3b82f6"),
  cyan: new Color("#06b6d4"),
  violet: new Color("#8b5cf6"),
};
const WHITE = new Color("#ffffff");
const BG = "#0b1020";
const FOG_NEAR = VIEW.cameraZ - 0.5;
const FOG_FAR = VIEW.cameraZ + 4.5;
const PACKET_COUNT = 12;
const RING_COUNT = 3;
const HUB_COUNT = 3;
const HOVER_RADIUS = 0.09;
const ANCHOR_HOVER_RADIUS = 0.16;
// Three packets per backbone link (lead + two fading followers) form a short trail between anchors.
const TRAIL = [
  { size: 0.17, lag: 0 },
  { size: 0.11, lag: 0.05 },
  { size: 0.07, lag: 0.1 },
];
const ANCHOR_PACKET_COUNT = HUB_COUNT * TRAIL.length;
const TOTAL_PACKETS = PACKET_COUNT + ANCHOR_PACKET_COUNT;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Deterministic spread across the 0.12-0.25 link opacity band.
const linkIntensity = (index: number) => 0.12 + ((index * 37) % 14) / 100;

// Soft additive sprites for node halos and packets; fog is applied by hand.
function createGlowMaterial(opacity: number) {
  return new ShaderMaterial({
    uniforms: {
      uScale: { value: 1 },
      uOpacity: { value: opacity },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute vec3 aColor;
      uniform float uScale;
      uniform float uFogNear;
      uniform float uFogFar;
      varying vec3 vColor;
      varying float vFog;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uScale / -mv.z;
        vColor = aColor;
        vFog = smoothstep(uFogNear, uFogFar, -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vFog;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, a * a * uOpacity * (1.0 - vFog));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

/**
 * Builds the whole scene imperatively. All mutable state and scratch objects live here
 * (allocated once), so the per-frame update allocates nothing and React never sees mutation.
 */
function createNetworkScene() {
  const topo = generateTopology({ hubs: HUB_COUNT });
  const { links, nodeLinks } = topo;
  // Spread positions (not radii) so nodes stay small relative to the mesh.
  const s = VIEW.worldScale;
  const nodes = topo.nodes.map((n) => ({ ...n, x: n.x * s, y: n.y * s, z: n.z * s }));
  const root = new Group();
  root.position.x = VIEW.offsetX;

  // Node cores: one instanced draw call
  const coreGeometry = new SphereGeometry(1, 16, 12);
  const coreMaterial = new MeshBasicMaterial({ toneMapped: false });
  const cores = new InstancedMesh(coreGeometry, coreMaterial, nodes.length);

  // Halos
  const haloGeometry = new BufferGeometry();
  const haloPos = new Float32Array(nodes.length * 3);
  const haloColor = new Float32Array(nodes.length * 3);
  const haloSize = new Float32Array(nodes.length);
  nodes.forEach((n, i) => {
    const c = TONES[n.tone];
    haloPos.set([n.x, n.y, n.z], i * 3);
    haloColor.set([c.r, c.g, c.b], i * 3);
    haloSize[i] = n.radius * (n.hub ? 8 : 6);
  });
  haloGeometry.setAttribute("position", new BufferAttribute(haloPos, 3));
  haloGeometry.setAttribute("aColor", new BufferAttribute(haloColor, 3));
  haloGeometry.setAttribute("aSize", new BufferAttribute(haloSize, 1));
  const haloMaterial = createGlowMaterial(0.55);
  const halos = new Points(haloGeometry, haloMaterial);

  // Links: additive blending on a dark scene, so vertex colour intensity acts as opacity
  const linkGeometry = new BufferGeometry();
  const linkPos = new Float32Array(links.length * 6);
  const linkColor = new Float32Array(links.length * 6);
  links.forEach(([a, b], i) => {
    linkPos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], i * 6);
  });
  linkGeometry.setAttribute("position", new BufferAttribute(linkPos, 3));
  const linkColorAttr = new BufferAttribute(linkColor, 3);
  linkGeometry.setAttribute("color", linkColorAttr);
  const linkMaterial = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
  });
  const lines = new LineSegments(linkGeometry, linkMaterial);

  // Packets
  const packetGeometry = new BufferGeometry();
  const packetPos = new Float32Array(TOTAL_PACKETS * 3);
  const packetColor = new Float32Array(TOTAL_PACKETS * 3).fill(1);
  for (let i = 0; i < PACKET_COUNT; i++) packetColor.set([0.88, 0.94, 1], i * 3);
  const packetSize = new Float32Array(TOTAL_PACKETS).fill(0.16);
  const packetPosAttr = new BufferAttribute(packetPos, 3);
  packetGeometry.setAttribute("position", packetPosAttr);
  packetGeometry.setAttribute("aColor", new BufferAttribute(packetColor, 3));
  packetGeometry.setAttribute("aSize", new BufferAttribute(packetSize, 1));
  const packetMaterial = createGlowMaterial(1);
  const packetPoints = new Points(packetGeometry, packetMaterial);
  packetPoints.frustumCulled = false;

  // Pulse rings on hubs
  const ringGeometry = new RingGeometry(0.92, 1, 48);
  const ringMaterials = Array.from(
    { length: RING_COUNT },
    () =>
      new MeshBasicMaterial({
        color: TONES.cyan,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      })
  );
  const rings = ringMaterials.map((material) => {
    const mesh = new Mesh(ringGeometry, material);
    mesh.visible = false;
    return mesh;
  });

  root.add(lines, cores, halos, packetPoints, ...rings);

  // Animation state + scratch objects
  const packets = Array.from({ length: PACKET_COUNT }, (_, i) => ({
    link: (i * 7) % links.length,
    forward: i % 2 === 0,
    t: i / PACKET_COUNT,
    duration: 1.6 + ((i * 13) % 10) / 10,
    fixed: false,
  }));
  // Anchor packets loop one way around the hub ring (0 -> 1 -> 2 -> 0) and never wander off it.
  for (let h = 0; h < HUB_COUNT; h++) {
    const next = (h + 1) % HUB_COUNT;
    const link = links.findIndex(([a, b]) => (a === h && b === next) || (a === next && b === h));
    TRAIL.forEach(({ size, lag }) => {
      const idx = packets.length;
      packets.push({
        link,
        forward: links[link][0] === h,
        t: (h / HUB_COUNT - lag + 1) % 1,
        duration: 2.8,
        fixed: true,
      });
      const c = TONES[nodes[h].tone].clone().lerp(WHITE, 0.5);
      packetColor.set([c.r, c.g, c.b], idx * 3);
      packetSize[idx] = size;
    });
  }
  const ringState = Array.from({ length: RING_COUNT }, () => ({ hub: 0, t: 1 }));
  let nextRingIn = 1.2;
  let autoRotation = 0;
  let parallaxX = 0;
  let parallaxY = 0;
  let elapsed = 0;
  let hoveredNode = -1;
  let selectedNode = -1;
  const tmp = new Vector3();
  const tmpMatrix = new Matrix4();
  const tmpColor = new Color();
  const tmpQuat = new Quaternion();
  const origin = new Vector3(0, 0, 0);

  function paintLink(index: number, strength: number) {
    const [a, b] = links[index];
    const ca = TONES[nodes[a].tone];
    const cb = TONES[nodes[b].tone];
    const o = index * 6;
    linkColor[o] = ca.r * strength;
    linkColor[o + 1] = ca.g * strength;
    linkColor[o + 2] = ca.b * strength;
    linkColor[o + 3] = cb.r * strength;
    linkColor[o + 4] = cb.g * strength;
    linkColor[o + 5] = cb.b * strength;
  }

  function paintNode(index: number, highlighted: boolean) {
    const n = nodes[index];
    const scale = n.radius * (highlighted ? 1.5 : 1);
    tmpMatrix.makeScale(scale, scale, scale).setPosition(n.x, n.y, n.z);
    cores.setMatrixAt(index, tmpMatrix);
    tmpColor.copy(TONES[n.tone]);
    if (n.hub) tmpColor.lerp(WHITE, 0.25);
    if (highlighted) tmpColor.lerp(WHITE, 0.55);
    cores.setColorAt(index, tmpColor);
  }

  const linkStrength = (l: number) => {
    const [a, b] = links[l];
    const lit = a === hoveredNode || b === hoveredNode || a === selectedNode || b === selectedNode;
    return lit ? 0.75 : linkIntensity(l);
  };

  /** Repaint one node and its links from the current hover/selection state. */
  function refreshNode(i: number) {
    if (i < 0) return;
    paintNode(i, i === hoveredNode || i === selectedNode);
    for (const l of nodeLinks[i]) paintLink(l, linkStrength(l));
  }

  function flushHighlights() {
    cores.instanceMatrix.needsUpdate = true;
    if (cores.instanceColor) cores.instanceColor.needsUpdate = true;
    linkColorAttr.needsUpdate = true;
  }

  for (let i = 0; i < nodes.length; i++) paintNode(i, false);
  for (let i = 0; i < links.length; i++) paintLink(i, linkIntensity(i));
  flushHighlights();

  function update(state: RootState, rawDelta: number, pointer: PointerState, interaction: InteractionState) {
    const delta = Math.min(rawDelta, 0.05);
    const camera = state.camera;
    elapsed += delta;

    // Slow oscillating rotation + lerped mouse parallax
    autoRotation += delta * 0.06;
    const k = 1 - Math.exp(-delta * 3);
    parallaxX += ((pointer.inside ? pointer.x : 0) * 0.15 - parallaxX) * k;
    parallaxY += ((pointer.inside ? -pointer.y : 0) * 0.1 - parallaxY) * k;
    root.rotation.y = Math.sin(autoRotation) * VIEW.swingY + parallaxX;
    root.rotation.x = VIEW.tiltX + parallaxY;

    // Subtle camera drift
    camera.position.x = Math.sin(elapsed * 0.13) * 0.15;
    camera.position.y = Math.sin(elapsed * 0.09) * 0.1;
    camera.lookAt(origin);

    // Packets walk the graph link by link with eased motion; anchor packets loop the hub ring
    for (let i = 0; i < TOTAL_PACKETS; i++) {
      const pk = packets[i];
      pk.t += delta / pk.duration;
      if (pk.fixed) {
        if (pk.t >= 1) pk.t -= 1;
      } else if (pk.t >= 1) {
        const arrived = pk.forward ? links[pk.link][1] : links[pk.link][0];
        const options = nodeLinks[arrived];
        pk.link = options[Math.floor(Math.random() * options.length)];
        pk.forward = links[pk.link][0] === arrived;
        pk.t = 0;
      }
      const from = nodes[pk.forward ? links[pk.link][0] : links[pk.link][1]];
      const to = nodes[pk.forward ? links[pk.link][1] : links[pk.link][0]];
      const e = easeInOutCubic(pk.t);
      packetPos[i * 3] = from.x + (to.x - from.x) * e;
      packetPos[i * 3 + 1] = from.y + (to.y - from.y) * e;
      packetPos[i * 3 + 2] = from.z + (to.z - from.z) * e;
    }
    packetPosAttr.needsUpdate = true;

    // Occasional pulse rings on hubs, billboarded toward the camera
    nextRingIn -= delta;
    if (nextRingIn <= 0) {
      const free = ringState.find((r) => r.t >= 1);
      if (free) {
        free.t = 0;
        free.hub = interaction.selected ?? Math.floor(Math.random() * HUB_COUNT);
      }
      nextRingIn = 1.8 + Math.random() * 1.6;
    }
    // local = inverse(parentWorld) * camera, so rings face the camera inside the rotating group
    root.getWorldQuaternion(tmpQuat).invert().multiply(camera.quaternion);
    for (let i = 0; i < RING_COUNT; i++) {
      const ring = rings[i];
      const rs = ringState[i];
      if (rs.t >= 1) {
        ring.visible = false;
        continue;
      }
      rs.t = Math.min(1, rs.t + delta / 1.6);
      const hub = nodes[rs.hub];
      ring.visible = true;
      ring.position.set(hub.x, hub.y, hub.z);
      ring.quaternion.copy(tmpQuat);
      ring.scale.setScalar(hub.radius * (1.4 + 3.2 * easeOutCubic(rs.t)));
      ringMaterials[i].opacity = (1 - rs.t) * 0.55;
    }

    // Anchors: position their DOM labels and find which one (if any) is under the pointer
    camera.updateMatrixWorld();
    root.updateMatrixWorld(true);
    const aspect = state.size.width / state.size.height;
    let hoveredAnchor = -1;
    let bestAnchor = ANCHOR_HOVER_RADIUS;
    for (let h = 0; h < HUB_COUNT; h++) {
      tmp.set(nodes[h].x, nodes[h].y, nodes[h].z).applyMatrix4(root.matrixWorld).project(camera);
      const label = interaction.labels[h];
      if (label) {
        const px = (tmp.x * 0.5 + 0.5) * state.size.width;
        const py = (-tmp.y * 0.5 + 0.5) * state.size.height;
        label.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, 14px)`;
      }
      if (pointer.inside) {
        const d = Math.hypot((tmp.x - pointer.x) * aspect, tmp.y - pointer.y);
        if (d < bestAnchor) {
          bestAnchor = d;
          hoveredAnchor = h;
        }
      }
    }
    interaction.hovered = hoveredAnchor;
    interaction.labels.forEach((label, h) => {
      const value = h === hoveredAnchor ? "1" : "0";
      if (label && label.dataset.hover !== value) label.dataset.hover = value;
    });

    // Hover: brighten the node nearest the pointer and its links (anchors win over workers)
    let hovered = hoveredAnchor;
    if (hovered === -1 && pointer.inside) {
      let best = HOVER_RADIUS;
      for (let i = 0; i < nodes.length; i++) {
        tmp.set(nodes[i].x, nodes[i].y, nodes[i].z).applyMatrix4(root.matrixWorld).project(camera);
        const d = Math.hypot((tmp.x - pointer.x) * aspect, tmp.y - pointer.y);
        if (d < best) {
          best = d;
          hovered = i;
        }
      }
    }
    const selected = interaction.selected ?? -1;
    if (hovered !== hoveredNode || selected !== selectedNode) {
      const previous = [hoveredNode, selectedNode];
      hoveredNode = hovered;
      selectedNode = selected;
      previous.forEach(refreshNode);
      refreshNode(hoveredNode);
      refreshNode(selectedNode);
      flushHighlights();
    }
  }

  /** Point sprites are sized in world units; convert to device pixels. */
  function setViewport(heightPx: number, dpr: number, fovDeg: number) {
    const scale = (heightPx * dpr) / (2 * Math.tan((fovDeg * Math.PI) / 360));
    haloMaterial.uniforms.uScale.value = scale;
    packetMaterial.uniforms.uScale.value = scale;
  }

  function dispose() {
    root.removeFromParent();
    cores.dispose();
    coreGeometry.dispose();
    coreMaterial.dispose();
    haloGeometry.dispose();
    haloMaterial.dispose();
    linkGeometry.dispose();
    linkMaterial.dispose();
    packetGeometry.dispose();
    packetMaterial.dispose();
    ringGeometry.dispose();
    ringMaterials.forEach((m) => m.dispose());
  }

  return { root, update, setViewport, dispose };
}

type NetworkScene = ReturnType<typeof createNetworkScene>;

function Scene({ pointer, interaction }: { pointer: RefObject<PointerState>; interaction: RefObject<InteractionState> }) {
  const camera = useThree((s) => s.camera);
  const height = useThree((s) => s.size.height);
  const dpr = useThree((s) => s.viewport.dpr);
  const mountRef = useRef<Group>(null);
  const sceneRef = useRef<NetworkScene | null>(null);

  useLayoutEffect(() => {
    const scene = createNetworkScene();
    mountRef.current?.add(scene.root);
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const fov = "fov" in camera ? (camera as { fov: number }).fov : 45;
    sceneRef.current?.setViewport(height, dpr, fov);
  }, [camera, height, dpr]);

  useFrame((state, delta) => {
    sceneRef.current?.update(state, delta, pointer.current, interaction.current);
  });

  return (
    <>
      <fog attach="fog" args={[BG, FOG_NEAR, FOG_FAR]} />
      <group ref={mountRef} />
    </>
  );
}

interface NetworkTopologyProps {
  /** Render loop runs only while the hero is on screen and the tab is visible. */
  active: boolean;
  pointer: RefObject<PointerState>;
  interaction: RefObject<InteractionState>;
}

export default function NetworkTopology({ active, pointer, interaction }: NetworkTopologyProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, VIEW.cameraZ], fov: VIEW.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Scene pointer={pointer} interaction={interaction} />
    </Canvas>
  );
}
