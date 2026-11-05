import { researchProjects, isPublished } from "@/data/research";
import { physicsArticles } from "@/data/physics-articles";

// Sitemap for physics.paolo.org.uk. The root sitemap only lists paolo.org.uk;
// each subdomain is its own site to Google, so this one is served on the
// physics host (the middleware rewrites /sitemap.xml here).
export const dynamic = "force-static";

const BASE = "https://physics.paolo.org.uk";

export function GET() {
  const urls: { path: string; priority: string; changefreq: string }[] = [
    { path: "", priority: "1.0", changefreq: "monthly" },
    { path: "/hibeam", priority: "0.9", changefreq: "monthly" },
    { path: "/research", priority: "0.8", changefreq: "monthly" },
    // Every published research entry, bespoke routes (mphys, grover) included.
    ...researchProjects
      .filter(isPublished)
      .map((p) => ({ path: `/research/${p.slug}`, priority: p.bespokeRoute ? "0.8" : "0.7", changefreq: "monthly" })),
    { path: "/simulations", priority: "0.6", changefreq: "monthly" },
    // Only simulations that have a page; add slugs here as you build the others.
    ...["ising"].map((s) => ({ path: `/simulations/${s}`, priority: "0.5", changefreq: "yearly" })),
    { path: "/articles", priority: "0.6", changefreq: "monthly" },
    ...physicsArticles.map((a) => ({ path: `/articles/${a.slug}`, priority: "0.5", changefreq: "yearly" })),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${BASE}${u.path}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
