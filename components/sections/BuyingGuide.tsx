import SectionBar from "@/components/layout/SectionBar";

interface BuyingGuideProps {
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
 * BuyingGuide — v25.44.2.5 "Is this product right for you?" block.
 *
 * Renders the Call 4e humanizer output as:
 *   - intro paragraph (plain-language reader-profile summary)
 *   - two-column list layout (stacked on mobile):
 *       Left  "May work well if you…" (checkmark bullets, neutral)
 *       Right "Keep in mind…"          (info bullets, honest cautions)
 *   - closing paragraph with a soft CTA link to the pricing section
 *
 * The two columns are intentionally framed as positive-tone lists —
 * the right column uses a neutral info icon, not a red "X", to keep
 * the tone advisory rather than dissuading.
 *
 * Accessibility: <section aria-labelledby="buying-guide-heading">
 * wraps the block. Lists are proper <ul> with descriptive aria-labels.
 */
export default function BuyingGuide({
  guide,
  productName,
  pricingHref = "/#pricing",
  heading,
}: BuyingGuideProps) {
  if (!guide) return null;
  const computed = heading || `Is ${productName} Right for You?`;
  return (
    <>
      <SectionBar>{computed}</SectionBar>
      <section id="buying-guide" className="buying-guide" aria-label={`Is ${productName} right for you?`}>
        <p className="buying-guide-intro">{guide.intro}</p>
        <div className="buying-guide-grid">
          <div className="buying-guide-col buying-guide-col--good">
            <h3 className="buying-guide-col-title">May work well if you…</h3>
            <ul className="buying-guide-list" aria-label="Reader profiles who tend to benefit most">
              {guide.goodFor.map((line, i) => (
                <li key={i} className="buying-guide-item buying-guide-item--good">
                  <span className="buying-guide-glyph" aria-hidden="true">✓</span>
                  <span className="buying-guide-text">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="buying-guide-col buying-guide-col--caution">
            <h3 className="buying-guide-col-title">Keep in mind…</h3>
            <ul className="buying-guide-list" aria-label="Honest cautions to consider before purchase">
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
            Compare all {productName} bundles →
          </a>
        </p>
      </section>
    </>
  );
}
