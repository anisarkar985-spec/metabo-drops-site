import type { Metadata } from "next";
import { siteData } from "@/lib/site-data";

// Layout components
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import EditorialByline from "@/components/layout/EditorialByline";
import AnswerFirst from "@/components/layout/AnswerFirst";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterDisclosure from "@/components/layout/FooterDisclosure";
import RelatedGuides from "@/components/sections/RelatedGuides";
import BuyerIntentFaq from "@/components/sections/BuyerIntentFaq";

// Section components
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Overview from "@/components/sections/Overview";
import WhyChoose from "@/components/sections/WhyChoose";
import ReviewsGrid from "@/components/sections/ReviewsGrid";
import PricingCards from "@/components/sections/PricingCards";
import HowItWorks from "@/components/sections/HowItWorks";
import MainBenefits from "@/components/sections/MainBenefits";
import Bonuses from "@/components/sections/Bonuses";
import GuaranteeSeal from "@/components/sections/GuaranteeSeal";
import Ingredients from "@/components/sections/Ingredients";
import HowToUse from "@/components/sections/HowToUse";
import WhereToBuy from "@/components/sections/WhereToBuy";
import WhatHappensAfterClick from "@/components/sections/WhatHappensAfterClick";
import ProsCons from "@/components/sections/ProsCons";
import BottleShowcase from "@/components/sections/BottleShowcase";
import FinalCta from "@/components/sections/FinalCta";
import InfoSources from "@/components/sections/InfoSources";

// Interactive client components
import FaqAccordion from "@/components/interactive/FaqAccordion";
import LiveNotifyPopup from "@/components/interactive/LiveNotifyPopup";
import ScrollReveal from "@/components/interactive/ScrollReveal";

// Schema
import SchemaJsonLd from "@/components/schema/SchemaJsonLd";

/**
 * Homepage metadata — derived from siteData.meta.home.
 */
