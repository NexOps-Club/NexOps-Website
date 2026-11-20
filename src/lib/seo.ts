import type { Metadata } from "next";
import { siteConfig } from "../config/site";

/** Public, indexable routes. Shared by the sitemap and its tests. /admin and /api are deliberately absent. */
export const PUBLIC_ROUTES = ["/", "/about", "/events", "/projects", "/resources", "/team", "/contact", "/join"] as const;

export const SOCIAL_IMAGE_ALT = `${siteConfig.name}: ${siteConfig.tagline} ${siteConfig.college.name}`;

/**
 * Paths blocked from crawling. /admin is intentionally NOT listed: a robots.txt disallow stops crawlers from
 * fetching the page, so they would never see its noindex directive and the bare URL could still be indexed if
 * something links to it. /admin is kept out of search results with noindex (meta + X-Robots-Tag header) and
 * out of the sitemap. Neither mechanism protects it; access control is the admin login.
 */
export const ROBOTS_DISALLOW = ["/api/"] as const;

/**
 * Production origin from NEXT_PUBLIC_SITE_URL (e.g. https://example.org). There is no built-in default:
 * without it the sitemap is empty, robots omits the sitemap line and canonical links are not emitted,
 * rather than publishing a guessed domain.
 */
export function getSiteUrl(raw: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): URL | null {
  const value = raw?.trim().replace(/\/+$/, "");
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

interface PageSeo {
  /** Short page title; the root template appends "| NexOps". */
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

/** Per-page metadata: title, description, keywords, canonical, Open Graph and Twitter card. */
export function pageMetadata({ title, description, path, keywords }: PageSeo): Metadata {
  const origin = getSiteUrl();
  const hasOrigin = origin !== null;
  // Social crawlers need absolute image URLs, so images are only attached once the production origin is known.
  // (Next does not carry the root opengraph-image file over to pages that define their own openGraph.)
  const og = origin ? [{ url: new URL("/opengraph-image", origin).toString(), width: 1200, height: 630, alt: SOCIAL_IMAGE_ALT }] : undefined;
  const tw = origin ? [{ url: new URL("/twitter-image", origin).toString(), alt: SOCIAL_IMAGE_ALT }] : undefined;
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    keywords,
    ...(hasOrigin ? { alternates: { canonical: path } } : {}),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
      title: fullTitle,
      description,
      ...(hasOrigin ? { url: path } : {}),
      images: og,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: tw,
    },
  };
}
