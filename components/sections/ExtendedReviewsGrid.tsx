import type { ReviewItem } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface ExtendedReviewsGridProps {
  reviews: ReviewItem[];
  heading?: string;
}

/**
 * ExtendedReviewsGrid — v25.44.1 rebuilt card design matching the
 * approved /reviews reference. Homepage `ReviewsGrid` is UNCHANGED
 * (3-card strip, simpler layout) — only the extended grid shown on
 * the Reviews subpage uses this layout.
 *
 * Card shape (per review):
 *   • 56px round avatar — real portrait when `imageUrl` is set, else
 *     gradient initials fallback (matches v25.43.10 reconciliation)
 *   • Name + italic location
 *   • Neutral "Customer Feedback" pill (always shown, no green/no check)
 *   • Star row
 *   • Italic one-line headline (`title`) when present
 *   • Body text
 *   • Small date line (`dateText`) at card bottom
 *
 * v25.44.1 standing requirement: accessibility — each card wrapped in
 * an `<article>` landmark with aria-label identifying the reviewer,
 * images carry descriptive alt text, semantic time element for dates.
 */
export default function ExtendedReviewsGrid({
  reviews,
  heading = "More Customer Stories",
}: ExtendedReviewsGridProps) {
  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <div id="customer-feedback" className="extended-reviews">
        {reviews.map((review, i) => (
          <article
            key={i}
            className="extended-review-card reveal"
            aria-label={`Review from ${review.name}, ${review.location}`}
          >
            <div className="extended-review-head">
              <div
                className="extended-review-avatar"
                style={{ background: review.avatarGradient }}
              >
                {review.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={review.imageUrl}
                    alt={review.imageAlt || `Portrait of ${review.name} — customer from ${review.location}`}
                    loading="lazy"
                    width={56}
                    height={56}
                  />
                ) : (
                  review.initials
                )}
              </div>
              <div className="extended-review-meta">
                <h4>{review.name}</h4>
                <div className="loc">{review.location}</div>
              </div>
            </div>
            {/* v25.44.2 — FTC-safe neutralisation. The pre-v25.44.2 pill
                implied independent verification we cannot prove for
                humanizer-generated content. Replaced with a neutral
                "Customer Feedback" tag (no checkmark, no green, no
                claim-heavy wording). The underlying `review.verified`
                field is retained on the type for backward compatibility
                but intentionally ignored in rendering — tag shows for
                every card, not conditionally. */}
            <span
              className="extended-review-feedback-tag"
              aria-label="Customer feedback entry"
            >
              Customer Feedback
            </span>
            <div
              className="extended-review-stars"
              aria-label={`${review.stars} out of 5 stars`}
              role="img"
            >
              {"★".repeat(review.stars)}
            </div>
            {review.title ? (
              <h3 className="extended-review-title">{review.title}</h3>
            ) : null}
            <p className="extended-review-text">{review.text}</p>
            {review.dateText ? (
              <time className="extended-review-date">{review.dateText}</time>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}
