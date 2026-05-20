import Link from "next/link";
import { siteData } from "@/lib/site-data";

// v25.67 — Related Guides cross-link block.
//
// Bing rewards strong internal linking with topical clusters; deep
// contextual links between Sales / Reviews / Ingredients / Benefits /
// Disclaimer pages reinforce the entity-graph signal that the site is
// genuinely about ProductName as one connected topic.
//
// Each link uses a NATURAL exact-match anchor combining productName
// and a buyer-intent keyword ("ProductName Review", "Where to Buy
// ProductName", etc.) so Bing's anchor-text ranker can give credit
// without keyword stuffing.
//
// Universal — accepts a `currentPath` so the component can suppress
// self-links on whichever page renders it. Identical block on every
// money page; reads productName from siteData so no per-product code.

const ALL_LINKS = (productName: string) => [
  { path: "/",            label: `${productName} Review`,                kw: "review" },
  { path: "/ingredients", label: `${productName} Ingredients`,           kw: "ingredients" },
  { path: "/benefits",    label: `${productName} Benefits`,              kw: "benefits" },
  { path: "/reviews",     label: `Customer Reviews of ${productName}`,   kw: "reviews" },
  { path: "/contact",     label: `Where to Buy ${productName}`,          kw: "buy" },
  { path: "/disclaimer",  label: `${productName} Affiliate & FDA Disclaimer`, kw: "disclaimer" },
];

interface RelatedGuidesProps {
  /** Current page path (e.g. "/reviews") so the component can omit
   *  the self-link from the rendered list. */
  currentPath: string;
  /** Optional heading override — defaults to "Related Guides". */
  heading?: string;
}

export default function RelatedGuides({ currentPath, heading }: RelatedGuidesProps) {
  const links = ALL_LINKS(siteData.product.name)
    .filter((l) => l.path !== currentPath)
    .slice(0, 5);

  return (
    <section className="related-guides" aria-labelledby="related-guides-heading">
      <div
        className="related-guides-inner"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <h2
          id="related-guides-heading"
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: 24,
            letterSpacing: "-0.01em",
          }}
        >
          {heading || `Related ${siteData.product.name} Guides`}
        </h2>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {links.map((l) => (
            <li key={l.path}>
              <Link
                href={l.path}
                style={{
                  display: "block",
                  padding: "16px 20px",
                  background: "var(--surface, #ffffff)",
                  border: "1px solid var(--border, #e5e7eb)",
                  borderRadius: 10,
                  color: "var(--text, #111827)",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  transition: "border-color 120ms ease",
                }}
              >
                {l.label} &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
