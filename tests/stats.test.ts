import { test, describe } from "node:test";
import assert from "node:assert";
import { getContentStats } from "../src/lib/stats.js";
import { eventsData } from "../src/data/events.js";
import { projectsData } from "../src/data/projects.js";

describe("Homepage content stats", () => {
  test("counts only events that have already happened", () => {
    const { events } = getContentStats();
    assert.strictEqual(events, eventsData.filter((e) => e.status === "past").length);
    assert.ok(events < eventsData.length, "upcoming events must not be counted as hosted");
  });

  test("counts every listed project", () => {
    assert.strictEqual(getContentStats().projects, projectsData.length);
  });
});
