"use client";

import { useState } from "react";
import { Widget } from "./ui";
import { TIMELINE, TAG_LABEL, type Tag } from "@/data/ppss";

const TAGS = Object.keys(TAG_LABEL) as Tag[];

export default function Timeline() {
  const [on, setOn] = useState<Set<Tag>>(new Set(TAGS));
  const toggle = (t: Tag) => {
    const n = new Set(on);
    if (n.has(t)) n.delete(t);
    else n.add(t);
    setOn(n.size === 0 ? new Set(TAGS) : n);
  };
  const shown = TIMELINE.filter((d) => d.tag.some((t) => on.has(t)));
  return (
    <Widget eyebrow="From my notes" title="Three weeks, day by day">
      <p className="text-sm text-white/55 mb-4">
        The notes are a diary: meetings, code, dead ends. Filter by theme to follow one thread.
      </p>
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by theme">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => toggle(t)}
            aria-pressed={on.has(t)}
            className={`px-3 py-1.5 rounded-full text-xs border ${
              on.has(t) ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/50 hover:bg-white/10"
            }`}
          >
            {TAG_LABEL[t]}
          </button>
        ))}
      </div>
      <ol className="relative border-l border-white/15 ml-2 space-y-6" aria-live="polite">
        {shown.map((d) => (
          <li key={d.date} className="pl-6 relative">
            <span className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${d.tag.includes("bug") ? "bg-[var(--accent)]" : "bg-[#2F9E7C]"}`} />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-xs text-white/45">{d.date}</span>
              <h4 className="font-bodoni text-lg text-white">{d.title}</h4>
            </div>
            <p className="mt-1 text-white/65 text-base leading-relaxed">{d.body}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {d.tag.map((t) => (
                <span key={t} className="text-[10px] tracking-normal text-white/35">{TAG_LABEL[t]}</span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Widget>
  );
}
