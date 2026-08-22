import type { Metadata } from "next";
import WebNav from "@/components/web/WebNav";
import WebFooter from "@/components/web/WebFooter";

/**
 * WEB LAYOUT
 *
 * Editorial-brutalist redesign of web.paolo.org.uk: Deep Navy (#101585),
 * Bright Yellow (#FFDD44), and Soft Lilac (#A78BFA) — see
 * tailwind.config.ts for the token definitions (navy / yellow / lilac /
 * paper) and src/app/globals.css for how it's wired into the build.
 *
 * This uses a bespoke WebNav/WebFooter rather than the shared
 * SubdomainNav/Footer used by physics and music — the pill nav and
 * zinc/stone footer don't suit this palette, and scoping the new
 * components to src/components/web/ keeps physics/music untouched.
 *
 * Base background is `paper` (off-white, faint lilac cast) so that
 * individual sections can go full-bleed Navy or Lilac without fighting
 * a dark body background — see web/page.tsx for the alternating
 * Navy -> Paper/Lilac -> Navy rhythm.
 */

export const metadata: Metadata = {
  title: {
    template: "%s | Web — Paolo Minhas",
    default: "Web Development — Paolo Minhas",
  },
  description:
    "Web development services, selected work, and write-ups from Paolo Minhas — Next.js, TypeScript, Docker.",
  openGraph: {
    siteName: "Web — Paolo Minhas",
    url: "https://web.paolo.org.uk",
  },
};

const webNavItems = [
  { name: "Work", path: "/portfolio" },
  { name: "Writing", path: "/tutorials" },
];

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-navy selection:bg-yellow selection:text-navy">
      <WebNav navItems={webNavItems} homeHref="https://paolo.org.uk" />
      <main className="relative z-10">{children}</main>
      <WebFooter />
    </div>
  );
}
