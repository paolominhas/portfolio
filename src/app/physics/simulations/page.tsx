import type { Metadata } from "next";
import Specimen from "@/components/instrument/Specimen";
import SimulationList from "@/components/physics/home/SimulationList";

/**
 * SIMULATIONS INDEX. Used to re-export the physics home page; now that the
 * home page leads with research, the simulations have their own index.
 */

export const metadata: Metadata = {
  title: "Simulations",
  description:
    "Interactive simulations from the Modelling & Visualisation in Physics course at Edinburgh, running live in the browser with the original Python shown alongside the TypeScript port.",
  alternates: { canonical: "https://physics.paolo.org.uk/simulations" },
};

export default function SimulationsIndex() {
  return (
    <div className="relative bg-abyss bg-stars min-h-screen">
      <section className="relative mx-auto max-w-[90rem] px-5 pb-28 pt-28 text-[var(--ink)] md:px-8 md:pt-36">
        <Specimen slot="physics-simulations" className="absolute right-8 top-24 hidden w-[min(24vw,20rem)] lg:block" />
        <div className="in-enter relative mb-14">
          <h1 className="in-display text-[length:var(--step-5)]">Simulations</h1>
          <p className="in-prose mt-6" style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
            Interactive simulations from the Modelling & Visualisation in Physics course at Edinburgh. Each one runs live in the browser; the
            original Python source is shown alongside the TypeScript port.
          </p>
        </div>
        <SimulationList />
        <p className="in-label mt-8 max-w-[70ch]">
          Ising is the first full Python to TypeScript translation; the rest are ported on the same pattern as they&apos;re needed.
        </p>
      </section>
    </div>
  );
}
