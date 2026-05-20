interface TableOfContentsProps {
  productName: string;
  /** Which TOC entries to render. The reviews page passes flags mirroring
   *  the conditional rendering of each section so the TOC never points at
   *  a missing target. */
  has: {
    ratingSummary: boolean;
    reviewStats: boolean;
    featuredJourneys: boolean;
    resultsTimeline: boolean;
    benefitCategories: boolean;
    ageBreakdown: boolean;
    customerFeedback: boolean;
    faq: boolean;
    buyingGuide: boolean;
  };
}

/**
 * TableOfContents — v25.44.2.5 on-page anchor nav for the /reviews page.
 *
 * Rendered directly below the hero disclaimer, above RatingSummary. Uses
 * a mobile-collapsible <details>/<summary> so there's no JS dependency —
 * the TOC expands naturally on desktop (open by default) and reads as a
 * single-tap accordion on mobile.
 *
 * Each anchor target corresponds to a section id the downstream components
 * set on their outer <section>. Missing sections (toggled off via the
 * `has` flags) are omitted from the list so no dead links ship.
 *
 * Accessibility: a <nav aria-label="On this page"> wraps the list so
 * screen readers announce this as secondary navigation distinct from the
 * site header.
 */
export default function TableOfContents({ productName, has }: TableOfContentsProps) {
  const items: Array<{ label: string; href: string }> = [];
  if (has.ratingSummary) items.push({ label: "Customer Ratings Overview", href: "#rating-summary" });
  if (has.reviewStats) items.push({ label: "Customer Satisfaction Snapshot", href: "#review-stats" });
  if (has.featuredJourneys) items.push({ label: "Featured Customer Stories", href: "#featured-journeys" });
  if (has.resultsTimeline) items.push({ label: "The Typical Results Timeline", href: "#results-timeline" });
  if (has.benefitCategories) items.push({ label: "Results by Benefit", href: "#benefit-categories" });
  if (has.ageBreakdown) items.push({ label: "Results by Age Group", href: "#age-breakdown" });
  if (has.customerFeedback) items.push({ label: "More Customer Feedback", href: "#customer-feedback" });
  if (has.faq) items.push({ label: "Frequently Asked Questions", href: "#faq" });
  if (has.buyingGuide) items.push({ label: `Is ${productName} Right for You?`, href: "#buying-guide" });

  if (items.length === 0) return null;

  return (
    <nav className="toc-wrap" aria-label="On this page">
      <details className="toc-details" open>
        <summary className="toc-title">
          On this page
          <span className="toc-toggle-chevron" aria-hidden="true">▾</span>
        </summary>
        <ol className="toc-list">
          {items.map((item, i) => (
            <li key={i} className="toc-item">
              <a href={item.href} className="toc-link">
                <span className="toc-number" aria-hidden="true">{i + 1}.</span>
                <span className="toc-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
