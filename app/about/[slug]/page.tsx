import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteData } from "@/lib/site-data";
import TopStrip from "@/components/layout/TopStrip";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterDisclosure from "@/components/layout/FooterDisclosure";
import ScrollReveal from "@/components/interactive/ScrollReveal";

/**
 * v25.49 — Author detail page (/about/[slug]).
 *
 * Pre-v25.49 the v25.48 Person schema referenced /about/{slug} URLs
 * via Person.url, but those routes didn't exist. Result: schema
 * validators flagged a soft-warning, AI engines crawling the Person
 * URL hit a 404, and the E-E-A-T credibility upside of the persona
 * pool was unrealised.
 *
 * This route renders one author detail page per persona in
 * siteData.editorial.authorPool. It is statically pre-rendered for
 * all 8 slugs at build time via generateStaticParams, so the
 * `output: "export"` build still produces a flat /about/{slug}/
 * folder per persona.
 *
 * Each page emits its OWN Person JSON-LD with the same stable @id
 * the SchemaJsonLd component uses on other pages. Schema.org dedup
 * via @id makes this safe — Google sees one entity referenced from
 * multiple pages.
 */

interface PageParams {
  params: { slug: string };
}

export function generateStaticParams() {
  const pool = siteData.editorial.authorPool || [];
  return pool.map((p) => ({ slug: p.slug }));
}

function findAuthor(slug: string) {
  return (siteData.editorial.authorPool || []).find((a) => a.slug === slug);
}

export function generateMetadata({ params }: PageParams): Metadata {
  const author = findAuthor(params.slug);
  if (!author) return { title: "Author — Not Found" };
  const title = `${author.name} — ${author.jobTitle} | ${siteData.product.name}`;
  const description = author.bio;
  const canonical = `${siteData.site.url}/about/${author.slug}`;
  return {
    title,
    description,
    authors: [{ name: author.name }],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteData.product.name,
      images: [{ url: `${siteData.site.url}${author.avatarPath}`, width: 256, height: 256 }],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [`${siteData.site.url}${author.avatarPath}`],
    },
    // v25.84.0 — author /about pages are E-E-A-T support surfaces, not
    // primary search content. sitemap.xml deliberately excludes them;
    // robots must agree (otherwise Google indexes despite sitemap
    // omission, contradicting the editorial intent).
    robots: { index: false, follow: false },
  };
}

export default function AuthorAboutPage({ params }: PageParams) {
  const author = findAuthor(params.slug);
  if (!author) notFound();
  const year = new Date(siteData.editorial.lastUpdatedIso).getFullYear().toString();
  // v25.84.0 — UNIFY editorial entity as Organization (was Person).
  // Pre-v25.84 the main siteData schema treated "Editorial Research
  // Team" as Organization while THIS page emitted Person — schema.org
  // entity conflict, hurts E-E-A-T trust signals.
  // "Editorial Research Team" is a team (org), not an individual; use
  // Organization consistently across both surfaces. Universal.
  const editorialJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteData.site.url}/#author-${author.slug}`,
    name: author.name,
    description: author.bio,
    knowsAbout: author.knowsAbout,
    image: `${siteData.site.url}${author.avatarPath}`,
    url: `${siteData.site.url}/about/${author.slug}`,
    parentOrganization: { "@id": `${siteData.site.url}/#organization` },
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteData.site.url}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteData.site.url}/about/${author.slug}` },
      { "@type": "ListItem", position: 3, name: author.name, item: `${siteData.site.url}/about/${author.slug}` },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(editorialJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TopStrip />
      <SiteHeader productName={siteData.product.name} subpage />

      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">About {author.name}</span>
      </nav>

      <main className="author-about-wrap">
        <article className="author-about-card">
          <header className="author-about-header">
            <img
              src={author.avatarPath}
              alt={`${author.name} — ${author.jobTitle}`}
              width={128}
              height={128}
              className="author-about-avatar"
            />
            <div>
              <h1 className="author-about-name">{author.name}</h1>
              <p className="author-about-role">{author.jobTitle}</p>
            </div>
          </header>

          <section className="author-about-bio">
            <h2>About</h2>
            <p>{author.bio}</p>
          </section>

          <section className="author-about-expertise">
            <h2>Areas of Expertise</h2>
            <ul className="author-about-tags">
              {author.knowsAbout.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </section>

          <section className="author-about-currently">
            <h2>Currently Reviewing</h2>
            <p>
              {author.name.split(",")[0]} is the editorial lead on this site's
              coverage of <a href="/">{siteData.product.name}</a> — including
              the <a href="/ingredients">ingredient breakdown</a>, the{" "}
              <a href="/benefits">benefit deep-dives</a>, and the{" "}
              <a href="/reviews">customer-feedback summary</a>.
            </p>
          </section>

          <p className="author-about-disclosure">
            This is an editorial profile for an author who contributes to this
            site. {author.name.split(",")[0]} is not affiliated with the
            manufacturer of {siteData.product.name}. Editorial content is
            produced independently from the affiliate sales relationship
            disclosed in the site footer.
          </p>
        </article>
      </main>

      <SiteFooter
        product={siteData.product}
        site={siteData.site}
        editorial={siteData.editorial}
        footerCopy={`A premium plant-based ${siteData.product.categoryShort.toLowerCase()} formula. Editorial coverage by ${author.name}.`}
        disclaimer={`* The statements on this website have not been evaluated by the FDA. ${siteData.product.name} is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. By using this site, you accept our Terms and Privacy Policy.`}
        year={year}
      />
      <FooterDisclosure
        product={siteData.product}
        site={siteData.site}
        editorial={siteData.editorial}
        year={year}
      />
      <ScrollReveal />
    </>
  );
}
