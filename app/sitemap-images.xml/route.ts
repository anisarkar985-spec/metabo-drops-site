import { siteData } from "@/lib/site-data";

// v25.67 — Image sitemap. Bing Images is a real traffic source for
// supplement / affiliate queries (people search "ProductName ingredient"
// on Bing Images). Listing every product, ingredient, review, and
// bonus image with image:title gives Bing Images explicit recall
// signals it can't get from inferred alt-text alone.
//
// Served at /sitemap-images.xml. Referenced from robots.ts so Bing's
// crawler discovers it on first visit.

export const dynamic = "force-static";

interface ImageEntry {
  loc: string;
  title: string;
  caption?: string;
}

function escapeXml(s: string): string {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function abs(rel: string | undefined | null, base: string): string | null {
  if (!rel) return null;
  if (rel.startsWith("http")) return rel;
  if (rel.startsWith("/")) return `${base}${rel}`;
  return `${base}/${rel}`;
}

export async function GET(): Promise<Response> {
  const base = siteData.site.url.replace(/\/+$/, "");
  const productName = siteData.product.name;

  const homeUrl = `${base}/`;
  const ingredientsUrl = `${base}/ingredients`;
  const reviewsUrl = `${base}/reviews`;
  const benefitsUrl = `${base}/benefits`;

  // Build per-page image lists. Filter out placeholder paths — Bing
  // weights image quality and a placeholder is worse-than-absent.
  const isPlaceholder = (u: string | null | undefined): boolean =>
    !u || /-placeholder\.(?:png|jpe?g|webp|gif|svg)$/i.test(u);

  // Homepage images: hero + every pricing tier image
  const homeImages: ImageEntry[] = [];
  const heroUrl = abs(siteData.product.heroImageUrl, base);
  if (heroUrl && !isPlaceholder(heroUrl)) {
    homeImages.push({
      loc: heroUrl,
      title: `${productName} — official product image`,
      caption: siteData.product.heroAltText || `${productName} ${siteData.product.categoryShort}`,
    });
  }
  for (const tier of siteData.pricing) {
    const tierUrl = abs(tier.imageUrl, base);
    if (tierUrl && !isPlaceholder(tierUrl)) {
      const unitMany = tier.unitLabelPlural || "Bottles";
      const unitOne = tier.unitLabel || "Bottle";
      const unitWord = tier.bottles === 1 ? unitOne : unitMany;
      homeImages.push({
        loc: tierUrl,
        title: `${productName} ${tier.bottles} ${unitWord} package`,
        caption: tier.imageAlt || `${productName} ${tier.bottles}-${unitWord.toLowerCase()} package — ${tier.daySupply}-day supply`,
      });
    }
  }

  // Bonus images. BonusItem.name (correct field) — verified against
  // templates/nextjs-premium/types/site-data.ts:290.
  const bonusImages: ImageEntry[] = [];
  const bonusItems = siteData.bonuses?.items || [];
  for (const b of bonusItems) {
    const bUrl = abs(b.imageUrl, base);
    if (bUrl && !isPlaceholder(bUrl)) {
      bonusImages.push({
        loc: bUrl,
        title: `${b.name} — bonus with ${productName}`,
        caption: b.imageAlt || `${b.name}`,
      });
    }
  }

  // Ingredient images. IngredientItem.title (NOT .name — verified
  // against templates/nextjs-premium/types/site-data.ts:315). Title is
  // pre-numbered ("1. Ginkgo Biloba — Circulation"); strip the
  // leading "N." prefix for cleaner image alt-text.
  const stripIngredientPrefix = (t: string): string =>
    String(t || "").replace(/^\s*\d+\.\s*/, "").trim();
  const ingredientImages: ImageEntry[] = [];
  for (const ing of siteData.ingredients?.ingredients || []) {
    const iUrl = abs(ing.imageUrl, base);
    if (iUrl && !isPlaceholder(iUrl)) {
      const ingName = stripIngredientPrefix(ing.title);
      ingredientImages.push({
        loc: iUrl,
        title: `${ingName} — ${productName} ingredient`,
        caption: `${ingName} ingredient profile in ${productName}`,
      });
    }
  }

  // Review images (featured reviews). ReviewItem.name (NOT .author —
  // verified against templates/nextjs-premium/types/site-data.ts:345).
  const reviewImages: ImageEntry[] = [];
  for (const r of siteData.featuredReviews || []) {
    const rUrl = abs(r.imageUrl, base);
    if (rUrl && !isPlaceholder(rUrl)) {
      reviewImages.push({
        loc: rUrl,
        title: `${productName} customer review — ${r.name || "verified buyer"}`,
        caption: `Customer-reported feedback about ${productName}`,
      });
    }
  }

  const renderUrl = (pageLoc: string, images: ImageEntry[]): string => {
    if (images.length === 0) return "";
    const imgBlocks = images
      .map(
        (img) =>
          `    <image:image>\n      <image:loc>${escapeXml(img.loc)}</image:loc>\n      <image:title>${escapeXml(img.title)}</image:title>` +
          (img.caption ? `\n      <image:caption>${escapeXml(img.caption)}</image:caption>` : "") +
          `\n    </image:image>`,
      )
      .join("\n");
    return `  <url>\n    <loc>${escapeXml(pageLoc)}</loc>\n${imgBlocks}\n  </url>`;
  };

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    renderUrl(homeUrl, [...homeImages, ...bonusImages]),
    renderUrl(ingredientsUrl, ingredientImages),
    renderUrl(reviewsUrl, reviewImages),
    renderUrl(benefitsUrl, []),
    "</urlset>",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
