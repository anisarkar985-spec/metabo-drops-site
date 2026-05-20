import type { BonusesSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface BonusesProps {
  bonuses: BonusesSection;
  product: ProductIdentity;
}

/**
 * Bonuses — "Free Bonuses With Your [Product] Order" grid.
 *
 * v25.14.6: each bonus card now renders a real <img> when bonus.imageUrl
 * is set (previously only the gradient placeholder was shown even when
 * the pipeline had downloaded bonus images to /images/bonus-N.<ext>).
 *
 * v25.87.0+ (phase 3m+): NEVER show fake/placeholder bonuses. Truth-only
 * rendering — if a bonus item has no real image (URL matches the system
 * placeholder convention `*-placeholder.{png,jpg,webp,svg}`, OR is
 * missing entirely), drop it from the grid. If all bonuses are
 * placeholder-only, hide the entire section. Rationale: vendors that
 * genuinely don't offer bonuses should not have a fake "Exclusive Bonus"
 * card with a gradient block — that's misleading to the visitor and
 * dilutes the page. Better to honestly hide than to invent.
 *
 * Pre-3m+ behaviour was the opposite: gradient placeholder rendered
 * whenever extractBonusPairs returned 0 pairs (e.g. metaflow's page
 * had no bonus image-title pairs but a stray "VIP Customer Program"
 * mention got hoisted into siteData.bonuses with a placeholder image).
 * Result was a giant fake gradient rectangle on every metaflow render.
 */
function isPlaceholderUrl(url: string | undefined | null): boolean {
  if (!url) return true;
  return /-placeholder\.(png|jpg|jpeg|webp|svg)(\?|$)/i.test(url);
}

export default function Bonuses({ bonuses, product }: BonusesProps) {
  if (!bonuses.items || bonuses.items.length === 0) {
    return null;
  }
  // v25.87.0+ phase 3m+ — truth-only filter. Drop bonuses that lack
  // a real image; if nothing real is left, suppress the whole section.
  const realItems = bonuses.items.filter((b) => !isPlaceholderUrl(b.imageUrl));
  if (realItems.length === 0) {
    return null;
  }

  return (
    <>
      <SectionBar>Free Bonuses With Your {product.name} Order</SectionBar>
      <div className="bonus-grid">
        {realItems.map((bonus, i) => (
          <div key={i} className="bonus reveal">
            <div className="bonus-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bonus.imageUrl}
                alt={bonus.imageAlt || `${bonus.name} — free digital bonus with ${product.name}`}
                className="bonus-image"
                loading="lazy"
                width={400}
                height={520}
              />
            </div>
            <h3 className="bonus-title">{bonus.name}</h3>
            <div className="bonus-value">
              {/* v25.92.14 — only show strike-through original price when
                  a real value was extracted from the vendor page. Empty
                  value collapses to a clean "100% FREE" line instead of
                  rendering a dangling "$ →" with no number. */}
              {bonus.value ? (
                <>
                  <del>${bonus.value}</del> → <span className="free">100% FREE</span>
                </>
              ) : (
                <span className="free">100% FREE</span>
              )}
            </div>
            <p className="bonus-desc">{bonus.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
