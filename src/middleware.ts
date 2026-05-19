import { NextRequest, NextResponse } from "next/server";

/**
 * SUBDOMAIN ROUTING MIDDLEWARE
 *
 * This is the heart of Option 2. It intercepts every request and checks
 * the hostname. If someone visits physics.paolo.org.uk/simulations/ising,
 * the middleware rewrites that internally to /physics/simulations/ising —
 * which is just a normal App Router path.
 *
 * The visitor sees the subdomain URL in their browser, but Next.js serves
 * the content from the /physics folder tree. One app, one build, one deploy.
 *
 * HOW IT WORKS:
 *   1. Extract the subdomain from the Host header
 *   2. If it's a known subdomain (physics, music, web), rewrite the path
 *   3. If it's the root domain or www, pass through unchanged
 *   4. Anything else → 404 or pass through
 *
 * IMPORTANT: This is a `rewrite`, not a `redirect`. The URL in the browser
 * stays as physics.paolo.org.uk/... — the user never sees /physics/... in
 * the address bar.
 */

// The subdomains we handle. Add more here as needed.
const SUBDOMAIN_MAP = new Set(["physics", "music", "web"]);

// Your root domain — used to extract the subdomain.
// In development, we also handle localhost.
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "paolo.org.uk";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // --- Development: localhost with port ---
  // In dev, subdomains don't work on localhost, so we skip rewriting.
  // To test subdomains locally, add entries to /etc/hosts:
  //   127.0.0.1  physics.localhost
  //   127.0.0.1  music.localhost
  //   127.0.0.1  web.localhost
  // Then access physics.localhost:3000

  // Strip the port if present (e.g. "physics.localhost:3000" → "physics.localhost")
  const hostname = host.split(":")[0];

  // Extract the subdomain:
  //   "physics.paolo.org.uk" → "physics"
  //   "paolo.org.uk" → "paolo"
  //   "www.paolo.org.uk" → "www"
  //   "physics.localhost" → "physics"
  let subdomain: string | null = null;

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    // Production: physics.paolo.org.uk
    subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "");
  } else if (hostname.endsWith(".localhost")) {
    // Development: physics.localhost
    subdomain = hostname.replace(".localhost", "");
  }

  // If it's a known subdomain, rewrite the path
  if (subdomain && SUBDOMAIN_MAP.has(subdomain)) {
    const url = request.nextUrl.clone();

    // Avoid double-prefixing: if someone somehow hits /physics/... on the
    // physics subdomain, don't rewrite to /physics/physics/...
    if (!pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${pathname}`;
    }

    return NextResponse.rewrite(url);
  }

  // Root domain, www, or unknown subdomain → pass through
  return NextResponse.next();
}

// Only run middleware on page routes, not on static assets / API routes
export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|images/|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2)).*)",
  ],
};
