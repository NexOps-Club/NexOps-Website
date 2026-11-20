import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ResourcesPageClient from "./ResourcesPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Learning Roadmaps",
  description:
    "Five-level learning roadmaps for DevOps, Cloud Computing and Computer Networking, from beginner to advanced, with topics, tools, practical projects and milestones.",
  path: "/resources",
  keywords: ["DevOps roadmap", "learn Linux", "learn Kubernetes", "CI/CD learning path", "cloud computing roadmap", "computer networking roadmap"],
});

export default function ResourcesPage() {
  return (
    <>
      <ResourcesPageClient />
    </>
  );
}
