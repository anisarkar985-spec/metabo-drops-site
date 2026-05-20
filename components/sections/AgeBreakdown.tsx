import type { AgeBucket } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface AgeBreakdownProps {
  buckets: AgeBucket[];
  heading?: string;
  /** Href target for the "common questions across age groups" footer
   *  link. Defaults to `#faq` on the current page. */
  faqLinkHref?: string;
}

/**
 * AgeBreakdown — v25.44.2 4-column age-bucket grid.
 *
 * Derived entirely in the mapper — no humanizer dependency, no
 * per-render cost. Each bucket: age range label (decorative badge),
 * large customerCount numeral, short commonOutcome phrase, and a
 * satisfaction bar showing the bucket's `satisfactionPct` on a 100-
 * wide track. A footer link points at the FAQ section with descriptive
 * anchor text "common questions across age groups".
 *
 * Accessibility:
 *   • `<section>` landmark
 *   • each bucket wrapped in `<figure>` with `<figcaption>` pairing the
 *     headline number with its label
 *   • satisfaction bar exposes `role="meter"` + aria-valuenow so
 *     non-sighted readers announce the percentage
 *
 * CSS scoped to `.age-breakdown` + `.age-bucket` + descendants.
 */
export default function AgeBreakdown({
  buckets,
  heading = "Results by Age Group",
  faqLinkHref = "#faq",
}: AgeBreakdownProps) {
  if (!buckets || buckets.length === 0) return null;

  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="age-breakdown"
        className="age-breakdown"
        aria-label="Customer results broken down by age group"
      >
        <div className="age-breakdown-grid">
          {buckets.map((b, i) => (
            <figure key={i} className="age-bucket reveal">
              <div className="age-bucket-badge">{b.ageRange}</div>
              <div
                className="age-bucket-count"
                aria-label={`${b.customerCount.toLocaleString()} customers in the ${b.ageRange} age range`}
              >
                {b.customerCount.toLocaleString()}
              </div>
              <figcaption className="age-bucket-label">customers</figcaption>
              <div className="age-bucket-outcome">{b.commonOutcome}</div>
              <div
                className="age-bucket-satisfaction"
                role="meter"
                aria-valuenow={b.satisfactionPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${b.satisfactionPct}% satisfaction in the ${b.ageRange} age range`}
              >
                <div
                  className="age-bucket-satisfaction-fill"
                  style={{ width: `${Math.max(0, Math.min(100, b.satisfactionPct))}%` }}
                />
                <span className="age-bucket-satisfaction-label">
                  {b.satisfactionPct}% satisfied
                </span>
              </div>
            </figure>
          ))}
        </div>
        <p className="age-breakdown-footer">
          <a href={faqLinkHref} className="age-breakdown-faq-link">
            See common questions across age groups
          </a>
        </p>
      </section>
    </>
  );
}
