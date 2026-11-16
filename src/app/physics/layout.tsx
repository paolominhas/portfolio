import "../instruments.css";
import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import Rail from "@/components/instrument/Rail";
import Backplate from "@/components/instrument/Backplate";
import { SpecimenProvider } from "@/components/instrument/Specimen";
import { availableSpecimens } from "@/lib/specimens";
import { fontVars } from "@/fonts";

/**
 * PHYSICS LAYOUT (physics.paolo.org.uk)
 *
 * The "physics" skin of the Instruments system: the same abyss / ember / kelp
 * palette and Bodoni Moda display face as before, now with the shared rail,
 * footer, reading face (Instrument Sans) and readout face (Martian Mono).
 * The --accent variables the existing pages use are kept.
 */

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Physics — Paolo Minhas",
    default: "Physics — Paolo Minhas",
  },
  description:
    "Physics simulations, demonstrations, and research from Paolo Minhas.",
  openGraph: {
    siteName: "Physics — Paolo Minhas",
    url: "https://physics.paolo.org.uk",
  },
};

const physicsNavItems = [
  { name: "Research", path: "/research" },
  { name: "HIBEAM", path: "/hibeam" },
  { name: "Simulations", path: "/simulations" },
  { name: "Articles", path: "/articles" },
];

export default function PhysicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-skin="physics"
      className={`${bodoni.variable} ${fontVars} min-h-screen bg-[var(--ground)]`}
      style={
        {
          "--accent": "#FF6B3D",
          "--accent-muted": "rgba(255, 107, 61, 0.15)",
          "--accent-border": "rgba(255, 107, 61, 0.25)",
        } as React.CSSProperties
      }
    >
      <SpecimenProvider available={availableSpecimens()}>
      <Rail skin="physics" siteLabel="Physics" items={physicsNavItems} />
      <main className="relative z-10">{children}</main>
      <Backplate skin="physics" siteLabel="Physics" items={physicsNavItems} />
  </SpecimenProvider>
    </div>
  );
}
