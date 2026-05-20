import type { WhyChooseSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface WhyChooseProps {
  whyChoose: WhyChooseSection;
  product: ProductIdentity;
}

/**
 * WhyChoose — "Why Choose [Product]?" section.
 * Two intro paragraphs, then a heading, then the arrow-list of reasons.
 */
export default function WhyChoose({ whyChoose, product }: WhyChooseProps) {
  return (
    <>
      <SectionBar>Why Choose {product.name}?</SectionBar>
      <div className="prose-wrap reveal">
        <p>{whyChoose.intro}</p>
        <p>{whyChoose.introSecond}</p>
        <h4>{whyChoose.listHeading}</h4>
        <ul className="arrow-list">
          {whyChoose.reasons.map((reason, i) => (
            <li key={i}>
              <strong>{reason.boldLabel}</strong> — {reason.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
