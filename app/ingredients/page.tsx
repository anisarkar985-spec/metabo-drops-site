import type { Metadata } from "next";
import { siteData } from "@/lib/site-data";
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import PageHero from "@/components/layout/PageHero";
import EditorialByline from "@/components/layout/EditorialByline";
import AnswerFirst from "@/components/layout/AnswerFirst";
import TableOfContents from "@/components/sections/TableOfContents";
import IngredientsSummaryBar from "@/components/sections/IngredientsSummaryBar";
import IngredientsChipGrid from "@/components/sections/IngredientsChipGrid";
import IngredientsDeepList from "@/components/sections/IngredientsDeepList";
import IngredientsFaq from "@/components/sections/IngredientsFaq";
import IngredientsBuyingGuide from "@/components/sections/IngredientsBuyingGuide";
import FinalCta from "@/components/sections/FinalCta";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterDisclosure from "@/components/layout/FooterDisclosure";
import ScrollReveal from "@/components/interactive/ScrollReveal";
import SchemaJsonLd from "@/components/schema/SchemaJsonLd";
import RelatedGuides from "@/components/sections/RelatedGuides";

/**
 * Ingredients subpage — v25.44.3 full rebuild.
 *
 * Section order (top to bottom):
 *   1.  SchemaJsonLd (ItemList + BreadcrumbList + FAQPage for ingredients)
 *   2.  TopStrip
 *   3.  SiteHeader
 *   4.  Breadcrumb (Home → Ingredients, above the dark hero)
 *   5.  PageHero (v25.44.2.4 dark navy hero, inherits automatically)
 *   6.  TableOfContents (v25.44.2.5 component, ingredients-specific anchors)
 *   7.  IngredientsSummaryBar  — id="ingredients-overview"
 *   8.  IngredientsChipGrid    — anchor-link chips to each deep block
 *   9.  IngredientsDeepList    — id="ingredient-breakdown"
 *   10. IngredientsFaq         — id="faq" (when ingredientsFaq present)
 *   11. IngredientsBuyingGuide — id="buying-guide" (when present)
 *   12. FinalCta
 *   13. SiteFooter + FooterDisclosure + ScrollReveal
 *
 * Internal-link inventory (≥ 10):
 *   1  Breadcrumb "Home" → /
 *   2-10 TableOfContents — 9 intra-page anchors
 *   11 IngredientsSummaryBar "See what customers say" → /reviews
 *   12 Each ingredient's "Research:" external links (Wikipedia + PubMed)
 *   13 IngredientsBuyingGuide closing → /#pricing
 *   14 FinalCta → affiliateUrl
 *
 * SEO: metadata from siteData.meta.ingredients. article-type OG. Heading
 * hierarchy — single h1 (inside PageHero), h2 on each SectionBar, h3 on
 * each ingredient name, h4 on "Role in X:" / "Key Benefits:" sub-labels.
 *
 * AEO / GEO: ItemList + FAQPage + BreadcrumbList schemas emitted when
 * opts.ingredients is true. Wikipedia + PubMed `sameAs` per-ingredient
 * entity links grant AI engines authoritative citation anchors.
 */
export const metadata: Metadata = {
  title: siteData.meta.ingredients.title,
  description: siteData.meta.ingredients.description,
  keywords: siteData.meta.ingredients.keywords,
  authors: [{ name: siteData.editorial.author }],
  alternates: { canonical: siteData.meta.ingredients.canonical },
  openGraph: {
    title: siteData.meta.ingredients.title,
    description: siteData.meta.ingredients.description,
    url: siteData.meta.ingredients.canonical,
    siteName: siteData.product.name,
    images: [{ url: siteData.meta.ingredients.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.ingredients.title,
    description: siteData.meta.ingredients.description,
    images: [siteData.meta.ingredients.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function IngredientsPage() {
  const page = siteData.subpages.ingredients;
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();

  const breadcrumb = [
    { name: "Home", url: `${siteData.site.url}/` },
    { name: "Ingredients", url: siteData.meta.ingredients.canonical },
  ];

  const totalIngredients = siteData.ingredients.ingredients.length;
  // Category count: rough heuristic from chip position (the chip palette
  // cycles every 6 entries). Always reports ≥ 1 even on short lists.
  const categoryCount = Math.min(6, Math.max(1, Math.ceil(totalIngredients / 4)));

  return (
    <>
      <SchemaJsonLd
        siteData={siteData}
        include={{
          website: true,
          product: true,
          faq: false,
          ingredients: true,
          breadcrumb: true,
        }}
        breadcrumb={breadcrumb}
      />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">Ingredients</span>
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
              See{" "}
              <a href="/reviews" className="page-hero-inline-link">
                what customers say
              </a>
              {" "}after trying these ingredients in real use.
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
            faq: !!(page.ingredientsFaq && page.ingredientsFaq.length > 0),
            buyingGuide: !!page.ingredientsBuyingGuide,
          }}
        />

        <IngredientsSummaryBar
          totalIngredients={totalIngredients}
          categoryCount={categoryCount}
          productName={siteData.product.name}
        />

        <IngredientsChipGrid chips={page.chips} />

        <IngredientsDeepList
          ingredients={siteData.ingredients.ingredients}
          ingredientsCopy={page.ingredientsCopy}
          productName={siteData.product.name}
        />

        {page.ingredientsFaq && page.ingredientsFaq.length > 0 ? (
          <IngredientsFaq items={page.ingredientsFaq} />
        ) : null}

        {page.ingredientsBuyingGuide ? (
          <IngredientsBuyingGuide
            guide={page.ingredientsBuyingGuide}
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
      <RelatedGuides currentPath="/ingredients" />

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
