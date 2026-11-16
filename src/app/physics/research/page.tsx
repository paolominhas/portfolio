import type { Metadata } from "next";
import Specimen from "@/components/instrument/Specimen";
import { visibleResearchProjects } from "@/data/research";
import ResearchExplorer from "@/components/physics/research/ResearchExplorer";

/**
 * RESEARCH INDEX
 *
 * Same visual system as physics/page.tsx (abyss + bg-stars + ember/kelp glow
 * blobs + font-bodoni headlines). A server component, so the metadata export
 * works; the cards themselves live in ResearchExplorer (client) and are all
 * present in the server HTML. The large lead card is the entry marked
 * `spotlight` in data/research.ts.
 */

export const metadata: Metadata = {
  title: "Research",
  description:
    "Detector physics, flavour physics and neutrino oscillations: an MPhys thesis on the HIBEAM prototype TPC, two summer placements, a senior honours project, two machine-learning coursework projects and a quantum-computing side project.",
  alternates: { canonical: "https://physics.paolo.org.uk/research" },
};

export default function ResearchIndex() {
  const projects = visibleResearchProjects();
  return (
    <div className="relative bg-abyss bg-stars min-h-screen overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-0 w-[34rem] h-[34rem] rounded-full bg-kelp/15 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-ember/15 blur-[120px]" />

      <section className="relative pt-32 pb-24 px-5 md:px-8 max-w-[90rem] mx-auto">
        <Specimen slot="physics-research" className="absolute right-8 top-24 hidden w-[min(28vw,24rem)] lg:block" />
        <h1 className="in-display mb-6 text-[length:var(--step-5)] text-white">Research</h1>
        <p className="in-prose mb-10">
          Projects spanning detector physics, flavour physics and neutrino oscillations: an MPhys thesis, two summer
          placements, a senior honours project and two machine-learning coursework projects, mostly built on ROOT and
          Python, plus a few side projects where the same ideas turn up somewhere unexpected.
        </p>
        <ResearchExplorer projects={projects} />
      </section>
    </div>
  );
}
