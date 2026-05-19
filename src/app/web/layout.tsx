import type { Metadata } from "next";

/**
 * WEB LAYOUT
 *
 * The web development company site. Two sections:
 * 1. Tutorials — getting started with Node, Next.js, etc.
 * 2. Portfolio — showcase of websites built and managed
 *
 * Accent: a clean blue-teal. Professional but dynamic.
 */

export const metadata: Metadata = {
  title: {
    template: "%s | Web — Paolo Minhas",
    default: "Web Development — Paolo Minhas",
  },
  description:
    "Web development tutorials, portfolio, and professional services.",
  openGraph: {
    siteName: "Web — Paolo Minhas",
    url: "https://web.paolo.org.uk",
  },
};

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={
        {
          "--accent": "#22b8a0",
          "--accent-muted": "rgba(34, 184, 160, 0.12)",
          "--accent-border": "rgba(34, 184, 160, 0.25)",
        } as React.CSSProperties
      }
    >
      {/* The old <SubdomainNav /> has been removed from here. 
        Now, only the children (your page.tsx files) will render.
      */}
      {children}
    </div>
  );
}
