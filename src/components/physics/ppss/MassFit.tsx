"use client";

import { useMemo, useState } from "react";
import { Widget, Callout } from "./ui";
import { LC_MASS } from "@/data/ppss";
import { mulberry32 } from "@/lib/physics/toyBdt";

/**
 * Toy mass spectrum shaped like the fit in the notes (exponential background
 * plus a Lambda_c -> p pi pi bump, window 2150-2425 MeV/c^2 in 100 bins), with an
 * optional signal you can dial in. The points are random numbers, NOT the LHCb data.
 */

const X0 = 2150;
const X1 = 2425;
const NB = 100;
const BW = (X1 - X0) / NB;
const WIN = 15; // MeV/c^2, the +-15 window used in fit_lc2pemu.C

const W = 640;
const H = 300;
const pad = { l: 44, r: 12, t: 12, b: 36 };

const gaussPdf = (x: number, m: number, s: number) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));

/** Crystal Ball pdf (unnormalised numerically below). */
function cb(x: number, m: number, s: number, a: number, n: number) {
  const t = (x - m) / s;
  if (t > -a) return Math.exp(-0.5 * t * t);
  const A = Math.pow(n / a, n) * Math.exp(-0.5 * a * a);
  const B = n / a - a;
  return A * Math.pow(B - t, -n);
}

function sigShape(sigma: number) {
  // CB core (as in the macro) plus a small wide Gaussian, normalised on the fit range.
  const grid = Array.from({ length: 2000 }, (_, i) => X0 + ((i + 0.5) * (X1 - X0)) / 2000);
  const core = grid.map((x) => cb(x, LC_MASS, sigma, 1.5, 3));
  const cs = core.reduce((a, b) => a + b, 0) * ((X1 - X0) / 2000);
  return (x: number) => 0.9 * (cb(x, LC_MASS, sigma, 1.5, 3) / cs) + 0.1 * gaussPdf(x, LC_MASS - 50, 60);
}

function poissonInv(mu: number, u: number) {
  // inverse-CDF with a fixed uniform, so adding signal only ever adds events
  let k = 0;
  let p = Math.exp(-mu);
  let c = p;
  while (u > c && k < 400) {
    k++;
    p *= mu / k;
    c += p;
  }
  return k;
}

const bkgExp = (x: number) => 32 * Math.exp(-(x - X0) / 250);
const ppipi = (x: number) => 25 * Math.exp(-0.5 * ((x - 2265) / 9) ** 2);

