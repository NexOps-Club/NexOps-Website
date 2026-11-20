import type { Metadata } from "next";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  ...pageMetadata({
    title: siteConfig.name,
    description:
      "NexOps is the student-led technical society at SIET Tumakuru for Cloud Computing, Computer Networks and DevOps. Learn hands-on, build real projects and join live workshops.",
    path: "/",
    keywords: ["DevOps club", "cloud computing club", "computer networks", "student technical society"],
  }),
  // The home page owns the full brand title instead of "NexOps | NexOps".
  title: { absolute: `${siteConfig.name} | Cloud, Networks and DevOps at SIET Tumakuru` },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <HomePageClient />
    </>
  );
}
