import type { EventItem } from "../src/types/index.js";
import { test, describe, afterEach } from "node:test";
import assert from "node:assert";
import { getSiteUrl, pageMetadata, PUBLIC_ROUTES } from "../src/lib/seo.js";
import {
  calendarTimeToIso,
  eventsJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "../src/lib/structured-data.js";
import { siteConfig } from "../src/config/site.js";
import sitemap from "../src/app/sitemap.js";
import robots from "../src/app/robots.js";
import manifest from "../src/app/manifest.js";
import { metadata as adminLayoutMetadata } from "../src/app/admin/layout.js";

const original = process.env.NEXT_PUBLIC_SITE_URL;
afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = original;
});

describe("site URL", () => {
  test("is null when unset or invalid, never a guessed domain", () => {
    assert.strictEqual(getSiteUrl(undefined), null);
    assert.strictEqual(getSiteUrl("   "), null);
    assert.strictEqual(getSiteUrl("not a url"), null);
    assert.strictEqual(getSiteUrl("ftp://example.org"), null);
  });

  test("parses a valid origin and ignores trailing slashes", () => {
    assert.strictEqual(getSiteUrl("https://example.org/")?.origin, "https://example.org");
  });
});

describe("sitemap and robots", () => {
  test("sitemap is empty without a configured origin", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    assert.deepStrictEqual(sitemap(), []);
    assert.strictEqual(robots().sitemap, undefined);
  });

  test("sitemap lists public routes only", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.org";
    const urls = sitemap().map((entry) => entry.url);
    assert.strictEqual(urls.length, PUBLIC_ROUTES.length);
    for (const url of urls) assert.ok(!/\/(admin|api)/.test(url), `${url} must not be listed`);
    assert.ok(urls.includes("https://example.org/events"));
  });

  test("robots blocks only /api/ so crawlers can still see the /admin noindex, and points at the sitemap", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.org";
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    assert.deepStrictEqual(rules.disallow, ["/api/"]);
    assert.strictEqual(result.sitemap, "https://example.org/sitemap.xml");
  });

  test("/admin is noindex and never listed in the sitemap", () => {
    assert.deepStrictEqual(adminLayoutMetadata.robots, { index: false, follow: false });
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.org";
    assert.ok(!sitemap().some((entry) => entry.url.includes("/admin")));
  });
});

describe("page metadata", () => {
  test("adds canonical and absolute social images only when the origin is known", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const without = pageMetadata({ title: "Events", description: "d", path: "/events" });
    assert.strictEqual(without.alternates, undefined);

    process.env.NEXT_PUBLIC_SITE_URL = "https://example.org";
    const withOrigin = pageMetadata({ title: "Events", description: "d", path: "/events" });
    assert.deepStrictEqual(withOrigin.alternates, { canonical: "/events" });
    const images = (withOrigin.openGraph as { images?: { url: string }[] }).images;
    assert.strictEqual(images?.[0].url, "https://example.org/opengraph-image");
  });
});

describe("structured data", () => {
  test("organization only uses verified project facts", () => {
    const org = organizationJsonLd(new URL("https://example.org"));
    const json = JSON.stringify(org);
    assert.strictEqual(org["@type"], "Organization");
    if (siteConfig.contact.email) assert.ok(!json.includes(siteConfig.contact.email), "no email address");
    assert.deepStrictEqual(org.sameAs, siteConfig.contact.github ? [siteConfig.contact.github] : undefined);
    assert.strictEqual(org.url, "https://example.org/");
  });

  test("omits url fields instead of guessing when the origin is unknown", () => {
    assert.ok(!("url" in organizationJsonLd(null)));
    assert.ok(!("url" in websiteJsonLd(null)));
  });

  test("converts calendar timestamps to ISO and rejects malformed ones", () => {
    assert.strictEqual(calendarTimeToIso("20261122T083000Z"), "2026-11-22T08:30:00Z");
    assert.strictEqual(calendarTimeToIso("tomorrow"), undefined);
  });

  test("event data stays unpublished while the flag is off", () => {
    assert.strictEqual(siteConfig.seo.publishEventStructuredData, false);
    assert.deepStrictEqual(eventsJsonLd(null), []);
  });

  test("events builder: upcoming only, no performers, offers or invented addresses", () => {
    const sample: EventItem = {
      id: "t1",
      title: "Sample workshop",
      slug: "sample-workshop",
      category: "Workshop",
      status: "upcoming",
      level: "beginner",
      date: "2030-01-01",
      time: "10:00",
      venue: "Room 1",
      description: "d",
      highlights: [],
      registrationOpen: true,
      calendarData: { title: "t", description: "d", location: "Room 1", startTime: "20300101T100000Z", endTime: "20300101T120000Z" },
      tags: [],
    };
    const events = eventsJsonLd(null, [sample, { ...sample, id: "t2", status: "past" }], true);
    assert.strictEqual(events.length, 1);
    for (const event of events) {
      assert.strictEqual(event["@type"], "Event");
      assert.ok(typeof event.startDate === "string" && typeof event.endDate === "string");
      assert.ok(!("performer" in event) && !("offers" in event));
      assert.deepStrictEqual(Object.keys(event.location as object), ["@type", "name"]);
    }
  });
});

describe("manifest", () => {
  test("uses the brand name, navy colours and existing icon files", () => {
    const m = manifest();
    assert.strictEqual(m.name, "NexOps");
    assert.strictEqual(m.short_name, "NexOps");
    assert.strictEqual(m.theme_color, "#0B1020");
    assert.strictEqual(m.background_color, "#0B1020");
    assert.ok((m.icons ?? []).length >= 2);
  });
});
