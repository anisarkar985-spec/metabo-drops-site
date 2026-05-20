import type { MetadataRoute } from "next";
import { siteData } from "@/lib/site-data";

/**
 * robots.ts — Robots directives for crawlers + AI bots.
 *
 * Explicitly allows major AI training/retrieval crawlers for AEO/GEO optimization:
 *   - GPTBot (OpenAI)
 *   - ClaudeBot / anthropic-ai (Anthropic)
 *   - PerplexityBot (Perplexity)
 *   - Google-Extended (Google AI / Bard / Gemini)
 *   - CCBot (Common Crawl — used by many models)
 *   - Bytespider (ByteDance)
 *   - Meta-ExternalAgent / FacebookBot (Meta)
 *   - Applebot-Extended (Apple Intelligence)
 *
 * All other crawlers allowed by default (single rule block).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteData.site.url;

  return {
    rules: [
      // Explicit allow for AI/LLM retrieval & training bots (AEO optimization)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },

      // Everyone else allowed by default
      {
        userAgent: "*",
        allow: "/",
        // v25.67 — disallow /_debug/ as belt-and-suspenders.
        // v25.92.6 — also disallow operator-notes folder + raw .md
        // files at root. README.deployment.md + IMAGE-GUIDE.md ship
        // under /_operator-notes/. If user FTPs the entire zip to web
        // root, these patterns keep deployment instructions out of
        // crawler indexes (no thin / off-topic content surfacing on
        // brand SERPs).
        disallow: ["/_debug/", "/_operator-notes/", "/*.md$", "/*.markdown$"],
      },
    ],
    // v25.67 — multi-sitemap declaration. Image sitemap surfaces
    // product/ingredient/review images to Bing Images directly.
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-images.xml`],
    host: baseUrl,
  };
}
