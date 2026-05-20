import type { MainBenefitsSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface MainBenefitsProps {
  mainBenefits: MainBenefitsSection;
  product: ProductIdentity;
}

/**
 * MainBenefits — "Main Benefits of [Product]" magazine-style section.
 * Structure (matches HTML reference):
 *   - Section bar with H2
 *   - Intro paragraph
 *   - For each benefit:
 *     - H3 numbered title
 *     - 1-2 paragraphs
 *     - Arrow-list of 3 sub-bullets
 */
export default function MainBenefits({ mainBenefits, product }: MainBenefitsProps) {
  return (
    <>
      <div id="benefits" />
      <SectionBar>Main Benefits of {product.name}</SectionBar>
      <div className="prose-wrap reveal">
        <p>{mainBenefits.intro}</p>

        {mainBenefits.benefits.map((benefit, i) => (
          <div key={i}>
            <h3>{benefit.title}</h3>
            {benefit.paragraphs.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
            <ul className="arrow-list">
              {benefit.subBullets.map((bullet, j) => (
                <li key={j}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
