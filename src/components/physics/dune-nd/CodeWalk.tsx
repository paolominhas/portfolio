"use client";

import React, { useState } from "react";
import { MACROS, REPO } from "@/data/dune-nd";

/** The five macros, one at a time: the key lines of the code beside a plain-English reading of them. */
export default function CodeWalk() {
  const [i, setI] = useState(0);
  const m = MACROS[i];
  return (
    <div className="my-10 rounded-2xl border border-[var(--accent-border)] bg-white/[0.03] p-5 md:p-8">
      <p className="text-xs font-mono tracking-[0.02em] text-[var(--accent)] mb-2">The code</p>
      <h3 className="font-bodoni text-2xl md:text-3xl text-white mb-5">Five macros, five questions</h3>
      <div role="tablist" aria-label="Macros" className="flex flex-wrap gap-1.5 mb-6">
        {MACROS.map((x, k) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`px-3 py-1.5 rounded-full text-sm border font-mono transition-colors ${k === i ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/70 hover:bg-white/10"}`}
          >
            {x.file}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6">
        <div className="min-w-0">
          <pre className="overflow-x-auto rounded-xl bg-black/50 border border-white/10 p-4 text-[12.5px] leading-relaxed text-white/80">
            <code>{m.code}</code>
          </pre>
          <p className="text-[11px] text-white/40 mt-2">
            Excerpt from <a className="underline underline-offset-4 hover:text-white/70" href={`${REPO}/blob/main/${m.file}`}>{m.file}</a>, {m.lines} lines in all.
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-white font-bodoni text-xl mb-2">{m.title}</p>
          <p className="text-white/65 text-base leading-relaxed">{m.plain}</p>
          <p className="mt-4 text-xs font-mono tracking-normal text-white/40">Produces</p>
          <p className="text-white/70 text-sm">{m.figs} of the report</p>
        </div>
      </div>
    </div>
  );
}
