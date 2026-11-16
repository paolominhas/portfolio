"use client";

import React, { useState } from "react";
import { Seg, Widget, COL } from "../daml/ui";
import { N } from "@/data/exotic-search";

const FEATS = ["lep1_pt", "lep2_pt", "fatjet_pt", "fatjet_eta", "fatjet_D2", "Zll_mass", "Zll_pt", "MET"];

function Architecture({ withMass }: { withMass: boolean }) {
  const inputs = withMass ? [...FEATS, "reco_zv_mass"] : FEATS;
  const hidden = withMass ? 3 : 2;
  const W = 700, H = 300;
  const colX = (c: number) => 150 + (c * (W - 230)) / (hidden + 1);
  const ys = (n: number) => Array.from({ length: n }, (_, i) => 26 + (i * (H - 52)) / Math.max(1, n - 1));
  const cols = [ys(inputs.length), ...Array.from({ length: hidden }, () => ys(7)), ys(1)];
  return (
    <div className="overflow-x-auto -mx-1 px-1"><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Network with ${inputs.length} inputs, ${hidden} hidden layers of 40 nodes with ReLU and dropout 0.2, and one sigmoid output`} className="h-auto w-full min-w-[34rem]">
      {cols.slice(0, -1).map((c, ci) =>
        c.flatMap((y1, i) => cols[ci + 1].map((y2, j) => <line key={`${ci}-${i}-${j}`} x1={colX(ci)} y1={y1} x2={colX(ci + 1)} y2={y2} stroke="rgba(255,255,255,0.07)" />))
      )}
      {cols.map((c, ci) =>
        c.map((y, i) => (
          <circle key={`${ci}-${i}`} cx={colX(ci)} cy={y} r={ci === 0 ? 5 : 6} fill={ci === 0 ? (withMass && i === inputs.length - 1 ? COL.ember : COL.sky) : ci === cols.length - 1 ? COL.kelp : "rgba(255,255,255,0.55)"} />
        ))
      )}
      {inputs.map((n, i) => (
        <text key={n} x={colX(0) - 12} y={cols[0][i] + 4} textAnchor="end" fontSize="11" fill={withMass && i === inputs.length - 1 ? COL.ember : "rgba(255,255,255,0.65)"}>{n}</text>
      ))}
      {Array.from({ length: hidden }, (_, h) => (
        <text key={h} x={colX(h + 1)} y={H - 4} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)">40 nodes, ReLU</text>
      ))}
      <text x={colX(hidden + 1)} y={H - 4} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)">sigmoid</text>
      <text x={colX(hidden + 1)} y={cols[hidden + 1][0] - 14} textAnchor="middle" fontSize="11" fill={COL.kelp}>P(signal)</text>
    </svg></div>
  );
}

function Confusion() {
  const { tn, fp, fn, tp } = N.nn1;
  const tot = tn + fp + fn + tp;
  const cells = [
    { k: "tn", label: "Background kept out", v: tn, row: tn + fp, good: true },
    { k: "fp", label: "Background let in", v: fp, row: tn + fp, good: false },
    { k: "fn", label: "Signal lost", v: fn, row: fn + tp, good: false },
    { k: "tp", label: "Signal found", v: tp, row: fn + tp, good: true },
  ];
  return (
    <div>
      <p className="text-xs text-white/45 mb-2">Held-out 30% of a balanced sample ({tot.toLocaleString()} events). Rows are the truth, columns the network&rsquo;s call.</p>
      <div className="grid grid-cols-2 gap-2 max-w-md">
        {cells.map((c) => (
          <div key={c.k} className="rounded-lg border p-3" style={{ borderColor: c.good ? "rgba(63,191,149,0.5)" : "rgba(255,107,61,0.45)", background: c.good ? "rgba(63,191,149,0.10)" : "rgba(255,107,61,0.08)" }}>
            <p className="text-[11px] text-white/55">{c.label}</p>
            <p className="font-mono text-xl text-white">{c.v.toLocaleString()}</p>
            <p className="font-mono text-xs text-white/55">{((c.v / c.row) * 100).toFixed(1)}% of its row</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/65">
        Accuracy {(((tn + tp) / tot) * 100).toFixed(1)}%, signal found {((tp / (fn + tp)) * 100).toFixed(1)}%, background rejected {((tn / (tn + fp)) * 100).toFixed(1)}%, area under the ROC curve {N.nn1.auc}.
      </p>
    </div>
  );
}

export default function NetLab() {
  const [which, setWhich] = useState<"1" | "2">("1");
  const withMass = which === "2";
  return (
    <Widget eyebrow="From the notebook's code and printed results" title="The network, and how it did">
      <div className="mb-4">
        <Seg value={which} onChange={setWhich} label="Which network" options={[["1", "Network 1: eight inputs"], ["2", "Network 2: adds the reconstructed mass"]]} />
      </div>
      <Architecture withMass={withMass} />
      <p className="mt-2 text-sm text-white/60 leading-relaxed">
        {withMass
          ? `Three hidden layers of 40 nodes, dropout 0.2, ${N.nn2.params.toLocaleString()} trainable parameters. Test accuracy ${(N.nn2.accuracy * 100).toFixed(1)}%.`
          : `Two hidden layers of 40 nodes, dropout 0.2, ${N.nn1.params.toLocaleString()} trainable parameters, trained with Adam on binary cross-entropy for 200 full-batch epochs.`}
        {" "}Each point stands for 40 nodes; only a few are drawn.
      </p>
      {!withMass && (
        <div className="mt-6">
          <Confusion />
        </div>
      )}
      {withMass && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70 leading-relaxed max-w-xl">
          Run on every event (signal plus all three backgrounds), this network passes {N.nn2.passEntries.toLocaleString()} of {N.nn2.ofEntries.toLocaleString()}, keeping {((N.nn2.sigW / N.signalWeighted) * 100).toFixed(1)}% of the weighted signal and {((N.nn2.bgW / N.backgroundWeighted) * 100).toFixed(1)}% of the weighted background.
        </div>
      )}
    </Widget>
  );
}
