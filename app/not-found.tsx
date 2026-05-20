import Link from "next/link";
import { siteData } from "@/lib/site-data";
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

// v25.67 — Branded 404 page (Next.js convention: app/not-found.tsx).
// Pre-v25.67 the .htaccess referenced /404.html but neither
// 404.html nor not-found.tsx existed, so 404 errors served the
// generic Next.js error page. Now Next.js generates a proper
// 404.html during static export and serves a branded experience
// matching the rest of the site (header + footer + product CTA).

export const metadata = {
  title: `Page not found — ${siteData.product.name}`,
  description: `The page you're looking for doesn't exist. Return to the ${siteData.product.name} homepage.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();
  return (
    <>
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />
      <main className="not-found-main" style={{ padding: "96px 24px", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: "0.875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mutedText, #6b7280)", marginBottom: 12 }}>
          404 — Page not found
        </p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
          We couldn't find that page
        </h1>
        <p style={{ fontSize: "1.125rem", color: "var(--mutedText, #6b7280)", marginBottom: 32, lineHeight: 1.6 }}>
          The link may be broken or the page may have moved. Head back to the{" "}
          <Link href="/" style={{ color: "var(--primaryCta, #2563eb)", fontWeight: 600 }}>
            {siteData.product.name} homepage
          </Link>{" "}
          to continue.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 8,
              background: "var(--primaryCta, #2563eb)",
              color: "white",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Back to homepage
          </Link>
          <Link
            href="/reviews"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 8,
              background: "transparent",
              color: "var(--text, #111827)",
              border: "1px solid var(--border, #e5e7eb)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            See {siteData.product.name} reviews
          </Link>
        </div>
      </main>
      <SiteFooter
        product={siteData.product}
        site={siteData.site}
        editorial={siteData.editorial}
        footerCopy={`A premium plant-based ${siteData.product.categoryShort.toLowerCase()} formula.`}
        disclaimer={`* The statements on this website have not been evaluated by the FDA. ${siteData.product.name} is not intended to diagnose, treat, cure, or prevent any disease.`}
        year={year}
      />
    </>
  );
}
