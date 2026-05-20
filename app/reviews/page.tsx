import type { Metadata } from "next";
import { siteData } from "@/lib/site-data";
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import PageHero from "@/components/layout/PageHero";
import EditorialByline from "@/components/layout/EditorialByline";
import AnswerFirst from "@/components/layout/AnswerFirst";
import RatingSummary from "@/components/sections/RatingSummary";
import ReviewStats from "@/components/sections/ReviewStats";
import FeaturedJourneys from "@/components/sections/FeaturedJourneys";
import ResultsTimeline from "@/components/sections/ResultsTimeline";
import BenefitCategories from "@/components/sections/BenefitCategories";
import AgeBreakdown from "@/components/sections/AgeBreakdown";
import ExtendedReviewsGrid from "@/components/sections/ExtendedReviewsGrid";
import EditorialNote from "@/components/sections/EditorialNote";
import TableOfContents from "@/components/sections/TableOfContents";
import ReviewsFaq from "@/components/sections/ReviewsFaq";
import BuyingGuide from "@/components/sections/BuyingGuide";
import SectionBar from "@/components/layout/SectionBar";
import FinalCta from "@/components/sections/FinalCta";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterDisclosure from "@/components/layout/FooterDisclosure";
import ScrollReveal from "@/components/interactive/ScrollReveal";
import RelatedGuides from "@/components/sections/RelatedGuides";
import SchemaJsonLd from "@/components/schema/SchemaJsonLd";

/**
 * Reviews subpage — v25.44.2 expansion.
 *
 * Section order (12 blocks, conditional where data may be absent):
 *   1.  TopStrip                 (shared)
 *   2.  SiteHeader               (shared)
 *   3.  PageHero                 (kicker / h1 / byline / AnswerFirst /
 *                                  FTC-safe honest closingParagraph)
 *   4.  RatingSummary            (unchanged markup, v25.44.1 CSS)
 *   5.  ReviewStats              (v25.44.1 stats strip)
 *   6.  FeaturedJourneys         (NEW v25.44.2; conditional)
 *   7.  ResultsTimeline          (NEW v25.44.2; conditional)
 *   8.  BenefitCategories        (NEW v25.44.2; conditional)
 *   9.  AgeBreakdown             (NEW v25.44.2; always shipped, derived)
 *   10. ExtendedReviewsGrid      (renamed heading "More Customer Feedback",
 *                                  FTC-safe "Customer Feedback" pill —
 *                                  v25.44.2 neutralisation)
 *   11. EditorialNote            (NEW v25.44.2 honest disclaimer strip)
 *   12. FinalCta                 (unchanged, secondary CTA link deep-
 *                                  links to /#pricing)
 *       SiteFooter + FooterDisclosure + ScrollReveal (shared)
 *
 * Internal-link inventory (v25.44.2 target: ≥ 13):
 *   1  PageHero closingParagraph tail → #how-it-works
 *   2-4 FeaturedJourneys[0..2].purchaseContextHref → #pricing (3 links)
 *   5  ResultsTimeline intro → #ingredients
 *   6-10 BenefitCategories[0..4].benefitName → #benefits (5 links)
 *   11 AgeBreakdown footer → #faq
 *   12 EditorialNote → /privacy (policy link)
 *   13 FinalCta secondary → #pricing
 *
 * SEO: metadata.title / description / canonical / keywords / openGraph /
 *   twitter all sourced from siteData.meta.reviews. `authors` field
 *   anchors the page with an editorial byline for E-E-A-T signal.
 *
 * AEO / GEO: SchemaJsonLd emits Product (with per-review Review + per-
 *   journey Review), AggregateRating nested under Product,
 *   BreadcrumbList for this page, ItemList wrapping the featured
 *   journeys.
 *
 * Accessibility: `<main>` wraps page body; `<nav aria-label="Breadcrumb">`
 *   under the header exposes the breadcrumb path; every new section
 *   ships with landmark + aria-label coverage (see individual
 *   components).
 */
