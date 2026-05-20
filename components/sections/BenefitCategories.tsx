import type { ReactNode } from "react";
import type { BenefitCategory } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface BenefitCategoriesProps {
  categories: BenefitCategory[];
  heading?: string;
  /** Template for the benefit internal-link href. Must contain `{slug}`
   *  which will be replaced per category. Defaults to `#benefits` so the
   *  page degrades gracefully when the /benefits subpage isn't published
   *  yet (v25.44.4). When /benefits exists, the page can pass
   *  `/benefits#{slug}`. */
  benefitHrefTemplate?: string;
}

/**
 * BenefitCategories — v25.44.2 five benefit blocks with clustered
 * representative customer quotes.
 *
 * Each block: an accent-coloured icon badge (emoji placeholder tied to
 * `iconName` — future revision can wire lucide-react if the client
 * bundle tolerates the dependency), h3 heading (keyword-rich internal
 * link to `/benefits#{slug}` when the full benefits page ships), a
 * summary paragraph (aggregate customer-feedback voice), and two
 * side-by-side quote cards (mobile: stacked). A small mention-count
 * footer anchors the block in data-specificity ("Referenced in
 * approximately 4,200 customer comments").
 *
 * Quotes framed as "representative of customer feedback" per the FTC-
 * safe disclosure pattern — never claimed as verified verbatim.
 *
 * Accessibility / SEO:
 *   • `<section>` landmark with aria-label
 *   • each block is `<article>`
 *   • benefit names are `<h3>` with descriptive anchor text
 *   • `<blockquote>` for each representative quote with `<footer>`
 *     for attribution — semantic HTML for crawlers + screen readers
 *
 * CSS scoped to `.benefit-categories` + `.benefit-block`.
 */
export default function BenefitCategories({
  categories,
  heading = "Results by Specific Benefit",
  benefitHrefTemplate = "#benefits",
}: BenefitCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  const href = (slug: string) =>
    benefitHrefTemplate.includes("{slug}")
      ? benefitHrefTemplate.replace("{slug}", slug)
      : benefitHrefTemplate;

  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="benefit-categories"
        className="benefit-categories"
        aria-label="Customer feedback grouped by benefit"
      >
        {categories.map((c, i) => (
          <article key={i} className="benefit-block reveal">
            <div className="benefit-block-head">
              <div className="benefit-block-icon" aria-hidden="true">
                <BenefitIcon name={c.iconName} />
              </div>
              <div className="benefit-block-heading-group">
                <h3 className="benefit-block-title">
                  <a
                    href={href(c.slug)}
                    className="benefit-block-link"
                    aria-label={`Learn more about ${c.benefitName}`}
                  >
                    {c.benefitName}
                  </a>
                </h3>
                {c.mentionCount > 0 ? (
                  <div className="benefit-mention-count">
                    Referenced in approximately{" "}
                    {c.mentionCount.toLocaleString()} customer comments
                  </div>
                ) : null}
              </div>
            </div>
            <p className="benefit-summary">{c.summary}</p>
            {c.quotes && c.quotes.length > 0 ? (
              <div className="benefit-quotes">
                {c.quotes.map((q, qi) => (
                  <blockquote key={qi} className="benefit-quote-card">
                    <p className="benefit-quote-text">{q.text}</p>
                    <footer className="benefit-quote-attribution">
                      {q.attribution}
                    </footer>
                  </blockquote>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </>
  );
}

/**
 * BenefitIcon — v25.44.2.2 inline SVG icons (zero external dependency).
 *
 * Replaces the v25.44.2 emoji-glyph shim with Lucide-style inline SVG
 * paths for the 12 iconName values the Call 4c prompt constrains output
 * to. Each path uses stroke: currentColor so the accent-coloured
 * `.benefit-block-icon` wrapper controls the visual tint; no SVG attrs
 * set fill/stroke explicitly (those come from CSS). Adding or swapping
 * an icon is a matter of editing the `PATHS` table below.
 *
 * Why inline SVG vs lucide-react: the lucide-react package adds ~12 kB
 * per used icon to the client bundle. An inline path table delivers the
 * same visual result at zero runtime cost.
 */
function BenefitIcon({ name }: { name: string }) {
  const PATHS: Record<string, ReactNode> = {
    Activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    Brain: (
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Zm5 0A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    ),
    Heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    Leaf: (
      <>
        <path d="M11 20A7 7 0 0 1 4 13c0-3.87 3.13-7 7-7h7v7a7 7 0 0 1-7 7Z" />
        <path d="M18 6 6.01 18" />
      </>
    ),
    Moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    Shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    Sparkles: (
      <>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
      </>
    ),
    Sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
    Target: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    TrendingUp: (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </>
    ),
    Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    Droplet: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  };
  const body = PATHS[name] || PATHS.Sparkles;
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
      {body}
    </svg>
  );
}
