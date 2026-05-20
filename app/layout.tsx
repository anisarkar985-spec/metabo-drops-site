import type { Metadata, Viewport } from "next";
import { siteData } from "@/lib/site-data";
import IndexNowPing from "@/components/seo/IndexNowPing";
import "./globals.css";

// v25.55 — explicit viewport meta. Without this Next 14 does NOT
// auto-emit <meta name="viewport"> on the App Router, so mobile
// browsers render at 1280px desktop width zoomed-out and every
// @media (max-width: ...) breakpoint silently fails. Result was a
// site that "looked desktop-only" on phones. Setting initialScale=1
// + width=device-width brings the responsive breakpoints back online.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0c1e3e",
};

/**
 * Root layout — provides HTML skeleton, fonts, and site-wide metadata base.
 * Individual pages override title/description via their own metadata exports.
 */

export const metadata: Metadata = {
  metadataBase: new URL(siteData.site.url),
  title: {
    default: siteData.meta.home.title,
    template: `%s | ${siteData.product.name}`,
  },
  description: siteData.meta.home.description,
  authors: [{ name: siteData.editorial.author }],
  keywords: siteData.meta.home.keywords.split(",").map((k) => k.trim()),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // v25.45.1 — favicon emitted at public/favicon.ico by the autosite
  // builder. The Metadata.icons block produces the canonical link tags
  // (<link rel="icon">, shortcut, apple-touch); the explicit <link>s
  // in <head> below are belt-and-braces for older browsers / scrapers
  // that don't honour the Next.js metadata icons emit.
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  // v25.46 — search engine verification meta tags. Filled from
  // environment variables so end users add Google Search Console +
  // Bing Webmaster Tools verification post-deploy without re-running
  // the generator. Both fields skip emission when env is unset.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
  other: {
    "theme-color": "#0c1e3e",
    "msapplication-TileColor": "#0c1e3e",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,600&family=Inter+Tight:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* v25.67 — Hero image preload for LCP optimisation. Bing
            weights LCP/CLS/INP directly in ranking; preload trims
            ~1.5s off LCP for the homepage hero. Skipped silently
            when heroImageUrl is absent. */}
        {siteData.product.heroImageUrl ? (
          <link
            rel="preload"
            as="image"
            href={siteData.product.heroImageUrl}
            // @ts-expect-error fetchpriority is valid HTML attr but not
            // yet typed in React's HTMLLinkAttributes
            fetchpriority="high"
          />
        ) : null}
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" />
      </head>
      <body>
        {children}
        {/* v25.67 — IndexNow first-visitor ping. No-op when
            NEXT_PUBLIC_INDEXNOW_KEY env var isn't set. */}
        <IndexNowPing />
      </body>
    </html>
  );
}
