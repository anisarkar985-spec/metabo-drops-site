import SectionBar from "@/components/layout/SectionBar";

interface BenefitsChipGridProps {
  chips: Array<{ slug: string; benefitName: string; tagline: string }>;
  heading?: string;
}

// Same 6-tone palette as IngredientsChipGrid, cycling by position.
const CHIP_TONES = [
  { bg: "rgba(200, 52, 44, 0.08)",  border: "rgba(200, 52, 44, 0.20)",  label: "Mechanism" },
  { bg: "rgba(245, 158, 11, 0.10)", border: "rgba(245, 158, 11, 0.22)", label: "Metabolic" },
  { bg: "rgba(21, 128, 61, 0.08)",  border: "rgba(21, 128, 61, 0.20)",  label: "Systemic" },
  { bg: "rgba(12, 30, 62, 0.06)",   border: "rgba(12, 30, 62, 0.16)",   label: "Supportive" },
  { bg: "rgba(200, 52, 44, 0.06)",  border: "rgba(200, 52, 44, 0.16)",  label: "Behavioural" },
  { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.16)", label: "Cognitive" },
];

/**
 * BenefitsChipGrid — v25.44.4 anchor-link preview of every benefit.
 * Rendered above the deep list. Each chip: category tone badge,
 * benefit name, one-line tagline. Click → anchors to #benefit-{slug}
 * in the deep list.
 *
 * Product-agnostic: grid cells auto-fill, so a 4-benefit formula and
 * a 12-benefit formula both render cleanly.
 */
export default function BenefitsChipGrid({
  chips,
  heading = "All Benefits — Quick Preview",
}: BenefitsChipGridProps) {
  if (!chips || chips.length === 0) return null;
  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <nav
        className="benefits-chip-grid"
        aria-label="Benefit quick navigation"
      >
        {chips.map((chip, i) => {
          const tone = CHIP_TONES[i % CHIP_TONES.length];
          return (
            <a
              key={chip.slug + i}
              href={`#${chip.slug}`}
              className="benefit-chip"
              style={{
                background: tone.bg,
                borderColor: tone.border,
              }}
            >
              <span className="benefit-chip-badge">{tone.label}</span>
              <span className="benefit-chip-name">{chip.benefitName}</span>
              {chip.tagline ? (
                <span className="benefit-chip-tagline">{chip.tagline}</span>
              ) : null}
            </a>
          );
        })}
      </nav>
    </>
  );
}
