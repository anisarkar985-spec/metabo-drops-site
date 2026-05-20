import type { ResultsTimelinePhase } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface ResultsTimelineProps {
  phases: ResultsTimelinePhase[];
  heading?: string;
  /** Keyword-rich anchor text for the internal link in the section intro.
   *  Example: "24 natural ingredients" → rendered inside the caption
   *  linking to /ingredients. Skipped when empty. */
  ingredientsLinkAnchor?: string;
  /** Target href for the ingredients link. Defaults to `#ingredients` so
   *  the reviews page still degrades gracefully when the full subpage
   *  isn't published yet. */
  ingredientsLinkHref?: string;
}

/**
 * ResultsTimeline — v25.44.2 infographic-style phase cards.
 *
 * Four ordered phases (`Week 1-2`, `Week 3-5`, `Week 6-9`, `Week 10+`)
 * linked by a gradient vertical track (pure CSS, no client JS). Each
 * phase card: period label, h3 phaseTitle, body paragraph (80-110 words
 * aggregate voice), stat callout pill (big number + short label), and
 * a reference-count micro-caption derived in the mapper from
 * rating.count + phase decay.
 *
 * Accessibility / SEO:
 *   • `<section>` landmark with aria-label
 *   • `<ol>` semantic ordered list for the phases (browsers + crawlers
 *     treat this as sequence)
 *   • phase titles are `<h3>` — single-page heading hierarchy:
 *     h1 (PageHero) → h2 (SectionBar "The Typical Results Timeline")
 *     → h3 (phaseTitle)
 *   • aria-label on stat-callout number for non-sighted reading of the
 *     decorative big number
 *
 * Component renders nothing when `phases.length === 0` — mapper omits
 * the block on truth-gate failure and this guard prevents empty ol
 * rendering.
 */
export default function ResultsTimeline({
  phases,
  heading = "The Typical Results Timeline",
  ingredientsLinkAnchor,
  ingredientsLinkHref = "#ingredients",
}: ResultsTimelineProps) {
  if (!phases || phases.length === 0) return null;

  return (
    <>
      <SectionBar>{heading}</SectionBar>
      <section
        id="results-timeline"
        className="results-timeline"
        aria-label="Typical customer results timeline"
      >
        {/* v25.44.2.5 — E-E-A-T source-citation line. Sits directly under
            the SectionBar so the reader sees the evidentiary framing
            before reading the phases. The ingredients link doubles as an
            internal-link signal for the ingredients subpage. */}
        <p className="results-timeline-citation">
          <em>
            Based on publicly available customer feedback and product
            documentation.{" "}
            <a href={ingredientsLinkHref} className="results-timeline-citation-link">
              See ingredients →
            </a>
          </em>
        </p>
        {ingredientsLinkAnchor ? (
          <p className="results-timeline-intro">
            Understanding these phases — see how the{" "}
            <a href={ingredientsLinkHref} className="results-timeline-intro-link">
              {ingredientsLinkAnchor}
            </a>{" "}
            drive them.
          </p>
        ) : null}
        <ol className="results-timeline-track">
          {phases.map((p, i) => (
            <li key={i} className="results-timeline-phase reveal">
              <div className="results-timeline-period">{p.period}</div>
              <div className="results-timeline-content">
                <h3 className="results-timeline-title">{p.phaseTitle}</h3>
                <p className="results-timeline-body">{p.bodyParagraph}</p>
                {p.statCallout?.number ? (
                  <div
                    className="results-timeline-stat"
                    aria-label={`${p.statCallout.number} ${p.statCallout.label}`}
                  >
                    <span className="results-timeline-stat-number">
                      {p.statCallout.number}
                    </span>
                    <span className="results-timeline-stat-label">
                      {p.statCallout.label}
                    </span>
                  </div>
                ) : null}
                {p.referenceCount > 0 ? (
                  <div className="results-timeline-ref">
                    Based on approximately {p.referenceCount.toLocaleString()}{" "}
                    customer reports.
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
