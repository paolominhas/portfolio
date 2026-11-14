"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "./plot";
import { btn, Callout, COL, Seg, Slider, Widget } from "./ui";
import { makeEngine, stdParams } from "@/lib/physics/neutrinoOsc";

const L_KM = 1300; // the report's baseline
const RHO = 2.848; // g/cm³, the constant-density value used for the DUNE baseline in my GLoBES project
const E0 = 0.3, E1 = 8.5, NT = 850; // true-energy grid
const R0 = 0.5, R1 = 6, NR = 276; // reconstructed-energy grid

function appearance(dcp: number, anti: boolean, ord: "NO" | "IO") {
  const eng = makeEngine(stdParams(dcp, ord), null);
  const y = new Float64Array(NT + 1);
  for (let i = 0; i <= NT; i++) y[i] = eng.probs(E0 + ((E1 - E0) * i) / NT, L_KM, RHO, anti)[1 * 3 + 0];
  return y;
}

/** Observed probability per reconstructed-energy bin: P folded with a Gaussian response, divided by the same fold of "1" so only the shape matters. */
function fold(P: Float64Array, res: number, bias: number) {
  const out = new Float64Array(NR + 1);
  for (let j = 0; j <= NR; j++) {
    const er = R0 + ((R1 - R0) * j) / NR;
    let num = 0, den = 0;
    for (let i = 0; i <= NT; i++) {
      const e = E0 + ((E1 - E0) * i) / NT;
      const mu = e * (1 + bias);
      const sg = Math.max(1e-4, res * mu);
      const z = (er - mu) / sg;
      if (z > 5 || z < -5) continue;
      const w = Math.exp(-0.5 * z * z) / sg;
      num += w * P[i];
      den += w;
    }
    out[j] = den > 0 ? num / den : 0;
  }
  return out;
}

const Er = Array.from({ length: NR + 1 }, (_, j) => R0 + ((R1 - R0) * j) / NR);
const near = (e: number) => Math.max(0, Math.min(NR, Math.round(((e - R0) / (R1 - R0)) * NR)));

function peak(y: ArrayLike<number>, lo: number, hi: number) {
  let b = near(lo);
  for (let j = near(lo); j <= near(hi); j++) if (y[j] > y[b]) b = j;
  return { E: Er[b], P: y[b], j: b };
}