export const metadata: Metadata = {
  title: siteData.meta.home.title,
  description: siteData.meta.home.description,
  keywords: siteData.meta.home.keywords,
  alternates: {
    canonical: siteData.meta.home.canonical,
  },
  openGraph: {
    title: siteData.meta.home.title,
    description: siteData.meta.home.description,
    url: siteData.meta.home.canonical,
    siteName: siteData.product.name,
    images: [{ url: siteData.meta.home.ogImage }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.home.title,
    description: siteData.meta.home.description,
    images: [siteData.meta.home.ogImage],
  },
};

/**
 * Homepage — assembles all 22 sections in exact HTML reference order.
 *
 * Section order (from HTML reference vitalflow-premium-v3.html):
 *   1.  TopStrip (announcement bar)
 *   2.  SiteHeader (sticky nav)
 *   3.  Hero (title, bullets, CTA, bottle visual)
 *   4.  LiveNotifyPopup (floating, fixed-position)
 *   5.  TrustBar (5 trust seals)
 *   6.  EditorialByline (E-E-A-T)
 *   7.  AnswerFirst (AEO block)
 *   8.  Overview ("What is X?")
 *   9.  WhyChoose (6 reasons)
 *   10. ReviewsGrid (3 featured reviews)
 *   11. PricingCards #1 (post-social-proof CTA)
 *   12. HowItWorks (4 mechanism points)
 *   13. MainBenefits (7 magazine-style benefits)
 *   14. Bonuses (2 free bonus cards)
 *   15. PricingCards #2 (Nitric-style with tagline)
 *   16. GuaranteeSeal (60-day)
 *   17. Ingredients (5 ingredient deep-dives)
 *   18. HowToUse (3-step protocol)
 *   19. WhereToBuy (exclusively official)
 *   20. WhatHappensAfterClick (6 steps)
 *   21. ProsCons (balanced assessment)
 *   22. FAQ Accordion (8 Q&A)
 *   23. BottleShowcase (6-bottle recommended bundle)
 *   24. FinalCta (bottom conversion CTA)
 *   25. InfoSources (scientific citations)
 *   26. SiteFooter (brand + 2 nav columns)
 *   27. FooterDisclosure (FTC/FDA legal block)
 *   + ScrollReveal (client — adds .visible to .reveal elements on scroll)
 *   + SchemaJsonLd (JSON-LD structured data)
 */
export default function HomePage() {
  const featuredTier = siteData.pricing.find((t) => t.isFeatured) || siteData.pricing[0];
  const currentYear = new Date(siteData.editorial.lastUpdatedIso)
    .getFullYear()
    .toString();

  return (
    <>
      {/* JSON-LD schemas (rendered in document head/body — both are valid) */}
      <SchemaJsonLd siteData={siteData} />

      <TopStrip
        featuredBottles={featuredTier?.bottles}
        featuredSavings={featuredTier?.savingsBadge}
        hasFreeShipping={Boolean(featuredTier?.freeShipping)}
        hasBonuses={(siteData.bonuses?.items?.length || 0) > 0}
        unitLabel={featuredTier?.unitLabel}
      />
      <SiteHeader productName={siteData.product.name} />

      <Hero
        hero={siteData.hero}
        product={siteData.product}
        site={siteData.site}
        rating={siteData.rating}
      />

      {/* Live-notify is position:fixed via CSS — placement in flow doesn't matter */}
      <LiveNotifyPopup people={siteData.liveNotifyPeople} />

      <TrustBar items={siteData.trust} guaranteeDays={siteData.guarantee.days} />

      <EditorialByline editorial={siteData.editorial} />

      <AnswerFirst
        bold={siteData.overview.answerFirst.bold}
        rest={siteData.overview.answerFirst.rest}
      />

      <Overview overview={siteData.overview} product={siteData.product} />

      <WhyChoose whyChoose={siteData.whyChoose} product={siteData.product} />

      <ReviewsGrid reviews={siteData.featuredReviews} product={siteData.product} />

      {/* Pricing Block #1 — after reviews (post-social-proof CTA) */}
      <PricingCards
        tiers={siteData.pricing}
        product={siteData.product}
        affiliateUrl={siteData.site.affiliateUrl}
        sectionTitle={`Ready to Try ${siteData.product.name}? Choose Your Package`}
        instanceId="block1"
        showTagline
        ratingAverage="4.9"
      />

      <HowItWorks howItWorks={siteData.howItWorks} product={siteData.product} />

      <MainBenefits
        mainBenefits={siteData.mainBenefits}
        product={siteData.product}
      />

      <Bonuses bonuses={siteData.bonuses} product={siteData.product} />

      {/* Pricing Block #2 — Nitric-style premium cards (before guarantee) */}
      <PricingCards
        tiers={siteData.pricing}
        product={siteData.product}
        affiliateUrl={siteData.site.affiliateUrl}
        sectionTitle="Step 1: Select Your Discount Package"
        instanceId="block2"
        sectionId="pricing"
        showTagline
        ratingAverage="4.9"
      />

      <GuaranteeSeal
        guarantee={siteData.guarantee}
        affiliateUrl={siteData.site.affiliateUrl}
      />

      <Ingredients
        ingredients={siteData.ingredients}
        product={siteData.product}
      />

      <HowToUse howToUse={siteData.howToUse} product={siteData.product} />

      <WhereToBuy
        whereToBuy={siteData.whereToBuy}
        product={siteData.product}
        affiliateUrl={siteData.site.affiliateUrl}
      />

      <WhatHappensAfterClick whatHappens={siteData.whatHappensAfterClick} />

      <ProsCons prosCons={siteData.prosCons} product={siteData.product} />

      <FaqAccordion faqs={siteData.faqs} />

      <BottleShowcase product={siteData.product} featuredTier={featuredTier} />

      <FinalCta
        finalCta={siteData.finalCta}
        affiliateUrl={siteData.site.affiliateUrl}
        microProof={siteData.finalCta.microProof}
      />

      <InfoSources infoSources={siteData.infoSources} />

      {/* v25.67 — Buyer-intent FAQ block (where to buy / price / safety / refund / legitimacy) */}
      <BuyerIntentFaq />

      {/* v25.67 — Related Guides cross-link block */}
      <RelatedGuides currentPath="/" />

      <SiteFooter
        product={siteData.product}
        site={siteData.site}
        editorial={siteData.editorial}
        footerCopy={`A premium plant-based ${siteData.product.categoryShort.toLowerCase()} formula. Crafted in the USA in an FDA-registered, GMP-certified facility. Every order protected by a ${siteData.guarantee.days}-day money-back guarantee.`}
        disclaimer={`* The statements on this website have not been evaluated by the FDA. ${siteData.product.name} is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. If you are pregnant, nursing, taking medication, or have a medical condition, consult your physician before use. By using this site, you accept our Terms and Privacy Policy.`}
        year={currentYear}
      />

      <FooterDisclosure
        product={siteData.product}
        site={siteData.site}
        editorial={siteData.editorial}
        year={currentYear}
      />

      {/* Client-side scroll reveal animations — must be last to observe all .reveal elements */}
      <ScrollReveal />
    </>
  );
}
