import type { Metadata } from "next";
import SubdomainNav from "@/components/shared/SubdomainNav";
import Footer from "@/components/shared/Footer";

/**
 * WEB LAYOUT
 *
 * The web development side of the site — services, selected work,
 * and write-ups. Previously every page here built its own ad-hoc
 * header and (on the home page only) a one-line footer, so nothing
 * outside the homepage had consistent navigation. This now uses the
 * same shared SubdomainNav/Footer as physics and music, in their
 * light-theme variants.
 *
 * DESIGN TOKENS — deliberately not the "cream background + serif +
 * warm accent" look the old pages used (that combination reads as a
 * generic template rather than a developer's own site). Instead:
 * a cool off-white, a teal accent, and monospace used for labels —
 * signalling "built by an engineer" rather than "editorial blog".
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
    <div
      className="min-h-screen bg-[#F6F7F7] text-slate-900"
      style={
        {
          "--accent": "#0f8a7b",
          "--accent-soft": "rgba(15, 138, 123, 0.08)",
          "--accent-border": "rgba(15, 138, 123, 0.22)",
        } as React.CSSProperties
      }
    >
      <SubdomainNav
        siteName="Web"
        siteHref="/"
        navItems={webNavItems}
        accentColor="#0f8a7b"
        homeHref="https://paolo.org.uk"
        theme="light"
      />
      <main className="relative z-10">{children}</main>
      <Footer theme="light" site="web" accent="#0f8a7b" />
    </div>
  );
}
