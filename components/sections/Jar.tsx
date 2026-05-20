import type { ProductIdentity } from "@/types/site-data";

interface JarProps {
  product: ProductIdentity;
  showTag?: boolean;
  servingsCount?: number;
}

/**
 * Jar — Single supplement bottle visual (pure CSS + HTML, no image).
 * Used inside pricing cards. Takes product identity to render the label.
 * If showTag is true (single-bottle card), includes "30 SERVINGS · SUPPLEMENT" tag.
 */
export default function Jar({ product, showTag = false, servingsCount = 30 }: JarProps) {
  return (
    <div className="jar">
      <div className="jar-label">
        <div className="jar-label-brand">
          {product.nameForLabel[0]}
          <br />
          {product.nameForLabel[1]}
        </div>
        <div className="jar-label-band">ULTRA</div>
        {showTag && (
          <div className="jar-label-tag">
            {servingsCount} SERVINGS · SUPPLEMENT
          </div>
        )}
      </div>
    </div>
  );
}
