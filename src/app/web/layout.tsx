import type { Metadata } from "next";
import Rail from "@/components/instrument/Rail";
import Backplate from "@/components/instrument/Backplate";
import { SpecimenProvider } from "@/components/instrument/Specimen";
import { availableSpecimens } from "@/lib/specimens";
import { bricolage, fontVars } from "@/fonts";
import { tutorials } from "@/data/web-data";

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

// "Writing" only appears in the nav once at least one post is written.
const hasWriting = tutorials.some((t) => t.content || process.env.NODE_ENV !== "production");
const webNavItems = [
  { name: "Work", path: "/portfolio" },
  ...(hasWriting ? [{ name: "Writing", path: "/tutorials" }] : []),
];

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-skin="web" className={`${fontVars} ${bricolage.variable} min-h-screen bg-paper text-navy selection:bg-yellow selection:text-navy`}>
      <SpecimenProvider available={availableSpecimens()}>
      {/* The shared Instruments rail and footer replace the old web-only nav and footer. */}
      <Rail skin="web" siteLabel="Web" items={webNavItems} cta={{ name: "Let's talk", href: "https://paolo.org.uk/contact" }} />
      <main className="relative z-10">{children}</main>
      <Backplate skin="web" siteLabel="Web" items={webNavItems} />
  </SpecimenProvider>
    </div>
  );
}
