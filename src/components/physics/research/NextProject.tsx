import Link from "next/link";
import CoverArt, { coverForSlug } from "./CoverArt";
import { visibleResearchProjects } from "@/data/research";

/**
 * NEXT PROJECT: a ruled band at the foot of a research page leading to the next
 * project in the order of data/research.ts (wrapping round at the end).
 */
export default function NextProject({ slug }: { slug: string }) {
  const all = visibleResearchProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i < 0 || all.length < 2) return null;
  const next = all[(i + 1) % all.length];
  return (
    <aside aria-label="Next project" className="relative z-10 bg-[var(--ground)] text-[var(--ink)]">
      <Link
        href={`/research/${next.slug}`}
        className="group mx-auto grid max-w-[90rem] grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-6 border-t border-[var(--line)] px-5 py-10 transition-colors hover:bg-[color-mix(in_srgb,var(--plate)_60%,transparent)] md:grid-cols-[14rem_minmax(0,1fr)_auto] md:gap-x-10 md:px-8 md:py-14"
      >
        <span className="block aspect-[16/10] overflow-hidden rounded-[3px] border border-[var(--line)]">
          <CoverArt kind={coverForSlug(next.slug)} seed={next.slug} className="h-full w-full" />
        </span>
        <span>
          <span className="in-label mb-2 block">Next project</span>
          <span className="in-display block text-[length:var(--step-2)] transition-colors group-hover:text-[var(--signal)] md:text-[length:var(--step-4)]">{next.title}</span>
          <span className="mt-2 hidden max-w-[60ch] text-[var(--ink-2)] md:block">{next.subtitle}</span>
        </span>
        <svg aria-hidden width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" className="hidden text-[var(--ink-2)] transition-[transform,color] duration-300 group-hover:translate-x-2 group-hover:text-[var(--signal)] md:block">
          <path d="M3 11h16M12 4l7 7-7 7" />
        </svg>
      </Link>
    </aside>
  );
}
