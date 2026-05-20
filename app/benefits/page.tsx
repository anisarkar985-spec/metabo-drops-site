import type { Metadata } from "next";
import { siteData } from "@/lib/site-data";
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import PageHero from "@/components/layout/PageHero";
import EditorialByline from "@/components/layout/EditorialByline";
import AnswerFirst from "@/components/layout/AnswerFirst";
import TableOfContents from "@/components/sections/TableOfContents";
import BenefitsSummaryBar from "@/components/sections/BenefitsSummaryBar";
import BenefitsChipGrid from "@/components/sections/BenefitsChipGrid";
import BenefitsDeepList from "@/components/sections/BenefitsDeepList";
import BenefitsFaq from "@/components/sections/BenefitsFaq";
import BenefitsBuyingGuide from "@/components/sections/BenefitsBuyingGuide";
import FinalCta from "@/components/sections/FinalCta";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterDisclosure from "@/components/layout/FooterDisclosure";
import ScrollReveal from "@/components/interactive/ScrollReveal";
import SchemaJsonLd from "@/components/schema/SchemaJsonLd";
import RelatedGuides from "@/components/sections/RelatedGuides";

/**
 * Benefits subpage — v25.44.4 full rebuild.
 *
 * Pre-v25.44.4 this page rendered <HowItWorks> + <MainBenefits> — both
 * homepage components using homepage data, making /benefits a 100%
 * homepage duplicate. v25.44.4 replaces those with five subpage-only
 * sections: dark-bg summary stats, benefit chip grid, per-benefit
 * mechanism deep dive, benefits-page FAQ (Call B-2), and benefits-page
 * BuyingGuide (Call B-3).
 *
 * Heading hierarchy:
 *   h1 (PageHero)
 *   h2 (each SectionBar — Full Benefit Breakdown, FAQ, Who Benefits Most)
 *   h3 (per-benefit name inside the deep list)
 *   h4 ("Mechanism pathway", "Supporting ingredients", …)
 *
 * Internal-link inventory (target ≥ 10):
 *   1  Breadcrumb "Home" → /
 *   2-9 TOC anchors (conditional on each section)
 *   10 PageHero closingParagraph → /ingredients
 *   11-M BenefitsDeepList per-benefit supportingIngredients → /ingredients#ingredient-{slug}
 *   M+1 BenefitsBuyingGuide closing → /#pricing
 *   M+2 FinalCta secondary → affiliateUrl
 *
 * SEO: metadata sourced from siteData.meta.benefits. article-type OG.
 * Zero verbatim match with the homepage — every block is subpage-only copy.
 *
 * AEO / GEO: SchemaJsonLd emits FAQPage (benefitsFaq) + BreadcrumbList.
 * Product + WebSite inherited globally.
 */
export const metadata: Metadata = {
  title: siteData.meta.benefits.title,
  description: siteData.meta.benefits.description,
  keywords: siteData.meta.benefits.keywords,
  authors: [{ name: siteData.editorial.author }],
  alternates: { canonical: siteData.meta.benefits.canonical },
  openGraph: {
    title: siteData.meta.benefits.title,
    description: siteData.meta.benefits.description,
    url: siteData.meta.benefits.canonical,
    siteName: siteData.product.name,
    images: [{ url: siteData.meta.benefits.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.benefits.title,
    description: siteData.meta.benefits.description,
    images: [siteData.meta.benefits.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function BenefitsPage() {
  const page = siteData.subpages.benefits;
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();

  const breadcrumb = [
    { name: "Home", url: `${siteData.site.url}/` },
    { name: "Benefits", url: siteData.meta.benefits.canonical },
  ];

  // Product-agnostic counts — derived from the actual arrays in siteData.
  // Works the same for a 4-benefit formula and a 12-benefit formula.
  const deepDives = page.benefitDeepDives || [];
  const mainBenefitsItems = siteData.mainBenefits?.benefits || [];
  const totalBenefits = deepDives.length > 0 ? deepDives.length : mainBenefitsItems.length;
  const totalIngredients = siteData.ingredients?.ingredients?.length || 0;

  // Chip grid mirrors the deep-list entries — same names, same anchor ids.
  const chips = deepDives.map((b) => ({
    slug: b.slug,
    benefitName: b.benefitName,
    tagline: b.tagline,
  }));

  return (
    <>
      <SchemaJsonLd
        siteData={siteData}
        include={{
          website: true,
          product: true,
          faq: false,
          benefits: true,
          breadcrumb: true,
        }}
        breadcrumb={breadcrumb}
      />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">Benefits</span>
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
              {page.hero.closingParagraph}
              {" "}
              Learn about the{" "}
              <a href="/ingredients" className="page-hero-inline-link">
                ingredients driving each pathway
              </a>
              .
            </>
          }
        >
          <EditorialByline editorial={siteData.editorial} />
          <AnswerFirst bold={page.hero.answerFirst.bold} rest={page.hero.answerFirst.rest} />
        </PageHero>

        <TableOfContents
          productName={siteData.product.name}
          has={{
            ratingSummary: false,
            reviewStats: false,
            featuredJourneys: false,
            resultsTimeline: false,
            benefitCategories: false,
            ageBreakdown: false,
            customerFeedback: false,
            faq: !!(page.benefitsFaq && page.benefitsFaq.length > 0),
            buyingGuide: !!page.benefitsBuyingGuide,
          }}
        />

        <BenefitsSummaryBar
          totalBenefits={totalBenefits}
          totalIngredients={totalIngredients}
          guaranteeDays={siteData.guarantee.days}
          productName={siteData.product.name}
        />

        {chips.length > 0 ? (
          <BenefitsChipGrid chips={chips} />
        ) : null}

        <BenefitsDeepList
          deepDives={deepDives}
          productName={siteData.product.name}
          fallbackBenefits={mainBenefitsItems.map((b) => ({
            title: b.title,
            description: (b.paragraphs && b.paragraphs[0]) || "",
          }))}
        />

        {page.benefitsFaq && page.benefitsFaq.length > 0 ? (
          <BenefitsFaq items={page.benefitsFaq} />
        ) : null}

        {page.benefitsBuyingGuide ? (
          <BenefitsBuyingGuide
            guide={page.benefitsBuyingGuide}
            productName={siteData.product.name}
            pricingHref="/#pricing"
          />
        ) : null}

        <FinalCta
          finalCta={siteData.finalCta}
          affiliateUrl={siteData.site.affiliateUrl}
          microProof={siteData.finalCta.microProof}
        />
      </main>

      {/* v25.67 — Related Guides cross-link block */}
      <RelatedGuides currentPath="/benefits" />

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
