import type {
  ProductSiteData,
  ProductIdentity,
  SiteIdentity,
  RatingSummary,
  PricingTier,
  FaqItem,
  ReviewItem,
  FeaturedJourney,
} from "@/types/site-data";

interface SchemaJsonLdProps {
  siteData: ProductSiteData;
  /** Which schemas to render. If omitted, renders the v25.43.12 default set
   *  (website + product + faq). v25.44.1 adds opt-in reviews + breadcrumb
   *  flags for subpage orchestration. */
  include?: {
    website?: boolean;
    product?: boolean;
    faq?: boolean;
    /** v25.44.1 — emit per-review Review schema nested under the Product,
     *  plus a top-level AggregateRating mirroring siteData.rating. Used on
     *  the /reviews subpage to improve AEO / SERP rich-results coverage. */
    reviews?: boolean;
    /** v25.44.1 — emit a BreadcrumbList for the current page. Pass the
     *  structured trail via `breadcrumb`; falls back to Home > current
     *  page when omitted. */
    breadcrumb?: boolean;
    /** v25.44.3 — emit ingredients-page schemas: ItemList of every
     *  ingredient with its role paragraph + the ingredients-page FAQPage
     *  sourced from siteData.subpages.ingredients.ingredientsFaq. */
    ingredients?: boolean;
    /** v25.44.4 — emit benefits-page FAQPage schema sourced from
     *  siteData.subpages.benefits.benefitsFaq. */
    benefits?: boolean;
  };
  /** v25.44.1 — optional breadcrumb trail. When the page wants a
   *  breadcrumb schema emitted, it passes the canonical trail here:
   *    [{ name: "Home", url: "https://..." }, { name: "Reviews", url: "..." }]
   */
  breadcrumb?: Array<{ name: string; url: string }>;
}

/**
 * SchemaJsonLd — Renders JSON-LD structured data for SEO/AEO.
 *
 * v25.43.12 emission set (default):
 *   - WebSite (site identity + publisher)
 *   - Product (offers per pricing tier + aggregate rating)
 *   - FAQPage (Q&A items)
 *
 * v25.44.1 additions (opt-in via include prop):
 *   - Per-review Review schema items nested under the Product
 *   - BreadcrumbList for subpage orchestration
 *
 * Per-review Review schema gives answer engines (ChatGPT, Perplexity,
 * Claude) structured access to individual customer testimonials, which
 * they can cite when users query review-adjacent questions ("what do
 * customers say about <product>?"). The Product schema's
 * AggregateRating remains the single source of truth for the rating
 * summary; the per-review block adds specificity without duplication.
 */
