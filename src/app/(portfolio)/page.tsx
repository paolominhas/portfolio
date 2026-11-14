import Link from "next/link";
import Specimen from "@/components/instrument/Specimen";
import ChannelDeck, { type Channel } from "@/components/instrument/ChannelDeck";
import { CATEGORIES, visibleProjects } from "@/data/projects";

/**
 * PORTFOLIO HOME (paolo.org.uk)
 *
 * One statement, two actions, then the three channels out to the other sites.
 * Below the fold: the first few projects as an index (rows, not cards).
 * The copy is unchanged from the previous home page.
 */

const channels: Channel[] = [
  {
    key: "physics",
    name: "Physics",
    description: "MPhys research, live particle-physics simulations, and the HIBEAM detector work.",
    href: "https://physics.paolo.org.uk",
    color: "var(--ch-physics)",
  },
  {
    key: "web",
    name: "Web",
    description: "Freelance full-stack work: case studies, stack, and how projects run end to end.",
    href: "https://web.paolo.org.uk",
    color: "var(--ch-web)",
  },
  {
    key: "music",
    name: "Music",
    description: "Arrangements, programme notes, and concert production work with EUCO.",
    href: "https://music.paolo.org.uk",
    color: "var(--ch-music)",
  },
];

export default function HomePage() {
  const projects = visibleProjects().slice(0, 4);
  const catName = (k: string) => CATEGORIES.find((c) => c.id === k)?.label ?? k;

  return (
    <>
      <section className="relative mx-auto max-w-[90rem] px-5 pt-28 md:px-8 md:pt-36">
        <Specimen slot="main-hero" className="absolute right-8 top-20 hidden w-[min(26vw,22rem)] lg:block" />
        <div className="in-enter relative">
          <p className="in-label mb-5">MPhys Physics, full-stack engineer</p>
          <h1 className="in-display max-w-[13ch] text-[length:var(--step-5)]">I build the systems behind real products.</h1>
          <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12">
            <p className="in-prose md:col-span-6 md:col-start-1" style={{ fontSize: "var(--step-1)", lineHeight: 1.45, color: "var(--ink)" }}>
              I build production systems: payment infrastructure, deployment pipelines, and detector simulations. Currently finishing a Physics
              Master&apos;s at Edinburgh while shipping full-stack work for a chamber orchestra and an AI advisory firm.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4 md:col-span-5 md:col-start-8 md:justify-end md:self-end">
              <Link
                href="/projects"
                className="flex h-12 items-center rounded-[3px] bg-[var(--signal)] px-6 text-[1.02rem] font-semibold text-[var(--signal-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                View my work
              </Link>
              <a
                href="https://physics.paolo.org.uk/research/mphys"
                className="text-[1.02rem] font-medium underline decoration-[var(--signal)] decoration-2 underline-offset-[6px] transition-[text-underline-offset] hover:underline-offset-[9px]"
              >
                Physics research
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          <ChannelDeck channels={channels} />
        </div>
      </section>

      <section aria-labelledby="work-h" className="mx-auto max-w-[90rem] px-5 pb-28 pt-24 md:px-8 md:pt-36">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 id="work-h" className="in-display text-[length:var(--step-3)] md:text-[length:var(--step-4)]">
            Recent work
          </h2>
          <Link href="/projects" className="mb-1 shrink-0 text-[0.95rem] font-medium underline decoration-[var(--signal)] decoration-2 underline-offset-[6px]">
            All projects
          </Link>
        </div>
        <ol className="border-t border-[var(--line)]">
          {projects.map((p) => {
            const href = p.external ?? `/projects/${p.slug}`;
            const inner = (
              <>
                <span className="in-label md:pt-2">{catName(p.category)}</span>
                <span>
                  <span className="block text-[length:var(--step-2)] font-semibold leading-tight tracking-tight transition-colors group-hover:text-[var(--signal)]">
                    {p.title}
                  </span>
                  <span className="mt-2 block max-w-[62ch] text-[0.98rem] leading-relaxed text-[var(--ink-2)]">{p.excerpt}</span>
                </span>
                <span className="in-label hidden text-right md:block md:pt-2">{p.techStack.slice(0, 3).join(", ")}</span>
              </>
            );
            const cls =
              "group grid gap-x-8 gap-y-2 border-b border-[var(--line)] py-7 transition-[padding,background-color] duration-300 hover:bg-[color-mix(in_srgb,var(--plate)_60%,transparent)] md:grid-cols-[10rem_minmax(0,1fr)_14rem] md:px-4 md:hover:pl-7";
            return (
              <li key={p.id}>
                {p.external ? (
                  <a href={href} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
