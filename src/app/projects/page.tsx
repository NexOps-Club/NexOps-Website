import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Open-source tools and infrastructure projects built by NexOps members: Kubernetes platforms, GitOps automation, monitoring dashboards and developer tools.",
  path: "/projects",
  keywords: ["student DevOps projects", "open source infrastructure", "Kubernetes", "GitOps", "monitoring"],
});

export default function ProjectsPage() {
  return (
    <>
      <ProjectsPageClient />
    </>
  );
}
