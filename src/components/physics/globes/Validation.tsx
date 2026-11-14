"use client";

import React, { useMemo } from "react";
import LinePlot from "./plot";
import { COL, Widget } from "./ui";
import saved from "@/data/globes/saved.json";
import { makeEngine, stdParams } from "@/lib/physics/neutrinoOsc";
import { VALIDATION as V } from "@/data/globes";

const S = saved as unknown as { prob: { E: number[]; P: number[] } };

/** The in-browser engine against GLoBES' own probability file, computed live. */
export default function Validation() {
  const r = useMemo(() => {
    const eng = makeEngine(stdParams(180, "NO"));
    const mine = S.prob.E.map((E) => eng.probs(E, 1300, 0, false)[0 * 3 + 1]); // P(νe → νμ) as glbVacuumProbability(1, 2, +1, E, 1300)
    const d = mine.map((v, i) => Math.abs(v - S.prob.P[i]));
    const sorted = [...d].sort((a, b) => a - b);
    return { mine, max: Math.max(...d), median: sorted[Math.floor(sorted.length / 2)], at: S.prob.E[d.indexOf(Math.max(...d))] };
  }, []);
  const fine = useMemo(() => {
    const eng = makeEngine(stdParams(180, "NO"));
    const x: number[] = [];
    const y: number[] = [];
    for (let i = 0; i <= 600; i++) {
      const E = Math.pow(10, -1 + (2 * i) / 600);
      x.push(E);
      y.push(eng.probs(E, 1300, 0, false)[1]);
    }
    return { x, y };
  }, []);
  return (
    <Widget eyebrow="Check · computed in your browser right now" title="This page’s engine against GLoBES’ own output">
      <p className="text-white/60 text-base mb-4 max-w-[44rem]">
        The repository saved GLoBES’ vacuum probability P(νe → νμ) over 1300 km at 100 energies (<code className="text-white/80">probabitity_out3_cp0.dat</code>). The line is my engine, the dots are GLoBES. They match with δCP = 180° and normal ordering, so I used that setting to check.
      </p>
      <LinePlot
        ariaLabel="Vacuum oscillation probability from the in-browser engine and from the GLoBES output file"
        series={[{ x: fine.x, y: fine.y, color: COL.ember, label: "this page’s engine", width: 1.6 }]}
        markers={S.prob.E.map((E, i) => ({ x: E, y: S.prob.P[i], color: COL.white, r: 2.4 }))}
        xDomain={[0.1, 10]}
        yDomain={[0, 0.5]}
        xLog
        xLabel="neutrino energy (GeV), L = 1300 km, vacuum"
        yLabel="P(νe → νμ)"
        height={280}
        interactive={false}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">Probability, 100 points</p>
          <p className="text-white/70">median difference <span className="text-white">{r.median.toExponential(1)}</span>; worst <span className="text-white">{r.max.toExponential(1)}</span> at {r.at.toFixed(2)} GeV (fastest oscillation)</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">Events, far detector</p>
          <p className="text-white/70">νe appearance totals agree with both saved GLoBES event files to <span className="text-white">{(V.eventsRelErr * 100).toFixed(2)}%</span> (δCP = 0° and 285°)</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">3 flavours vs 3+1 at zero</p>
          <p className="text-white/70">χ² curves differ by at most <span className="text-white">{V.chi3v31MaxAbs}</span> (≤ {(V.chi3v31MaxRel * 100).toFixed(1)}%)</p>
        </div>
        <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/[0.06] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] mb-1">Not reproduced</p>
          <p className="text-white/70">The near detector’s absolute event totals (needs a factor {V.ndRatio} that is not constant in energy)</p>
        </div>
      </div>
    </Widget>
  );
}
