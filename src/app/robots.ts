import type { MetadataRoute } from "next";
import { getSiteUrl, ROBOTS_DISALLOW } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: [...ROBOTS_DISALLOW] },
    ...(origin ? { sitemap: new URL("/sitemap.xml", origin).toString() } : {}),
  };
}
