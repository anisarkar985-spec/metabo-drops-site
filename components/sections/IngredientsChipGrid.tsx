import SectionBar from "@/components/layout/SectionBar";

interface IngredientsChipGridProps {
  chips: Array<{
    anchorId: string;
    icon?: string;
    iconStyle?: string;
    name: string;
    role?: string;
  }>;
  heading?: string;
}

// 6-tone palette pulled from existing tokens. Category is derived from
// chip index so the palette is stable across regens for any given
// ingredient position.
const CHIP_TONES = [
  { bg: "rgba(200, 52, 44, 0.08)",  border: "rgba(200, 52, 44, 0.20)",  label: "Antioxidant" },
  { bg: "rgba(245, 158, 11, 0.10)", border: "rgba(245, 158, 11, 0.22)", label: "Metabolic" },
  { bg: "rgba(21, 128, 61, 0.08)",  border: "rgba(21, 128, 61, 0.20)",  label: "Adaptogen" },
  { bg: "rgba(12, 30, 62, 0.06)",   border: "rgba(12, 30, 62, 0.16)",   label: "Mineral" },
  { bg: "rgba(200, 52, 44, 0.06)",  border: "rgba(200, 52, 44, 0.16)",  label: "Botanical" },
  { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.16)", label: "Vitamin" },
];

/**
 * IngredientsChipGrid — v25.44.3 visual preview of every ingredient as
 * an anchor-link chip. Rendered above the deep list so visitors can
 * scan the whole formula at a glance and jump straight to any entry.
 *
 * Each chip:
 *   • name (Fraunces 15px)
 *   • category badge (small pill, deterministic per-position tone)
 *   • role line (italic Inter Tight 12px muted, if available)
 *   • anchor link → #ingredient-{slug}
 *
 * Accessibility: <nav aria-label="Ingredient quick navigation"> so
 * screen readers announce this as a secondary nav landmark.
 */
export default function IngredientsChipGrid({
  chips,
  heading = "All Ingredients — Quick Preview",
}: IngredientsChipGridProps) {
  if (!chips || chips.length === 0) return null;
  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <nav
        className="ingredients-chip-grid"
        aria-label="Ingredient quick navigation"
      >
        {chips.map((chip, i) => {
          const tone = CHIP_TONES[i % CHIP_TONES.length];
          return (
            <a
              key={chip.anchorId + i}
              href={`#${chip.anchorId}`}
              className="ingredient-chip"
              style={{
                background: tone.bg,
                borderColor: tone.border,
              }}
            >
              <span className="ingredient-chip-badge">{tone.label}</span>
              <span className="ingredient-chip-name">{chip.name}</span>
              {chip.role ? (
                <span className="ingredient-chip-role">{chip.role}</span>
              ) : null}
            </a>
          );
        })}
      </nav>
    </>
  );
}
