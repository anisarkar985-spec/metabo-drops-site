import type { Metadata } from "next";
import { siteData } from "@/lib/site-data";
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import LegalHero from "@/components/layout/LegalHero";
import EditorialByline from "@/components/layout/EditorialByline";
import LegalContent from "@/components/sections/LegalContent";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterDisclosure from "@/components/layout/FooterDisclosure";
import ScrollReveal from "@/components/interactive/ScrollReveal";
import SchemaJsonLd from "@/components/schema/SchemaJsonLd";

// v25.67 — Disclaimer page. Required for supplement / health-product
// affiliate compliance. Covers FDA + medical + affiliate-earnings +
// individual-results disclaimers in one canonical location.
//
// Meta + content fall back to a static template when site-data doesn't
// supply customised values, so the page renders correctly for every
// generated bundle including pre-v25.67 ones.

const FALLBACK_META = {
  title: `${siteData.product.name} — Affiliate, FDA & Medical Disclaimer`,
  description: `Read the affiliate, FDA, medical, and individual-results disclaimer for ${siteData.product.name} reviews on ${siteData.site.domain}.`,
  canonical: `${siteData.site.url}/disclaimer`,
  keywords: `${siteData.product.name} disclaimer, affiliate disclosure, FDA disclaimer, medical disclaimer`,
  ogImage: siteData.meta.home.ogImage,
};

const meta = siteData.meta.disclaimer || FALLBACK_META;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: meta.canonical },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: meta.canonical,
    siteName: siteData.product.name,
    images: [{ url: meta.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: [meta.ogImage],
  },
  robots: { index: true, follow: true },
};

// v25.67.1 — fallback disclaimer with `id` field per section
// (LegalSubsection.id is required; v25.67 zip without id failed
// the next build's strict-types pass on Hostinger).
const FALLBACK_DISCLAIMER = {
  kicker: "Legal",
  title: "Disclaimer",
  intro: `This disclaimer applies to the editorial content published on ${siteData.site.domain} about ${siteData.product.name}. Please read it carefully before relying on any information here for purchase or health decisions.`,
  sections: [
    {
      id: "fda-disclaimer",
      heading: "FDA Disclaimer",
      paragraphs: [
        `The statements on this website have not been evaluated by the U.S. Food and Drug Administration. ${siteData.product.name} is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease.`,
      ],
    },
    {
      id: "medical-disclaimer",
      heading: "Medical Disclaimer",
      paragraphs: [
        `The information on this site is provided for general informational and educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before starting any new supplement, especially if you are pregnant, nursing, taking medication, or managing a medical condition.`,
      ],
    },
    {
      id: "affiliate-disclosure",
      heading: "Affiliate Disclosure",
      paragraphs: [
        `${siteData.site.domain} participates in affiliate programs. When you click an affiliate link on this site and complete a qualifying purchase, we may receive a commission at no additional cost to you. This helps support our editorial work. We only feature products we believe are worth a closer look — affiliate compensation does not influence editorial content.`,
      ],
    },
    {
      id: "individual-results-disclaimer",
      heading: "Individual Results Disclaimer",
      paragraphs: [
        `Customer feedback summaries on this site reflect individual experiences. Results vary from person to person and depend on factors such as diet, lifestyle, age, and overall health. No specific outcome is guaranteed. Past customer experiences do not predict future results for any individual user.`,
      ],
    },
    {
      id: "editorial-independence",
      heading: "Editorial Independence",
      paragraphs: [
        `Reviews on this site are produced by an independent editorial research team. We summarise publicly available product information, ingredient research from sources such as PubMed and Wikipedia, and aggregated customer feedback. We are not affiliated with the manufacturer of ${siteData.product.name}.`,
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      paragraphs: [
        `If you have questions about this disclaimer, please reach out at ${siteData.site.supportEmail}.`,
      ],
    },
  ],
};

export default function DisclaimerPage() {
  const disclaimer = siteData.subpages.disclaimer || FALLBACK_DISCLAIMER;
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();
  const breadcrumb = [
    { name: "Home", url: siteData.site.url },
    { name: "Disclaimer", url: meta.canonical },
  ];

  return (
    <>
      <SchemaJsonLd
        siteData={siteData}
        include={{ website: true, product: false, faq: false, breadcrumb: true }}
        breadcrumb={breadcrumb}
      />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <LegalHero kicker={disclaimer.kicker} title={disclaimer.title}>
        <EditorialByline editorial={siteData.editorial} />
        <div className="updated">Last updated: {siteData.editorial.lastUpdated}</div>
      </LegalHero>

      <LegalContent content={disclaimer} />

      <SiteFooter
        product={siteData.product}
        site={siteData.site}
        editorial={siteData.editorial}
        footerCopy={`A premium plant-based ${siteData.product.categoryShort.toLowerCase()} formula. Crafted in the USA in an FDA-registered, GMP-certified facility. Every order protected by a ${siteData.guarantee.days}-day money-back guarantee.`}
        disclaimer={`* The statements on this website have not been evaluated by the FDA. ${siteData.product.name} is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. If you are pregnant, nursing, taking medication, or have a medical condition, consult your physician before use.`}
        year={year}
      />
      <FooterDisclosure product={siteData.product} site={siteData.site} editorial={siteData.editorial} year={year} />
      <ScrollReveal />
    </>
  );
}
