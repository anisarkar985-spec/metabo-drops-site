import type { ProductIdentity, SiteIdentity, EditorialInfo } from "@/types/site-data";

interface SiteFooterProps {
  product: ProductIdentity;
  site: SiteIdentity;
  editorial: EditorialInfo;
  /** Footer copy describing the product in 1-2 sentences */
  footerCopy: string;
  /** Short disclaimer paragraph at very bottom */
  disclaimer: string;
  /** Year to display in copyright, e.g., "2026" */
  year: string;
}

/**
 * SiteFooter — Main site footer (before legal disclosure block).
 * Structure (matches HTML reference):
 *   - 3-column grid: Brand, Explore nav, Support nav
 *   - Footer bottom row: copyright + SSL badge
 *   - Small FDA/medical disclaimer paragraph
 */
export default function SiteFooter({
  product,
  footerCopy,
  disclaimer,
  year,
}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            {product.name}
            <span style={{ opacity: 0.5, fontSize: "15px", marginLeft: "4px" }}>™</span>
          </div>
          <p className="footer-copy">{footerCopy}</p>
        </div>

        <div>
          <div className="footer-title">Explore</div>
          <nav className="footer-nav">
            <a href="/#how">How It Works</a>
            <a href="/ingredients">Ingredients</a>
            <a href="/benefits">Benefits</a>
            <a href="/reviews">Customer Reviews</a>
          </nav>
        </div>

        <div>
          <div className="footer-title">Support</div>
          <nav className="footer-nav">
            <a href="/contact">Contact Us</a>
            <a href="/terms">Terms &amp; Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookie">Cookie Policy</a>
            {/* v25.67 — disclaimer page (supplement affiliate compliance). */}
            <a href="/disclaimer">Disclaimer</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} {product.name}. All rights reserved.</span>
        <span>🛡️ Secure checkout · Verified SSL</span>
      </div>

      <div className="footer-disclaimer">{disclaimer}</div>
    </footer>
  );
}
