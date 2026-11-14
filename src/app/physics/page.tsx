import Link from "next/link";
import EventDisplay from "@/components/instrument/EventDisplay";
import CoverArt, { coverForSlug } from "@/components/physics/research/CoverArt";
import SimulationList from "@/components/physics/home/SimulationList";
import { visibleResearchProjects } from "@/data/research";

/**
 * PHYSICS HOME (physics.paolo.org.uk)
 *
 * Leads with an event display you can fire, then research (the substantial
 * content) as an index with each project's cover as a thumbnail, then the
 * simulations, then HIBEAM and the articles. Rows, not cards.
 *
 * /simulations has its own page now (it used to re-export this one).
 */

export default function PhysicsHome() {
  const research = visibleResearchProjects();
  const more = "text-[0.95rem] font-medium underline decoration-[var(--signal)] decoration-2 underline-offset-[6px]";

  return (
    <div className="relative bg-abyss bg-stars min-h-screen overflow-x-clip text-[var(--ink)]">
      <div aria-hidden className="pointer-events-none absolute -top-32 right-0 h-[36rem] w-[36rem] rounded-full bg-ember/15 blur-[130px]" />

      <section className="relative mx-auto grid max-w-[90rem] items-center gap-x-10 gap-y-12 px-5 pb-20 pt-28 md:px-8 md:pt-32 lg:grid-cols-12">
        <div className="in-enter lg:col-span-5">
          <h1 className="in-display text-[clamp(4.2rem,11vw,10rem)]">Physics</h1>
          <p className="mt-7 max-w-[30ch] text-[length:var(--step-1)] leading-[1.45]">
            Detector, flavour and neutrino physics research, and simulations that run live in the browser.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/research"
              className="flex h-12 items-center rounded-[3px] bg-[var(--signal)] px-6 text-[1.02rem] font-semibold text-[var(--signal-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Read the research
            </Link>
            <Link href="/simulations/ising" className={more.replace("text-[0.95rem]", "text-[1.02rem]")}>
              Run the Ising model
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <EventDisplay />
        </div>
      </section>

      <section aria-labelledby="research-h" className="relative mx-auto max-w-[90rem] px-5 pt-16 md:px-8 md:pt-24">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 id="research-h" className="in-display text-[length:var(--step-3)] md:text-[length:var(--step-4)]">
            Research
          </h2>
          <Link href="/research" className={`${more} mb-1 shrink-0`}>
            Search all research
          </Link>
        </div>
        <ul className="border-t border-[var(--line)]">
          {research.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/research/${p.slug}`}
                className="group grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-2 border-b border-[var(--line)] py-5 transition-[padding,background-color] duration-300 hover:bg-[color-mix(in_srgb,var(--plate)_60%,transparent)] md:grid-cols-[11rem_minmax(0,1fr)_13rem] md:gap-x-8 md:px-4 md:hover:pl-7"
              >
                <span className="block aspect-[16/10] overflow-hidden rounded-[3px] border border-[var(--line)]">
                  <CoverArt kind={coverForSlug(p.slug)} seed={p.slug} className="h-full w-full" />
                </span>
                <span>
                  <span className="in-display block text-[length:var(--step-1)] leading-[1.1] transition-colors group-hover:text-[var(--signal)] md:text-[length:var(--step-3)]">
                    {p.title}
                  </span>
                  <span className="mt-2 hidden max-w-[62ch] text-[0.98rem] leading-relaxed text-[var(--ink-2)] sm:block">{p.subtitle}</span>
                </span>
                <span className="in-label col-span-2 md:col-span-1 md:text-right">
                  {p.kind ?? "Research"}
                  <br className="hidden md:block" />
                  <span className="md:hidden">, </span>
                  {p.period}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sims-h" className="relative mx-auto max-w-[90rem] px-5 pt-24 md:px-8 md:pt-32">
        <div className="mb-8">
          <h2 id="sims-h" className="in-display text-[length:var(--step-3)] md:text-[length:var(--step-4)]">
            Simulations
          </h2>
          <p className="in-prose mt-4">
            From the Modelling & Visualisation in Physics course at Edinburgh. Each one runs live in the browser; the original Python source is
            shown alongside the TypeScript port.
          </p>
        </div>
        <SimulationList />
      </section>

      <section aria-label="More on this site" className="relative mx-auto grid max-w-[90rem] gap-x-10 px-5 pb-28 pt-24 md:grid-cols-2 md:px-8 md:pt-32">
        {[
          {
            href: "/hibeam",
            title: "What is HIBEAM?",
            text: "A planned neutron experiment at the European Spallation Source in Lund, Sweden: what it stands for, what it searches for and how it relates to NNBAR.",
          },
          {
            href: "/articles",
            title: "Articles",
            text: "Simulations computed in Python and embedded as recordings, with the code alongside.",
          },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="group border-t border-[var(--line)] py-7">
            <span className="in-display block text-[length:var(--step-3)] transition-colors group-hover:text-[var(--signal)]">{x.title}</span>
            <span className="in-prose mt-3 block">{x.text}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
