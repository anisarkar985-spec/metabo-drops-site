interface LegalHeroProps {
  /** Kicker label, typically "Legal" */
  kicker: string;
  /** Main title (no emphasis) */
  title: string;
  /** Content rendered inside after the title — typically byline + "Last updated" line */
  children?: React.ReactNode;
}

/**
 * LegalHero — Hero wrapper for legal pages (Terms/Privacy/Cookie).
 *
 * Structure (matches HTML reference):
 *   - Kicker label
 *   - H1 title
 *   - Children: typically <EditorialByline> + "Last updated:" line
 */
export default function LegalHero({ kicker, title, children }: LegalHeroProps) {
  return (
    <section className="legal-hero">
      <span className="legal-hero-kicker">{kicker}</span>
      <h1>{title}</h1>
      {children}
    </section>
  );
}
