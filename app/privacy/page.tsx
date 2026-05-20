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
  title: siteData.meta.privacy.title,
  description: siteData.meta.privacy.description,
  keywords: siteData.meta.privacy.keywords,
  alternates: { canonical: siteData.meta.privacy.canonical },
  openGraph: {
    title: siteData.meta.privacy.title,
    description: siteData.meta.privacy.description,
    url: siteData.meta.privacy.canonical,
    siteName: siteData.product.name,
    images: [{ url: siteData.meta.privacy.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.privacy.title,
    description: siteData.meta.privacy.description,
    images: [siteData.meta.privacy.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const privacy = siteData.subpages.privacy;
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();

  return (
    <>
      <SchemaJsonLd siteData={siteData} include={{ website: true, product: false, faq: false }} />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <LegalHero kicker={privacy.kicker} title={privacy.title}>
        <EditorialByline editorial={siteData.editorial} />
        <div className="updated">Last updated: {siteData.editorial.lastUpdated}</div>
      </LegalHero>

      <LegalContent content={privacy} />

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
