import type { FeaturedJourney } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface FeaturedJourneysProps {
  journeys: FeaturedJourney[];
  heading?: string;
}

// Six gradient presets matching the site's review-face-pool palette.
// Deterministic pick via name hash so the same reviewer always gets
// the same gradient across regens.
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #c8342c 0%, #8b1f1a 100%)",
  "linear-gradient(135deg, #0c1e3e 0%, #334155 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
  "linear-gradient(135deg, #15803d 0%, #166534 100%)",
  "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)",
];

function hashToIndex(input: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % mod;
}

function initialsFromName(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * FeaturedJourneys — v25.44.2.5 round-avatar card design.
 *
 * v25.44.2 shipped a 280px grey photo block at the top of each journey
 * card, which rendered as a generic placeholder on every product that
 * didn't surface a real journey photo. v25.44.2.5 replaces the photo
 * with a round 80px avatar — initials from the journey name, gradient
 * bg derived from a deterministic name-hash. Same pattern as the
 * homepage ReviewsGrid avatar fallback.
 *
 * Accessibility / SEO:
 *   • `<section>` landmark with aria-label (unchanged).
 *   • each card is `<article>` with aria-label identifying the reviewer.
 *   • `<blockquote>` for pullQuote.
 *   • id="featured-journeys" lets TableOfContents anchor-link here.
 */
export default function FeaturedJourneys({
  journeys,
  heading = "Featured Customer Stories",
}: FeaturedJourneysProps) {
  if (!journeys || journeys.length === 0) return null;

  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="featured-journeys"
        className="featured-journeys"
        aria-label="Featured customer stories"
      >
        {journeys.map((j, i) => {
          const gradient =
            (j as any).avatarGradient ||
            AVATAR_GRADIENTS[hashToIndex(j.name || `journey-${i}`, AVATAR_GRADIENTS.length)];
          const initials = initialsFromName(j.name);
          return (
            <article
              key={i}
              className="journey-card reveal"
              aria-label={`Customer story from ${j.name}, ${j.location}`}
            >
              <div className="journey-body">
                <div className="journey-header">
                  <div
                    className="journey-avatar"
                    style={{ background: gradient }}
                    aria-hidden="true"
                  >
                    <span className="journey-avatar-inner">{initials}</span>
                  </div>
                  <div className="journey-header-text">
                    <span className="journey-kicker">
                      Featured Story · {j.journeyDuration}
                    </span>
                    <h3 className="journey-name">{j.name}</h3>
                    <div className="journey-meta">
                      <span>{j.ageRange}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{j.location}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{j.profession}</span>
                    </div>
                    <div
                      className="journey-stars"
                      role="img"
                      aria-label="5 out of 5 stars"
                    >
                      ★★★★★
                    </div>
                  </div>
                </div>
                {j.headlineQuote ? (
                  <p className="journey-headline-quote">
                    <em>{j.headlineQuote}</em>
                  </p>
                ) : null}
                <div className="journey-narrative">
                  {j.narrative.map((p, pi) => (
                    <p key={pi}>{p}</p>
                  ))}
                </div>
                {j.pullQuote ? (
                  <blockquote className="journey-pullquote">
                    <p>{j.pullQuote}</p>
                  </blockquote>
                ) : null}
                {j.timeline && j.timeline.length > 0 ? (
                  <div
                    className="journey-timeline"
                    aria-label={`Week-by-week timeline for ${j.name}`}
                  >
                    <div className="journey-timeline-title">
                      {j.name.split(" ")[0]}'s Timeline
                    </div>
                    {j.timeline.map((row, ri) => (
                      <div key={ri} className="journey-timeline-row">
                        <div className="journey-timeline-period">
                          {row.period}
                        </div>
                        <div className="journey-timeline-observation">
                          {row.observation}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {j.purchaseContext ? (
                  <p className="journey-purchase-strip">
                    {j.purchaseContext}
                    {" "}
                    <a
                      href={j.purchaseContextHref}
                      className="journey-purchase-link"
                    >
                      {j.purchaseContextAnchor}
                    </a>
                    .
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
