"use client";

import { useState } from "react";

/**
 * EXPERIENCE LOG: the About page's timeline, as a strip chart plus a log.
 *
 * Each entry is a bar on a shared time axis and a row underneath. Pointing at
 * (or focusing) either one lights both, so overlaps are easy to read: the
 * degree runs under everything else. The log is an ordinary list; the chart is
 * hidden from assistive tech because it repeats the dates.
 */

export interface LogEntry {
  title: string;
  when: string;
  text: string;
  /** Start and end as decimal years; end null = ongoing. */
  from: number;
  to: number | null;
}

export default function ExperienceLog({ entries, axis }: { entries: LogEntry[]; axis: [number, number] }) {
  const [hot, setHot] = useState(-1);
  const [a0, a1] = axis;
  const pct = (y: number) => `${(((y - a0) / (a1 - a0)) * 100).toFixed(2)}%`;
  const years = Array.from({ length: Math.floor(a1) - Math.ceil(a0) + 1 }, (_, i) => Math.ceil(a0) + i);

  return (
    <div>
      <div aria-hidden className="relative mb-2 overflow-hidden border-b border-[var(--line)] pb-7 pt-1">
        {years.map((y) => (
          <span key={y} className="absolute bottom-0 top-0 border-l border-dashed border-[var(--line)]" style={{ left: pct(y) }}>
            <span className="in-label absolute bottom-1 left-1.5">{y}</span>
          </span>
        ))}
        <div className="relative space-y-2">
          {entries.map((e, i) => {
            const end = e.to ?? a1;
            return (
              <div key={e.title} className="relative h-3" onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)}>
                <span
                  className="absolute h-full rounded-[2px] transition-[background-color,opacity] duration-200"
                  style={{
                    left: pct(e.from),
                    width: `calc(${pct(end)} - ${pct(e.from)})`,
                    background: hot === i ? "var(--signal)" : "var(--ink-2)",
                    opacity: hot === -1 || hot === i ? 1 : 0.35,
                    ...(e.to === null ? { maskImage: "linear-gradient(90deg, #000 70%, transparent)", WebkitMaskImage: "linear-gradient(90deg, #000 70%, transparent)" } : {}),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <ol>
        {entries.map((e, i) => (
          <li
            key={e.title}
            tabIndex={0}
            onPointerEnter={() => setHot(i)}
            onPointerLeave={() => setHot(-1)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(-1)}
            className="grid gap-x-8 gap-y-1 border-b border-[var(--line)] py-5 transition-colors md:grid-cols-[9rem_minmax(0,1fr)]"
          >
            <span className={`in-label md:pt-1.5 ${hot === i ? "!text-[var(--signal)]" : ""}`}>{e.when}</span>
            <span>
              <span className="block text-[length:var(--step-1)] font-semibold leading-snug tracking-tight">{e.title}</span>
              <span className="mt-1 block max-w-[60ch] text-[var(--ink-2)]">{e.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
