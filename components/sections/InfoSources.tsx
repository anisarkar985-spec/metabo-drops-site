import type { InfoSourcesSection } from "@/types/site-data";

interface InfoSourcesProps {
  infoSources: InfoSourcesSection;
}

/**
 * InfoSources — Scientific citations block (E-E-A-T trust signal).
 * Structure (matches HTML reference):
 *   - H3 heading with 📚 emoji
 *   - Subheading paragraph
 *   - UL of citation items: each has bold topic + anchor links separated by ·
 *   - Medical disclaimer paragraph at bottom
 */
export default function InfoSources({ infoSources }: InfoSourcesProps) {
  // Split disclaimer on "Medical Disclaimer:" so we can bold that label
  const disclaimerParts = infoSources.disclaimer.split(/^(⚠ Medical Disclaimer:)/);

  return (
    <section className="info-sources">
      <h3 className="info-sources-heading">{infoSources.heading}</h3>
      <p className="info-sources-sub">{infoSources.subheading}</p>

      <ul className="info-sources-list">
        {infoSources.items.map((item, i) => (
          <li key={i}>
            <strong>{item.topic}</strong>{" "}
            {item.links.map((link, j) => (
              <span key={j}>
                {j > 0 && " · "}
                <a href={link.url} target="_blank" rel="noopener">
                  {link.label}
                </a>
              </span>
            ))}
          </li>
        ))}
      </ul>

      <p className="info-sources-disclaimer">
        {disclaimerParts.length > 1 ? (
          <>
            <strong>{disclaimerParts[1]}</strong>
            {disclaimerParts[2]}
          </>
        ) : (
          infoSources.disclaimer
        )}
      </p>
    </section>
  );
}
