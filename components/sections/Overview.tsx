import type { OverviewSection, ProductIdentity } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface OverviewProps {
  overview: OverviewSection;
  product: ProductIdentity;
}

/**
 * Overview — "What is [Product]?" section.
 *
 * Structure (matches HTML reference):
 *   - Section bar with H2
 *   - Italic lead paragraph (display font, 23px, muted)
 *   - 3-4 content paragraphs
 *
 * NOTE: The AEO answer-first block is rendered SEPARATELY on the homepage
 * (it sits between the EditorialByline and this section in HTML order).
 * See `overview.answerFirst` in site-data and use <AnswerFirst> directly.
 */
export default function Overview({ overview, product }: OverviewProps) {
  return (
    <>
      <SectionBar>What is {product.name}?</SectionBar>
      <div className="prose-wrap reveal">
        <p
          style={{
            fontStyle: "italic",
            fontFamily: "var(--font-display)",
            fontSize: "23px",
            color: "var(--muted)",
            marginBottom: "28px",
          }}
        >
          {overview.lead}
        </p>
        {overview.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </>
  );
}