export const metadata: Metadata = {
  title: siteData.meta.reviews.title,
  description: siteData.meta.reviews.description,
  keywords: siteData.meta.reviews.keywords,
  authors: [{ name: siteData.editorial.author }],
  alternates: { canonical: siteData.meta.reviews.canonical },
  openGraph: {
    title: siteData.meta.reviews.title,
    description: siteData.meta.reviews.description,
    url: siteData.meta.reviews.canonical,
    siteName: siteData.product.name,
    images: [{ url: siteData.meta.reviews.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.reviews.title,
    description: siteData.meta.reviews.description,
    images: [siteData.meta.reviews.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function ReviewsPage() {
  const page = siteData.subpages.reviews;
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();

  const breadcrumb = [
    { name: "Home", url: `${siteData.site.url}/` },
    { name: "Customer Reviews", url: siteData.meta.reviews.canonical },
  ];

  // Ingredient-link anchor for the ResultsTimeline intro. Dynamic per
  // product so the link copy reflects the actual ingredient count.
  const ingredientCount = page.reviewStats?.totalReviews // placeholder context
    ? (page as any).ingredientCount
    : undefined;
  const ingredientAnchor = (() => {
    const list = (siteData as any).ingredients?.ingredients;
    if (Array.isArray(list) && list.length > 0) {
      return `${list.length} natural ingredients`;
    }
    return "the natural ingredient formula";
  })();

  return (
    <>
      <SchemaJsonLd
        siteData={siteData}
        include={{
          website: true,
          product: true,
          faq: false,
          reviews: true,
          breadcrumb: true,
        }}
        breadcrumb={breadcrumb}
      />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">Customer Reviews</span>
      </nav>

      <main>
        <PageHero
          kicker={page.hero.kicker}
          title={{
            before: page.hero.titleBefore,
            emphasis: page.hero.titleEmphasis,
            after: page.hero.titleAfter,
          }}
          closingParagraph={
            <>
              {page.honestDisclaimer?.heroClosingParagraph || page.hero.closingParagraph}
              {" "}
              Learn more about{" "}
              <a href="/#how-it-works" className="page-hero-inline-link">
                how {siteData.product.name} works
              </a>
              .
            </>
          }
        >
          <EditorialByline editorial={siteData.editorial} />
          <AnswerFirst bold={page.hero.answerFirst.bold} rest={page.hero.answerFirst.rest} />
        </PageHero>

        {/* v25.44.2.5 — on-page TOC rendered between the hero disclaimer
            and the first content section. Flags mirror the conditional
            rendering below so the TOC never points at a missing id. */}
        <TableOfContents
          productName={siteData.product.name}
          has={{
            ratingSummary: true,
            reviewStats: !!page.reviewStats,
            featuredJourneys: !!(page.featuredJourneys && page.featuredJourneys.length > 0),
            resultsTimeline: !!(page.resultsTimeline && page.resultsTimeline.length > 0),
            benefitCategories: !!(page.benefitCategories && page.benefitCategories.length > 0),
            ageBreakdown: !!(page.ageBreakdown && page.ageBreakdown.length > 0),
            customerFeedback: true,
            faq: !!(page.faqItems && page.faqItems.length > 0),
            buyingGuide: !!page.buyingGuide,
          }}
        />

        <RatingSummary rating={siteData.rating} breakdown={page.ratingsBreakdown} product={siteData.product} />

        {page.reviewStats ? (
          <>
            <SectionBar>Customer Satisfaction Snapshot</SectionBar>
            <ReviewStats stats={page.reviewStats} />
          </>
        ) : null}

        {page.featuredJourneys && page.featuredJourneys.length > 0 ? (
          <FeaturedJourneys journeys={page.featuredJourneys} />
        ) : null}

        {page.resultsTimeline && page.resultsTimeline.length > 0 ? (
          <ResultsTimeline
            phases={page.resultsTimeline}
            ingredientsLinkAnchor={ingredientAnchor}
            ingredientsLinkHref="/#ingredients"
          />
        ) : null}

        {page.benefitCategories && page.benefitCategories.length > 0 ? (
          <BenefitCategories
            categories={page.benefitCategories}
            benefitHrefTemplate="/#benefits"
          />
        ) : null}

        {page.ageBreakdown && page.ageBreakdown.length > 0 ? (
          <AgeBreakdown
            buckets={page.ageBreakdown}
            faqLinkHref="#faq"
          />
        ) : null}

        {/* v25.44.2.5 — in-page FAQ + buying-guide blocks. Both conditional
            on the Call 4d/4e humanizer output; mapper drops either if the
            truth-gate rejected it. */}
        {page.faqItems && page.faqItems.length > 0 ? (
          <ReviewsFaq items={page.faqItems} />
        ) : null}

        {page.buyingGuide ? (
          <BuyingGuide
            guide={page.buyingGuide}
            productName={siteData.product.name}
            pricingHref="/#pricing"
          />
        ) : null}

        <ExtendedReviewsGrid
          reviews={page.reviewsGrid}
          heading="More Customer Feedback"
        />

        {page.honestDisclaimer ? (
          <EditorialNote
            disclaimer={page.honestDisclaimer}
            policyHref="/privacy"
            policyAnchor="full editorial policy"
          />
        ) : null}

        <FinalCta
          finalCta={siteData.finalCta}
          affiliateUrl={siteData.site.affiliateUrl}
          microProof={siteData.finalCta.microProof}
        />

        <p className="reviews-secondary-cta">
          Prefer to browse options first?{" "}
          <a href="/#pricing" className="reviews-secondary-cta-link">
            Compare all {siteData.product.name} bundles
          </a>
          .
        </p>
      </main>

      {/* v25.67 — Related Guides cross-link block */}
      <RelatedGuides currentPath="/reviews" />

      <SiteFooter
        product={siteData.product}
        site={siteData.site}
        editorial={siteData.editorial}
        footerCopy={`A premium plant-based ${siteData.product.categoryShort.toLowerCase()} formula. Crafted in the USA in an FDA-registered, GMP-certified facility. Every order protected by a ${siteData.guarantee.days}-day money-back guarantee.`}
        disclaimer={`* The statements on this website have not been evaluated by the FDA. ${siteData.product.name} is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. If you are pregnant, nursing, taking medication, or have a medical condition, consult your physician before use. By using this site, you accept our Terms and Privacy Policy.`}
        year={year}
      />
      <FooterDisclosure product={siteData.product} site={siteData.site} editorial={siteData.editorial} year={year} />
      <ScrollReveal />
    </>
  );
}
