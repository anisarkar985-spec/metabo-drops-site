import type { MetadataRoute } from "next";
import { siteData } from "@/lib/site-data";

/**
 * sitemap.ts — Auto-generated sitemap for all 8 pages.
 *
 * Next.js reads this at build time and emits /sitemap.xml.
 * Pages:
 *   1. / (homepage)
 *   2. /ingredients
 *   3. /benefits
 *   4. /reviews
 *   5. /contact
 *   6. /terms
 *   7. /privacy
 *   8. /cookie
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteData.site.url;
  const lastModified = new Date(siteData.editorial.lastUpdatedIso);

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ingredients`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/benefits`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      // v25.67 — disclaimer page (supplement affiliate compliance).
      url: `${baseUrl}/disclaimer`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    // v25.67.6 — /cookie and /about/[slug] omitted from sitemap to
    // match the locked 8-page strict structure (Sales / Reviews /
    // Benefits / Ingredients / Terms / Privacy / Disclaimer / Contact).
    // Both routes still build (so direct links work and footer link
    // doesn't 404) but they are noindex via robots meta on the page
    // itself and excluded from sitemap so Bing/Google don't crawl
    // them as canonical content.
  ];
}
