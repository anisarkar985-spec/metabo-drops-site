interface IngredientsSummaryBarProps {
  totalIngredients: number;
  categoryCount: number;
  productName: string;
}

/**
 * IngredientsSummaryBar — v25.44.3 dark-bg quick-stats strip rendered
 * directly below the TOC on the /ingredients page.
 *
 * Four tiles on desktop / 2×2 on mobile, matching the ReviewStats
 * strip pattern (deep --bar-bg background, gold accent numbers,
 * uppercase muted labels). No humanizer dependency — pure derived
 * data: total ingredient count + category count + two trust claims
 * that hold true for every product in the catalog.
 *
 * Accessibility: <section aria-label="Ingredient summary"> + <figure>
 * per tile with <figcaption> linking the big number to its label.
 */
export default function IngredientsSummaryBar({
  totalIngredients,
  categoryCount,
  productName,
}: IngredientsSummaryBarProps) {
  const tiles: Array<{ big: string; label: string }> = [
    {
      big: String(totalIngredients),
      label: "Natural Ingredients",
    },
    {
      big: String(Math.max(1, categoryCount)),
      label: "Ingredient Categories",
    },
    {
      big: "All",
      label: "Listed with Research Citations",
    },
    {
      big: "Zero",
      label: "Fillers or Proprietary Blends",
    },
  ];
  return (
    <section
      id="ingredients-overview"
      className="ingredients-summary-bar"
      aria-label={`${productName} ingredient summary`}
    >
      <div className="ingredients-summary-inner">
        {tiles.map((tile, i) => (
          <figure key={i} className="ingredients-summary-stat">
            <div className="ingredients-summary-number">{tile.big}</div>
            <figcaption className="ingredients-summary-label">{tile.label}</figcaption>
          </figure>
        ))}
      </div>
      <p className="ingredients-summary-source">
        All ingredient information sourced from publicly available research
        and manufacturer documentation.
      </p>
    </section>
  );
}
