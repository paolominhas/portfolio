import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import MusicNav from "@/components/music/MusicNav";
import MusicFooter from "@/components/music/MusicFooter";

/**
 * MUSIC LAYOUT
 *
 * Acid-brutalist redesign of music.paolo.org.uk: electric neon lime
 * (#D6FF00) background, hot-pink/magenta (#FF007F) mesh-gradient
 * accents, pure black text and rules. See tailwind.config.ts for the
 * lime / magenta / cream tokens and the `font-display` family.
 *
 * Playfair Display is loaded here via next/font/google — self-hosted
 * and inlined as a CSS variable (--font-playfair) at build time, so
 * there's no runtime request to Google Fonts and no layout shift.
 * The variable is applied on this layout's wrapping <div>, which is
 * why `font-display` (defined in tailwind.config.ts as
 * `var(--font-playfair)`) only resolves to Playfair *within* /music —
 * used elsewhere it just falls back to the generic serif stack,
 * rather than silently reaching outside this subtree.
 *
 * Bespoke MusicNav/MusicFooter (src/components/music/) rather than
 * the shared SubdomainNav/Footer used by physics — the same reasoning
 * as WebNav/WebFooter: this palette needs hard rules and flat colour,
 * not the soft pill-nav/zinc-footer treatment. physics is untouched.
 */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Music — Paolo Minhas",
    default: "Music — Paolo Minhas",
  },
  description:
    "A downloadable archive of chamber-ensemble arrangements, by Paolo Minhas.",
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
      className={`${playfair.variable} min-h-screen bg-lime text-black selection:bg-black selection:text-lime`}
    >
      <MusicNav navItems={musicNavItems} homeHref="https://paolo.org.uk" />
      <main className="relative z-10">{children}</main>
      <MusicFooter />
    </div>
  );
}
