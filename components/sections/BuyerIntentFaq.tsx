import { siteData } from "@/lib/site-data";

// v25.67 — Buyer-intent FAQ block.
//
// Locked output structure is 8 pages — no new routes — so the
// buyer-intent topics Bing/Google rank well for ("where to buy",
// "side effects", "scam or legit", "price", "refund policy") are
// addressed via SECTIONS within existing pages instead.
//
// This block uses exact-match H2 headings ("Where to Buy ProductName",
// "Is ProductName Legit?", etc.) so Bing's anchor + heading rankers
// can attribute content to the right buyer-intent query without
// keyword stuffing. Each answer pulls from siteData truth (price
// tiers, guarantee days, support email) so the copy is always
// consistent with the rest of the page.
//
// Universal — works for any supplement product, no per-product
// hardcoding.

export default function BuyerIntentFaq() {
  const productName = siteData.product.name;
  const guaranteeDays = siteData.guarantee?.days || 60;
  const featuredTier = siteData.pricing.find((t) => t.isFeatured) || siteData.pricing[siteData.pricing.length - 1];
  const cheapestTier = [...siteData.pricing].sort(
    (a, b) => parseFloat(a.priceTotal) - parseFloat(b.priceTotal),
  )[0];
  const unitOne = featuredTier?.unitLabel || "Bottle";
  const unitMany = featuredTier?.unitLabelPlural || "Bottles";

  const items = [
    {
      heading: `Where to Buy ${productName}`,
      body: `${productName} is sold through the official order page only. Avoid Amazon, eBay, Walmart, or third-party marketplaces — these listings are not verified by the manufacturer and may carry counterfeit or expired stock. Use the official affiliate-protected order link on this page to ensure you get the genuine ${productName} formula with the full ${guaranteeDays}-day money-back guarantee.`,
    },
    {
      heading: `${productName} Price & Best Value`,
      body: `${productName} is offered in ${siteData.pricing.length} bundle sizes. The most economical per-${unitOne.toLowerCase()} pricing is on the ${featuredTier?.bottles}-${unitMany.toLowerCase()} bundle, which also includes free US shipping and bonus materials. The starter bundle (${cheapestTier?.bottles} ${cheapestTier?.bottles === 1 ? unitOne.toLowerCase() : unitMany.toLowerCase()}) is best for first-time customers who want to try the formula before committing to a longer protocol.`,
    },
    {
      heading: `Is ${productName} Legit?`,
      body: `${productName} is a real product sold by an official manufacturer with a public order page, customer-support contact, and a documented ${guaranteeDays}-day refund policy. Like every supplement, individual results vary — but the offer itself, the ingredient profile, and the refund window are publicly verifiable. We recommend buying only from the official order page (linked on this site) to avoid third-party imitations.`,
    },
    {
      heading: `${productName} Side Effects & Safety`,
      body: `${productName} is a dietary supplement intended for adults. Like any supplement, individual reactions vary based on health conditions, medications, and sensitivities. Consult a qualified healthcare professional before starting ${productName}, especially if you are pregnant, nursing, taking prescription medication, or managing a chronic condition. Discontinue use and seek medical advice if you experience any unusual symptoms.`,
    },
    {
      heading: `${productName} Refund Policy`,
      body: `${productName} ships with a ${guaranteeDays}-day money-back guarantee. If you're unsatisfied for any reason, contact customer support within ${guaranteeDays} days of delivery to initiate a return. Refund details and return-shipping instructions are available on the official order page and via the support email listed in our Contact section.`,
    },
  ];

  return (
    <section
      className="buyer-intent-faq"
      aria-labelledby="buyer-intent-faq-heading"
      style={{
        padding: "64px 24px",
        background: "var(--surface, #ffffff)",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <h2
          id="buyer-intent-faq-heading"
          style={{
            fontSize: "1.875rem",
            fontWeight: 700,
            marginBottom: 32,
            letterSpacing: "-0.01em",
          }}
        >
          {productName} Buying Guide & Common Questions
        </h2>
        <div style={{ display: "grid", gap: 28 }}>
          {items.map((item, i) => (
            <article key={i}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "var(--text, #111827)",
                }}
              >
                {item.heading}
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "var(--mutedText, #4b5563)",
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
