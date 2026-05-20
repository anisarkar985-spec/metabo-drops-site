import type { ProsConsSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface ProsConsProps {
  prosCons: ProsConsSection;
  product: ProductIdentity;
}

/**
 * ProsCons — Balanced product assessment section.
 * Structure (matches HTML reference):
 *   - Section bar with H2 "[Product] Pros & Cons"
 *   - H3.pc-green "Pros of [Product]:" + check-list
 *   - H3.pc-red "Things to keep in mind:" + dash-list
 */
export default function ProsCons({ prosCons, product }: ProsConsProps) {
  return (
    <>
      <SectionBar>{product.name} Pros &amp; Cons</SectionBar>
      <div className="prose-wrap reveal">
        <h3 className="pc-green">Pros of {product.name}:</h3>
        <ul className="check-list">
          {prosCons.pros.map((pro, i) => (
            <li key={i}>{pro}</li>
          ))}
        </ul>

        <h3 className="pc-red">Things to keep in mind:</h3>
        <ul className="dash-list">
          {prosCons.cons.map((con, i) => (
            <li key={i}>{con}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
