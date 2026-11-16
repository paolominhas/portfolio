"use client";

import React, { useMemo, useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import LinePlot from "../dune-nd/plot";
import { COL, Seg, Slider, Widget } from "../daml/ui";
import { N } from "@/data/mini-cms";

/**
 * The notebook's Cherenkov formulas for water, swept over momentum:
 *   beta = p / sqrt(p^2 + m^2)     cos(theta) = 1 / (n beta)     p_threshold = m / sqrt(n^2 - 1)
 * Photon yield uses the notebook's N ~ sin^2(theta) = 1 - 1/(n^2 beta^2).
 */

const { n, mPion, mKaon } = N.cherenkov;
const beta = (p: number, m: number) => p / Math.sqrt(p * p + m * m);
const angle = (p: number, m: number) => {
  const c = 1 / (n * beta(p, m));
  return c <= 1 ? (Math.acos(c) * 180) / Math.PI : NaN;
};
const yieldRel = (p: number, m: number) => {
  const b = beta(p, m);
  const y = 1 - 1 / (n * n * b * b);
  return y > 0 ? y / (1 - 1 / (n * n)) : NaN;
};
const thr = (m: number) => m / Math.sqrt(n * n - 1);
const P_LO = 0.2, P_HI = 20; // the beam's momentum range in the macros

type View = "angle" | "diff" | "yield";

export default function CherenkovLab() {
  const [view, setView] = useState<View>("angle");
  const [logP, setLogP] = useState(Math.log10(1.85));
  const [res, setRes] = useState(1);
  const p = Math.pow(10, logP);

  const grid = useMemo(() => Array.from({ length: 241 }, (_, i) => Math.pow(10, Math.log10(0.1) + (i / 240) * (Math.log10(20) - Math.log10(0.1)))), []);
  const tPi = thr(mPion), tK = thr(mKaon);

  const pi = grid.map((q) => angle(q, mPion));
  const ka = grid.map((q) => angle(q, mKaon));
  const diff = grid.map((q, i) => (Number.isFinite(pi[i]) && Number.isFinite(ka[i]) ? pi[i] - ka[i] : NaN));
  const yp = grid.map((q) => yieldRel(q, mPion));
  const yk = grid.map((q) => yieldRel(q, mKaon));

  // the largest momentum at which the two angles still differ by at least `res` degrees
  const pStar = useMemo(() => {
    let best = NaN;
    for (let i = 0; i < grid.length; i++) if (Number.isFinite(diff[i]) && diff[i] >= res) best = grid[i];
    return best;
  }, [grid, diff, res]);
  const lo = Math.max(tK, P_LO);
  const hi = Number.isFinite(pStar) ? Math.min(pStar, P_HI) : lo;
  const shareAngle = Math.max(0, hi - lo) / (P_HI - P_LO);
  const shareDark = Math.max(0, tK - Math.max(tPi, P_LO)) / (P_HI - P_LO);

  const aPi = angle(p, mPion), aK = angle(p, mKaon);
  const f = (v: number, d = 1) => (Number.isFinite(v) ? v.toFixed(d) : "no light");

  const series =
    view === "angle"
      ? [{ x: grid, y: pi, color: COL.sky, label: "Pion (°)" }, { x: grid, y: ka, color: COL.gold, label: "Kaon (°)", dash: "6 4" }]
      : view === "diff"
      ? [{ x: grid, y: diff, color: COL.kelp, label: "Pion − kaon (°)", fill: true }]
      : [{ x: grid, y: yp, color: COL.sky, label: "Pion" }, { x: grid, y: yk, color: COL.gold, label: "Kaon", dash: "6 4" }];
  const yDom: [number, number] = view === "angle" ? [0, 50] : view === "diff" ? [0, 10] : [0, 1.05];
  const markers =
    view === "angle"
      ? [aPi, aK].map((a, i) => ({ x: p, y: a, color: i ? COL.gold : COL.sky, r: 5 })).filter((m) => Number.isFinite(m.y))
      : [];

  return (
    <Widget eyebrow="The notebook's formulas, live" title="Why a water RICH can't separate high-momentum kaons">
      <div className="max-w-[44rem] text-white/65 mb-6">
        <BlockMath math="\cos\theta_C = \frac{1}{n\,\beta},\qquad \beta = \frac{p}{\sqrt{p^2+m^2}},\qquad p_{\text{threshold}} = \frac{m}{\sqrt{n^2-1}}" />
        <p className="text-base leading-relaxed">
          With <InlineMath math="n = 1.33" /> the pion starts to radiate at {tPi.toFixed(2)} GeV and the kaon at {tK.toFixed(2)} GeV. Both angles then climb towards the same limit, <InlineMath math="\arccos(1/n) \approx 41.2^\circ" />, because at high momentum a pion and a kaon are both travelling at almost the speed of light.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-x-8 gap-y-4">
        <Seg<View> label="Show" value={view} onChange={setView} options={[["angle", "Cherenkov angle"], ["diff", "Pion − kaon difference"], ["yield", "Relative photon yield"]]} />
      </div>

      <LinePlot
        series={series}
        markers={markers}
        vlines={[{ x: tPi, label: "π on", color: COL.sky }, { x: tK, label: "K on", color: COL.gold }]}
        xDomain={[0.1, 20]}
        yDomain={yDom}
        xLog
        xLabel="Momentum (GeV/c)"
        yLabel={view === "angle" ? "Cherenkov angle (degrees)" : view === "diff" ? "θπ − θK (degrees)" : "sin²θ, relative to its maximum"}
        height={320}
        ariaLabel={view === "angle" ? "Cherenkov angle against momentum for pions and kaons in water" : view === "diff" ? "Difference between pion and kaon Cherenkov angles against momentum" : "Relative Cherenkov photon yield against momentum"}
        formatX={(v) => String(v)}
        formatY={(v) => v.toFixed(2)}
        xTicks={[0.1, 0.2, 0.5, 1, 2, 5, 10, 20]}
        legend
      />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Slider label="Momentum" value={logP} min={Math.log10(0.1)} max={Math.log10(20)} step={0.005} onChange={setLogP} format={() => `${p.toFixed(2)} GeV`} />
          <dl className="grid grid-cols-3 gap-3 text-sm">
            {[["Pion", `${f(aPi)}°`], ["Kaon", `${f(aK)}${Number.isFinite(aK) ? "°" : ""}`], ["Difference", Number.isFinite(aPi) && Number.isFinite(aK) ? `${(aPi - aK).toFixed(2)}°` : "n/a"]].map(([a, b]) => (
              <div key={a} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <dt className="text-xs text-white/45">{a}</dt>
                <dd className="font-mono text-white mt-1">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-4">
          <Slider label="Smallest angle difference the detector can resolve" value={res} min={0.1} max={5} step={0.1} onChange={setRes} format={(v) => `${v.toFixed(1)}°`} />
          <p className="text-sm text-white/65 leading-relaxed">
            Kaons and pions can be told apart by angle from {tK.toFixed(2)} GeV up to about <span className="font-mono text-white">{Number.isFinite(pStar) ? pStar.toFixed(1) : "–"} GeV</span>. If the beam is flat in momentum from {P_LO} to {P_HI} GeV, as the macros set it up, that window holds about <span className="font-mono text-white">{(shareAngle * 100).toFixed(0)}%</span> of the particles. Between {tPi.toFixed(2)} and {tK.toFixed(2)} GeV pions glow and kaons stay dark, another <span className="font-mono text-white">{(shareDark * 100).toFixed(1)}%</span>. The rest sits where the two rings are the same ring.
          </p>
        </div>
      </div>
    </Widget>
  );
}
