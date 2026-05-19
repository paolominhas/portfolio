import type { Metadata } from "next";
import PhysicsNav from "@/components/shared/SubdomainNav";

/**
 * PHYSICS LAYOUT
 *
 * This layout wraps everything under /physics/... — which is what
 * physics.paolo.org.uk resolves to via the middleware rewrite.
 *
 * It does NOT include the root layout's <html> and <body> tags —
 * those come from src/app/layout.tsx which wraps everything. This
 * layout just adds the physics-specific chrome: its own navbar,
 * colour scheme overrides, and metadata.
 *
 * The root layout applies the dark bg-zinc-950 base. This layout
 * layers the physics-specific accent colours on top via CSS variables.
 */

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

// Navigation items specific to the physics site
const physicsNavItems = [
  { name: "Simulations", path: "/simulations" },
  { name: "Research", path: "/research" },
];

export default function PhysicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={
        {
          "--accent": "#e84834",
          "--accent-muted": "rgba(232, 72, 52, 0.15)",
          "--accent-border": "rgba(232, 72, 52, 0.25)",
        } as React.CSSProperties
      }
    >
      <PhysicsNav
        siteName="Physics"
        siteHref="/"
        navItems={physicsNavItems}
        accentColor="#e84834"
        homeHref="https://paolo.org.uk"
      />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
