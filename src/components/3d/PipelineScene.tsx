"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  HalfFloatType,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Raycaster,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
  FogExp2,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/*
 * Cinematic DevOps pipeline: an elevated, lit deck that carries data packets past three glass nodes
 * (CN, CC, DevOps). Built imperatively with plain three.js so the per-frame update allocates nothing
 * and React never sees mutation. Only mounted on desktop with WebGL and effects on; every other case
 * falls back to the existing static SVG network.
 */

interface PipelineSceneProps {
  /** Hub index of the locked-in domain, or null. */
  selected: number | null;
  onSelect: (hub: number) => void;
}

const HW = 2.25; // deck half width
const HH = 0.2; // deck half thickness
const LUT_N = 700;
const CUBES = [
  { t: 0.49, hex: "#3fd0c0", lat: 0.5, s: 0.44, hub: -1 },
  { t: 0.44, hex: "#5aa0ff", lat: -0.3, s: 0.62, hub: 0 },
  { t: 0.57, hex: "#22d3ee", lat: 0.2, s: 0.7, hub: 1 },
  { t: 0.64, hex: "#ffc48a", lat: -0.5, s: 0.44, hub: -1 },
  { t: 0.71, hex: "#a78bfa", lat: 0.15, s: 0.6, hub: 2 },
];

interface Frame {
  p: Vector3;
  T: Vector3;
  S: Vector3;
  U: Vector3;
}

