import { siteConfig } from "../config/site";
import { eventsData } from "../data/events";
import type { EventItem } from "../types";

type JsonLdObject = Record<string, unknown>;

const absolute = (origin: URL | null, path: string) => (origin ? new URL(path, origin).toString() : undefined);

/** Drops undefined values so absent facts are omitted instead of serialised as null. */
const compact = (obj: JsonLdObject): JsonLdObject =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

/** "20261122T083000Z" -> "2026-11-22T08:30:00Z". Returns undefined for anything else. */
export function calendarTimeToIso(value: string): string | undefined {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(value);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : undefined;
}

/**
 * Only facts already in the project: name, tagline, description, parent college (name and campus address)
 * and the project's GitHub repository. No email address or unverified social profiles are included.
 */
export function organizationJsonLd(origin: URL | null): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    url: absolute(origin, "/"),
    logo: absolute(origin, "/icon-512.png"),
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.college.name,
      address: `${siteConfig.college.campus}, ${siteConfig.college.city}`,
    },
    sameAs: siteConfig.contact.github ? [siteConfig.contact.github] : undefined,
  });
}

export function websiteJsonLd(origin: URL | null): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absolute(origin, "/"),
    inLanguage: "en",
  });
}

/**
 * One Event per upcoming event that has a name, a valid start and end time and a venue.
 * Instructors are not exposed as performers and no offers, prices or addresses are invented.
 */
export function eventsJsonLd(
  origin: URL | null,
  events: EventItem[] = eventsData,
  publish: boolean = siteConfig.seo.publishEventStructuredData,
): JsonLdObject[] {
  if (!publish) return [];
  return events
    .filter((event) => event.status === "upcoming")
    .flatMap((event) => {
      const startDate = calendarTimeToIso(event.calendarData.startTime);
      const endDate = calendarTimeToIso(event.calendarData.endTime);
      if (!event.title || !event.venue || !startDate || !endDate) return [];
      return [
        compact({
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.description,
          startDate,
          endDate,
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "Place", name: event.venue },
          image: event.posterImage ? [event.posterImage] : undefined,
          url: absolute(origin, "/events"),
          organizer: compact({ "@type": "Organization", name: siteConfig.name, url: absolute(origin, "/") }),
        }),
      ];
    });
}
