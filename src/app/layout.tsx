import "./globals.css";
import type { Metadata } from "next";

/**
 * ROOT LAYOUT — UPDATED
 *
 * WHAT CHANGED: The root layout is now minimal. It provides:
 *   - <html> and <body> tags
 *   - Global CSS
 *   - Base metadata
 *   - The dark background class
 *
 * WHAT MOVED:
 *   - <Scene /> (3D background) → only rendered on main portfolio pages,
 *     not on subdomain routes. Handled by checking the route.
 *   - <Navbar /> → the portfolio navbar is now only used on main routes.
 *     Subdomain routes use SubdomainNav via their own layout.tsx.
 *   - <Footer /> → added to main portfolio pages.
 *
 * WHY: Previously, every route (including /physics/..., /music/..., /web/...)
 * would inherit the portfolio's 3D scene and navbar. Subdomain sites need
 * their own theming and navigation.
 *
 * HOW: The subdomain layouts (physics/layout.tsx etc.) provide their own
 * navigation. The main portfolio pages keep their existing Navbar + Scene
 * via a route group layout at src/app/(portfolio)/layout.tsx.
 *
 * ROUTE STRUCTURE AFTER RESTRUCTURING:
 *
 *   src/app/
 *   ├── layout.tsx          ← THIS FILE (minimal root)
 *   ├── globals.css
 *   ├── (portfolio)/        ← Route group for main paolo.org.uk pages
 *   │   ├── layout.tsx      ← Navbar + Scene + Footer (moved from root)
 *   │   ├── page.tsx        ← Home page
 *   │   ├── about/
 *   │   ├── projects/       ← MPhys links out to physics.paolo.org.uk/research/mphys
 *   │   └── contact/
 *   ├── physics/            ← physics.paolo.org.uk (own layout + nav)
 *   │   ├── articles/       ← physics simulation write-ups (unrelated to the old portfolio /articles)
 *   │   └── research/       ← the 4 research projects (mphys, ppss, globes, dune-nd)
 *   ├── music/              ← music.paolo.org.uk (own layout + nav)
 *   └── web/                ← web.paolo.org.uk (own layout + nav)
 */

export const metadata: Metadata = {
  title: {
    template: "%s | Paolo Minhas",
    default: "Paolo Minhas | Software Engineer & Physics Graduate",
  },
  description:
    "Full-stack software engineer and physics graduate — production systems, payment infrastructure, and particle detector research.",
  metadataBase: new URL("https://paolo.org.uk"),
  openGraph: {
    title: "Paolo Minhas | Software Engineer & Physics Graduate",
    description:
      "Full-stack software engineer and physics graduate — production systems, payment infrastructure, and particle detector research.",
    url: "https://paolo.org.uk",
    siteName: "Paolo Minhas",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Paolo Minhas — Software Engineer & Physics Graduate",
      },
    ],
    locale: "en_UK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paolo Minhas | Software Engineer & Physics Graduate",
    description:
      "Full-stack software engineer and physics graduate — production systems, payment infrastructure, and particle detector research.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
