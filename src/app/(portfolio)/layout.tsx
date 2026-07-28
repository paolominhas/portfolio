import Navbar from "@/components/navbar";
import Scene from "@/components/scene";
import Footer from "@/components/shared/Footer";

/**
 * PORTFOLIO ROUTE GROUP LAYOUT
 *
 * This is the layout for the main paolo.org.uk pages. It contains
 * exactly what was previously in the root layout.tsx:
 *   - <Scene /> (the 3D background)
 *   - <Navbar /> (the portfolio navigation pill)
 *   - <Footer /> (NEW — links to subdomains)
 *
 * ROUTE GROUPS: The (portfolio) folder name with parentheses is a
 * Next.js "route group" — it creates a layout boundary without
 * adding a URL segment. So src/app/(portfolio)/about/page.tsx
 * is still accessible at paolo.org.uk/about, not /portfolio/about.
 *
 * WHY: This isolates the portfolio's 3D scene and navbar from the
 * subdomain routes. physics.paolo.org.uk doesn't get the particle
 * background or the "My Portfolio" nav pill — it gets its own layout.
 */

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Scene />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer theme="dark" site="portfolio" />
    </>
  );
}
