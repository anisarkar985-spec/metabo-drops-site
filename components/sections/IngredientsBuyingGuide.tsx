import SectionBar from "@/components/layout/SectionBar";

interface IngredientsBuyingGuideProps {
  guide: {
    intro: string;
    goodFor: string[];
    notFor: string[];
    closing: string;
  };
  productName: string;
  pricingHref?: string;
  heading?: string;
}

/**
 * IngredientsBuyingGuide — v25.44.3. "What these ingredients mean for
 * you" two-column layout, framed around the ingredient profile rather
 * than the customer journey (that's the reviews-page BuyingGuide).
 *
 * CSS reuses the .buying-guide-* class family — identical visual
 * treatment. Only the heading + framing changes.
 */
export default function IngredientsBuyingGuide({
  guide,
  productName,
  pricingHref = "/#pricing",
  heading,
}: IngredientsBuyingGuideProps) {
  if (!guide) return null;
  const computed = heading || `What These Ingredients Mean For You`;
  return (
    <>
      <SectionBar>{computed}</SectionBar>
      <section
        id="buying-guide"
        className="buying-guide"
        aria-label={`What these ${productName} ingredients mean for you`}
      >
        <p className="buying-guide-intro">{guide.intro}</p>
        <div className="buying-guide-grid">
          <div className="buying-guide-col buying-guide-col--good">
            <h3 className="buying-guide-col-title">This profile tends to suit you if…</h3>
            <ul
              className="buying-guide-list"
              aria-label="Ingredient-profile fits"
            >
              {guide.goodFor.map((line, i) => (
                <li key={i} className="buying-guide-item buying-guide-item--good">
                  <span className="buying-guide-glyph" aria-hidden="true">✓</span>
                  <span className="buying-guide-text">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="buying-guide-col buying-guide-col--caution">
            <h3 className="buying-guide-col-title">Consult a doctor first if…</h3>
            <ul
              className="buying-guide-list"
              aria-label="Honest ingredient cautions"
            >
              {guide.notFor.map((line, i) => (
                <li key={i} className="buying-guide-item buying-guide-item--caution">
                  <span className="buying-guide-glyph" aria-hidden="true">•</span>
                  <span className="buying-guide-text">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="buying-guide-closing">
          {guide.closing}
          {" "}
          <a href={pricingHref} className="buying-guide-cta">
            View all {productName} bundles →
          </a>
        </p>
      </section>
    </>
  );
}
