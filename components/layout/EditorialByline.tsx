import type { EditorialInfo } from "@/types/site-data";

interface EditorialBylineProps {
  editorial: EditorialInfo;
}

/**
 * EditorialByline — E-E-A-T signals shown at top of content pages.
 * Three items: Written By / Last Updated / Fact-Checked.
 * Each with SVG icon + label + value, separated by vertical lines.
 *
 * v25.49 — when editorial.authorPerson is present, the "Written By"
 * slot renders the author's avatar (the v25.49 SVG identicon),
 * jobTitle, and a link to /about/{slug}. Falls back to the legacy
 * generic-icon + name display when authorPerson is absent (older
 * site-data bundles).
 */
export default function EditorialByline({ editorial }: EditorialBylineProps) {
  const ap = editorial.authorPerson;
  return (
    <div className="editorial-byline">
      <div className="byline-item">
        {ap ? (
          <img
            className="byline-avatar"
            src={ap.avatarPath}
            alt={`${ap.name} — ${ap.jobTitle}`}
            width={36}
            height={36}
            loading="lazy"
          />
        ) : (
          <svg
            className="byline-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        )}
        <div>
          <div className="byline-label">Written By</div>
          <div className="byline-value">
            {ap ? (
              <a className="byline-author-link" href={`/about/${ap.slug}`}>
                {editorial.author}
              </a>
            ) : (
              editorial.author
            )}
          </div>
          {ap?.jobTitle ? (
            <div className="byline-jobtitle">{ap.jobTitle}</div>
          ) : null}
        </div>
      </div>

      <div className="byline-separator" />

      <div className="byline-item">
        <svg
          className="byline-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <div>
          <div className="byline-label">Last Updated</div>
          <div className="byline-value">{editorial.lastUpdated}</div>
        </div>
      </div>

      <div className="byline-separator" />

      <div className="byline-item">
        <svg
          className="byline-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <div>
          <div className="byline-label">Fact-Checked</div>
          <div className="byline-value">Research verified</div>
        </div>
      </div>
    </div>
  );
}
