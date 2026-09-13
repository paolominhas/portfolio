import type { Metadata } from "next";
import TutorNav from "@/components/tutor/TutorNav";
import TutorFooter from "@/components/tutor/TutorFooter";

/**
 * TUTOR LAYOUT
 *
 * The fourth subdomain: tutor.paolo.org.uk. Same "Option 2" single-
 * app/single-deploy pattern as physics/music/web — see src/middleware.ts
 * for the Host-header rewrite that maps this hostname to /tutor, and
 * the DNS/infra notes delivered alongside this code for what's needed
 * outside the repo to make the hostname resolve at all.
 *
 * Bespoke TutorNav/TutorFooter rather than the shared components —
 * same reasoning as WebFooter/MusicFooter: the warm teal/cream/amber
 * palette (see the CSS vars added to globals.css) doesn't suit the
 * shared zinc/stone theming.
 *
 * Metadata here is written to actually rank: the title leads with the
 * qualification names a parent searches for, the description repeats
 * them plus "Edinburgh" and "online" for the location-modified
 * queries ("gcse maths tutor edinburgh", "online a level physics
 * tutor"). Page-specific JSON-LD (schema.org Service) lives in
 * page.tsx, next to the data it describes.
 */

const title =
  "Maths & Physics Tutor — GCSE, A Level, Advanced Higher & 11+ | Paolo Minhas";
const description =
  "One-to-one Maths & Physics tuition for GCSE, A Level, Advanced Higher and 11+ entrance exams — online across the UK or in person in Edinburgh. Taught by a physics researcher at the University of Edinburgh.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tutor.paolo.org.uk",
  },
  openGraph: {
    title,
    description,
    url: "https://tutor.paolo.org.uk",
    siteName: "Paolo Minhas — Tutor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="top"
      className="min-h-screen bg-[var(--tutor-paper)] text-[var(--tutor-ink)] selection:bg-[var(--tutor-amber)] selection:text-[var(--tutor-ink)]"
    >
      <TutorNav />
      <main>{children}</main>
      <TutorFooter />
    </div>
  );
}
