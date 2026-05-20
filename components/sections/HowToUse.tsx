import type { HowToUseSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface HowToUseProps {
  howToUse: HowToUseSection;
  product: ProductIdentity;
}

/**
 * HowToUse — "How to Use [Product]" section.
 * Structure (matches HTML reference):
 *   - Section bar with H2
 *   - Intro paragraph
 *   - For each step: H4 step title + body paragraph
 */
export default function HowToUse({ howToUse, product }: HowToUseProps) {
  return (
    <>
      <SectionBar>How to Use {product.name}</SectionBar>
      <div className="prose-wrap reveal">
        <p>{howToUse.intro}</p>
        {howToUse.steps.map((step, i) => (
          <div key={i}>
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
