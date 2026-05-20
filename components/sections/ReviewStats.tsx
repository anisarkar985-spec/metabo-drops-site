import type { ReviewStats as ReviewStatsType } from "@/types/site-data";

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

/**
 * ReviewStats — v25.44.1 customer-satisfaction stats strip.
 *
 * Renders a 4-column grid below the RatingSummary on the Reviews
 * subpage. Each tile shows a headline stat (display number) + a label.
 * Data comes from siteData.subpages.reviews.reviewStats, populated by
 * site-data-mapper.ts with zero humanizer dependency:
 *
 *   verifiedCount     → "Verified Reviews"
 *   averageRating     → "Average Rating"
 *   reorderRatePct    → "Reorder Rate"            (display constant 83)
 *   guaranteeDays     → "Money-Back Guarantee"
 *
 * satisfactionPct + wouldRecommendPct are also present in the type so
 * future layouts can surface them without another mapper change; the
 * current 4-stat layout mirrors the approved reference design.
 *
 * Accessibility: `<section>` landmark wrapping the strip; each tile is
 * a `<figure>` with `<figcaption>` so screen readers announce the
 * relationship between the headline number and its label.
 */
export default function ReviewStats({ stats }: ReviewStatsProps) {
  const guaranteeLabel =
    stats.guaranteeDays > 0
      ? `${stats.guaranteeDays}-Day`
      : "Money-Back";
  // v25.93 — Reorder Rate tile is only shown when the mapper provides
  // a verified value. Pre-v25.84 this was a hardcoded 83% constant
  // applied to every product; v25.84 removed that to avoid the
  // cross-site-fingerprint footprint that ad-detection clusters on.
  const tiles: Array<{ big: string; label: string }> = [
    {
      big: stats.verifiedCount.toLocaleString(),
      label: "Verified Reviews",
    },
    {
      big: stats.averageRating,
      label: "Average Rating",
    },
    ...(typeof stats.reorderRatePct === "number"
      ? [{ big: `${stats.reorderRatePct}%`, label: "Reorder Rate" }]
      : []),
    {
      big: guaranteeLabel,
      label: "Money-Back Guarantee",
    },
  ];

  return (
    <section
      id="review-stats"
      className="stats-strip"
      aria-label="Customer satisfaction statistics"
    >
      <div className="stats-inner">
        {tiles.map((tile, i) => (
          <figure key={i} style={{ margin: 0 }}>
            <div className="stat-big">{tile.big}</div>
            <figcaption className="stat-label">{tile.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
