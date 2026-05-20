interface PageHeroProps {
  /** Kicker label above title, e.g., "🌱 The Science Inside Every Bottle" */
  kicker: string;
  /** Main title — supports <em> emphasis */
  title: {
    before: string;
    emphasis: string;
    after: string;
  };
  /** Content rendered inside the dark hero — typically byline + answer-first */
  children?: React.ReactNode;
  /**
   * v25.44.2.4 — optional honest-disclaimer paragraph rendered BELOW the
   * dark hero on paper-warm background, inside a site-container max-width.
   * When absent, no below-hero slot is rendered. Existing callers that
   * pass the disclaimer as the last `<p>` child continue to work — in
   * that case the paragraph renders inside the dark hero on top of the
   * bottom-fade, which reads cleanly too.
   */
  closingParagraph?: React.ReactNode;
}

/**
 * PageHero — v25.44.2.4 premium dark-navy subpage hero.
 *
 * Applies to every content page (reviews / ingredients / benefits /
 * contact) so all subpages share a consistent brand experience and
 * signal the same editorial authority to crawlers.
 *
 * Structure:
 *   <section.page-hero-dark>
 *     <div.page-hero-dark__inner>
 *       <span.page-hero-dark__kicker>
 *       <h1.page-hero-dark__title>  (with <em> emphasis)
 *       {children}                  (byline + answer-first, dark-themed via CSS)
 *     </div>
 *     <div.page-hero-dark__fade>    (bottom gradient transition to paper-warm)
 *   </section>
 *   {closingParagraph ? <div.site-container><p.honest-disclaimer>…</p></div> : null}
 *
 * The kicker / h1 / children are rendered inside a max-width 900px
 * centered inner container so content never hugs the viewport edge —
 * this is the v25.44.2.4 container fix.
 *
 * Dark-theme overrides for EditorialByline + AnswerFirst are scoped
 * under `.page-hero-dark` in globals.css so those two components stay
 * untouched and can still be used on any future light-bg subpage.
 */
export default function PageHero({
  kicker,
  title,
  children,
  closingParagraph,
}: PageHeroProps) {
  return (
    <>
      <section className="page-hero-dark">
        <div className="page-hero-dark__inner">
          <span className="page-hero-dark__kicker">{kicker}</span>
          <h1 className="page-hero-dark__title">
            {title.before}
            <em>{title.emphasis}</em>
            {title.after}
          </h1>
          {children}
        </div>
        <div className="page-hero-dark__fade" aria-hidden="true" />
      </section>
      {closingParagraph ? (
        <div className="page-hero-disclaimer-wrap">
          <p className="honest-disclaimer">{closingParagraph}</p>
        </div>
      ) : null}
    </>
  );
}
