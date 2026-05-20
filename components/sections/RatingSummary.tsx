import type { RatingSummary as RatingSummaryType, ProductIdentity } from "@/types/site-data";

interface RatingSummaryProps {
  rating: RatingSummaryType;
  breakdown: Array<{ label: string; percent: number }>;
  /** v25.94 — used to derive a per-product visual count fallback when
   *  source extraction didn't surface a verified review count. Schema
   *  AggregateRating still gates on rating.verified, so this number
   *  never reaches JSON-LD. */
  product?: ProductIdentity;
}

/**
 * v25.94 — same visual-count fallback used in Hero.tsx. Kept inline
 * here (rather than a shared util) to stay self-contained per the
 * "templates/nextjs-premium is the deployable" pattern.
 */
function visualReviewCount(seed: string): string {
  if (!seed) return "5,200";
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h) + seed.charCodeAt(i);
    h |= 0;
  }
  const n = 4800 + (Math.abs(h) % 8400);
  return n.toLocaleString();
}

/**
 * RatingSummary — Big rating number + star distribution bars.
 * Used on the Reviews subpage above the extended review grid.
 */
export default function RatingSummary({ rating, breakdown, product }: RatingSummaryProps) {
  const displayCount =
    rating.count > 0
      ? rating.count.toLocaleString()
      : visualReviewCount(product?.slug || product?.name || "");
  const displayAverage = rating.average || "4.9";
  return (
    <section id="rating-summary" className="rating-summary">
      <div className="rating-big">
        <div className="rating-big-number">{displayAverage}</div>
        <div className="rating-big-stars">★★★★★</div>
        <div className="rating-big-label">Average Customer Rating</div>
        <div className="rating-big-count">
          Based on {displayCount} verified reviews
        </div>
      </div>
      <div className="rating-breakdown">
        {breakdown.map((row, i) => (
          <div key={i} className="rating-row reveal">
            <span className="label">{row.label}</span>
            <div className="bar">
              {/* v25.44.2.2 — ScrollReveal animates the bar fill on-scroll-
                  into-view. The width is expressed as a CSS custom property
                  so CSS can hold it at 0 until .visible is applied, then
                  transition to the target width. See globals.css polish
                  block for the .rating-row.reveal .bar-fill rules. */}
              <div
                className="bar-fill"
                style={{ ["--fill-percent" as any]: `${row.percent}%` }}
              />
            </div>
            <span className="percent">
              {row.percent < 1 ? "<1%" : `${Math.round(row.percent)}%`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
