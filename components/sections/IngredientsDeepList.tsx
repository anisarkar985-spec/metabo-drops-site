import type { IngredientItem } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface IngredientsDeepListProps {
  ingredients: IngredientItem[];
  /**
   * v25.44.3 — optional per-ingredient humanized deep copy keyed by
   * normalized ingredient name. When a match is found, it REPLACES the
   * shorter Call-3 roleParagraph + benefits for the /ingredients page.
   * Falls back to Call-3 data when absent so no block is ever blank.
   */
  ingredientsCopy?: Array<{ name: string; roleParagraph: string; benefits: string[] }>;
  productName: string;
  heading?: string;
}

// Strip "N. " prefix and " — role" tail so the display h3 shows a
// clean canonical ingredient name.
function parseTitle(title: string): { name: string; role: string } {
  const stripped = String(title || "").replace(/^\s*\d+\s*[.)]\s*/, "").trim();
  const emDashIdx = stripped.indexOf("—");
  if (emDashIdx > 0) {
    return {
      name: stripped.slice(0, emDashIdx).trim(),
      role: stripped.slice(emDashIdx + 1).trim(),
    };
  }
  return { name: stripped, role: "" };
}

function normalizeKey(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/^\s*\d+\s*[.)]\s*/, "")
    .split("—")[0]
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s: string): string {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * IngredientsDeepList — v25.44.3 one deep block per ingredient.
 *
 * Each block renders:
 *   • anchor id="ingredient-{slug}" (matches chip-grid hrefs)
 *   • number badge (01 / 02 / …)
 *   • h3 ingredient name + role subline
 *   • "Role in {productName}:" — v25.44.3 humanized copy (≥60 words)
 *     or Call-3 fallback if per-ingredient lookup missed
 *   • "Key Benefits:" arrow-bullet list (3-4 items)
 *   • "Research:" citation row — Wikipedia + PubMed links when present
 *
 * Semantic HTML: every block is an <article>; section wrapper is
 * <section id="ingredient-breakdown">. Preserves Call-3 research URLs
 * verbatim.
 */
export default function IngredientsDeepList({
  ingredients,
  ingredientsCopy,
  productName,
  heading = "Full Ingredient Breakdown",
}: IngredientsDeepListProps) {
  if (!ingredients || ingredients.length === 0) return null;

  const lookup = new Map<string, { roleParagraph: string; benefits: string[] }>();
  (ingredientsCopy || []).forEach((e) => {
    lookup.set(normalizeKey(e.name), {
      roleParagraph: e.roleParagraph,
      benefits: e.benefits,
    });
  });

  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="ingredient-breakdown"
        className="ingredients-deep-list"
        aria-label={`Full breakdown of ${productName} ingredients`}
      >
        {ingredients.map((ing, i) => {
          const parsed = parseTitle(ing.title);
          const slug = slugify(parsed.name);
          const humanized = lookup.get(normalizeKey(parsed.name));
          const role = humanized?.roleParagraph || ing.roleParagraph || "";
          const benefits =
            humanized?.benefits && humanized.benefits.length > 0
              ? humanized.benefits
              : ing.benefits || [];
          const num = String(i + 1).padStart(2, "0");
          return (
            <article
              key={i}
              id={`ingredient-${slug}`}
              className="ingredient-block reveal"
              aria-label={`${parsed.name} — ingredient deep-dive`}
            >
              <header className="ingredient-block-header">
                <span className="ingredient-number-badge" aria-hidden="true">
                  {num}
                </span>
                <div>
                  <h3 className="ingredient-name">{parsed.name}</h3>
                  {parsed.role ? (
                    <div className="ingredient-role-tag">{parsed.role}</div>
                  ) : null}
                </div>
              </header>
              {role ? (
                <>
                  <h4 className="ingredient-subhead">Role in {productName}:</h4>
                  <p className="ingredient-role">{role}</p>
                </>
              ) : null}
              {benefits.length > 0 ? (
                <>
                  <h4 className="ingredient-subhead">Key Benefits:</h4>
                  <ul className="ingredient-benefits">
                    {benefits.map((b, j) => (
                      <li key={j} className="ingredient-benefit-item">
                        <span className="ingredient-benefit-arrow" aria-hidden="true">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {ing.wikipediaUrl || ing.pubmedUrl ? (
                <p className="ingredient-citation">
                  <span className="ingredient-citation-label">Research:</span>{" "}
                  {ing.wikipediaUrl ? (
                    <a
                      href={ing.wikipediaUrl}
                      target="_blank"
                      rel="noopener"
                      className="ingredient-citation-link"
                    >
                      Wikipedia
                    </a>
                  ) : null}
                  {ing.wikipediaUrl && ing.pubmedUrl ? " · " : null}
                  {ing.pubmedUrl ? (
                    <a
                      href={ing.pubmedUrl}
                      target="_blank"
                      rel="noopener"
                      className="ingredient-citation-link"
                    >
                      PubMed study
                    </a>
                  ) : null}
                </p>
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
