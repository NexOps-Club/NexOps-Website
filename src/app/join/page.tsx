import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import JoinPageClient from "./JoinPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Join the Club",
  description:
    "Apply to join NexOps. Open to all branches and skill levels with no prior cloud experience needed. See the recruitment process and apply online.",
  path: "/join",
  keywords: ["join DevOps club", "student club membership", "NexOps recruitment"],
});

export default function JoinPage() {
  return (
    <>
      <JoinPageClient />
    </>
  );
}
