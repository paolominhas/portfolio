"use client";

import React, { useState } from "react";
import { Slider, Widget, COL } from "../daml/ui";
import { N } from "@/data/exotic-search";

/**
 * The notebook's significance recipe: sigma = sqrt(delta chi2), with the one-sided
 * p-value for one extra parameter, p = erfc(sqrt(delta chi2 / 2)). The two results
 * are the notebook's printed chi-squared values. ndf is 40 bins minus the fitted
 * parameters (4 for H0, 5 for H1), so the chi2/ndf values are arithmetic on those.
 */

/** Complementary error function, accurate into the far tail (series below 2, continued fraction above). */
export function erfc(x: number): number {
  if (x < 0) return 2 - erfc(-x);
  if (x < 2) {
    let sum = x, term = x;
    for (let n = 1; n < 80; n++) {
      term *= (-x * x) / n;
      sum += term / (2 * n + 1);
    }
    return 1 - (2 / Math.sqrt(Math.PI)) * sum;
  }
  let f = 0;
  for (let k = 60; k >= 1; k--) f = (k / 2) / (x + f);
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / (x + f);
}
const pOf = (d: number) => erfc(Math.sqrt(d / 2));
const sci = (p: number) => {
  if (p >= 0.001) return p.toFixed(3);
  const e = Math.floor(Math.log10(p));
  return `${(p / Math.pow(10, e)).toFixed(2)}×10${String(e).replace("-", "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d])}`;
};

export default function SigMeter() {
  const { square, nn, ndfH0, ndfH1 } = N.fits;
  const [ld, setLd] = useState(Math.log10(square.dchi2));
  const d = Math.pow(10, ld);
  const sigma = Math.sqrt(d);
  const lo = -0.5, hi = 2.5; // log10 range of delta chi2: 0.3 to 316
  const pos = (v: number) => `${((Math.log10(v) - lo) / (hi - lo)) * 100}%`;

  const bars = [
    { label: "Square cuts, background only (H0)", v: square.chi2H0 / ndfH0, c: "rgba(255,255,255,0.45)" },
    { label: "Square cuts, with a signal term (H1)", v: square.chi2H1 / ndfH1, c: COL.sky },
    { label: "After the network, background only (H0)", v: nn.chi2H0 / ndfH0, c: "rgba(255,255,255,0.45)" },
    { label: "After the network, with a signal term (H1)", v: nn.chi2H1 / ndfH1, c: COL.sky },
  ];
  const maxBar = 20;

  return (
    <Widget eyebrow="The notebook's recipe, live" title="How many sigma, and for what?">
      <div className="max-w-xl">
        <Slider label="Improvement in χ² when a signal term is added (Δχ²)" value={ld} min={lo} max={hi} step={0.005} onChange={setLd} format={() => d.toFixed(d < 10 ? 2 : 1)} />
      </div>
      <div className="relative mt-3 h-[3.75rem] max-w-xl" aria-hidden>
        <div className="absolute inset-x-0 top-6 h-px bg-white/30" />
        {([[square.dchi2, `Square cuts ${square.sigma}σ`, COL.ember, false], [nn.dchi2, `Network ${nn.sigma}σ`, COL.kelp, false], [25, "5σ bar", "rgba(255,255,255,0.7)", true]] as [number, string, string, boolean][]).map(([v, t, c, below]) => (
          <div key={t} className="absolute -translate-x-1/2 text-center" style={{ left: pos(v), top: 0 }}>
            {!below && <div className="text-[11px] whitespace-nowrap" style={{ color: c }}>{t}</div>}
            <div className="mx-auto h-5 w-px" style={{ background: c, marginTop: below ? 16 : 4 }} />
            {below && <div className="text-[11px] whitespace-nowrap" style={{ color: c }}>{t}</div>}
          </div>
        ))}
        <div className="absolute top-[18px] h-3 w-3 -translate-x-1/2 rounded-full bg-white" style={{ left: pos(d) }} />
      </div>
      <dl className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl text-sm">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><dt className="text-xs text-white/45">Significance √Δχ²</dt><dd className="font-mono text-white mt-1">{sigma.toFixed(2)} σ</dd></div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><dt className="text-xs text-white/45">p-value, one extra parameter</dt><dd className="font-mono text-white mt-1">{sci(pOf(d))}</dd></div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 col-span-2 sm:col-span-1"><dt className="text-xs text-white/45">Particle-physics discovery bar</dt><dd className="font-mono text-white mt-1">5 σ, Δχ² = 25</dd></div>
      </dl>

      <h4 className="mt-9 mb-1 font-bodoni text-xl text-white">But is the background model any good?</h4>
      <p className="text-sm text-white/60 mb-4 max-w-[44rem]">χ² divided by the number of degrees of freedom is about 1 for a fit that describes the data. Bars longer than the line are fits that do not.</p>
      <div className="grid gap-3 max-w-2xl">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex items-baseline justify-between text-sm text-white/75"><span>{b.label}</span><span className="font-mono text-white">{b.v.toFixed(1)}</span></div>
            <div className="relative mt-1 h-4 rounded bg-white/[0.05]" role="img" aria-label={`${b.label}: chi-squared per degree of freedom ${b.v.toFixed(1)}`}>
              <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${Math.min(100, (b.v / maxBar) * 100)}%`, background: b.c }} />
              <div className="absolute inset-y-[-3px] w-px bg-white/80" style={{ left: `${(1 / maxBar) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/45 max-w-[44rem]">Fits over 0.7 to 2.0 TeV in 40 bins: 36 degrees of freedom for the cubic background, 35 with the signal term. The white tick is χ²/ndf = 1. A large Δχ² only says that the signal term fits better than nothing; it says nothing about whether &ldquo;nothing&rdquo; was a fair description to begin with.</p>
    </Widget>
  );
}
