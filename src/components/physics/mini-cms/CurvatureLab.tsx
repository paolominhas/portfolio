"use client";

import React, { useMemo, useState } from "react";
import { InlineMath } from "react-katex";
import { Seg, Slider, Widget, COL } from "../daml/ui";
import { EVENT6, N } from "@/data/mini-cms";

/**
 * The notebook's own momentum formulas, run live. The two presets are real track
 * pairs from the first run; the readout shows what the formulas give next to what
 * the notebook recorded. Equal-aspect plot in metres.
 *
 *   sagitta = sin(dphi) * r1       R = r2^2 / (8 sagitta)       pT = 0.3 B R       p = pT / sin(theta)
 */

const { r1, r2, k } = N.geometry;

export default function CurvatureLab() {
  const [logP, setLogP] = useState(Math.log10(45.466));
  const [thetaDeg, setThetaDeg] = useState(93.3);
  const [B, setB] = useState(N.geometry.B);
  const [preset, setPreset] = useState<"free" | "0" | "1">("0");

  const p = Math.pow(10, logP);
  const th = (thetaDeg * Math.PI) / 180;
  const pT = p * Math.sin(th);
  const R = pT / (k * B);
  const reach = 2 * R;
  const reachesOuter = reach >= r2;
  // From the notebook: sin(dphi) = r2^2 / (8 R r1)
  const s = r2 * r2 / (8 * R);
  const sinDphi = s / r1;
  const dphi = reachesOuter && sinDphi <= 1 ? Math.asin(sinDphi) : NaN;
  const pMinOuter = (k * B * r2) / 2; // pT needed to reach r2

  const choose = (v: "free" | "0" | "1") => {
    setPreset(v);
    if (v === "free") return;
    const e = EVENT6[Number(v)];
    setLogP(Math.log10(e.pReco));
    setThetaDeg((e.theta * 180) / Math.PI);
    setB(N.geometry.B);
  };
  const ev = preset === "free" ? null : EVENT6[Number(preset)];

  // geometry for the picture: initial direction +x, bending towards +y
  const path = useMemo(() => {
    const rEnd = Math.min(reach - 0.01, 9.2);
    let d = "";
    for (let r = 0.1; r <= rEnd; r += 0.1) {
      const a = Math.asin(Math.min(1, r / (2 * R)));
      d += `${d ? "L" : "M"}${(r * Math.cos(a)).toFixed(3)} ${(-r * Math.sin(a)).toFixed(3)}`;
    }
    return d;
  }, [R, reach]);
  const hit = (r: number): [number, number] | null => {
    if (reach < r) return null;
    const a = Math.asin(r / (2 * R));
    return [r * Math.cos(a), -r * Math.sin(a)];
  };
  const h1 = hit(r1), h2 = hit(r2);
  const circ = (r: number) => `M${-r} 0a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

  return (
    <Widget title="Bend a track, read the momentum">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] items-start">
        <div className="min-w-0">
          <svg viewBox="-1 -9.3 10.6 10.3" role="img" aria-label="Plan view, to scale in metres: a charged track leaving the centre and bending in the magnetic field, crossing two tracker circles at 4 m and 8 m" className="w-full h-auto max-w-[24rem] mx-auto block rounded-lg bg-white/[0.02]">
            <path d={circ(r1)} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.04" strokeDasharray="0.15 0.15" />
            <path d={circ(r2)} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.04" strokeDasharray="0.15 0.15" />
            <line x1="0" y1="0" x2="9.2" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.03" strokeDasharray="0.12 0.12" />
            <path d={path} fill="none" stroke={COL.ember} strokeWidth="0.07" strokeLinecap="round" />
            {h1 && <circle cx={h1[0]} cy={h1[1]} r="0.13" fill={COL.sky} />}
            {h2 && <circle cx={h2[0]} cy={h2[1]} r="0.13" fill={COL.sky} />}
            <circle cx="0" cy="0" r="0.12" fill="#fff" />
            <text x="0.2" y="0.8" fontSize="0.42" fill="rgba(255,255,255,0.5)">tracker 1: 4 m</text>
            <text x="4.4" y="-8.3" fontSize="0.42" fill="rgba(255,255,255,0.5)">tracker 2: 8 m</text>
          </svg>
          <p className="mt-2 text-xs text-white/45 text-center">Plan view, drawn to scale. The dashed line is where the track would go with no field.</p>
        </div>

        <div className="min-w-0 space-y-5">
          <Seg
            label="Start from"
            value={preset}
            onChange={choose}
            options={[["0", "Real track, event 6, pair 1"], ["1", "Real track, event 6, pair 2"], ["free", "My own numbers"]]}
          />
          <div className="grid gap-4">
            <Slider label="Momentum" value={logP} min={Math.log10(0.5)} max={Math.log10(60)} step={0.005} onChange={(v) => { setLogP(v); setPreset("free"); }} format={() => `${p.toFixed(p < 10 ? 2 : 1)} GeV`} />
            <Slider label="Polar angle θ" value={thetaDeg} min={30} max={150} step={0.1} onChange={(v) => { setThetaDeg(v); setPreset("free"); }} format={(v) => `${v.toFixed(1)}°`} />
            <Slider label="Field B" value={B} min={0.5} max={4} step={0.1} onChange={(v) => { setB(v); setPreset("free"); }} format={(v) => `${v.toFixed(1)} T`} hint="The simulation used 2 T." />
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              ["Transverse momentum", `${pT.toFixed(2)} GeV`],
              ["Bending radius", `${R.toFixed(1)} m`],
              ["Sagitta at 8 m", reachesOuter ? `${(s * 100).toFixed(1)} cm` : "not reached"],
              ["Hit-to-hit angle Δφ", Number.isFinite(dphi) ? `${(dphi * 1000).toFixed(2)} mrad` : "not reached"],
            ].map(([a, b]) => (
              <div key={a} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <dt className="text-xs text-white/45">{a}</dt>
                <dd className="font-mono text-white mt-1">{b}</dd>
              </div>
            ))}
          </dl>

          {ev && (
            <div className="rounded-xl border border-[#2F9E7C]/50 bg-[#2F9E7C]/[0.07] p-4 text-sm text-white/75 leading-relaxed">
              <p className="font-mono text-xs text-[#5FD0A8] mb-1">Against the notebook</p>
              <p>
                The notebook recorded φ₁ = {ev.phi1}, φ₂ = {ev.phi2}, θ = {ev.theta}, so Δφ = {Math.abs(ev.phi1 - ev.phi2).toFixed(5)} rad; the formula above gives {Number.isFinite(dphi) ? dphi.toFixed(5) : "n/a"} rad from the reconstructed {ev.pReco.toFixed(3)} GeV. The reconstructed momentum is {ev.pReco.toFixed(3)} GeV against a true {ev.pTruth.toFixed(4)} GeV, a difference of {(((ev.pReco - ev.pTruth) / ev.pTruth) * 100).toFixed(2)}%.
              </p>
            </div>
          )}

          <p className="text-sm text-white/60 leading-relaxed">
            A track of transverse momentum <InlineMath math="p_T" /> bends on a circle of radius <InlineMath math="R = p_T / (0.3\,B)" /> metres, so it can only get <InlineMath math="2R" /> away from the centre. Reaching the outer tracker at 8 m therefore needs <InlineMath math="p_T \ge 0.3\,B\,r_2/2" />: <span className="font-mono text-white/85">{pMinOuter.toFixed(1)} GeV</span> in a {B.toFixed(1)} T field. {reachesOuter ? "This track gets there." : "This one curls up first, and would never leave a second hit."}
          </p>
        </div>
      </div>
    </Widget>
  );
}
