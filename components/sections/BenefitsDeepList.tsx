import SectionBar from "@/components/layout/SectionBar";

type BenefitDeepDive = {
  slug: string;
  benefitName: string;
  tagline: string;
  mechanismParagraph: string;
  supportingIngredients: string[];
  userSignals: string[];
  timelineNote: string;
};

interface BenefitsDeepListProps {
  deepDives: BenefitDeepDive[];
  productName: string;
  heading?: string;
  /** Fallback headline-only list from siteData.mainBenefits for the graceful-
   *  degrade stub when deepDives is absent. Each stub renders the benefit
   *  name + a short placeholder note — better than a blank page. */
  fallbackBenefits?: Array<{ title: string; description?: string }>;
}

function slugFromName(name: string): string {
  return `benefit-${String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

/**
 * BenefitsDeepList — v25.44.4 mechanism-angle per-benefit deep-dive.
 *
 * Each block:
 *   • anchor id="benefit-{slug}" (matches chip-grid hrefs)
 *   • number badge (01 / 02 / …)
 *   • h3 benefit name + tagline subline
 *   • "Mechanism pathway" — mechanismParagraph (≥ 60 words)
 *   • "Supporting ingredients" — 2-3 ingredient chip strip
 *   • "What you'll notice" — 2-3 userSignals bullets
 *   • "Typical timeline" — timelineNote one-liner
 *
 * When deepDives is empty, falls back to fallbackBenefits stubs so the
 * page never renders blank. Subpage-only content — does NOT duplicate
 * homepage MainBenefits copy.
 */
export default function BenefitsDeepList({
  deepDives,
  productName,
  heading = "Full Benefit Breakdown",
  fallbackBenefits,
}: BenefitsDeepListProps) {
  const hasDeep = Array.isArray(deepDives) && deepDives.length > 0;
  const entries: BenefitDeepDive[] = hasDeep
    ? deepDives
    : (fallbackBenefits || []).map((b) => ({
        slug: slugFromName(b.title),
        benefitName: b.title,
        tagline: b.description || "",
        mechanismParagraph: "",
        supportingIngredients: [],
        userSignals: [],
        timelineNote: "",
      }));
  if (entries.length === 0) return null;

  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="benefit-breakdown"
        className="benefits-deep-list"
        aria-label={`Full breakdown of ${productName} benefits`}
      >
        {entries.map((b, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <article
              key={b.slug + i}
              id={b.slug}
              className="benefit-block reveal"
              aria-label={`${b.benefitName} — benefit deep-dive`}
            >
              <header className="benefit-block-header">
                <span className="benefit-number-badge" aria-hidden="true">
                  {num}
                </span>
                <div>
                  <h3 className="benefit-name">{b.benefitName}</h3>
                  {b.tagline ? (
                    <div className="benefit-tagline">{b.tagline}</div>
                  ) : null}
                </div>
              </header>
              {b.mechanismParagraph ? (
                <>
                  <h4 className="benefit-subhead">Mechanism pathway</h4>
                  <p className="benefit-mechanism">{b.mechanismParagraph}</p>
                </>
              ) : (
                // Fallback stub — siteData.mainBenefits description line,
                // graceful-degrade when Call B-1 didn't ship.
                b.tagline ? (
                  <p className="benefit-mechanism benefit-mechanism--stub">
                    Detailed mechanism analysis for this benefit is prepared on
                    the next content regeneration. See the{" "}
                    <a href="/ingredients" className="benefit-mechanism-link">
                      ingredients page
                    </a>
                    {" "}for the ingredient pathways driving this outcome.
                  </p>
                ) : null
              )}
              {b.supportingIngredients.length > 0 ? (
                <>
                  <h4 className="benefit-subhead">Supporting ingredients</h4>
                  <ul className="benefit-ingredients" aria-label="Ingredients driving this benefit">
                    {b.supportingIngredients.map((ing, j) => (
                      <li key={j} className="benefit-ingredient-chip">
                        <a
                          href={`/ingredients#ingredient-${ing
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")}`}
                        >
                          {ing}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {b.userSignals.length > 0 ? (
                <>
                  <h4 className="benefit-subhead">What you'll notice</h4>
                  <ul className="benefit-signals">
                    {b.userSignals.map((s, j) => (
                      <li key={j} className="benefit-signal-item">
                        <span className="benefit-signal-arrow" aria-hidden="true">→</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {b.timelineNote ? (
                <p className="benefit-timeline-note">
                  <span className="benefit-timeline-label">Typical timeline:</span>{" "}
                  {b.timelineNote}
                </p>
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
