import type { Metadata } from "next";
import { siteData } from "@/lib/site-data";
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import PageHero from "@/components/layout/PageHero";
import EditorialByline from "@/components/layout/EditorialByline";
import AnswerFirst from "@/components/layout/AnswerFirst";
import FaqAccordion from "@/components/interactive/FaqAccordion";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterDisclosure from "@/components/layout/FooterDisclosure";
import ScrollReveal from "@/components/interactive/ScrollReveal";
import SchemaJsonLd from "@/components/schema/SchemaJsonLd";

export const metadata: Metadata = {
  title: siteData.meta.contact.title,
  description: siteData.meta.contact.description,
  keywords: siteData.meta.contact.keywords,
  alternates: { canonical: siteData.meta.contact.canonical },
  openGraph: {
    title: siteData.meta.contact.title,
    description: siteData.meta.contact.description,
    url: siteData.meta.contact.canonical,
    siteName: siteData.product.name,
    images: [{ url: siteData.meta.contact.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.meta.contact.title,
    description: siteData.meta.contact.description,
    images: [siteData.meta.contact.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const page = siteData.subpages.contact;
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();

  return (
    <>
      <SchemaJsonLd siteData={siteData} include={{ website: true, product: false, faq: false }} />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <PageHero
        kicker={page.hero.kicker}
        title={{
          before: page.hero.titleBefore,
          emphasis: page.hero.titleEmphasis,
          after: page.hero.titleAfter,
        }}
        closingParagraph={page.hero.closingParagraph}
      >
        <EditorialByline editorial={siteData.editorial} />
        <AnswerFirst bold={page.hero.answerFirst.bold} rest={page.hero.answerFirst.rest} />
      </PageHero>

      {/* Primary support card — directs user to official product team */}
      <section className="primary-support">
        <div className="primary-card">
          <div className="primary-card-head">
            <div className="primary-card-icon">📞</div>
            <h2>Product support is handled on the official {siteData.product.name} website</h2>
          </div>
          <p>
            This page exists to help you discover {siteData.product.name} and make an
            informed decision. For anything involving your order, your account, or your
            personal use of the product, the official {siteData.product.name} customer
            care team is the right place to go — they have access to your order records
            and can resolve your question directly.
          </p>
          <p><strong>Visit the official {siteData.product.name} order page to find:</strong></p>
          <ul>
            <li>Direct customer support email address</li>
            <li>Refund &amp; return request process ({siteData.guarantee.days}-day guarantee)</li>
            <li>Order tracking and shipping inquiries</li>
            <li>Product questions and dosage guidance</li>
            <li>Full contact details and business hours</li>
          </ul>
          <a
            href={siteData.site.affiliateUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="primary-card-btn"
          >
            Go to Official {siteData.product.name} Page
          </a>
        </div>
      </section>

      {/* Info chip strip */}
      <section className="info-strip">
        <div className="info-chip">
          <div className="info-chip-icon">📦</div>
          <div className="info-chip-title">Order &amp; Shipping</div>
          <p className="info-chip-desc">Track your order, change address, shipping questions</p>
        </div>
        <div className="info-chip">
          <div className="info-chip-icon">💰</div>
          <div className="info-chip-title">Refunds</div>
          <p className="info-chip-desc">{siteData.guarantee.days}-day money-back guarantee claims</p>
        </div>
        <div className="info-chip">
          <div className="info-chip-icon">❓</div>
          <div className="info-chip-title">Product Questions</div>
          <p className="info-chip-desc">Ingredients, dosage, compatibility</p>
        </div>
        <div className="info-chip">
          <div className="info-chip-icon">🛡️</div>
          <div className="info-chip-title">Account &amp; Billing</div>
          <p className="info-chip-desc">Payment issues, receipts, account management</p>
        </div>
      </section>

      {/* General inquiry card */}
      <section className="general-inquiry">
        <div className="general-box">
          <div className="general-box-label">For non-product inquiries only</div>
          <h3>Media, partnership, or editorial questions about this page</h3>
          <p>
            If you have a press inquiry, partnership proposal, or feedback about this
            specific review page (not about your order), you can reach out using the
            address below. {page.responseLine}
          </p>
          <a href={`mailto:${siteData.site.supportEmail}`} className="mail-link">
            {siteData.site.supportEmail}
          </a>
          <div className="note">
            Please do not send order-related questions to this address — we cannot access
            your order details. Use the official product support above instead.
          </div>
        </div>
      </section>

      {/* Support FAQs */}
      <FaqAccordion faqs={page.supportFaqs} defaultOpenIndex={0} />

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