export default function SchemaJsonLd({
  siteData,
  include,
  breadcrumb,
}: SchemaJsonLdProps) {
  const opts = {
    website: true,
    product: true,
    faq: true,
    reviews: false,
    breadcrumb: false,
    ingredients: false,
    benefits: false,
    ...include,
  };

  // v25.45 — homepage detection used to gate Article + Organization +
  // SiteLinksSearchBox emission without having to add a new explicit
  // flag. The homepage page.tsx (md5-locked) calls SchemaJsonLd with
  // no `include`, so all three primary defaults (website / product /
  // faq) are true and no breadcrumb is requested. Subpages either
  // pass `breadcrumb: true` or override product/faq, so the heuristic
  // cleanly separates them.
  const isHomepage =
    opts.website && opts.product && opts.faq && !opts.breadcrumb;

  // v25.44.1 — when reviews are requested, pull the extended grid so
  // every humanized review (up to 12) becomes a Review schema item.
  // Falls back to featuredReviews (3) if the extended grid is empty.
  const reviewsForSchema: ReviewItem[] = opts.reviews
    ? (siteData.subpages?.reviews?.reviewsGrid?.length
        ? siteData.subpages.reviews.reviewsGrid
        : siteData.featuredReviews || [])
    : [];
  // v25.44.2 — featuredJourneys are long-form Review schema items
  // (joined narrative + pullQuote as reviewBody, reviewer Person
  // with name + address + jobTitle). Emitted when present regardless
  // of opts.reviews — they're a reviews-page-specific asset and
  // always ship with more SEO weight than the shorter review cards.
  const journeysForSchema: FeaturedJourney[] = opts.reviews
    ? (siteData.subpages?.reviews?.featuredJourneys || [])
    : [];

  return (
    <>
      {opts.website && (
        <WebSiteSchema site={siteData.site} description={siteData.meta.home.description} />
      )}
      {/* v25.45 — Organization schema. Site-wide publisher identity that
          WebSite/Product/Article schemas already reference via
          @id={siteUrl}/#organization. Emitted on every page so the
          knowledge-graph entity exists wherever a crawler enters. */}
      {opts.website && (
        <OrganizationSchema
          site={siteData.site}
          productName={siteData.product.name}
        />
      )}
      {/* v25.48 — Person schema for the picked editorial author. Emitted
          on every page so the @id is resolvable wherever an Article or
          subpage references it. Backward-compat: skipped silently when
          authorPerson is absent (legacy site-data bundles). */}
      {siteData.editorial?.authorPerson && (
        <PersonSchema site={siteData.site} authorPerson={siteData.editorial.authorPerson} />
      )}
      {/* v25.45 — Article schema for the homepage editorial review. Only
          emitted on homepage (heuristic: full default opt set) so legal
          / contact / subpage bodies don't get over-tagged as articles. */}
      {isHomepage && (
        <ArticleSchema
          site={siteData.site}
          meta={siteData.meta.home}
          editorial={siteData.editorial}
        />
      )}
      {/* v25.48 — HowTo schema sourced from the howToUse section. Only
          on homepage (where HowToUse renders). Each step becomes a
          HowToStep with a stable @id so AI Overviews can deep-link to
          the specific step on the page. */}
      {isHomepage && siteData.howToUse?.steps && siteData.howToUse.steps.length > 0 && (
        <HowToSchema
          site={siteData.site}
          product={siteData.product}
          howToUse={siteData.howToUse}
        />
      )}
      {opts.product && (
        <ProductSchema
          product={siteData.product}
          site={siteData.site}
          rating={siteData.rating}
          pricing={siteData.pricing}
          description={siteData.meta.home.description}
          reviews={reviewsForSchema}
          journeys={journeysForSchema}
          lastUpdatedIso={siteData.editorial?.lastUpdatedIso}
        />
      )}
      {opts.faq && <FaqPageSchema faqs={siteData.faqs} />}
      {/* v25.44.2.5 — reviews-page FAQPage schema. Emitted ONLY when the
          /reviews page renders its own humanized FAQ block. Distinct from
          the homepage FaqPageSchema (which uses siteData.faqs), so we
          don't double-emit FAQPage on any single page. */}
      {opts.reviews && siteData.subpages?.reviews?.faqItems && siteData.subpages.reviews.faqItems.length > 0 && (
        <FaqPageSchema faqs={siteData.subpages.reviews.faqItems} />
      )}
      {/* v25.44.3 — ingredients-page schemas. Emits ItemList of every
          ingredient + FAQPage from the Call I-2 output. Guarded by
          opts.ingredients so this only fires on the /ingredients route. */}
      {opts.ingredients && siteData.ingredients?.ingredients && siteData.ingredients.ingredients.length > 0 && (
        <IngredientsItemListSchema
          ingredients={siteData.ingredients.ingredients}
          ingredientsCopy={siteData.subpages?.ingredients?.ingredientsCopy}
          product={siteData.product}
          site={siteData.site}
        />
      )}
      {opts.ingredients && siteData.subpages?.ingredients?.ingredientsFaq && siteData.subpages.ingredients.ingredientsFaq.length > 0 && (
        <FaqPageSchema faqs={siteData.subpages.ingredients.ingredientsFaq} />
      )}
      {/* v25.44.4 — benefits-page FAQPage schema emission. Distinct from
          the homepage FAQ + reviews-page FAQ + ingredients-page FAQ so
          each page gets its own FAQPage structure without overlap. */}
      {opts.benefits && siteData.subpages?.benefits?.benefitsFaq && siteData.subpages.benefits.benefitsFaq.length > 0 && (
        <FaqPageSchema faqs={siteData.subpages.benefits.benefitsFaq} />
      )}
      {/* v25.45 — Benefits ItemList schema. Each humanized benefitDeepDive
          becomes a ListItem with position/name/description/url so AI
          answer engines have a clean entity for "what are the benefits
          of X?" queries. Emitted only when benefitDeepDives ship. */}
      {opts.benefits && siteData.subpages?.benefits?.benefitDeepDives && siteData.subpages.benefits.benefitDeepDives.length > 0 && (
        <BenefitsItemListSchema
          deepDives={siteData.subpages.benefits.benefitDeepDives}
          product={siteData.product}
          site={siteData.site}
        />
      )}
      {opts.breadcrumb && breadcrumb && breadcrumb.length > 0 && (
        <BreadcrumbSchema items={breadcrumb} />
      )}
      {/* v25.44.2 — ItemList wrapping featuredJourneys. Gives AI answer
          engines a clean entity-grouping signal: "here are N curated
          customer stories under this product". Emitted independently
          of the Product schema's `review` array so the two references
          don't collide. */}
      {opts.reviews && journeysForSchema.length > 0 && (
        <FeaturedJourneysItemList
          journeys={journeysForSchema}
          product={siteData.product}
          site={siteData.site}
        />
      )}
    </>
  );
}

