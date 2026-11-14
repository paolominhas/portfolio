import Link from "next/link";
import { simulations } from "@/data/physics-simulations";

/**
 * Simulations as an index: one row each, a lamp for status (lit = runs now).
 * Rows that are not built yet are plain text, not links.
 */
export default function SimulationList() {
  return (
    <ul className="border-t border-[var(--line)]">
      {simulations.map((s) => {
        const live = s.status === "live";
        const inner = (
          <>
            <span className="flex items-center gap-3 md:pt-2">
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-full ${live ? "bg-[var(--signal)] shadow-[0_0_12px_var(--signal)]" : "border border-[var(--ink-2)]"}`}
              />
              <span className="in-label">{live ? "Runs now" : "Not built yet"}</span>
            </span>
            <span>
              <span className={`in-display block text-[length:var(--step-2)] md:text-[length:var(--step-3)] ${live ? "transition-colors group-hover:text-[var(--signal)]" : "text-[var(--ink-2)]"}`}>
                {s.title}
              </span>
              <span className="mt-2 block max-w-[58ch] text-[0.98rem] leading-relaxed text-[var(--ink-2)]">{s.description}</span>
            </span>
            <span className="in-label hidden text-right md:block md:pt-2">{s.tags.join(", ")}</span>
          </>
        );
        const cls = "grid gap-x-8 gap-y-2 border-b border-[var(--line)] py-6 md:grid-cols-[10rem_minmax(0,1fr)_16rem] md:px-4";
        return (
          <li key={s.slug}>
            {live ? (
              <Link href={`/simulations/${s.slug}`} className={`${cls} group transition-[padding,background-color] duration-300 hover:bg-[color-mix(in_srgb,var(--plate)_60%,transparent)] md:hover:pl-7`}>
                {inner}
              </Link>
            ) : (
              <div className={cls}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
