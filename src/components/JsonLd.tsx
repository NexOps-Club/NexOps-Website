import { getSiteUrl } from "@/lib/seo";
import { eventsJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

/** Renders one JSON-LD block. "<" is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationJsonLd() {
  return <JsonLd data={organizationJsonLd(getSiteUrl())} />;
}

export function WebSiteJsonLd() {
  return <JsonLd data={websiteJsonLd(getSiteUrl())} />;
}

export function EventsJsonLd() {
  return (
    <>
      {eventsJsonLd(getSiteUrl()).map((event) => (
        <JsonLd key={String(event.name)} data={event} />
      ))}
    </>
  );
}
