import SectionBar from "@/components/layout/SectionBar";

interface BenefitsBuyingGuideProps {
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
 * BenefitsBuyingGuide — v25.44.4. Reuses the .buying-guide-* CSS from
 * v25.44.2.5. Framed around "who benefits most from this formula" —
 * benefit-priority fit rather than customer-journey fit or ingredient-
 * profile fit (which are covered by the /reviews and /ingredients
 * buying guides respectively).
 */
export default function BenefitsBuyingGuide({
  guide,
  productName,
  pricingHref = "/#pricing",
  heading,
}: BenefitsBuyingGuideProps) {
  if (!guide) return null;
  const computed = heading || `Who Benefits Most From ${productName}`;
  return (
    <>
      <SectionBar>{computed}</SectionBar>
      <section
        id="buying-guide"
        className="buying-guide"
        aria-label={`Who benefits most from ${productName}`}
      >
        <p className="buying-guide-intro">{guide.intro}</p>
        <div className="buying-guide-grid">
          <div className="buying-guide-col buying-guide-col--good">
            <h3 className="buying-guide-col-title">Likely a strong fit if…</h3>
            <ul className="buying-guide-list" aria-label="Reader profiles who benefit most">
              {guide.goodFor.map((line, i) => (
                <li key={i} className="buying-guide-item buying-guide-item--good">
                  <span className="buying-guide-glyph" aria-hidden="true">✓</span>
                  <span className="buying-guide-text">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="buying-guide-col buying-guide-col--caution">
            <h3 className="buying-guide-col-title">Consider carefully if…</h3>
            <ul className="buying-guide-list" aria-label="Honest cautions">
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
