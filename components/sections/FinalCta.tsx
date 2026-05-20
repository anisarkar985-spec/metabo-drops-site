import type { FinalCtaSection } from "@/types/site-data";

interface FinalCtaProps {
  finalCta: FinalCtaSection;
  affiliateUrl: string;
  /** Micro-proof line below CTA, e.g., guarantee info */
  microProof?: string;
}

/**
 * FinalCta — Bottom conversion CTA section.
 * Structure (matches HTML reference):
 *   - H2 headline
 *   - Body paragraph
 *   - Primary CTA button
 *   - Micro-proof line (⚡ Free shipping · guarantee · no auto-ship)
 */
export default function FinalCta({ finalCta, affiliateUrl, microProof }: FinalCtaProps) {
  return (
    <section className="final-cta">
      <div className="final-cta-inner">
        <h2>{finalCta.headline}</h2>
        <p>{finalCta.body}</p>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="nofollow noopener sponsored"
          className="btn btn-primary btn-lg"
        >
          {finalCta.ctaText}
        </a>
        {microProof && (
          <div className="final-cta-micro">{microProof}</div>
        )}
      </div>
    </section>
  );
}
