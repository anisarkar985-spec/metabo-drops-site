/** @type {import('next').NextConfig} */
const nextConfig = {
  // v25.47.2 — Static-export mode.
  // `output: "export"` + `images.unoptimized: true` together produce a
  // pure-HTML/CSS/JS bundle in `out/` after `npm run build`. That
  // bundle uploads cleanly to:
  //   - Cloudflare Pages (drag-drop or git-connected)
  //   - Hostinger shared / static hosting
  //   - Netlify / GitHub Pages / any static host
  // No Node.js server required at runtime.
  //
  // `trailingSlash: true` makes Next.js emit each route as a folder
  // (`/benefits/index.html` instead of `/benefits.html`). Apache and
  // Cloudflare Pages both serve `/benefits/` and `/benefits` from the
  // same folder out of the box — no custom rewrite rules needed.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
