// robots.txt for physics.paolo.org.uk. The root robots.ts only describes
// paolo.org.uk; Google reads robots.txt per host, so the physics subdomain
// serves its own (the middleware rewrites /robots.txt here on that host).
export const dynamic = "force-static";

export function GET() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: https://physics.paolo.org.uk/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
