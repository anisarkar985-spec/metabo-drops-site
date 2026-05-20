interface SiteHeaderProps {
  productName: string;
  /**
   * v25.44.4 — when true, nav links use absolute paths to the subpage
   * routes instead of the homepage in-page anchors. Homepage stays on
   * the anchor-only behavior so scroll-spy keeps working.
   *
   *   subpage=false (default): #ingredients / #benefits / #reviews /
   *                             #how / #faq / #pricing
   *   subpage=true:            /ingredients / /benefits / /reviews /
   *                             /#how / /#faq / /#pricing
   *
   * Homepage CTA always targets /#pricing so the buy button never dead-
   * ends on a subpage that doesn't have a pricing section.
   */
  subpage?: boolean;
}

/**
 * SiteHeader — Sticky top nav with brand logo, section links, and CTA.
 * Uses in-page anchors on the homepage. On subpages pass `subpage` so
 * links route back to the homepage's corresponding sections (or to the
 * dedicated subpage where one exists).
 */
export default function SiteHeader({ productName, subpage = false }: SiteHeaderProps) {
  // Nav hrefs pivot on `subpage`. Ingredients / Benefits / Reviews have
  // dedicated subpages — link straight to them. How-it-works + FAQs +
  // pricing live only on the homepage — link with a hash-anchor to /.
  const hrefs = subpage
    ? {
        ingredients: "/ingredients",
        benefits: "/benefits",
        how: "/#how",
        reviews: "/reviews",
        faq: "/#faq",
        pricing: "/#pricing",
      }
    : {
        ingredients: "#ingredients",
        benefits: "#benefits",
        how: "#how",
        reviews: "#reviews",
        faq: "#faq",
        pricing: "#pricing",
      };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="brand-logo">
          {productName}
          <span className="brand-logo-tm">™</span>
        </a>
        <nav className="site-nav">
          <a href={hrefs.ingredients}>Ingredients</a>
          <a href={hrefs.benefits}>Benefits</a>
          <a href={hrefs.how}>How It Works</a>
          <a href={hrefs.reviews}>Reviews</a>
          <a href={hrefs.faq}>FAQs</a>
        </nav>
        <a href={hrefs.pricing} className="nav-cta">
          Order Now
        </a>
      </div>
    </header>
  );
}
