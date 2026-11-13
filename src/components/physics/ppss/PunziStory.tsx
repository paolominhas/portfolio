"use client";

import { useState } from "react";
import { Widget, Figure, btn } from "./ui";
import { FIGS, PUNZI_STORY } from "@/data/ppss";

export default function PunziStory() {
  const [i, setI] = useState(0);
  const s = PUNZI_STORY[i];
  return (
    <Widget eyebrow="The real plots" title="A week chasing a spike">
      <p className="text-sm text-white/55 mb-4">
        These are the actual Punzi plots from my notes, in the order I made them. Step through to see what changed and why.
      </p>
      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Steps in the Punzi debugging story">
        {PUNZI_STORY.map((st, k) => (
          <button
            key={k}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`px-3 py-2 rounded-lg text-sm border text-left ${
              k === i ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/70 hover:bg-white/10"
            }`}
          >
            <span className="block font-mono text-xs opacity-70">{st.date}</span>
            cut {st.cut}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start" aria-live="polite">
        <div>
          <Figure id={s.fig} className="my-0" />
          {i === 4 && <Figure id="punzi0338" />}
        </div>
        <div>
          <h4 className="font-bodoni text-xl text-white mb-2">{s.title}</h4>
          <p className="text-white/70 leading-relaxed">{s.what}</p>
          <div className="flex gap-2 mt-5">
            <button className={btn} disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
            <button className={btn} disabled={i === PUNZI_STORY.length - 1} onClick={() => setI(i + 1)}>Next</button>
          </div>
        </div>
      </div>
      <span className="sr-only">{FIGS[s.fig].alt}</span>
    </Widget>
  );
}
