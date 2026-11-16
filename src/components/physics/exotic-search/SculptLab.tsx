"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "../dune-nd/plot";
import { COL, Slider, Widget } from "../daml/ui";
import { N } from "@/data/exotic-search";

/**
 * MASS SCULPTING: A TOY BUILT ON ONE REAL THING
 * The background curve is the cubic the notebook fitted to the square-cut background
 * between 0.7 and 2.0 TeV (its real parameters, mass in MeV). Everything else is an
 * illustration: a "classifier" that keeps each background event with a probability
 * that rises near 1 TeV, scaled so the total kept is always 10%. There is NO signal
 * anywhere in the sample. The fit is the notebook's idea (a cubic plus a Gaussian of
 * fixed position and width), done by weighted least squares on the expected counts
 * (no random noise), with sigma_i = sqrt(N_i).
 */

const [c0, c1, c2, c3] = N.h0Cubic;
const NB = 40, LO = 0.7, HI = 2.0; // TeV
const EDGES = Array.from({ length: NB + 1 }, (_, i) => LO + ((HI - LO) * i) / NB);
const CENTRES = EDGES.slice(0, -1).map((e, i) => (e + EDGES[i + 1]) / 2);
const bg = (m: number) => {
  const x = m * 1e6;
  return Math.max(0, c0 + c1 * x + c2 * x * x + c3 * x * x * x);
};
const G = (m: number) => Math.exp(-0.5 * ((m - 1.0) / 0.08) ** 2);
const KEEP = 0.1;

function solve(A: number[][], y: number[]) {
  const n = y.length;
  const M = A.map((r, i) => [...r, y[i]]);
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
    [M[i], M[p]] = [M[p], M[i]];
    for (let r = i + 1; r < n; r++) {
      const f = M[r][i] / M[i][i];
      for (let k = i; k <= n; k++) M[r][k] -= f * M[i][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let k = i + 1; k < n; k++) s -= M[i][k] * x[k];
    x[i] = s / M[i][i];
  }
  return x;
}
function wls(basis: ((m: number) => number)[], y: number[], sig: number[]) {
  const k = basis.length;
  const X = CENTRES.map((m) => basis.map((f) => f(m)));
  const A = Array.from({ length: k }, (_, a) => Array.from({ length: k }, (_, b) => X.reduce((s, r, i) => s + (r[a] * r[b]) / (sig[i] * sig[i]), 0)));
  const v = Array.from({ length: k }, (_, a) => X.reduce((s, r, i) => s + (r[a] * y[i]) / (sig[i] * sig[i]), 0));
  const beta = solve(A, v);
  const fit = X.map((r) => r.reduce((s, x, j) => s + x * beta[j], 0));
  const chi2 = fit.reduce((s, f, i) => s + ((y[i] - f) / sig[i]) ** 2, 0);
  return { beta, fit, chi2 };
}
const t = (m: number) => (m - 1.35) / 0.65;
const CUBIC = [() => 1, (m: number) => t(m), (m: number) => t(m) ** 2, (m: number) => t(m) ** 3];

export default function SculptLab() {
  const [w, setW] = useState(0.4);
  const a = 1.2 * w; // peak boost of the selection probability at 1 TeV

  const r = useMemo(() => {
    const raw = CENTRES.map((m) => bg(m) * (1 + a * G(m)));
    const base = CENTRES.map((m) => bg(m));
    const norm = base.reduce((s, v) => s + v, 0) / raw.reduce((s, v) => s + v, 0);
    const y = raw.map((v) => v * norm * KEEP);
    const sig = y.map((v) => Math.sqrt(Math.max(v, 1)));
    const h0 = wls(CUBIC, y, sig);
    const h1 = wls([...CUBIC, G], y, sig);
    const dchi = Math.max(0, h0.chi2 - h1.chi2);
    const resid = y.map((v, i) => (v - h0.fit[i]) / sig[i]);
    return { y, h0: h0.fit, h1: h1.fit, chi0: h0.chi2, chi1: h1.chi2, dchi, amp: h1.beta[4], resid };
  }, [a]);

  const ymax = Math.ceil((Math.max(...r.y) * 1.12) / 500) * 500;
  const sigma = Math.sqrt(r.dchi);
  const rmax = Math.max(4, Math.ceil(Math.max(...r.resid.map(Math.abs))));
  const stepY = [...r.y, r.y[r.y.length - 1]];
  const stepR = [...r.resid, r.resid[r.resid.length - 1]];

  return (
    <Widget eyebrow="A toy with one real ingredient" title="Build a signal out of nothing">
      <p className="max-w-[44rem] text-white/65 text-base leading-relaxed mb-6">
        This sample contains <strong className="text-white/85">no signal at all</strong>. The background curve is the cubic the notebook fitted to the square-cut background; the selection is a stand-in for a classifier that has been shown the mass and likes events near 1 TeV. Turn up how much it leans on the mass, and fit the result the way the notebook did.
      </p>
      <div className="max-w-xl mb-5">
        <Slider label="How much the classifier leans on the mass" value={w} min={0} max={1} step={0.01} onChange={setW} format={(v) => (v === 0 ? "not at all" : `${Math.round(v * 100)}%`)} hint="At 0% it ignores the mass and the background keeps its smooth shape." />
      </div>
      <LinePlot
        series={[
          { x: EDGES, y: stepY, color: "rgba(255,255,255,0.55)", step: true, fill: true, label: "Selected background" },
          { x: CENTRES, y: r.h0, color: COL.sky, width: 2.2, label: "Cubic fit (no signal)" },
        ]}
        vlines={[{ x: 1.0, label: "1 TeV", color: COL.ember }]}
        xDomain={[LO, HI]}
        yDomain={[0, ymax]}
        xLabel="Reconstructed mass (TeV)"
        yLabel="Events kept"
        height={300}
        ariaLabel="Histogram of selected background events against reconstructed mass with a cubic fit; a bump near 1 TeV appears as the classifier leans on the mass"
        formatX={(v) => v.toFixed(1)}
        formatY={(v) => String(Math.round(v))}
        xTicks={[0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0]}
        legend
      />
      <LinePlot
        series={[{ x: EDGES, y: stepR, color: COL.gold, step: true, width: 2, label: "(data − fit) / error" }]}
        xDomain={[LO, HI]}
        yDomain={[-rmax, rmax]}
        xLabel="Reconstructed mass (TeV)"
        yLabel="Pull"
        height={150}
        ariaLabel="Residuals of the cubic fit in units of the statistical error"
        formatX={(v) => v.toFixed(1)}
        formatY={(v) => v.toFixed(1)}
        xTicks={[0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0]}
        legend={false}
        interactive={false}
      />
      <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm max-w-2xl">
        {[
          ["Real signal events", "0"],
          ["Fitted signal amplitude", `${r.amp >= 0 ? "+" : "−"}${Math.abs(r.amp).toFixed(0)} events`],
          ["Δχ² against no signal", r.dchi.toFixed(1)],
          ["Apparent significance", `${sigma.toFixed(1)} σ`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <dt className="text-xs text-white/45">{k}</dt>
            <dd className="font-mono text-white mt-1">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-white/45 max-w-[44rem]">Toy: expected counts, no random fluctuations; 10% of the background is kept at every setting; the bump is a Gaussian of width 0.08 TeV, and the fit uses a Gaussian of the same position and width. Only the background curve is real data.</p>
    </Widget>
  );
}