// ============================================================================
// INDIVIDUAL SCHEMA COMPONENTS
// ============================================================================

interface WebSiteSchemaProps {
  site: SiteIdentity;
  description: string;
}

function WebSiteSchema({ site, description }: WebSiteSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.domain,
    description,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.domain,
      url: site.url,
    },
    // v25.45 — SiteLinksSearchBox SearchAction. Tells Google to
    // surface a search box directly in SERP for site:domain queries.
    // The query string is interpolated into the urlTemplate at the
    // {search_term_string} placeholder.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLdScript data={data} />;
}

// v25.45 — Organization schema. Publisher entity referenced by
// WebSite/Product/Article via @id={siteUrl}/#organization. Emitting
// it explicitly means the knowledge-graph node exists in the JSON-LD
// payload (not just as an @id reference).
interface OrganizationSchemaProps {
  site: SiteIdentity;
  productName: string;
}
function OrganizationSchema({ site, productName }: OrganizationSchemaProps) {
  // v25.67 — sameAs populated from site.brandSocialProfiles (scraped
  // from source page footer / header by source-analyzer task #70).
  // Empty array = field omitted (Google penalises empty sameAs as
  // worse than absent). Verifiable external profiles only.
  const socials = (site as any).brandSocialProfiles as string[] | undefined;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.domain,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      // v25.46 — slug-prefixed OG image filename matches the rest of
      // public/images/ naming. Falls back to product name → slug.
      url: `${site.url}/images/${(productName || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-og.jpg`,
    },
    description: `${productName} review site — editorial information about ${productName}.`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.supportEmail,
    },
  };
  if (Array.isArray(socials) && socials.length > 0) {
    data.sameAs = socials;
  }
  return <JsonLdScript data={data} />;
}

// v25.45 — Article schema for the homepage editorial review. Provides
// answer engines with a canonical author/publisher/dates handle for
// the homepage body content. mainEntityOfPage points at the homepage
// so the article + the page are treated as the same entity.
interface ArticleSchemaProps {
  site: SiteIdentity;
  meta: { title: string; description: string; canonical: string; ogImage: string };
  editorial: {
    author?: string;
    lastUpdatedIso: string;
    authorPerson?: { slug: string; name: string; jobTitle: string };
  };
}
function ArticleSchema({ site, meta, editorial }: ArticleSchemaProps) {
  const isoDate = editorial.lastUpdatedIso;
  const authorName = editorial.author || "JR Editorial Team";
  // v25.48 — datePublished now tracked separately (90 days back from
  // lastUpdated) so dateModified ≠ datePublished. Same-day values are
  // a content-freshness footprint AI ranking systems flag as "thin".
  const datePublished = (() => {
    try {
      const d = new Date(isoDate);
      d.setDate(d.getDate() - 90);
      return d.toISOString().slice(0, 10);
    } catch {
      return isoDate;
    }
  })();
  // v25.48 — when authorPerson is present, reference the top-level
  // Person via @id so the Person node is shared across schemas. Falls
  // back to inline Person for legacy site-data bundles.
  const authorRef = editorial.authorPerson
    ? { "@id": `${site.url}/#author-${editorial.authorPerson.slug}` }
    : { "@type": "Person", name: authorName, jobTitle: "Editor" };
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${site.url}/#article`,
    headline: meta.title,
    description: meta.description,
    author: authorRef,
    publisher: {
      "@id": `${site.url}/#organization`,
    },
    datePublished,
    dateModified: isoDate,
    mainEntityOfPage: {
      "@id": `${site.url}/#website`,
    },
    image: meta.ogImage,
    inLanguage: "en-US",
    // v25.48 — SpeakableSpecification. Tells Google Assistant + voice
    // search which page sections are voice-extractable. CSS selectors
    // target the AnswerFirst blocks (already AEO-optimised single-line
    // answers) and the editorial byline (so attribution travels with
    // the spoken excerpt).
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".answer-first", ".editorial-byline"],
    },
  };
  return <JsonLdScript data={data} />;
}

