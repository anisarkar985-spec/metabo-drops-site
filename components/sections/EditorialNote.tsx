import type { HonestDisclaimer } from "@/types/site-data";

interface EditorialNoteProps {
  disclaimer: HonestDisclaimer;
  /** Optional link target for the "full editorial policy" tail. Defaults
   *  to the privacy page so the 2000-product pipeline degrades cleanly
   *  even if a dedicated /disclosure page isn't published. */
  policyHref?: string;
  policyAnchor?: string;
}

/**
 * EditorialNote — v25.44.2 FTC-safe honest disclaimer strip shown above
 * the FinalCta on the /reviews page.
 *
 * Replaces the pre-v25.44.2 "verified purchaser" framing with curated-
 * feedback language: states explicitly that customer statements are
 * opinions (not medical claims), results vary, FDA disclaimer, and
 * links out to the site's full editorial policy for operators who want
 * to publish the full disclosure matrix.
 *
 * Accessibility:
 *   • `<aside>` landmark with aria-label
 *   • readable at 375px viewport (~15-16px type)
 *
 * CSS scoped to `.editorial-note`.
 */
export default function EditorialNote({
  disclaimer,
  policyHref = "/privacy",
  policyAnchor = "full editorial policy",
}: EditorialNoteProps) {
  if (!disclaimer || !disclaimer.editorialNoteBody) return null;
  return (
    <aside
      className="editorial-note"
      aria-label="Editorial disclosure and honest review framing"
    >
      <div className="editorial-note-inner">
        <p className="editorial-note-body">
          {disclaimer.editorialNoteBody}
          {" "}
          <a
            href={policyHref}
            className="editorial-note-policy-link"
          >
            Read our {policyAnchor}.
          </a>
        </p>
      </div>
    </aside>
  );
}
