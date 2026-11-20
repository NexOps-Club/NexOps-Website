import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TeamPageClient from "./TeamPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Leadership and Core Team",
  description:
    "Meet the faculty coordinators, student leads and core committee who run NexOps labs and workshops at SIET Tumakuru.",
  path: "/team",
  keywords: ["NexOps team", "student leads", "faculty coordinators"],
});

export default function TeamPage() {
  return (
    <>
      <TeamPageClient />
    </>
  );
}
