import type { PricingTier, ProductIdentity } from "@/types/site-data";
import Jar from "./Jar";
import PaymentIcons from "./PaymentIcons";
import BestValueSticker from "./BestValueSticker";
import BuyNowButton from "./BuyNowButton";
import SectionBar from "@/components/layout/SectionBar";

interface PricingCardsProps {
  tiers: PricingTier[];
  product: ProductIdentity;
  affiliateUrl: string;
  /** Section title — can differ per placement */
  sectionTitle: string;
  /** Unique instance id (for sticker SVG filter id to avoid conflicts) */
  instanceId: string;
  /** Show final tagline at bottom? */
  showTagline?: boolean;
  /** Average rating for tagline */
  ratingAverage?: string;
  /** Section anchor id */
  sectionId?: string;
}

/**
 * PricingCards — dynamic N-tier pricing grid.
 *
 * v25.14.4 rewrite: previous implementation hardcoded three fixed slots
 * (basic / popular / bundle) and used `.find()` by id. That broke for any
 * tier configuration except 1/3/6 because:
 *   - A 2/3/6 config assigns id="bundle" to both 2-bot and 3-bot,
 *     so `find(id === "bundle")` dropped the second one silently.
 *   - A 1/2/3 config had no id="popular" card so only 2 cards rendered.
 *
 * New approach: render whatever tiers you're given, sorted ascending by
 * bottle count, in a CSS grid that auto-sizes. The featured tier (from
 * `isFeatured: true` — guaranteed to be exactly one by the mapper) gets
 * the BEST VALUE sticker and the enlarged "featured" styling. All other
 * tiers render as uniform cards.
 *
 * Works identically for 1/3/6, 2/3/6, 1/2/3, 3/6/12, 1/2/3/6, anything.
 */
export default function PricingCards({
  tiers,
  product,
  affiliateUrl,
  sectionTitle,
  instanceId,
  showTagline = false,
  ratingAverage,
  sectionId,
}: PricingCardsProps) {
  // Sort ascending by bottle count so smallest pack appears first.
  const sortedTiers = [...tiers].sort((a, b) => (a.bottles || 0) - (b.bottles || 0));

  return (
    <>
      {sectionId && <div id={sectionId} />}
      <SectionBar>{sectionTitle}</SectionBar>
      <div className="pricing-grid">
        {sortedTiers.map((tier) => (
          <TierCard
            key={`${tier.bottles}-${tier.id}`}
            tier={tier}
            product={product}
            affiliateUrl={affiliateUrl}
            filterId={`sticker-${instanceId}-${tier.bottles}`}
          />
        ))}
      </div>
      {showTagline && ratingAverage && (
        <div className="pricing-tagline">
          {/* v25.67.5 — form-aware container word in the pricing
              tagline. Reads tier.unitLabel (set by mapper from
              productForm) so jar products show "6-jar bundle" and
              capsule products show "6-bottle bundle". Falls back to
              "bottle" only when no tier supplies a unitLabel. */}
          ★★★★★ Average Customer Rating {ratingAverage} · 96% of customers choose the{" "}
          {sortedTiers.find((t) => t.isFeatured)?.bottles || sortedTiers.slice(-1)[0]?.bottles || 6}
          -{(sortedTiers.find((t) => t.isFeatured)?.unitLabel || sortedTiers[0]?.unitLabel || "Bottle").toLowerCase()} bundle
        </div>
      )}
    </>
  );
}

// ===================================================================
// UNIFIED TIER CARD — handles all quantity counts + featured/non-featured
// ===================================================================

interface TierCardProps {
  tier: PricingTier;
  product: ProductIdentity;
  affiliateUrl: string;
  filterId: string;
}

