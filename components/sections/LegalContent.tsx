import type { LegalPageContent } from "@/types/site-data";

interface LegalContentProps {
  content: LegalPageContent;
}

/**
 * LegalContent — Renders the body of legal pages (Terms/Privacy/Cookie).
 *
 * Structure (matches HTML reference):
 *   - <main class="legal-wrap">
 *   - Optional TOC (<div class="toc"><ol>...</ol></div>) rendered only if toc provided
 *   - For each section:
 *       <h2 id="section-id">Heading</h2>
 *       <p>Paragraph</p> × N
 *       <ul><li>bullet</li>...</ul> (optional)
 */
export default function LegalContent({ content }: LegalContentProps) {
  const { toc, sections } = content;

  return (
    <main className="legal-wrap">
      {toc && toc.length > 0 && (
        <div className="toc">
          <div className="toc-title">On this page</div>
          <ol>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {sections.map((section) => (
        <section key={section.id}>
          <h2 id={section.id}>{section.heading}</h2>
          {section.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul>
              {section.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
