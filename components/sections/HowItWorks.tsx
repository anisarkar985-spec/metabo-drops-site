import type { HowItWorksSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface HowItWorksProps {
  howItWorks: HowItWorksSection;
  product: ProductIdentity;
}

/**
 * HowItWorks — "How Does [Product] Work?" section.
 * Structure (matches HTML reference):
 *   - Section bar with H2
 *   - 3 intro paragraphs
 *   - H4 list heading
 *   - Arrow-list of 4 mechanism points
 *   - Closing paragraph
 */
export default function HowItWorks({ howItWorks, product }: HowItWorksProps) {
  return (
    <>
      <div id="how" />
      <SectionBar>How Does {product.name} Work?</SectionBar>
      <div className="prose-wrap reveal">
        {howItWorks.introParagraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <h4>{howItWorks.listHeading}</h4>
        <ul className="arrow-list">
          {howItWorks.mechanismPoints.map((point, i) => (
            <li key={i}>
              <strong>{point.title}</strong> — {point.description}
            </li>
          ))}
        </ul>
        <p>{howItWorks.closingParagraph}</p>
      </div>
    </>
  );
}
