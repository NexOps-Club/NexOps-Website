import { test, describe } from "node:test";
import assert from "node:assert";
import {
  generateTopology,
  HUB_RADIUS,
  NODE_RADIUS_MAX,
  NODE_RADIUS_MIN,
} from "../src/components/3d/topology.js";
import { DOMAINS } from "../src/data/domains.js";

describe("Hero network topology", () => {
  const topo = generateTopology();

  test("is deterministic for a given seed", () => {
    assert.deepStrictEqual(generateTopology(), topo);
    assert.notDeepStrictEqual(generateTopology({ seed: 7 }).nodes, topo.nodes);
  });

  test("builds ~50 small nodes plus three larger domain hubs", () => {
    assert.strictEqual(topo.nodes.length, 50);
    const hubs = topo.nodes.filter((n) => n.hub);
    assert.strictEqual(hubs.length, 3);
    for (const hub of hubs) assert.strictEqual(hub.radius, HUB_RADIUS);
    for (const node of topo.nodes.filter((n) => !n.hub)) {
      assert.ok(node.radius >= NODE_RADIUS_MIN && node.radius <= NODE_RADIUS_MAX);
    }
    assert.deepStrictEqual(new Set(topo.nodes.map((n) => n.tone)), new Set(["emerald", "cyan", "violet"]));
    // Workers share the tone of the hub they cluster around.
    topo.nodes.forEach((n, i) => assert.strictEqual(n.tone, topo.nodes[i % 3].tone));
  });

  test("links are unique, local, and leave no node isolated", () => {
    const keys = topo.links.map(([a, b]) => `${a}-${b}`);
    assert.strictEqual(new Set(keys).size, keys.length);
    for (const [a, b] of topo.links) {
      assert.ok(a < b);
      const na = topo.nodes[a];
      const nb = topo.nodes[b];
      const d = Math.hypot(na.x - nb.x, na.y - nb.y, na.z - nb.z);
      // Only the hub backbone may span between clusters.
      if (!(na.hub && nb.hub)) assert.ok(d <= 1.6, `link ${a}-${b} spans ${d.toFixed(2)}`);
    }
    topo.nodeLinks.forEach((linkIds, i) => assert.ok(linkIds.length > 0, `node ${i} isolated`));
  });
});

describe("Domain anchors", () => {
  test("hub i maps to domain i and hubs are mutually linked", () => {
    const topo = generateTopology();
    DOMAINS.forEach((d, i) => {
      assert.strictEqual(d.hub, i);
      assert.strictEqual(topo.nodes[d.hub].hub, true);
      assert.strictEqual(topo.nodes[d.hub].tone, d.tone);
    });
    const keys = new Set(topo.links.map(([a, b]) => `${a}-${b}`));
    for (const k of ["0-1", "1-2", "0-2"]) assert.ok(keys.has(k), `missing backbone link ${k}`);
  });
});
