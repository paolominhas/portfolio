import type { Metadata } from "next";
import SubdomainNav from "@/components/shared/SubdomainNav";

/**
 * MUSIC LAYOUT
 *
 * The music site is a blog about music — editorial, warm, text-heavy.
 * Accent: a warm amber/gold. The blog structure uses [slug] dynamic
 * routes for individual posts, with VexFlow for inline notation.
 */

export const metadata: Metadata = {
  title: {
    template: "%s | Music — Paolo Minhas",
    default: "Music — Paolo Minhas",
  },
  description:
    "Writing about music, orchestral performance, and music theory.",
  openGraph: {
    siteName: "Music — Paolo Minhas",
    url: "https://music.paolo.org.uk",
  },
};

const musicNavItems = [
  { name: "Posts", path: "/posts" },
  { name: "About", path: "/about" },
];

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={
        {
          "--accent": "#d4a24e",
          "--accent-muted": "rgba(212, 162, 78, 0.12)",
          "--accent-border": "rgba(212, 162, 78, 0.25)",
        } as React.CSSProperties
      }
    >
      <SubdomainNav
        siteName="Music"
        siteHref="/"
        navItems={musicNavItems}
        accentColor="#d4a24e"
        homeHref="https://paolo.org.uk"
      />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