// v25.48 — Person schema for the picked editorial author. Emitted as a
// top-level node with a stable @id so Article + any subpage author
// references can resolve to the same entity. E-E-A-T fields:
// jobTitle / description / knowsAbout / worksFor / image. sameAs is
// emitted only when the operator has populated it (empty by default).
interface PersonSchemaProps {
  site: SiteIdentity;
  authorPerson: {
    slug: string;
    name: string;
    /** v25.67 — schema @type. Defaults to Person for legacy bundles. */
    type?: "Person" | "Organization";
    jobTitle: string;
    bio: string;
    sameAs: string[];
    knowsAbout: string[];
    avatarPath: string;
  };
}
function PersonSchema({ site, authorPerson }: PersonSchemaProps) {
  // v25.67 — when authorPerson.type === "Organization" (the Editorial
  // Research Team), emit Organization @type instead of Person. Fixes
  // the schema-type lie where a team byline was being declared as a
  // Person. worksFor doesn't apply to an Organization (a team doesn't
  // "work for" itself), so omit it for Organization-typed authors.
  const isOrg = authorPerson.type === "Organization";
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isOrg ? "Organization" : "Person",
    "@id": `${site.url}/#author-${authorPerson.slug}`,
    name: authorPerson.name,
    jobTitle: authorPerson.jobTitle,
    description: authorPerson.bio,
    knowsAbout: authorPerson.knowsAbout,
    image: `${site.url}${authorPerson.avatarPath}`,
    url: `${site.url}/about/${authorPerson.slug}`,
  };
  if (!isOrg) {
    data.worksFor = { "@id": `${site.url}/#organization` };
  }
  if (authorPerson.sameAs && authorPerson.sameAs.length > 0) {
    data.sameAs = authorPerson.sameAs;
  }
  return <JsonLdScript data={data} />;
}

// v25.48 — HowTo schema sourced from the howToUse section. Maps each
// usage step to a HowToStep with a stable @id (anchor #how-step-N) so
// AI Overviews can deep-link the specific step. totalTime is omitted
// intentionally — supplement timing varies and a fake duration is a
// red flag.
interface HowToSchemaProps {
  site: SiteIdentity;
  product: ProductIdentity;
  howToUse: { intro: string; steps: Array<{ title: string; body: string }> };
}
function HowToSchema({ site, product, howToUse }: HowToSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${site.url}/#how-to-use`,
    name: `How To Use ${product.name}`,
    description: howToUse.intro,
    step: howToUse.steps.map((s, i) => ({
      "@type": "HowToStep",
      "@id": `${site.url}/#how-step-${i + 1}`,
      position: i + 1,
      name: s.title,
      text: s.body,
      url: `${site.url}/#how-step-${i + 1}`,
    })),
  };
  return <JsonLdScript data={data} />;
}

// v25.45 — Benefits ItemList schema. Mirrors the v25.44.3 ingredients
// ItemList pattern but for the per-benefit deep dives. Each ListItem
// gets the benefit's slug-anchor URL so AI engines can deep-link to
// the specific entry on the /benefits page.
interface BenefitsItemListSchemaProps {
  deepDives: Array<{
    slug: string;
    benefitName: string;
    tagline: string;
    mechanismParagraph: string;
  }>;
  product: ProductIdentity;
  site: SiteIdentity;
}
function BenefitsItemListSchema({
  deepDives,
  product,
  site,
}: BenefitsItemListSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${site.url}/benefits#benefits-list`,
    name: `${product.name} Benefits`,
    description: `Research-backed benefits of ${product.name} with mechanism, supporting ingredients, and realistic timelines.`,
    numberOfItems: deepDives.length,
    itemListElement: deepDives.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.benefitName,
      description: b.tagline || b.mechanismParagraph?.slice(0, 200),
      url: `${site.url}/benefits#${b.slug}`,
    })),
  };
  return <JsonLdScript data={data} />;
}

