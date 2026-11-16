"use client";

import React, { useMemo, useState } from "react";
import { Seg, Widget, COL, mulberry32 } from "../daml/ui";
import { N } from "@/data/exotic-search";

/**
 * 1,500 events, drawn as a grid. Each selection keeps some signal and some
 * background; the share of signal is the weighted signal / (signal + background)
 * from the notebook's printed sums. Which cells are "signal" is a fixed seeded
 * pick (nested, so the same ones stay marked as the selection tightens), so this
 * shows the proportion, not real events.
 */

const COLS = 50, ROWS = 30, TOTAL = COLS * ROWS;

type Sel = "none" | "cuts" | "net";
const SEL: Record<Sel, { label: string; sig: number; bg: number; blurb: string }> = {
  none: { label: "No selection", sig: N.signalWeighted, bg: N.backgroundWeighted, blurb: "Everything in the three background samples and the signal sample, weighted by the event weights." },
  cuts: { label: "Square cuts", sig: N.cuts.sigW, bg: N.cuts.bgW, blurb: "The five cuts chosen by eye. They keep 61% of the signal and remove 76% of the background." },
  net: { label: "Network that sees the mass", sig: N.nn2.sigW, bg: N.nn2.bgW, blurb: "The second network keeps 94% of the signal and 7.5% of the background. Section 6 explains why that is a warning, not a win." },
};

export default function Haystack() {
  const [sel, setSel] = useState<Sel>("none");
  const [reveal, setReveal] = useState(false);
  const order = useMemo(() => {
    const r = mulberry32(2718);
    const idx = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  }, []);

  const s = SEL[sel];
  const frac = s.sig / (s.sig + s.bg);
  const oneIn = Math.round(1 / frac);
  const nSig = Math.max(1, Math.round(frac * TOTAL));
  const sigSet = useMemo(() => new Set(order.slice(0, nSig)), [order, nSig]);

  const cell = 12, pad = 14;
  return (
    <Widget eyebrow="Real proportions" title="One signal event in how many?">
      <div className="mb-5 flex flex-wrap items-end gap-x-8 gap-y-3">
        <Seg<Sel> label="Keep only the events that pass" value={sel} onChange={setSel} options={[["none", SEL.none.label], ["cuts", SEL.cuts.label], ["net", SEL.net.label]]} />
        <button
          type="button"
          aria-pressed={reveal}
          onClick={() => setReveal((v) => !v)}
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${reveal ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/75 hover:bg-white/10"}`}
        >
          {reveal ? "Hide the signal" : "Reveal the signal"}
        </button>
      </div>
      <svg viewBox={`0 0 ${COLS * cell + pad * 2} ${ROWS * cell + pad * 2}`} role="img" aria-label={`A grid of ${TOTAL} events of which ${nSig} ${nSig === 1 ? "is" : "are"} signal`} className="w-full h-auto rounded-lg bg-white/[0.02]">
        {Array.from({ length: TOTAL }, (_, i) => {
          const x = pad + (i % COLS) * cell, y = pad + Math.floor(i / COLS) * cell;
          const isSig = sigSet.has(i);
          const show = reveal && isSig;
          return (
            <g key={i}>
              <rect x={x + 1} y={y + 1} width={cell - 2.4} height={cell - 2.4} rx="1.6" fill={show ? COL.ember : "rgba(255,255,255,0.2)"} />
              {show && <circle cx={x + cell / 2} cy={y + cell / 2} r={cell * 1.05} fill="none" stroke={COL.ember} strokeWidth="1.4" />}
            </g>
          );
        })}
      </svg>
      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <p className="text-white/70 text-base leading-relaxed">
          <span className="font-mono text-2xl text-white mr-2">1 in {oneIn.toLocaleString()}</span> events is signal. The grid shows {TOTAL.toLocaleString()} events, so about {nSig} {nSig === 1 ? "is" : "are"} signal. {s.blurb}
        </p>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          {[["Signal kept", s.sig.toFixed(0)], ["Background kept", Math.round(s.bg).toLocaleString()], ["S / B", (s.sig / s.bg).toFixed(4)]].map(([a, b]) => (
            <div key={a} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <dt className="text-xs text-white/45">{a}</dt>
              <dd className="font-mono text-white mt-1 break-words">{b}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-3 text-xs text-white/40">Weighted event counts from the notebook. Which cells are signal is a fixed random pick: the picture shows the proportion, not real events.</p>
    </Widget>
  );
}