export default function MassFit() {
  const [nSig, setNSig] = useState(0);
  const [sigma, setSigma] = useState(8);

  const rnd = useMemo(() => {
    const r = mulberry32(2025);
    return Array.from({ length: NB }, () => r());
  }, []);

  const model = useMemo(() => {
    const shape = sigShape(sigma);
    const xs = Array.from({ length: NB }, (_, i) => X0 + (i + 0.5) * BW);
    const b = xs.map((x) => bkgExp(x) + ppipi(x));
    const s = xs.map((x) => nSig * shape(x) * BW);
    const data = xs.map((_, i) => poissonInv(b[i] + s[i], rnd[i]));
    // numbers inside the +-15 window
    let sIn = 0;
    let bIn = 0;
    let dIn = 0;
    xs.forEach((x, i) => {
      if (Math.abs(x - LC_MASS) <= WIN) {
        sIn += s[i];
        bIn += b[i];
        dIn += data[i];
      }
    });
    const z = sIn > 0 && bIn > 0 ? Math.sqrt(2 * ((sIn + bIn) * Math.log(1 + sIn / bIn) - sIn)) : 0;
    return { xs, b, s, data, sIn, bIn, dIn, z };
  }, [nSig, sigma, rnd]);

  const ymax = Math.max(...model.data.map((d) => d + Math.sqrt(d + 1)), 10) * 1.08;
  const gx = (x: number) => pad.l + ((x - X0) / (X1 - X0)) * (W - pad.l - pad.r);
  const gy = (y: number) => H - pad.b - (y / ymax) * (H - pad.t - pad.b);
  const path = (v: number[]) => v.map((y, i) => `${gx(model.xs[i])},${gy(y)}`).join(" ");
  const total = model.b.map((b, i) => b + model.s[i]);

  const verdict =
    model.z >= 5
      ? "above 5σ: this would be a discovery"
      : model.z >= 3
        ? "between 3σ and 5σ: this would be called evidence"
        : "below 3σ: no significant signal, so you quote an upper limit";

  return (
    <Widget title="How big must a signal be to show up?">
      <p className="text-sm text-white/55 mb-4">
        A toy spectrum shaped like my fit: a smooth falling background plus a bump from Λc → pππ, which fakes a nearby peak. Dial in a signal at the Λc mass ({LC_MASS} MeV/c²). The points are random numbers, not LHCb data.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mb-4 text-sm text-white/70">
        <label className="flex items-center gap-3">
          <span className="w-36 shrink-0">Signal events <strong className="text-white">{nSig}</strong></span>
          <input type="range" min={0} max={150} value={nSig} onChange={(e) => setNSig(+e.target.value)} className="accent-[#FF6B3D] w-full" aria-label="Number of signal events" />
        </label>
        <label className="flex items-center gap-3">
          <span className="w-36 shrink-0">Resolution σ <strong className="text-white">{sigma} MeV</strong></span>
          <input type="range" min={5} max={12} step={0.5} value={sigma} onChange={(e) => setSigma(+e.target.value)} className="accent-[#FF6B3D] w-full" aria-label="Mass resolution" />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg bg-white border border-white/10" role="img" aria-label="Toy invariant-mass spectrum with fit components">
        <rect x={gx(LC_MASS - WIN)} y={pad.t} width={gx(LC_MASS + WIN) - gx(LC_MASS - WIN)} height={H - pad.t - pad.b} fill="#FF6B3D" opacity={0.12} />
        <g fontSize={10} fill="#444">
          <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="#999" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} stroke="#999" />
          {[2200, 2250, 2300, 2350, 2400].map((t) => (
            <g key={t}>
              <line x1={gx(t)} x2={gx(t)} y1={H - pad.b} y2={H - pad.b + 4} stroke="#999" />
              <text x={gx(t)} y={H - pad.b + 16} textAnchor="middle">{t}</text>
            </g>
          ))}
          <text x={(pad.l + W - pad.r) / 2} y={H - 4} textAnchor="middle">m(p e μ) [MeV/c²]</text>
          <text x={pad.l - 4} y={pad.t + 8} textAnchor="end">{Math.round(ymax)}</text>
          <text x={pad.l - 4} y={H - pad.b} textAnchor="end">0</text>
        </g>
        <polyline fill="none" stroke="#3b6fd6" strokeWidth={1.5} strokeDasharray="5 4" points={path(model.b)} />
        <polyline fill="none" stroke="#FF6B3D" strokeWidth={2} strokeDasharray="2 3" points={path(model.s)} />
        <polyline fill="none" stroke="#1d3fa8" strokeWidth={2.2} points={path(total)} />
        {model.data.map((d, i) => (
          <g key={i}>
            <line x1={gx(model.xs[i])} x2={gx(model.xs[i])} y1={gy(Math.max(0, d - Math.sqrt(d + 1)))} y2={gy(d + Math.sqrt(d + 1))} stroke="#111" strokeWidth={1} />
            <circle cx={gx(model.xs[i])} cy={gy(d)} r={2.4} fill="#111" />
          </g>
        ))}
      </svg>
      <p className="text-xs text-white/45 mt-2">
        Black: toy data. Solid blue: total. Dashed blue: background (exponential plus pππ). Orange dotted: signal. Shaded band: ±15 MeV/c² window around the Λc mass.
      </p>

      <div className="grid grid-cols-3 gap-3 mt-4 text-center" aria-live="polite">
        {[
          ["Signal in window", model.sIn.toFixed(0)],
          ["Background in window", model.bIn.toFixed(0)],
          ["Counting significance", `${model.z.toFixed(1)}σ`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-white/10 p-2 sm:p-3 min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-normal sm:tracking-wider text-white/40 break-words">{k}</div>
            <div className="font-bodoni text-2xl text-white">{v}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-white/70">Significance is {verdict}.</p>
      <Callout title="Why the thresholds matter">
        <p>
          My notes sort outcomes by significance: above 5σ a signal is present and you measure its rate; 3σ to 5σ is &lsquo;evidence&rsquo;; below 3σ you provide an upper limit. The significance here is a simple counting estimate inside the window, not the full likelihood fit used in the real analysis.
        </p>
      </Callout>
    </Widget>
  );
}
