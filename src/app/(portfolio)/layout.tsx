import Rail from "@/components/instrument/Rail";
import Backplate from "@/components/instrument/Backplate";
import { SpecimenProvider } from "@/components/instrument/Specimen";
import { availableSpecimens } from "@/lib/specimens";
import ScopeField from "@/components/instrument/ScopeField";
import { fontVars } from "@/fonts";

/**
 * PORTFOLIO ROUTE GROUP LAYOUT (paolo.org.uk)
 *
 * The "main" skin of the Instruments system: bottle-green ground, brass signal.
 * - ScopeField replaces the old three.js <Scene /> (components/scene.tsx is no
 *   longer imported here; it can be deleted once nothing else uses it).
 * - Rail replaces components/navbar.tsx; Backplate replaces shared/Footer.
 * - Physics and Web are no longer nav links: the site switch on the right of
 *   the rail goes to them from every page.
 */

const items = [
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
];

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-skin="main" className={`${fontVars} relative min-h-screen bg-[var(--ground)] text-[var(--ink)]`}>
      <SpecimenProvider available={availableSpecimens()}>
      <ScopeField />
      <Rail skin="main" items={items} cta={{ name: "Contact", href: "/contact" }} />
      <main className="relative z-10">{children}</main>
      <Backplate skin="main" items={[{ name: "Home", path: "/" }, ...items, { name: "Contact", path: "/contact" }]} />
  </SpecimenProvider>
    </div>
  );
}
