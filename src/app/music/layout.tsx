import type { Metadata } from "next";
import SubdomainNav from "@/components/shared/SubdomainNav";
import Footer from "@/components/shared/Footer";

/**
 * MUSIC LAYOUT
 *
 * Pivoted from an analysis blog to a portfolio of arrangements, and
 * from the dark portfolio-wide theme to a bright, clean one — closer
 * to how sheet-music and concert-programme sites actually look
 * (white background, a warm single accent, generous whitespace)
 * than to a dark editorial blog.
 *
 * A serif display face is kept for headings (a nod to concert
 * programmes and engraved title pages) but the background is white,
 * not the cream/terracotta combination that's become a generic
 * "AI portfolio" tell — paired here with a warm amber accent and a
 * plain five-line staff as the one recurring decorative motif.
 */

export const metadata: Metadata = {
  title: {
    template: "%s | Music — Paolo Minhas",
    default: "Music — Paolo Minhas",
  },
  description:
    "A portfolio of arrangements for chamber ensembles, by Paolo Minhas.",
  openGraph: {
    siteName: "Music — Paolo Minhas",
    url: "https://music.paolo.org.uk",
  },
};

const musicNavItems = [
  { name: "Arrangements", path: "/arrangements" },
  { name: "About", path: "/about" },
];

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-white text-stone-900"
      style={
        {
          "--accent": "#b8791a",
          "--accent-soft": "rgba(184, 121, 26, 0.1)",
          "--accent-border": "rgba(184, 121, 26, 0.25)",
        } as React.CSSProperties
      }
    >
      <SubdomainNav
        siteName="Music"
        siteHref="/"
        navItems={musicNavItems}
        accentColor="#b8791a"
        homeHref="https://paolo.org.uk"
        theme="light"
      />
      <main className="relative z-10">{children}</main>
      <Footer theme="light" site="music" accent="#b8791a" />
    </div>
  );
}
