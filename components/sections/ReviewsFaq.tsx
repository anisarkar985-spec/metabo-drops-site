import SectionBar from "@/components/layout/SectionBar";

interface ReviewsFaqProps {
  items: Array<{ question: string; answer: string }>;
  heading?: string;
}

/**
 * ReviewsFaq — v25.44.2.5 Q&A block on /reviews.
 *
 * Renders a native <details>/<summary> accordion — no client JS
 * dependency, keyboard-accessible, screen-reader-friendly by default.
 * Each <details> carries a unique `name` attribute so only one answer
 * is open at a time (exclusive accordion behaviour, new to browsers
 * in 2024+ and gracefully degrades to multi-open for older UAs).
 *
 * SEO / AEO: matches the FAQPage schema emitted by SchemaJsonLd. When
 * ChatGPT / Perplexity / Google AI Overviews look for structured Q&A
 * on this page, the schema + the rendered DOM agree 1:1 on question
 * text + answer text.
 *
 * Accessibility: outer `<section aria-labelledby="faq-heading">`
 * groups the accordion; the section-bar h2 is the accessible name.
 * Each <summary> is a natural button-role element.
 */
export default function ReviewsFaq({
  items,
  heading = "Frequently Asked Questions",
}: ReviewsFaqProps) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section id="faq" className="reviews-faq" aria-label="Frequently asked questions">
        {items.map((f, i) => (
          <details key={i} className="reviews-faq-item" name="reviews-faq">
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
