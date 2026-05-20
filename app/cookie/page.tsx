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

export const metadata: Metadata = {
  title: siteData.meta.cookie.title,
  description: siteData.meta.cookie.description,
  keywords: siteData.meta.cookie.keywords,
  alternates: { canonical: siteData.meta.cookie.canonical },
  openGraph: {
    title: siteData.meta.cookie.title,
    description: siteData.meta.cookie.description,
    url: siteData.meta.cookie.canonical,
    siteName: siteData.product.name,
    images: [{ url: siteData.meta.cookie.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.cookie.title,
    description: siteData.meta.cookie.description,
    images: [siteData.meta.cookie.ogImage],
  },
  // v25.84.0 — Cookie page is a legal disclosure, not search content.
  // sitemap.xml deliberately excludes it; robots metadata must agree.
  // Pre-v25.84 had `index: true` which contradicted the sitemap exclusion
  // (Google would index the page despite sitemap omission).
  robots: { index: false, follow: false },
};

export default function CookiePage() {
  const cookie = siteData.subpages.cookie;
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();

  return (
    <>
      <SchemaJsonLd siteData={siteData} include={{ website: true, product: false, faq: false }} />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <LegalHero kicker={cookie.kicker} title={cookie.title}>
        <EditorialByline editorial={siteData.editorial} />
        <div className="updated">Last updated: {siteData.editorial.lastUpdated}</div>
      </LegalHero>

      <LegalContent content={cookie} />

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
