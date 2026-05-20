import type { ReviewItem, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface ReviewsGridProps {
  reviews: ReviewItem[];
  product: ProductIdentity;
}

/**
 * ReviewsGrid — 3 featured customer review cards on homepage.
 *
 * v25.14.5: when a review has a real scraped portrait (review.imageUrl),
 * show it. Otherwise fall back to the gradient avatar with initials.
 * This mirrors how ExtendedReviewsGrid on the Reviews subpage already
 * works but wasn't wired on the homepage.
 */
export default function ReviewsGrid({ reviews, product }: ReviewsGridProps) {
  return (
    <>
      <div id="reviews" />
      <SectionBar>{product.name} Customer Reviews</SectionBar>
      <div className="reviews-grid">
        {reviews.map((review, i) => (
          <div key={i} className="review reveal">
            <div className="review-photo">
              {review.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={review.imageUrl}
                  alt={review.imageAlt || `${review.name} — customer review portrait`}
                  className="review-photo-image"
                  loading="lazy"
                  width={120}
                  height={120}
                />
              ) : (
                <div
                  className="review-photo-placeholder"
                  style={{ background: review.avatarGradient }}
                >
                  {review.initials}
                </div>
              )}
            </div>
            <div className="review-name">{review.name}</div>
            <div className="review-location">{review.location}</div>
            <div className="review-stars">{"★".repeat(review.stars)}</div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
