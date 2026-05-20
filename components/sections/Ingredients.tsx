import type { IngredientsSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface IngredientsProps {
  ingredients: IngredientsSection;
  product: ProductIdentity;
}

/**
 * Ingredients — "Key Ingredients Inside [Product]" deep-dive section.
 *
 * v25.16: when an IngredientItem has imageUrl (populated by the mapper
 * when the vision classifier found an ingredient-tagged image whose alt
 * text matched the ingredient name), a photo renders to the left of the
 * role paragraph. Without imageUrl, card stays text-only — no layout
 * collapse.
 */
export default function Ingredients({ ingredients, product }: IngredientsProps) {
  return (
    <>
      <div id="ingredients" />
      <SectionBar>Key Ingredients Inside {product.name}</SectionBar>
      <div className="prose-wrap reveal">
        <p>{ingredients.intro}</p>

        {ingredients.ingredients.map((ing, i) => (
          <div
            key={i}
            className={ing.imageUrl ? "ingredient-card has-image" : "ingredient-card"}
          >
            {ing.imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={ing.imageUrl}
                alt={ing.imageAlt || `${ing.title} — ingredient in ${product.name}`}
                className="ingredient-image"
                loading="lazy"
                width={120}
                height={120}
              />
            )}
            <div className="ingredient-body">
              <h3>{ing.title}</h3>
              <h4>Role in {product.name}:</h4>
              <p>{ing.roleParagraph}</p>
              <h4>Benefits:</h4>
              <ul className="arrow-list">
                {ing.benefits.map((benefit, j) => (
                  <li key={j}>{benefit}</li>
                ))}
              </ul>
              {(ing.wikipediaUrl || ing.pubmedUrl) && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--muted-soft)",
                    marginTop: "8px",
                  }}
                >
                  Research:{" "}
                  {ing.wikipediaUrl && (
                    <a
                      href={ing.wikipediaUrl}
                      target="_blank"
                      rel="noopener"
                      style={{ color: "var(--accent)" }}
                    >
                      Wikipedia
                    </a>
                  )}
                  {ing.wikipediaUrl && ing.pubmedUrl && " · "}
                  {ing.pubmedUrl && (
                    <a
                      href={ing.pubmedUrl}
                      target="_blank"
                      rel="noopener"
                      style={{ color: "var(--accent)" }}
                    >
                      PubMed study
                    </a>
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
