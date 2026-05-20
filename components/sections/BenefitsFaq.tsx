import SectionBar from "@/components/layout/SectionBar";

interface BenefitsFaqProps {
  items: Array<{ question: string; answer: string }>;
  heading?: string;
}

/**
 * BenefitsFaq — v25.44.4. Reuses the .reviews-faq-* CSS family from
 * v25.44.2.5 — identical accordion treatment, different data source
 * (siteData.subpages.benefits.benefitsFaq from Call B-2).
 *
 * <details name="benefits-faq"> exclusive open — one Q&A expanded at a
 * time. No client-side JS dependency.
 */
export default function BenefitsFaq({
  items,
  heading = "Frequently Asked Questions About the Benefits",
}: BenefitsFaqProps) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="faq"
        className="reviews-faq"
        aria-label="Frequently asked questions about the benefits"
      >
        {items.map((f, i) => (
          <details key={i} className="reviews-faq-item" name="benefits-faq">
            <summary className="reviews-faq-question">
              <span className="reviews-faq-question-text">{f.question}</span>
              <span className="reviews-faq-chevron" aria-hidden="true">+</span>
            </summary>
            <div className="reviews-faq-answer">
              <p>{f.answer}</p>
            </div>
          </details>
        ))}
      </section>
    </>
  );
}
