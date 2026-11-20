import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ResourcesPageClient from "./ResourcesPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Learning Roadmaps",
  description:
    "Step-by-step Cloud and DevOps learning roadmaps covering Linux, computer networking, containers, Kubernetes and CI/CD, with free labs and guides.",
  path: "/resources",
  keywords: ["DevOps roadmap", "learn Linux", "learn Kubernetes", "CI/CD learning path", "cloud computing roadmap"],
});

export default function ResourcesPage() {
  return (
    <>
      <ResourcesPageClient />
    </>
  );
}
