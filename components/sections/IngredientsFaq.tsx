import SectionBar from "@/components/layout/SectionBar";

interface IngredientsFaqProps {
  items: Array<{ question: string; answer: string }>;
  heading?: string;
}

/**
 * IngredientsFaq — v25.44.3. Same <details>/<summary> accordion shape
 * as ReviewsFaq, just fed from siteData.subpages.ingredients.ingredientsFaq
 * (Call I-2) instead of the reviews-page FAQ source.
 *
 * Exclusive open via <details name="ingredients-faq"> so only one Q&A
 * is expanded at a time. CSS is shared with .reviews-faq-* family — the
 * same token-led palette + hover states apply.
 */
export default function IngredientsFaq({
  items,
  heading = "Frequently Asked Questions About the Ingredients",
}: IngredientsFaqProps) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="faq"
        className="reviews-faq"
        aria-label="Frequently asked questions about the ingredients"
      >
        {items.map((f, i) => (
          <details key={i} className="reviews-faq-item" name="ingredients-faq">
            <summary className="reviews-faq-question">
              <span className="reviews-faq-question-text">{f.question}</span>
              <span className="reviews-faq-chevron" aria-hidden="true">+</span>
            </summary>
            <div className="reviews-faq-answer">
              <p>{f.answer}</p>
            </div>
          </details>
        ))}
      </section>
    </>
  );
}
