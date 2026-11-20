import type { Metadata } from "next";
import { EventsJsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import EventsPageClient from "./EventsPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Events and Workshops",
  description:
    "Hands-on workshops, bootcamps, talks and CTFs on Kubernetes, Terraform, networking and DevSecOps. Filter by experience level, from new to tech to ready to build infrastructure.",
  path: "/events",
  keywords: ["DevOps workshops", "Kubernetes workshop", "Terraform bootcamp", "DevSecOps CTF", "student tech events"],
});

export default function EventsPage() {
  return (
    <>
      <EventsJsonLd />
      <EventsPageClient />
    </>
  );
}
