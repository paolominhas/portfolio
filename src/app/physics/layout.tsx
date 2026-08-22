import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import PhysicsNav from "@/components/shared/SubdomainNav";
import Footer from "@/components/shared/Footer";

/**
 * PHYSICS LAYOUT
 *
 * Scope note: this redesign covers the index/landing page (dark) and
 * the simulation sandbox pages (warm/painterly) — see physics/page.tsx
 * and SimulationSandbox.tsx. The nav and footer are intentionally
 * NOT rebuilt from scratch the way WebNav/MusicNav were; that wasn't
 * asked for this time, and SubdomainNav's existing "dark" pill theme
 * already sits fine over the new abyss/starfield background. Only the
 * accent hex changes, from the old #e84834 to `ember` (#FF6B3D), to
 * match the new palette in tailwind.config.ts.
 *
 * Bodoni Moda is loaded here via next/font/google for the "classic,
 * elegant, high-contrast serif" headline treatment — self-hosted at
 * build time, scoped to /physics the same way Playfair Display is
 * scoped to /music (see music/layout.tsx for the fuller explanation
 * of why that scoping works). Utility class: `font-bodoni`.
 */

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Physics — Paolo Minhas",
    default: "Physics — Paolo Minhas",
  },
  description:
    "Physics simulations, demonstrations, and research from Paolo Minhas.",
  openGraph: {
    siteName: "Physics — Paolo Minhas",
    url: "https://physics.paolo.org.uk",
  },
};

const physicsNavItems = [
  { name: "Research", path: "/research" },
  { name: "Simulations", path: "/simulations" },
  { name: "Articles", path: "/articles" },
];

export default function PhysicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${bodoni.variable} min-h-screen`}
      style={
        {
          "--accent": "#FF6B3D",
          "--accent-muted": "rgba(255, 107, 61, 0.15)",
          "--accent-border": "rgba(255, 107, 61, 0.25)",
        } as React.CSSProperties
      }
    >
      <PhysicsNav
        siteName="Physics"
        siteHref="/"
        navItems={physicsNavItems}
        accentColor="#FF6B3D"
        homeHref="https://paolo.org.uk"
      />
      <main className="relative z-10">{children}</main>
      <Footer theme="dark" site="physics" accent="#FF6B3D" />
    </div>
  );
}
