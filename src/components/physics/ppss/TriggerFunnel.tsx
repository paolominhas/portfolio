"use client";

import { useState } from "react";
import { Widget } from "./ui";

/** Rates as quoted in ProjectNotes.pdf (Offline Method Write Up, p. 26). */
const STAGES = [
  { name: "Collisions", rate: 40e6, label: "up to 40 MHz", what: "Proton bunches cross at up to 40 million times a second. Far too much to write to disk." },
  { name: "Hardware trigger", rate: 1e6, label: "about 1 MHz", what: "The first layer is hardware and makes a very fast, rough decision." },
  { name: "First software level", rate: 110e3, label: "110 kHz", what: "A first high-level trigger in software keeps events with recognisable signatures, such as a muon pair." },
  { name: "Second software level", rate: 12.5e3, label: "12.5 kHz", what: "A second software level improves the track reconstruction and decides what is stored for analysis." },
];

const fmt = (n: number) => (n >= 100 ? Math.round(n).toLocaleString("en-GB") : n.toFixed(1));

export default function TriggerFunnel() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  const prev = i > 0 ? STAGES[i - 1].rate / s.rate : null;
  const total = STAGES[0].rate / s.rate;
  const lo = Math.log10(5e3);
  const hi = Math.log10(4e7);
  const width = (r: number) => 8 + ((Math.log10(r) - lo) / (hi - lo)) * 92;

  return (
    <Widget title="How much data survives the trigger?">
      <p className="text-sm text-white/55 mb-5">
        Bar lengths are on a log scale. Click a stage. The rates are the ones quoted in my notes.
      </p>
      <div className="space-y-2">
        {STAGES.map((st, k) => (
          <button
            key={st.name}
            onClick={() => setI(k)}
            aria-pressed={k === i}
            className="w-full text-left group"
          >
            <div className="flex justify-between text-xs mb-1 text-white/50">
              <span className={k === i ? "text-white font-semibold" : ""}>{st.name}</span>
              <span className="font-mono">{st.label}</span>
            </div>
            <div className="h-6 rounded bg-white/5">
              <div
                className={`h-6 rounded transition-all ${k === i ? "bg-ember" : "bg-[#2F9E7C]/70 group-hover:bg-[#2F9E7C]"}`}
                style={{ width: `${width(st.rate)}%` }}
              />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3" aria-live="polite">
        <div className="sm:col-span-3 text-white/70">{s.what}</div>
        <div className="rounded-lg border border-white/10 p-3">
          <div className="text-xs tracking-normal text-white/40">This step keeps</div>
          <div className="font-bodoni text-2xl text-white">{prev ? `1 in ${fmt(prev)}` : "everything"}</div>
        </div>
        <div className="rounded-lg border border-white/10 p-3">
          <div className="text-xs tracking-normal text-white/40">Cumulative</div>
          <div className="font-bodoni text-2xl text-white">{i === 0 ? "1 in 1" : `1 in ${fmt(total)}`}</div>
        </div>
        <div className="rounded-lg border border-white/10 p-3">
          <div className="text-xs tracking-normal text-white/40">Rate left</div>
          <div className="font-bodoni text-2xl text-white">{s.label}</div>
        </div>
      </div>
      <p className="mt-4 text-xs text-white/40">
        My meeting note says the trigger reduces the data by &ldquo;about a factor of 1000&rdquo;; the rates in the write-up multiply out to about 1 in 3,200. Both are rough.
      </p>
    </Widget>
  );
}
