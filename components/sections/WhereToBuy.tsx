import type { WhereToBuySection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface WhereToBuyProps {
  whereToBuy: WhereToBuySection;
  product: ProductIdentity;
  affiliateUrl: string;
}

/**
 * WhereToBuy — "Where to Buy [Product]" section.
 * Structure:
 *   - Section bar with H2
 *   - 3 paragraphs (first mentions "exclusively through the official website" in bold)
 *   - Centered CTA button
 *
 * The first paragraph has "exclusively through the official website"
 * as bold emphasis per HTML reference.
 */
export default function WhereToBuy({ whereToBuy, product, affiliateUrl }: WhereToBuyProps) {
  return (
    <>
      <SectionBar>Where to Buy {product.name}</SectionBar>
      <div className="prose-wrap reveal">
        {whereToBuy.paragraphs.map((para, i) => (
          <p key={i}>
            {i === 0 ? (
              // First paragraph: emphasize "exclusively through the official website"
              <EmphasizeOfficial text={para} />
            ) : (
              para
            )}
          </p>
        ))}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="btn btn-primary btn-lg"
          >
            {whereToBuy.ctaText}
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * EmphasizeOfficial — Wraps "exclusively through the official website"
 * in <strong> tags if found in the text.
 */
function EmphasizeOfficial({ text }: { text: string }) {
  const phrase = "exclusively through the official website";
  const idx = text.toLowerCase().indexOf(phrase.toLowerCase());

  if (idx === -1) {
    return <>{text}</>;
  }

  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + phrase.length);
  const after = text.substring(idx + phrase.length);

  return (
    <>
      {before}
      <strong>{match}</strong>
      {after}
    </>
  );
}
