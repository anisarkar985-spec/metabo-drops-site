interface BenefitsSummaryBarProps {
  totalBenefits: number;
  totalIngredients: number;
  guaranteeDays: number;
  productName: string;
}

/**
 * BenefitsSummaryBar — v25.44.4 dark-bg quick-stats strip below the
 * TOC on the /benefits page. Matches v25.44.3 IngredientsSummaryBar
 * pattern — 4 tiles on --bar-bg, gold accent numbers, uppercase muted
 * labels. No humanizer dependency; all values derived from the
 * rendered siteData counts.
 *
 * Product-agnostic: counts read from the actual array lengths passed
 * in, so a 4-benefit formula and a 12-benefit formula both ship clean.
 */
export default function BenefitsSummaryBar({
  totalBenefits,
  totalIngredients,
  guaranteeDays,
  productName,
}: BenefitsSummaryBarProps) {
  const tiles: Array<{ big: string; label: string }> = [
    {
      big: String(totalBenefits),
      label: "Researched Benefits",
    },
    {
      big: String(totalIngredients),
      label: "Supporting Ingredients",
    },
    {
      big: `${guaranteeDays}-Day`,
      label: "Money-Back Guarantee",
    },
    {
      big: "Multi",
      label: "Pathway Formula Approach",
    },
  ];
  return (
    <section
      id="benefits-overview"
      className="benefits-summary-bar"
      aria-label={`${productName} benefits summary`}
    >
      <div className="benefits-summary-inner">
        {tiles.map((tile, i) => (
          <figure key={i} className="benefits-summary-stat">
            <div className="benefits-summary-number">{tile.big}</div>
            <figcaption className="benefits-summary-label">{tile.label}</figcaption>
          </figure>
        ))}
      </div>
      <p className="benefits-summary-source">
        Benefits described are traced to specific ingredients and mechanism
        pathways. Individual experiences vary.
      </p>
    </section>
  );
}