function TierCard({ tier, product, affiliateUrl, filterId }: TierCardProps) {
  const isSingle = tier.bottles === 1;
  const cardClass = tier.isFeatured ? "price-card featured reveal" : "price-card bundle reveal";
  // Visual variety: 1-bottle shows a single jar with servings tag,
  // multi-bottle shows a row of jar SVGs capped at 6.
  const jarCount = Math.min(Math.max(tier.bottles, 1), 6);
  // v25.67 — form-aware unit label (Jar/Bottle/Pouch). Falls back to
  // "Bottle"/"Bottles" for backward-compat with pre-v25.67 site-data.
  const unitOne = tier.unitLabel || "Bottle";
  const unitMany = tier.unitLabelPlural || "Bottles";
  const unitOneLower = unitOne.toLowerCase();
  const unitManyLower = unitMany.toLowerCase();

  return (
    <div className={cardClass}>
      {tier.isFeatured && <BestValueSticker filterId={filterId} />}

      <div className="price-tier-header">
        {tier.isFeatured ? (
          <>
            <span className="price-tier-header-label">
              {tier.bottles} {isSingle ? unitOne : unitMany}
            </span>
            <span className="price-tier-header-sub">{tier.daySupply} Day Supply</span>
          </>
        ) : (
          tier.label || (isSingle ? "Starter" : `${tier.bottles}-${unitOne} Bundle`)
        )}
      </div>

      <div className="price-card-body">
        {!tier.isFeatured && (
          <>
            <div className="price-qty-header">
              {tier.bottles} {isSingle ? unitOne : unitMany}
            </div>
            <div className="price-qty-sub">{tier.daySupply} Day Supply</div>
          </>
        )}

        <div className="price-img">
          {tier.imageUrl ? (
            // Real product pack shot (preferred). Using plain <img>
            // instead of next/image so the path works identically in
            // generated output as a flat export.
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={tier.imageUrl}
              alt={tier.imageAlt || `${product.name} — ${tier.bottles} ${isSingle ? unitOneLower : unitManyLower} pack — ${tier.daySupply}-day supply`}
              className="price-product-image"
              loading="lazy"
              width={400}
              height={400}
            />
          ) : jarCount === 1 ? (
            <Jar product={product} showTag servingsCount={tier.daySupply} />
          ) : (
            <div className={`jars-row jars-${jarCount}`}>
              {[...Array(jarCount)].map((_, i) => (
                <Jar key={i} product={product} />
              ))}
            </div>
          )}
        </div>

        <div className="price-row">
          <span className="price-now-big">${tier.pricePerBottle}</span>
          {/* v25.67.19 — form-aware unit suffix. Pre-v25.67.19 the
              "/BOTTLE" suffix was hardcoded — leaked "/BOTTLE" into
              jar/pouch/spray products even when rest of card said
              "Jar". Now reads tier.unitLabel set by mapper from
              productForm. */}
          <span className="price-now-unit">/{(tier.unitLabel || "Bottle").toUpperCase()}</span>
        </div>
        <div className="price-compare">
          <del>${tier.priceTotalOld}</del>{" "}
          <span className="now">${tier.priceTotal} Total</span>
        </div>

        {(tier.isFeatured || tier.freeShipping) && (
          <ul className="price-benefits">
            {/* v25.43.5 — guard against the `0 && ...` short-circuit
                that rendered the numeric literal 0 on featured tiers
                with zero bonuses (React renders {0} as text; it only
                suppresses false/null/undefined). Use an explicit
                numeric-positive check so the <li> shows only when
                bonusCount is a real positive number. */}
            {tier.isFeatured && typeof tier.bonusCount === "number" && tier.bonusCount > 0 && (
              <li>{tier.bonusCount} FREE BONUS{tier.bonusCount === 1 ? "" : "ES"}!</li>
            )}
            {tier.freeShipping && <li className="shipping">FREE US SHIPPING!</li>}
          </ul>
        )}

        {/* v25.43.5 — render the savings pill on EVERY tier including
            the featured one (was suppressed by !tier.isFeatured).
            The featured tier often carries the largest saving so
            hiding its pill is the opposite of what the operator
            wants. */}
        {tier.savingsBadge && (
          <div className="price-savings-badge">{tier.savingsBadge}</div>
        )}

        <BuyNowButton affiliateUrl={affiliateUrl} />
        <PaymentIcons />
      </div>
    </div>
  );
}