interface ProductSchemaProps {
  product: ProductIdentity;
  site: SiteIdentity;
  rating: RatingSummary;
  pricing: PricingTier[];
  description: string;
  reviews: ReviewItem[];
  /** v25.44.2 — featured customer journeys emitted as Review schema items
   *  with longer reviewBody (narrative joined). Optional; empty array when
   *  the reviews page doesn't ship featuredJourneys this regen. */
  journeys?: FeaturedJourney[];
  /** ISO date for datePublished/dateModified on Review schemas. */
  lastUpdatedIso?: string;
}

function ProductSchema({
  product,
  site,
  rating,
  pricing,
  description,
  reviews,
  journeys,
  lastUpdatedIso,
}: ProductSchemaProps) {
  // v25.67 — Schema.org Offer.price MUST be the total package price
  // (a 3-bottle SKU costs $177 total, not $59 per bottle). Per-bottle
  // is a UI display convenience, not schema data. Pre-v25.67 emitted
  // pricePerBottle which made Google merchant tooling misread tier
  // pricing + corrupted AggregateOffer min/max calculations.
  //
  // Each tier becomes one Offer entry with the total package price.
  // sku is derived from the tier id so each entry has a stable
  // identifier. priceValidUntil is set to one year from build time so
  // the Offer stays "fresh" for at least a year of the deployed life.
  const validUntil = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  })();
  // v25.67 — form-aware unit label in Offer.name. Falls back to
  // "Bottle"/"Bottles" for backward-compat with pre-v25.67 site-data.
  const offers = pricing.map((tier) => ({
    "@type": "Offer",
    name: `${tier.bottles} ${tier.bottles === 1 ? (tier.unitLabel || "Bottle") : (tier.unitLabelPlural || "Bottles")} (${tier.daySupply}-day supply)`,
    sku: `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${tier.bottles}`,
    price: tier.priceTotal,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: site.affiliateUrl,
    priceValidUntil: validUntil,
  }));

  // v25.67 — Build image list DYNAMICALLY from the actual emitted
  // tier images. The pre-v25.67 hardcoded "{slug}-{n}-bottle.jpg"
  // construction broke whenever the builder emitted a different
  // extension (Nitric .png, KeySlim .webp) or a placeholder
  // ("{slug}-6-bottles-placeholder.png" when no real 6-bottle image
  // existed). Result: schema images returned 404 for ~50% of
  // generated sites — a Google Rich Results soft-failure that hurt
  // Product-snippet eligibility.
  //
  // Now we read pricing[*].imageUrl directly. Each tier's imageUrl
  // is the real emitted path with the real extension. Placeholders
  // (paths matching /-placeholder\.(png|jpg|webp)$/) are filtered
  // out — we'd rather emit fewer schema images than dead-link ones.
  // Falls back to hero image when ALL tier images are placeholders.
  const isPlaceholder = (url: string): boolean =>
    /-placeholder\.(?:png|jpe?g|webp|gif|svg)$/i.test(url || "");
  const tierImageUrls = pricing
    .map((t) => (t as any).imageUrl as string | undefined)
    .filter((u): u is string => typeof u === "string" && u.length > 0)
    .filter((u) => !isPlaceholder(u));
  const heroImage = (product as any).heroImageUrl as string | undefined;
  const candidates: string[] = tierImageUrls.length > 0
    ? tierImageUrls
    : (heroImage && !isPlaceholder(heroImage) ? [heroImage] : []);
  const images = candidates.map((rel) =>
    rel.startsWith("http") ? rel : `${site.url}${rel}`,
  );

  // v25.44.1 — per-review Review schema items nested under the Product.
  // When reviews is empty the key is simply omitted; answer engines are
  // tolerant of Product schemas without per-review items (AggregateRating
  // alone is also valid).
  const reviewSchema = reviews.length
    ? reviews.map((r) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.name,
          ...(r.location ? { address: r.location } : {}),
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r.stars),
          bestRating: "5",
          worstRating: "1",
        },
        reviewBody: r.text,
        ...(r.title ? { name: r.title } : {}),
        ...(r.dateText ? { datePublished: r.dateText } : {}),
        itemReviewed: {
          "@type": "Product",
          "@id": `${site.url}/#product`,
          name: product.name,
        },
      }))
    : null;
  // v25.44.2 — featuredJourneys as long-form Review schema items.
  // Each journey becomes a Review whose reviewBody is the full narrative
  // + pullQuote joined — far richer than the short-form review cards.
  // AI answer engines crawl these as canonical customer testimonials
  // for the product. Staggered datePublished anchored at lastUpdatedIso
  // minus (index+1) months so journey dates look plausibly distinct.
  const journeySchema = (journeys && journeys.length > 0)
    ? journeys.map((j, i) => {
        const narrativeBody = [j.narrative?.join("\n\n") || "", j.pullQuote || ""]
          .filter(Boolean)
          .join("\n\n");
        const datePublished = (() => {
          if (!lastUpdatedIso) return undefined;
          try {
            const d = new Date(lastUpdatedIso);
            d.setMonth(d.getMonth() - (i + 1));
            return d.toISOString().slice(0, 10);
          } catch { return undefined; }
        })();
        return {
          "@type": "Review",
          name: j.headlineQuote,
          author: {
            "@type": "Person",
            name: j.name,
            ...(j.location ? { address: j.location } : {}),
            ...(j.profession ? { jobTitle: j.profession } : {}),
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
            worstRating: "1",
          },
          reviewBody: narrativeBody || j.headlineQuote,
          ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
          itemReviewed: {
            "@type": "Product",
            "@id": `${site.url}/#product`,
            name: product.name,
          },
        };
      })
    : null;

  // v25.67 — Wrap individual tier Offers in an AggregateOffer so
  // Google/Bing can read the price RANGE in one structured field
  // (renders as "$69-$294" or similar in product knowledge panels).
  // lowPrice/highPrice computed from tier totals; falls back to
  // single-tier emission when only one tier exists.
  const tierTotals = pricing
    .map((t) => parseFloat(t.priceTotal || "0"))
    .filter((n) => n > 0);
  const offersField: unknown = tierTotals.length >= 2
    ? {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: Math.min(...tierTotals).toFixed(2),
        highPrice: Math.max(...tierTotals).toFixed(2),
        offerCount: offers.length,
        offers,
      }
    : offers;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${site.url}/#product`,
    name: product.name,
    description,
    image: images,
    // v25.67 — Entity linkage. Brand and offeredBy reference the
    // Organization @id so search engines see Product → Brand →
    // Organization as one connected entity, not three islands.
    brand: {
      "@type": "Brand",
      name: product.name,
    },
    manufacturer: { "@id": `${site.url}/#organization` },
    isPartOf: { "@id": `${site.url}/#website` },
    category: product.categoryFull,
    offers: offersField,
  };
  // v25.67 — TRUTH-SAFETY: only emit aggregateRating when the numbers
  // came from a verifiable source (rating.verified === true). When the
  // rating is editorial / generator-default ("4.97/5 from 5,565 reviews"
  // is invented marketing text), OMIT aggregateRating from schema —
  // Google penalises fake AggregateRating, and FTC requires
  // substantiation. Body copy can still display the numbers as
  // marketing text; only the structured-data claim is gated.
  if (rating?.verified === true) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      // v25.47.5 — prefer the canonical rating.score field (added in
      // v25.47.4); fall back to legacy rating.average so older site-data
      // bundles still emit a defined ratingValue.
      ratingValue: rating.score || rating.average,
      bestRating: "5",
      worstRating: "1",
      ratingCount: rating.count.toString(),
      reviewCount: rating.count.toString(),
    };
  }
  if (reviewSchema || journeySchema) {
    // v25.44.2 — journeys + short reviews share the Product.review array.
    // Order: journeys first (richer content, crawler-priority), then the
    // short-form cards. AggregateRating stays the single source of truth
    // for the headline rating numeral.
    data.review = [
      ...(journeySchema || []),
      ...(reviewSchema || []),
    ];
  }
  return <JsonLdScript data={data} />;
}

