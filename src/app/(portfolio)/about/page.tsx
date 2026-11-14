import Image from "next/image";
import type { Metadata } from "next";
import ExperienceLog, { type LogEntry } from "@/components/instrument/ExperienceLog";

/**
 * ABOUT (paolo.org.uk/about)
 *
 * Same content as before, re-set in the Instruments system: a portrait with
 * two readouts beside the opening statement, then links, tools and the
 * experience log (a strip chart over a list; see ExperienceLog).
 */

export const metadata: Metadata = { title: "About" };

const skills = ["Python", "TypeScript", "JavaScript", "C++", "Next.js", "Astro", "React", "React Native", "FastAPI", "Tailwind", "Docker", "PostgreSQL", "Stripe API", "ROOT", "Geant4", "GLoBES"];

const experience: LogEntry[] = [
  { title: "Student @ University of Edinburgh", when: "2022 - 2026", text: "Integrated Master's (MPhys) in Physics, direct entry", from: 2022.7, to: 2026.45 },
  { title: "Intern Researcher @ IFJ PAN Kraków, PL", when: "2025", text: "Applied ML to energy fitting in ROOT and Python for charmed lambda baryon decays (LHCb)", from: 2025.5, to: 2025.72 },
  { title: "Summer Researcher @ University of Edinburgh, UK", when: "2025", text: "Simulated the effect of the sterile neutrino on DUNE detector sensitivity", from: 2025.42, to: 2025.58 },
  { title: "Front of House @ Edinburgh Playhouse (ATG)", when: "Jul 2024 - Present", text: "Usher and bartender at Europe's largest all-seated theatre, working during high-pressure shows", from: 2024.5, to: null },
];

const links = [
  { name: "Visit EUCO site", href: "https://eu-co.co.uk" },
  { name: "eu-co.co.uk GitHub repo", href: "https://github.com/paolominhas/EUCO-Website" },
  { name: "This site's GitHub repo", href: "https://github.com/paolominhas/portfolio" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 pb-28 pt-28 md:px-8 md:pt-36">
      <div className="in-enter grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <h1 className="in-display text-[length:var(--step-5)] lg:col-span-12">About me</h1>

        <div className="lg:col-span-4">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[3px] border border-[var(--line)] bg-[var(--plate)]">
            <Image src="/images/me_new.jpg" alt="Paolo Minhas" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
          </div>
          <dl className="mt-4 border-t border-[var(--line)]">
            {[
              ["Location", "Edinburgh, UK"],
              ["Degree subject", "Physics (Particle Physics)"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-[var(--line)] py-3">
                <dt className="in-label">{k}</dt>
                <dd className="m-0 text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="max-w-[34ch] text-[length:var(--step-2)] font-medium leading-[1.25] tracking-tight">
            I&apos;m finishing an integrated Master&apos;s in Physics at Edinburgh, alongside freelance full-stack web development and research on
            the HIBEAM experiment at the European Spallation Source.
          </p>
          <p className="in-prose mt-7">
            Outside physics, I run digital infrastructure for Edinburgh University Chamber Orchestra, including a Stripe ticketing platform I
            designed and built for their site. You can see the live site, and buy tickets for their upcoming concerts, at eu-co.co.uk.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="in-link">
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section aria-labelledby="tools-h" className="mt-24 grid gap-x-12 gap-y-6 md:mt-32 lg:grid-cols-12">
        <h2 id="tools-h" className="in-display text-[length:var(--step-3)] lg:col-span-4">
          My coding experience
        </h2>
        <ul className="flex flex-wrap content-start border-l border-t border-[var(--line)] lg:col-span-7 lg:col-start-6">
          {skills.map((s) => (
            <li key={s} className="border-b border-r border-[var(--line)] px-4 py-2.5 font-mono text-[0.8rem] transition-colors hover:bg-[var(--signal)] hover:text-[var(--signal-ink)]">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="exp-h" className="mt-24 grid gap-x-12 gap-y-6 md:mt-32 lg:grid-cols-12">
        <h2 id="exp-h" className="in-display text-[length:var(--step-3)] lg:col-span-4">
          Experience
        </h2>
        <div className="lg:col-span-7 lg:col-start-6">
          <ExperienceLog entries={experience} axis={[2022, 2027]} />
        </div>
      </section>
    </div>
  );
}
