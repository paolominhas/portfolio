"use client";

import React, { useState } from "react";
import { Seg, Widget, COL } from "../daml/ui";
import { ATTEMPTS, N, informedness } from "@/data/mini-cms";

/** Two views of the notebook's identification results. All numbers are the notebook's printed ones. */

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

function Bar({ label, value, colour, note }: { label: string; value: number; colour: string; note?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm text-white/75">
        <span>{label}</span>
        <span className="font-mono text-white">{pct(value)}</span>
      </div>
      <div className="relative mt-1 h-6 rounded bg-white/[0.06]" role="img" aria-label={`${label}: ${pct(value)}; target ${pct(N.emu.target)}`}>
        <div className="absolute inset-y-0 left-0 rounded transition-[width] duration-500" style={{ width: `${value * 100}%`, background: colour }} />
        <div className="absolute inset-y-[-3px] w-px bg-white/70" style={{ left: `${N.emu.target * 100}%` }} />
      </div>
      {note && <p className="mt-1 text-xs text-white/45">{note}</p>}
    </div>
  );
}

export function EmuBench() {
  const [det, setDet] = useState<"ecal" | "muon">("ecal");
  const r = det === "ecal" ? N.emu.ecalOnly : N.emu.withMuonChamber;
  return (
    <Widget eyebrow="Real results" title="Electron or muon?">
      <div className="mb-6">
        <Seg value={det} onChange={setDet} label="Which detectors the decision may use" options={[["ecal", "ECAL energy only"], ["muon", "ECAL plus muon chamber"]]} />
      </div>
      <div className="grid gap-5 max-w-xl">
        <Bar label="Electrons identified" value={r.electron} colour={COL.sky} note={det === "ecal" ? "The rule: over 1 GeV in the ECAL means electron." : "Unchanged: the muon chamber says nothing about electrons."} />
        <Bar label="Muons identified" value={r.muon} colour={COL.ember} note={det === "ecal" ? "Everything below 1 GeV is called a muon, which is why muons look good." : "Any hit in the chamber overrides the ECAL and calls it a muon."} />
        <Bar label="Overall" value={r.overall} colour={COL.kelp} />
      </div>
      <p className="mt-5 text-xs text-white/45">The white tick is the 70% target set for the project. 2000 simulated events, energies flat between 0.2 and 20 GeV.</p>
    </Widget>
  );
}

export function InformednessChart() {
  const rows = ATTEMPTS.map((a) => ({ ...a, j: informedness(a) }));
  const lo = -0.1, hi = 0.65;
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <Widget eyebrow="Arithmetic on the notebook's numbers" title="How much does each classifier actually know?">
      <p className="text-white/65 text-base leading-relaxed max-w-[44rem] mb-6">
        Add a classifier&rsquo;s efficiency for one species to its efficiency for the other and subtract 1. A classifier that ignores the particle and just says &ldquo;pion&rdquo; 84% of the time scores 0; a perfect one scores 1.
      </p>
      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.id} className="grid gap-1 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:items-center sm:gap-4">
            <p className="text-sm text-white/75 leading-snug">{r.label}</p>
            <div className="relative h-6" role="img" aria-label={`${r.label}: ${r.j.toFixed(3)}`}>
              <div className="absolute inset-y-0 left-0 right-0 rounded bg-white/[0.04]" />
              <div className="absolute inset-y-0 w-px bg-white/50" style={{ left: `${x(0)}%` }} />
              <div
                className="absolute inset-y-1 rounded-sm"
                style={{ left: `${x(Math.min(0, r.j))}%`, width: `${Math.max(0.6, Math.abs(x(r.j) - x(0)))}%`, background: r.group === "e/mu" ? COL.ember : COL.sky }}
              />
              <span className="absolute top-1/2 -translate-y-1/2 font-mono text-xs text-white" style={{ left: `${Math.min(92, x(Math.max(0, r.j)) + 1.5)}%` }}>
                {r.j >= 0 ? "+" : "−"}{Math.abs(r.j).toFixed(3)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-white/45 leading-relaxed">
        Orange: electron against muon. Blue: pion against kaon. The gradient-boosting row is worked out from its accuracy of 0.487 on a roughly balanced test sample, so it is approximate. With about 500 events of each species, an efficiency near 0.5 carries a statistical uncertainty of about ±2%, so every blue bar is consistent with zero.
      </p>
    </Widget>
  );
}