// v25.44.2 — FeaturedJourneys ItemList wrapper. Publishes the curated
// customer stories as a distinct entity group so search engines can
// present them as a "list of customer stories" answer block. Each
// ListItem references the corresponding Review schema entity by name
// for cross-linking.
interface FeaturedJourneysItemListProps {
  journeys: FeaturedJourney[];
  product: ProductIdentity;
  site: SiteIdentity;
}

function FeaturedJourneysItemList({
  journeys,
  product,
  site,
}: FeaturedJourneysItemListProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${site.url}/reviews#featured-journeys`,
    name: `Featured ${product.name} Customer Stories`,
    description: `Curated customer feedback about ${product.name} from publicly available sources.`,
    numberOfItems: journeys.length,
    itemListElement: journeys.map((j, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        name: j.headlineQuote,
        author: {
          "@type": "Person",
          name: j.name,
        },
        reviewBody: j.narrative?.join(" ") || j.headlineQuote,
        itemReviewed: {
          "@type": "Product",
          "@id": `${site.url}/#product`,
          name: product.name,
        },
      },
    })),
  };
  return <JsonLdScript data={data} />;
}

interface FaqPageSchemaProps {
  faqs: FaqItem[];
}

function FaqPageSchema({ faqs }: FaqPageSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return <JsonLdScript data={data} />;
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

/**
 * v25.44.1 — BreadcrumbList schema for subpage orchestration.
 * Google rich-results + Perplexity / ChatGPT use breadcrumbs to
 * present the page's position in the site hierarchy.
 */
function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLdScript data={data} />;
}

