"use client";

import React, { useState } from "react";
import { CODE } from "@/data/globes";
import { Widget } from "./ui";

/** The real code from the repository, one step at a time, each with a plain-English reading. */
export default function CodeWalk() {
  const [k, setK] = useState(0);
  const c = CODE[k];
  return (
    <Widget eyebrow="Interactive · the repository's code" title="How the simulation is wired together">
      <div role="tablist" aria-label="Code steps" className="flex flex-wrap gap-1.5 mb-5">
        {CODE.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === k}
            onClick={() => setK(i)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${i === k ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/70 hover:bg-white/10"}`}
          >
            <span className="font-mono text-[10px] mr-1.5 opacity-70">{i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="min-w-0">
          <p className="text-xs font-mono text-white/40 mb-1.5">{c.file}</p>
          <pre className="rounded-xl bg-black/50 border border-white/10 p-4 text-[12.5px] leading-relaxed text-[#cfe3ff] overflow-x-auto"><code>{c.code}</code></pre>
        </div>
        <div className="text-white/70 text-base leading-relaxed">
          <p className="text-xs font-mono tracking-[0.02em] text-white/40 mb-2">In plain English</p>
          <p>{c.plain}</p>
        </div>
      </div>
    </Widget>
  );
}
