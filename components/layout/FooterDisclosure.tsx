import type { ProductIdentity, SiteIdentity, EditorialInfo } from "@/types/site-data";

interface FooterDisclosureProps {
  product: ProductIdentity;
  site: SiteIdentity;
  editorial: EditorialInfo;
  year: string;
}

/**
 * FooterDisclosure — Industry-standard FTC/FDA legal disclosure block.
 * Rendered AFTER the main footer for maximum conversion protection.
 *
 * Structure (matches HTML reference):
 *   - Advertising & Affiliate Disclosure
 *   - Medical Disclaimer
 *   - Testimonials & Results Disclosure
 *   - Product Information & Support (with mailto link)
 *   - Meta block: nav links + copyright + compliance notice
 */
export default function FooterDisclosure({
  product,
  site,
  editorial,
  year,
}: FooterDisclosureProps) {
  return (
    <section className="footer-disclosure" aria-label="Legal Disclosures">
      <div className="disclosure-container">
        <div className="disclosure-section">
          <h4>Advertising &amp; Affiliate Disclosure</h4>
          <p>
            This website is an authorized information resource for {product.name} and
            contains affiliate links. We may earn a commission when you purchase through
            these links — at no additional cost to you. This does not influence our
            recommendations or content. All products featured are curated based on
            customer feedback, ingredient research, and manufacturer verification. Orders
            are processed and fulfilled directly by the official {product.name} retailer,
            not by this website.
          </p>
        </div>

        <div className="disclosure-section">
          <h4>Medical Disclaimer</h4>
          <p>
            The information provided on this website is for educational and informational
            purposes only and is not intended as a substitute for professional medical
            advice, diagnosis, or treatment. Always seek the advice of your physician or
            other qualified healthcare provider with any questions you may have regarding
            a medical condition, hearing issue, or before starting any dietary supplement
            regimen. Statements regarding dietary supplements have not been evaluated by
            the Food and Drug Administration (FDA) and are not intended to diagnose,
            treat, cure, or prevent any disease. Individual results may vary based on
            many factors including consistency of use, diet, age, and underlying health
            conditions.
          </p>
        </div>

        <div className="disclosure-section">
          <h4>Testimonials &amp; Results Disclosure</h4>
          <p>
            Testimonials and customer reviews featured on this site reflect individual
            experiences of people who have used our products. Results are not typical and
            may vary from person to person. No claim or representation is made, whether
            express or implied, that any user will achieve similar results. {product.name}{" "}
            is a dietary supplement intended to support general wellness and is not a
            cure or treatment for any medical condition.
          </p>
        </div>

        <div className="disclosure-section">
          <h4>Product Information &amp; Support</h4>
          <p>
            {product.name} is manufactured in an FDA-registered, GMP-certified facility
            in the United States using plant-based ingredients. For product support,
            order inquiries, refunds, or shipping questions, please contact the official{" "}
            {product.name} customer service team at{" "}
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. This website
            cannot process orders, refunds, or customer service requests — all such
            matters are handled exclusively by the official retailer.
          </p>
        </div>

        <div className="disclosure-meta">
          <div className="disclosure-meta-links">
            <a href="/terms">Terms &amp; Conditions</a>
            <span className="sep">·</span>
            <a href="/privacy">Privacy Policy</a>
            <span className="sep">·</span>
            <a href="/cookie">Cookie Policy</a>
            <span className="sep">·</span>
            <a href="/contact">Contact</a>
          </div>
          <p className="disclosure-copyright">
            © {year} <strong>{site.domain}</strong> · All rights reserved · Page last
            reviewed: {editorial.lastUpdated}
          </p>
          <p className="disclosure-compliance">
            <small>
              This site complies with the FTC 16 CFR Part 255 guidelines on endorsements
              and testimonials. Affiliate links are clearly marked with{" "}
              <code>rel=&quot;sponsored&quot;</code> attribute. Trademarks referenced on
              this site are the property of their respective owners and are used in
              accordance with nominative fair use principles.
            </small>
          </p>
        </div>
      </div>
    </section>
  );
}