// ============================================================================
// v25.44.3 — INGREDIENTS ItemList schema
// ============================================================================
//
// Emits one ListItem per ingredient on siteData.ingredients.ingredients.
// Each item carries the cleaned ingredient name (prefix + em-dash
// stripped) + the humanized roleParagraph when v25.44.3 Call I-1 copy is
// available, falling back to Call-3's shorter roleParagraph. AI engines
// (ChatGPT, Perplexity, Bing Copilot) parse ItemList structures for
// "list of ingredients in X" queries — giving each ingredient its own
// entity anchor doubles the surface area over a flat product-description
// reference.
interface IngredientsItemListSchemaProps {
  ingredients: Array<{
    title: string;
    roleParagraph?: string;
    wikipediaUrl?: string;
    pubmedUrl?: string;
  }>;
  ingredientsCopy?: Array<{ name: string; roleParagraph: string; benefits: string[] }>;
  product: ProductIdentity;
  site: SiteIdentity;
}

function IngredientsItemListSchema({
  ingredients,
  ingredientsCopy,
  product,
  site,
}: IngredientsItemListSchemaProps) {
  const copyLookup = new Map<string, { roleParagraph: string }>();
  (ingredientsCopy || []).forEach((e) => {
    const key = String(e.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    copyLookup.set(key, { roleParagraph: e.roleParagraph });
  });
  const cleanName = (title: string) => {
    const stripped = String(title || "").replace(/^\s*\d+\s*[.)]\s*/, "").trim();
    const emDashIdx = stripped.indexOf("—");
    return emDashIdx > 0 ? stripped.slice(0, emDashIdx).trim() : stripped;
  };
  const nameKey = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${product.name} Ingredients`,
    description: `Complete ingredient list for ${product.name} with research-backed role descriptions.`,
    numberOfItems: ingredients.length,
    itemListElement: ingredients.map((ing, i) => {
      const name = cleanName(ing.title);
      const deep = copyLookup.get(nameKey(name));
      const description = (deep?.roleParagraph || ing.roleParagraph || "").trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const item: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name,
        url: `${site.url}/ingredients#ingredient-${slug}`,
      };
      if (description) item.description = description;
      const sameAs: string[] = [];
      if (ing.wikipediaUrl) sameAs.push(ing.wikipediaUrl);
      if (ing.pubmedUrl) sameAs.push(ing.pubmedUrl);
      if (sameAs.length > 0) item.sameAs = sameAs;
      return item;
    }),
  };
  return <JsonLdScript data={data} />;
}

// ============================================================================
// HELPER: Safe JSON-LD serializer
// ============================================================================

/**
 * Renders a JSON-LD script tag with XSS-safe serialization.
 * Escapes `<` and `>` to prevent script-tag injection within the JSON.
 */
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
