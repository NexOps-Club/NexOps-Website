import type { MetadataRoute } from "next";
import { getSiteUrl, PUBLIC_ROUTES } from "@/lib/seo";

// Needs NEXT_PUBLIC_SITE_URL at build time; without it the sitemap is empty instead of using a guessed domain.
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  if (!origin) return [];
  return PUBLIC_ROUTES.map((path) => ({ url: new URL(path, origin).toString() }));
}
