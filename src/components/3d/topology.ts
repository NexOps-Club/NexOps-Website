// Deterministic hub-and-spoke network layout shared by the WebGL scene and the static SVG fallback.
// Pure data only (no three.js) so it stays cheap to import and easy to unit test.

export type Tone = "blue" | "cyan" | "violet";

/** One tone per hub; hubs are the three domain anchors (CN, CC, DevOps). Workers inherit their hub's tone. */
export const HUB_TONES: Tone[] = ["blue", "cyan", "violet"];

export interface TopologyNode {
  x: number;
  y: number;
  z: number;
  radius: number;
  tone: Tone;
  hub: boolean;
}

export interface Topology {
  nodes: TopologyNode[];
  links: [number, number][];
  /** Link indices touching each node, for routing packets and highlighting. */
  nodeLinks: number[][];
}

export interface TopologyOptions {
  count?: number;
  hubs?: number;
  seed?: number;
  /** Links longer than this are never created, keeping the mesh local. */
  maxLinkDistance?: number;
  neighbors?: number;
}

export const NODE_RADIUS_MIN = 0.03;
export const NODE_RADIUS_MAX = 0.07;
export const HUB_RADIUS = 0.1;

// Shared framing for the WebGL scene and the SVG fallback. The layout is spread out and the
// camera pulled back so nodes stay small and evenly sized. The whole cluster fits inside the
// canvas, centred on the hero's right column and clear of the masked left 25% (hero copy side).
export const VIEW = {
  worldScale: 1.3,
  offsetX: 0.75,
  cameraZ: 9,
  fov: 42,
  tiltX: 0.12,
  swingY: 0.35,
} as const;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distance(a: TopologyNode, b: TopologyNode) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function generateTopology({
  count = 50,
  hubs = 3,
  seed = 2026,
  maxLinkDistance = 0.95,
  neighbors = 3,
}: TopologyOptions = {}): Topology {
  const rand = mulberry32(seed);
  const spread = (scale: number) => (rand() + rand() + rand() - 1.5) * scale;
  const nodes: TopologyNode[] = [];

  // Hubs sit on a loose, tall ring so clusters read as separate "regions" and frame the terminal.
  for (let h = 0; h < hubs; h++) {
    const angle = (h / hubs) * Math.PI * 2 + rand() * 0.4;
    nodes.push({
      x: Math.cos(angle) * 1.1,
      y: Math.sin(angle) * 1.45 + spread(0.15),
      z: Math.sin(angle * 2) * 0.5 + spread(0.2),
      radius: HUB_RADIUS,
      tone: HUB_TONES[h % HUB_TONES.length],
      hub: true,
    });
  }

  // Workers cluster around their hub.
  for (let i = hubs; i < count; i++) {
    const hub = nodes[i % hubs];
    nodes.push({
      x: hub.x + spread(0.8),
      y: hub.y + spread(0.8),
      z: hub.z + spread(0.8),
      radius: NODE_RADIUS_MIN + rand() * (NODE_RADIUS_MAX - NODE_RADIUS_MIN),
      tone: hub.tone,
      hub: false,
    });
  }

  const seen = new Set<number>();
  const links: [number, number][] = [];
  const addLink = (a: number, b: number) => {
    const key = Math.min(a, b) * count + Math.max(a, b);
    if (a === b || seen.has(key)) return;
    seen.add(key);
    links.push([Math.min(a, b), Math.max(a, b)]);
  };

  // Backbone between neighbouring hubs.
  for (let h = 0; h < hubs; h++) addLink(h, (h + 1) % hubs);

  // Each node links to its nearest neighbours, but only when they are close.
  for (let i = 0; i < count; i++) {
    const nearest = nodes
      .map((node, j) => ({ j, d: distance(nodes[i], node) }))
      .filter(({ j, d }) => j !== i && d <= maxLinkDistance)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbors);
    for (const { j } of nearest) addLink(i, j);
    // Never leave a worker floating: fall back to its own hub.
    if (nearest.length === 0 && i >= hubs) addLink(i, i % hubs);
  }

  const nodeLinks: number[][] = nodes.map(() => []);
  links.forEach(([a, b], index) => {
    nodeLinks[a].push(index);
    nodeLinks[b].push(index);
  });

  return { nodes, links, nodeLinks };
}