function glowTexture(alpha: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1].forEach((k) => g.addColorStop(k, `rgba(255,255,255,${(alpha * Math.pow(1 - k, 2.4)).toFixed(4)})`));
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export default function PipelineScene({ selected, onSelect }: PipelineSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ selected, onSelect });

  useEffect(() => {
    stateRef.current = { selected, onSelect };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new Scene();
    scene.fog = new FogExp2(0x000000, 0.016);
    const camera = new PerspectiveCamera(32, 1, 0.1, 120);
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    /* Environment used only for reflections */
    const envScene = new Scene();
    envScene.add(new Mesh(track(new BoxGeometry(34, 16, 34)), track(new MeshBasicMaterial({ color: 0x010305, side: BackSide }))));
    const panel = (w: number, h: number, hex: number, k: number, x: number, y: number, z: number) => {
      const m = new Mesh(
        track(new PlaneGeometry(w, h)),
        track(new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(k), side: DoubleSide }))
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    };
    panel(16, 1.2, 0xffffff, 4.5, 0, 7, -2);
    panel(1.4, 8, 0x22d3ee, 3, -13, 1, 2);
    panel(10, 1, 0x22d3ee, 1.5, 2, -6, 6);
    panel(1.6, 3, 0xffa95c, 5, 12, 2, -4);
    const pmrem = new PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(envScene, 0.03);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    /* Path and a lookup of frames along it */
    const curve = new CatmullRomCurve3(
      [
        new Vector3(-18, -3.6, 3.2),
        new Vector3(-9, -2.5, 1.8),
        new Vector3(-2.5, -1.1, 0.6),
        new Vector3(4, 0, -0.3),
        new Vector3(10, 0.1, -1.2),
        new Vector3(18, -1.6, -2.6),
      ],
      false,
      "catmullrom",
      0.5
    );
    const UP = new Vector3(0, 1, 0);
    const lut: Frame[] = [];
    for (let i = 0; i <= LUT_N; i++) {
      const p = curve.getPointAt(i / LUT_N);
      const T = curve.getTangentAt(i / LUT_N).normalize();
      const S = new Vector3().crossVectors(T, UP).normalize();
      const U = new Vector3().crossVectors(S, T).normalize();
      lut.push({ p, T, S, U });
    }
    const frame = (t: number) => lut[Math.round(Math.min(Math.max(t, 0), 1) * LUT_N)];
    const basis = (f: Frame) => new Matrix4().makeBasis(f.T, f.U, f.S);
    const length = curve.getLength();

    const strip = (a: [number, number], b: [number, number], rows: number, vScale: number) => {
      const pos: number[] = [];
      const uv: number[] = [];
      const idx: number[] = [];
      for (let i = 0; i <= rows; i++) {
        const f = frame(i / rows);
        const v = ((i / rows) * length) / vScale;
        const p0 = f.p.clone().addScaledVector(f.S, a[0]).addScaledVector(f.U, a[1]);
        const p1 = f.p.clone().addScaledVector(f.S, b[0]).addScaledVector(f.U, b[1]);
        pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
        uv.push(0, v, 1, v);
        if (i < rows) {
          const k = i * 2;
          idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
        }
      }
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return track(g);
    };

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const deckTexture = (() => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 64;
      const x = c.getContext("2d")!;
      x.fillStyle = "#0a0d11";
      x.fillRect(0, 0, 1024, 64);
      for (let i = 0; i < 1024; i += 7) {
        x.fillStyle = i % 56 === 0 ? "#38444f" : "#1b222a";
        x.fillRect(i, 0, 2, 64);
      }
      x.fillStyle = "#2a343e";
      x.fillRect(0, 0, 26, 64);
      x.fillRect(998, 0, 26, 64);
      x.fillStyle = "#030507";
      x.fillRect(0, 0, 1024, 2);
      const t = new CanvasTexture(c);
      t.colorSpace = SRGBColorSpace;
      t.wrapT = RepeatWrapping;
      t.anisotropy = maxAniso;
      return track(t);
    })();
    const sideGlow = (() => {
      const c = document.createElement("canvas");
      c.width = 4;
      c.height = 128;
      const x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, "#000");
      g.addColorStop(0.55, "#02161a");
      g.addColorStop(1, "#1fb6cc");
      x.fillStyle = g;
      x.fillRect(0, 0, 4, 128);
      const t = new CanvasTexture(c);
      t.colorSpace = SRGBColorSpace;
      return track(t);
    })();

    const ROWS = 260;
    const root = new Group();
    scene.add(root);
    const topMat = track(new MeshStandardMaterial({ color: 0xffffff, map: deckTexture, metalness: 0.9, roughness: 0.34, envMapIntensity: 1.15 }));
    const sideMat = track(
      new MeshStandardMaterial({
        color: 0x07090c,
        metalness: 0.95,
        roughness: 0.22,
        emissive: 0xffffff,
        emissiveMap: sideGlow,
        emissiveIntensity: 1.1,
        side: DoubleSide,
      })
    );
    const botMat = track(new MeshStandardMaterial({ color: 0x05070a, metalness: 0.9, roughness: 0.3, side: DoubleSide }));
    root.add(
      new Mesh(strip([-HW, HH], [HW, HH], ROWS, 5.5), topMat),
      new Mesh(strip([HW, HH], [HW, -HH], ROWS, 5.5), sideMat),
      new Mesh(strip([-HW, -HH], [-HW, HH], ROWS, 5.5), sideMat),
      new Mesh(strip([HW, -HH], [-HW, -HH], ROWS, 5.5), botMat)
    );
    const edge = (lat: number, vert: number, radius: number, hex: number, k: number) => {
      const pts: Vector3[] = [];
      for (let i = 0; i <= 120; i++) {
        const f = frame(i / 120);
        pts.push(f.p.clone().addScaledVector(f.S, lat).addScaledVector(f.U, vert));
      }
      root.add(
        new Mesh(
          track(new TubeGeometry(new CatmullRomCurve3(pts), 360, radius, 6, false)),
          track(new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(k) }))
        )
      );
    };
    edge(HW + 0.01, HH + 0.005, 0.02, 0x7ff0ff, 1.5);
    edge(-HW - 0.01, HH + 0.005, 0.016, 0x3fc8dc, 0.9);
    edge(HW + 0.01, -HH, 0.026, 0x22d3ee, 1.2);
    [-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].forEach((l) => edge(l, HH + 0.004, 0.005, 0x6c7d8a, 0.55));

    /* Lighting. Physical light units: values are roughly the old legacy values times pi. */
    const underLights = [
      [-8, -3.8, 2.4],
      [-1, -2.2, 1.4],
      [6, -1.4, 0.6],
    ].map(([x, y, z]) => {
      const l = new PointLight(0x22d3ee, 8, 8, 2);
      l.position.set(x, y, z);
      scene.add(l);
      return l;
    });
    const rim = new DirectionalLight(0xdff6ff, 4.4);
    rim.position.set(-6, 9, -7);
    scene.add(rim);
    const warm = new PointLight(0xff9a4d, 7, 5, 2);
    warm.position.set(11, 1.3, -0.6);
    scene.add(warm);
    scene.add(new AmbientLight(0x0a1418, 1.8));

    /* Glass nodes */
    const poolTexture = track(glowTexture(0.9));
    const cubes = CUBES.map((d, i) => {
      const f = frame(d.t);
      const col = new Color(d.hex);
      const g = new Group();
      g.position.copy(f.p).addScaledVector(f.S, d.lat).addScaledVector(f.U, HH + d.s * 0.5 + 0.06);
      g.quaternion.setFromRotationMatrix(basis(f));
      const inner = new Group();
      g.add(inner);
      const box = track(new BoxGeometry(d.s, d.s, d.s));
      inner.add(
        new Mesh(
          box,
          track(
            new MeshPhysicalMaterial({
              color: col,
              transparent: true,
              opacity: 0.26,
              roughness: 0.05,
              metalness: 0,
              clearcoat: 1,
              clearcoatRoughness: 0.05,
              envMapIntensity: 2.2,
              depthWrite: false,
            })
          )
        )
      );
      inner.add(
        new Mesh(track(new BoxGeometry(d.s * 0.4, d.s * 0.4, d.s * 0.4)), track(new MeshBasicMaterial({ color: col.clone().multiplyScalar(2.4) })))
      );
      inner.add(
        new LineSegments(
          track(new EdgesGeometry(box)),
          track(new LineBasicMaterial({ color: col.clone().multiplyScalar(1.6), transparent: true, opacity: 0.7 }))
        )
      );
      const light = new PointLight(col, 7.5, 4.6, 2);
      g.add(light);
      const poolMat = track(
        new MeshBasicMaterial({
          map: poolTexture,
          color: col,
          blending: AdditiveBlending,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
          fog: false,
        })
      );
      const pool = new Mesh(track(new PlaneGeometry(d.s * 3.6, d.s * 3.6).rotateX(-Math.PI / 2)), poolMat);
      pool.position.copy(f.p).addScaledVector(f.S, d.lat).addScaledVector(f.U, HH + 0.012);
      pool.quaternion.copy(g.quaternion);
      scene.add(g, pool);
      return { g, inner, light, pool, poolMat, base: g.position.clone(), U: f.U, def: d, phase: i * 1.7, scale: 1, hit: inner.children[0] as Mesh };
    });

    /* Light packets: a bright head plus two trailing sparks, one instanced draw call */
    const PK = 16;
    const TR = 3;
    const packetMesh = new InstancedMesh(track(new SphereGeometry(0.05, 8, 6)), track(new MeshBasicMaterial({ color: 0xffffff })), PK * TR);
    packetMesh.frustumCulled = false;
    scene.add(packetMesh);
    const packets = Array.from({ length: PK }, (_, i) => ({
      t: (i * 0.618) % 1,
      v: 0.035 + ((i * 0.37) % 1) * 0.03,
      lat: (((i * 0.53) % 1) * 2 - 1) * HW * 0.72,
    }));
    const dummy = new Object3D();
    const tmpColor = new Color();
    const tmpMatrix = new Matrix4();
    for (let i = 0; i < PK; i++) {
      for (let j = 0; j < TR; j++) {
        tmpColor.set(j === 0 ? 0xffffff : 0x22d3ee).multiplyScalar(j === 0 ? 3.2 : j === 1 ? 1.6 : 1);
        packetMesh.setColorAt(i * TR + j, tmpColor);
      }
    }
    if (packetMesh.instanceColor) packetMesh.instanceColor.needsUpdate = true;
    const updatePackets = (dt: number) => {
      for (let i = 0; i < PK; i++) {
        const k = packets[i];
        k.t = (k.t + k.v * dt) % 1;
        for (let j = 0; j < TR; j++) {
          const f = frame((k.t - j * 0.012 + 1) % 1);
          dummy.position.copy(f.p).addScaledVector(f.S, k.lat).addScaledVector(f.U, HH + 0.05);
          const sc = j === 0 ? 1 : j === 1 ? 0.8 : 0.55;
          dummy.scale.set(sc * (j ? 1.7 : 1), sc, sc);
          dummy.quaternion.setFromRotationMatrix(tmpMatrix.makeBasis(f.T, f.U, f.S));
          dummy.updateMatrix();
          packetMesh.setMatrixAt(i * TR + j, dummy.matrix);
        }
      }
      packetMesh.instanceMatrix.needsUpdate = true;
    };

    /* Post processing: multisampled HDR target, bloom, then tone mapping and sRGB output */
    const target = new WebGLRenderTarget(4, 4, { type: HalfFloatType, samples: 4 });
    const composer = new EffectComposer(renderer, target);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new Vector2(4, 4), 0.5, 0.15, 0.92);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    /* Sizing */
    let W = 1;
    let H = 1;
    let baseZ = 14;
    const resize = () => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      const pr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(pr);
      renderer.setSize(W, H, false);
      composer.setPixelRatio(pr);
      composer.setSize(W, H);
      camera.aspect = W / H;
      baseZ = Math.max(14, 7.7 / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect));
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    /* Pointer: parallax, hover and click on the three domain nodes */
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let hovered = -1;
    const pick = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(cubes.filter((c) => c.def.hub >= 0).map((c) => c.hit), false);
      if (!hits.length) return -1;
      const c = cubes.find((cc) => cc.hit === hits[0].object);
      return c ? c.def.hub : -1;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      hovered = pick(e);
      host.style.cursor = hovered >= 0 ? "pointer" : "";
    };
    const onClick = (e: PointerEvent) => {
      const hub = pick(e);
      if (hub >= 0) stateRef.current.onSelect(hub);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onClick);

    /* Loop: paused while off screen or in a hidden tab */
    let visible = true;
    let tabVisible = document.visibilityState === "visible";
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
    io.observe(host);
    const onVis = () => (tabVisible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    let clock = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || !tabVisible) return;
      clock += dt;
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2);
      camera.position.set(Math.sin(clock * 0.12) * 0.55 + pointer.x * 0.5, 4.6 + Math.sin(clock * 0.15) * 0.12 - pointer.y * 0.15, baseZ);
      camera.lookAt(0.4, -0.7, 0);

      const sel = stateRef.current.selected;
      cubes.forEach((c) => {
        const emphasised = c.def.hub >= 0 && (c.def.hub === sel || c.def.hub === hovered);
        const dim = sel !== null && c.def.hub >= 0 && c.def.hub !== sel && c.def.hub !== hovered;
        const targetScale = emphasised ? 1.22 : 1;
        c.scale += (targetScale - c.scale) * Math.min(1, dt * 6);
        c.g.scale.setScalar(c.scale);
        c.g.position.copy(c.base).addScaledVector(c.U, Math.sin(clock * 0.9 + c.phase) * 0.05);
        c.inner.rotation.y = clock * 0.25 + c.phase;
        c.inner.rotation.x = Math.sin(clock * 0.3 + c.phase) * 0.15;
        const boost = emphasised ? 1.6 : dim ? 0.55 : 1;
        c.light.intensity = (7.5 + Math.sin(clock * 1.3 + c.phase) * 1.5) * boost;
        c.poolMat.opacity = (0.38 + Math.sin(clock * 1.3 + c.phase) * 0.08) * boost;
      });
      warm.intensity = 7 + Math.sin(clock * 0.8) * 1.2;
      underLights.forEach((l, i) => (l.intensity = 8 + Math.sin(clock * 0.7 + i) * 1.2));
      updatePackets(dt);

      composer.render();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onClick);
      composer.dispose();
      target.dispose();
      envTarget.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0" />;
}
