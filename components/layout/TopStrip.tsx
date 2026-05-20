interface TopStripProps {
  /** Featured tier bottle count (e.g. 6). Used as "N-{unit} bundle" in copy. */
  featuredBottles?: number;
  /** Savings amount for the featured tier, e.g. "Save $780". When present,
   *  the strip copy uses this real number; when missing, falls back to a
   *  soft "save up to" phrasing. */
  featuredSavings?: string;
  /** Whether the featured tier has free shipping — turns on the shipping line. */
  hasFreeShipping?: boolean;
  /** Whether there are any bonuses attached to the featured tier. */
  hasBonuses?: boolean;
  /**
   * v25.67.5 — Form-aware container word. Mapper passes featuredTier.unitLabel
   * (jar / bottle / pouch / spray / pack) so the announcement bar reads
   * "6-jar bundle" for jar products and "6-bottle bundle" for capsule
   * products. Falls back to "bottle" for backward-compat.
   */
  unitLabel?: string;
}

/**
 * TopStrip — announcement bar at the very top of the page.
 *
 * v25.14.4: strip copy is now DATA-DRIVEN rather than hardcoded. Previously
 * this component emitted "Save up to 60% + 2 free bonuses with the 6-bottle
 * bundle" regardless of the actual generated site. Now it reads the real
 * featured-tier details passed in from page.tsx and renders the specific
 * number (e.g. "Save $780 on the 6-bottle bundle").
 *
 * All props optional — component degrades gracefully if data is missing.
 */
export default function TopStrip({
  featuredBottles,
  featuredSavings,
  hasFreeShipping = true,
  hasBonuses = false,
  unitLabel = "bottle",
}: TopStripProps = {}) {
  const unitWord = (unitLabel || "bottle").toLowerCase();
  const bundleLabel = featuredBottles ? `${featuredBottles}-${unitWord} bundle` : "largest bundle";

  // Normalize the savings string. Accept shapes like "Save $780", "$780", "780".
  const savings = (featuredSavings || "").trim();
  const normalizedSavings = savings
    ? /^save\b/i.test(savings)
      ? savings
      : /^\$/.test(savings)
        ? `Save ${savings}`
        : `Save $${savings.replace(/[^\d.]/g, "")}`
    : null;

  const savingsSegment = normalizedSavings || "Save up to 60%";
  const bonusesSegment = hasBonuses ? " + free bonuses" : "";
  const shippingSegment = hasFreeShipping ? " · Free US shipping" : "";

  return (
    <div className="top-strip">
      🎉 <strong>Limited-time offer:</strong> {savingsSegment}
      {bonusesSegment} on the {bundleLabel}
      {shippingSegment}
    </div>
  );
}
