import type { ProductIdentity, PricingTier } from "@/types/site-data";

interface BottleShowcaseProps {
  product: ProductIdentity;
  /** The featured tier to source details from (usually the 6-bottle). */
  featuredTier: PricingTier;
}

/**
 * BottleShowcase — "Recommended bundle" visual strip shown before Final CTA.
 *
 * v25.14.6 rewrite: renders ONE large product image instead of N copies.
 * v25.14.5 rendered hero-image × bottleCount which looked silly when the
 * hero image was already a multi-bottle pack shot (2-bottle or 3-bottle
 * composite) — the page ended up showing "12 bottles" of VigorLong when
 * the user intended to see a single prominent product visual.
 *
 * Image priority:
 *   1. featuredTier.imageUrl   (the matched pack shot for this tier)
 *   2. product.heroImageUrl    (fallback — reuse the hero image)
 *   3. CSS placeholder         (last resort when no image available)
 */
export default function BottleShowcase({
  product,
  featuredTier,
}: BottleShowcaseProps) {
  const realImage = (featuredTier.imageUrl || product.heroImageUrl || "").trim();
  // v25.67.5 — form-aware container word. featuredTier.unitLabel is
  // set by the mapper from productForm so jar products say
  // "6-jar protocol" / "lowest per-jar cost" instead of "6-bottle".
  const unitOne = (featuredTier.unitLabel || "Bottle").toLowerCase();

  return (
    <section className="showcase">
      <div className="showcase-label">Recommended bundle</div>
      <h2 className="showcase-title">
        The <em>{featuredTier.bottles}-{unitOne}</em> {product.name} protocol — built for lasting results
      </h2>
      <p className="showcase-sub">
        Designed for the {featuredTier.daySupply}-day commitment that unlocks the full protective benefit of the
        formula. Both free bonuses, the lowest per-{unitOne} cost, and free US shipping — all
        in one package.
      </p>

      <div className="showcase-bundle reveal">
        {realImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={realImage}
            alt={featuredTier.imageAlt || `${product.name} ${featuredTier.bottles}-${unitOne} bundle`}
            className="showcase-hero-image"
            loading="lazy"
            width={500}
            height={500}
          />
        ) : (
          <div className="bottle-big">
            <div className="bb-name">{product.name}</div>
            <div className="bb-tag">{product.categoryShort}</div>
            <div className="bb-label-band">ULTRA</div>
          </div>
        )}
      </div>

      <div className="showcase-badge-row">
        <div className="showcase-badge">
          <span className="check">✓</span> {featuredTier.daySupply}-Day Supply
        </div>
        <div className="showcase-badge">
          <span className="check">✓</span> ${featuredTier.pricePerBottle} per {unitOne} (lowest price)
        </div>
        <div className="showcase-badge">
          <span className="check">✓</span> 2 Free Bonuses Included
        </div>
        <div className="showcase-badge">
          <span className="check">✓</span> Free US Shipping
        </div>
      </div>
    </section>
  );
}
