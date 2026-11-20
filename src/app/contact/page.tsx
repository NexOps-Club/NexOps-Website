import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with NexOps: send an inquiry, propose a workshop or collaboration, or find our community channels and campus location.",
  path: "/contact",
  keywords: ["contact NexOps", "workshop proposal", "student club collaboration"],
});

export default function ContactPage() {
  return (
    <>
      <ContactPageClient />
    </>
  );
}