export default function OscResolution() {
  const [anti, setAnti] = useState(false);
  const [ord, setOrd] = useState<"NO" | "IO">("NO");
  const [res, setRes] = useState(0.15);
  const [bias, setBias] = useState(0);
  const [dcp, setDcp] = useState(0);

  const raw = useMemo(
    () => ({ a: appearance(270, anti, ord), b: appearance(90, anti, ord), c: appearance(dcp, anti, ord) }),
    [anti, ord, dcp]
  );
  const ideal = useMemo(() => ({ a: fold(raw.a, 0.002, 0), b: fold(raw.b, 0.002, 0), c: fold(raw.c, 0.002, 0) }), [raw]);
  const seen = useMemo(() => ({ a: fold(raw.a, Math.max(res, 0.002), bias), b: fold(raw.b, Math.max(res, 0.002), bias), c: fold(raw.c, Math.max(res, 0.002), bias) }), [raw, res, bias]);

  // where the two maxima are (for the −90° curve with no smearing), then the ±90° gap at those energies
  const p1 = peak(ideal.a, 1.8, 3.4);
  const p2 = peak(ideal.a, 0.6, 1.15);
  const gap = (y: { a: Float64Array; b: Float64Array }, lo: number, hi: number) => {
    let m = 0;
    for (let j = near(lo); j <= near(hi); j++) m = Math.max(m, Math.abs(y.a[j] - y.b[j]));
    return m;
  };
  const W1: [number, number] = [1.8, 3.4], W2: [number, number] = [0.6, 1.15];
  const g1i = gap(ideal, ...W1), g2i = gap(ideal, ...W2);
  const g1s = gap(seen, ...W1), g2s = gap(seen, ...W2);
  // how far the blur or shift moves the −90° curve itself, against the whole −90°/+90° gap
  const change = (lo: number, hi: number) => {
    let m = 0;
    for (let j = near(lo); j <= near(hi); j++) m = Math.max(m, Math.abs(seen.a[j] - ideal.a[j]));
    return m;
  };
  const c1 = g1i > 0 ? change(...W1) / g1i : 0, c2 = g2i > 0 ? change(...W2) / g2i : 0;
  const ymax = Math.max(...seen.a, ...seen.b, ...seen.c, ...ideal.a, ...ideal.b) * 1.12;
  const nm = anti ? "ν̄μ → ν̄e" : "νμ → νe";

  return (
    <Widget eyebrow="Interactive · live oscillation engine" title="Why DUNE needs the energy right">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        This is the far-detector appearance probability, computed live (three flavours, constant-density matter, 1,300 km), as a detector with a blurred or shifted energy scale would see it. The solid curves are what survives; the faint dashed curves are what a perfect detector would see. The question is how much of the gap between δCP = −90° and +90° is left.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        <button className={btn} onClick={() => { setRes(0.002); setBias(0); }}>Perfect detector</button>
        <button className={btn} onClick={() => { setRes(0.15); setBias(0); }}>15% resolution</button>
        <button className={btn} onClick={() => { setRes(0.3); setBias(0); }}>30% resolution</button>
        <button className={btn} onClick={() => { setRes(0.05); setBias(-0.1); }}>5% resolution, energies 10% low</button>
      </div>
      <div className="grid lg:grid-cols-[18rem_1fr] gap-8">
        <div className="space-y-5">
          <Seg label="Beam" value={anti ? "a" : "n"} onChange={(v) => setAnti(v === "a")} options={[["n", "Neutrinos (FHC)"], ["a", "Antineutrinos (RHC)"]]} />
          <Seg label="Mass ordering" value={ord} onChange={setOrd} options={[["NO", "Normal"], ["IO", "Inverted"]]} />
          <Slider label="Energy resolution (σ / E)" value={res} min={0} max={0.4} step={0.01} onChange={setRes} format={(v) => (v < 0.005 ? "perfect" : `${(v * 100).toFixed(0)}%`)} />
          <Slider label="Energy scale error" value={bias} min={-0.2} max={0.2} step={0.01} onChange={setBias} format={(v) => `${v > 0 ? "+" : ""}${(v * 100).toFixed(0)}%`} hint="Negative: reconstructed energies come out low, as the report finds." />
          <Slider label="Third curve: δCP" value={dcp} min={0} max={360} step={15} onChange={setDcp} format={(v) => `${v}°`} />
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm space-y-3">
            <p className="text-xs uppercase tracking-wider text-white/40">Largest gap between δCP = −90° and +90°, kept</p>
            <GapRow name={`Around the first maximum (${W1[0]}–${W1[1]} GeV)`} before={g1i} after={g1s} />
            <GapRow name={`Around the second maximum (${W2[0]}–${W2[1]} GeV)`} before={g2i} after={g2s} />
            <div className="border-t border-white/10 pt-3 space-y-2">
              <p className="text-xs uppercase tracking-wider text-white/40">Change to the −90° curve itself</p>
              <ShiftRow name="First maximum region" v={c1} />
              <ShiftRow name="Second maximum region" v={c2} />
              <p className="text-[11px] text-white/35">Measured against that region’s full −90° to +90° gap: at 100% the blur or shift moves the curve as far as a change of δCP would.</p>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-white/70 mb-2">
            <strong className="text-white">P({nm})</strong> seen in reconstructed energy · {ord === "NO" ? "normal" : "inverted"} ordering
          </p>
          <LinePlot
            ariaLabel={`Appearance probability ${nm} against reconstructed energy for three values of delta CP, with and without detector smearing`}
            series={[
              { x: Er, y: Array.from(ideal.a), color: COL.ember, dash: "4 4", width: 1, label: undefined },
              { x: Er, y: Array.from(ideal.b), color: COL.sky, dash: "4 4", width: 1, label: undefined },
              { x: Er, y: Array.from(seen.c), color: COL.grey, width: 1.4, label: `δCP = ${dcp}°` },
              { x: Er, y: Array.from(seen.a), color: COL.ember, width: 2.2, label: "δCP = −90° (270°)" },
              { x: Er, y: Array.from(seen.b), color: COL.sky, width: 2.2, label: "δCP = +90°" },
            ]}
            vlines={[
              { x: p1.E, color: "rgba(255,255,255,0.25)" },
              { x: p2.E, color: "rgba(255,255,255,0.25)" },
            ]}
            xDomain={[R0, R1]}
            yDomain={[0, ymax]}
            xLabel="reconstructed neutrino energy (GeV)"
            yLabel="probability"
            height={340}
          />
          <p className="text-[11px] text-white/40 mt-2">
            Illustration: the true-energy flux is taken as flat, the response as a Gaussian, and no cross-section or efficiency is applied. A real analysis weights each energy by the flux and cross-section and uses the full smearing matrix, which is not Gaussian (that is what the near detector is for). Vertical lines mark the two oscillation maxima of the −90° curve.
          </p>
        </div>
      </div>
      <Callout title="Read it like this">
        <p>
          The first maximum is wide, so blurring costs little of the gap between δCP = −90° and +90°. The second is narrow and washes out quickly. An energy scale that is wrong does something different: it keeps the gap but moves the pattern, and a 10% error (with 5% resolution) shifts the −90° curve by roughly a third of that gap near the first maximum and two thirds near the second, as far as a large change in δCP would. The report’s own Figure 3 caption makes the same point: δCP shows up more strongly at lower energies, which is where the energy resolution is worth most.
        </p>
      </Callout>
    </Widget>
  );
}

function ShiftRow({ name, v }: { name: string; v: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs text-white/65">
        <span>{name}</span>
        <span className="font-mono text-[var(--accent)]">{(v * 100).toFixed(0)}% of the gap</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-[#7FB7FF]" style={{ width: `${Math.min(1, v) * 100}%` }} />
      </div>
    </div>
  );
}

function GapRow({ name, before, after }: { name: string; before: number; after: number }) {
  const keep = before > 0 ? Math.max(0, Math.min(1, after / before)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs text-white/65">
        <span>{name}</span>
        <span className="font-mono text-[var(--accent)]">
          {after.toFixed(3)} <span className="text-white/35">of {before.toFixed(3)}</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-[var(--accent)]" style={{ width: `${keep * 100}%` }} />
      </div>
      <p className="text-[11px] text-white/35 mt-0.5">{(keep * 100).toFixed(0)}% of the separation survives</p>
    </div>
  );
}
