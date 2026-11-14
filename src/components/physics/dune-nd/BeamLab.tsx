"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "./plot";
import { Callout, COL, Seg, Slider, Widget } from "./ui";
import { NUMBERS } from "@/data/dune-nd";

const M_PI = 0.13957; // GeV
const M_MU = 0.105658;
const E_STAR = (M_PI * M_PI - M_MU * M_MU) / (2 * M_PI); // neutrino energy in the pion rest frame, 29.79 MeV

/** Lab energy of the neutrino from π → μν, for a pion of lab energy Epi seen at lab angle θ from its direction. Exact. */
export function nuEnergy(Epi: number, theta: number) {
  const g = Epi / M_PI;
  const b = Math.sqrt(Math.max(0, 1 - 1 / (g * g)));
  return E_STAR / (g * (1 - b * Math.cos(theta)));
}

/* ----------------------------------------------------------------------- horn schematic */

function Horns({ mode }: { mode: "FHC" | "RHC" }) {
  const focus = mode === "FHC" ? "pos" : "neg";
  // trajectories start at the target (x=70) and go to the end of the decay pipe (x=560)
  const traj = (sign: 1 | -1, k: number, focused: boolean) => {
    const y0 = 110 + sign * (6 + k * 6);
    const yEnd = focused ? 110 + sign * (4 + k * 3) : 110 + sign * (70 + k * 22);
    const yMid = focused ? 110 + sign * (2 + k * 2) : 110 + sign * (30 + k * 8);
    return `M70,${110 + sign * 3} C 130,${y0} 170,${yMid} 330,${yMid + (yEnd - yMid) * 0.3} S 520,${yEnd} 560,${yEnd}`;
  };
  return (
    <svg viewBox="0 0 700 220" className="w-full h-auto" role="img" aria-label={`Schematic of the beamline in ${mode} mode: ${focus === "pos" ? "positive" : "negative"} pions are focused down the decay pipe and the other sign is bent away`}>
      <rect x="0" y="0" width="700" height="220" fill="rgba(255,255,255,0.02)" />
      <rect x="170" y="70" width="390" height="80" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" />
      <text x="365" y="62" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)">decay pipe, {NUMBERS.decayPipe} m</text>
      <rect x="60" y="92" width="18" height="36" fill={COL.grey} opacity="0.7" />
      <text x="69" y="150" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)">target</text>
      <text x="69" y="164" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)">(graphite)</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={92 + i * 24} y="50" width="10" height="120" rx="3" fill={COL.gold} opacity="0.55" />
        </g>
      ))}
      <text x="120" y="190" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)">3 magnetic horns</text>
      <rect x="560" y="60" width="26" height="100" fill={COL.grey} opacity="0.45" />
      <text x="573" y="178" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)">absorber</text>
      {[0, 1, 2].map((k) => (
        <path key={`p${k}`} d={traj(-1, k, focus === "pos")} fill="none" stroke={COL.ember} strokeWidth="1.6" opacity={focus === "pos" ? 0.95 : 0.35} style={{ transition: "all .5s" }} />
      ))}
      {[0, 1, 2].map((k) => (
        <path key={`n${k}`} d={traj(1, k, focus === "neg")} fill="none" stroke={COL.sky} strokeWidth="1.6" opacity={focus === "neg" ? 0.95 : 0.35} style={{ transition: "all .5s" }} />
      ))}
      <line x1="586" y1="110" x2="690" y2="110" stroke={COL.white} strokeWidth="2.5" strokeDasharray="6 5" />
      <text x="638" y="98" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.85)">{mode === "FHC" ? "mostly νμ" : "mostly ν̄μ"}</text>
      <text x="638" y="132" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.45)">to the near detector</text>
      <g fontSize="11">
        <circle cx="22" cy="198" r="4" fill={COL.ember} />
        <text x="32" y="202" fill="rgba(255,255,255,0.6)">π⁺ (→ μ⁺ νμ)</text>
        <circle cx="140" cy="198" r="4" fill={COL.sky} />
        <text x="150" y="202" fill="rgba(255,255,255,0.6)">π⁻ (→ μ⁻ ν̄μ)</text>
      </g>
    </svg>
  );
}

/* ----------------------------------------------------------------------- the lab */

const bins = (th: number) => {
  const nb = 160, w = 0.05;
  const h = new Float64Array(nb);
  let tot = 0, m1 = 0, m2 = 0;
  for (let E = 0.3; E < 80; E += 0.01) {
    const wgt = E * Math.exp(-E / 6); // toy pion spectrum, rising then falling
    const e = nuEnergy(E, th);
    const k = Math.floor(e / w);
    if (k < nb) { h[k] += wgt; }
    if (e < nb * w) { tot += wgt; m1 += wgt * e; m2 += wgt * e * e; }
  }
  const mean = m1 / tot;
  const rms = Math.sqrt(Math.max(0, m2 / tot - mean * mean));
  let pk = 0;
  for (let k = 0; k < nb; k++) if (h[k] > h[pk]) pk = k;
  const norm = Array.from(h, (v) => v / (tot * w));
  return { norm, mean, rel: rms / mean, peak: (pk + 0.5) * w, w, nb };
};

export default function BeamLab() {
  const [mode, setMode] = useState<"FHC" | "RHC">("FHC");
  const [mrad, setMrad] = useState(15);
  const th = mrad / 1000;

  const curves = useMemo(() => {
    const E = Array.from({ length: 400 }, (_, i) => 0.5 + (i * (60 - 0.5)) / 399);
    return { E, on: E.map((e) => nuEnergy(e, 0)), off: E.map((e) => nuEnergy(e, th)) };
  }, [th]);
  const hOn = useMemo(() => bins(0), []);
  const hOff = useMemo(() => bins(th), [th]);
  const x = Array.from({ length: hOn.nb + 1 }, (_, i) => i * hOn.w);
  const max = th > 0 ? E_STAR / Math.sin(th) : Infinity;
  const ymax = Math.max(...hOn.norm, ...hOff.norm) * 1.1;

  return (
    <Widget eyebrow="Interactive · beam physics" title="Where the neutrinos come from, and why moving sideways changes them">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        Top: the two horn modes. Bottom: an exact bit of decay kinematics that explains the DUNE-PRISM idea in the report, where moving the detector off the beam axis makes the beam “more monochromatic” with a lower mean energy.
      </p>
      <Seg label="Horn current" value={mode} onChange={setMode} options={[["FHC", "Forward (FHC)"], ["RHC", "Reverse (RHC)"]]} />
      <div className="mt-4 rounded-xl border border-white/10 overflow-hidden">
        <Horns mode={mode} />
      </div>
      <p className="text-xs text-white/45 mt-2 max-w-[44rem]">
        Schematic, not to scale. The horns focus one sign of pion and bend the other away, but not perfectly: the “wrong-sign” pions that get through are why a reverse-horn beam still contains neutrinos, as the plots in section 5 show.
      </p>

      <div className="grid lg:grid-cols-[18rem_1fr] gap-8 mt-10">
        <div className="space-y-5">
          <Slider label="Angle off the beam axis" value={mrad} min={0} max={50} step={1} onChange={setMrad} format={(v) => `${v} mrad`} hint={`At the near detector’s ${NUMBERS.baselineND} m that is a sideways shift of about ${(NUMBERS.baselineND * mrad / 1000).toFixed(1)} m (treating the source as a point).`} />
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm space-y-2 text-white/70">
            <Row k="Highest neutrino energy" v={th > 0 ? `${max.toFixed(2)} GeV` : "no limit"} />
            <Row k="…reached by a pion of" v={th > 0 ? `${(M_PI / Math.sin(th)).toFixed(1)} GeV` : "—"} />
            <Row k="Toy beam, mean energy" v={`${hOn.mean.toFixed(2)} → ${hOff.mean.toFixed(2)} GeV`} />
            <Row k="Toy beam, spread / mean" v={`${hOn.rel.toFixed(2)} → ${hOff.rel.toFixed(2)}`} />
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">
            The first two lines are exact: a pion of energy E<sub>π</sub> produces a neutrino of energy E* / (γ(1 − β cos θ)), where E* = {(E_STAR * 1000).toFixed(2)} MeV is the neutrino energy in the pion’s rest frame. Its maximum over all pion energies is exactly E* / sin θ. The last two lines use a made-up pion spectrum (rising then falling, ∝ E e<sup>−E/6 GeV</sup>), not the LBNF flux.
          </p>
        </div>
        <div className="min-w-0 space-y-6">
          <div>
            <p className="text-sm text-white/70 mb-2">Neutrino energy against pion energy</p>
            <LinePlot
              ariaLabel="Neutrino energy against parent pion energy, on axis and at the chosen angle"
              series={[
                { x: curves.E, y: curves.on, color: COL.grey, dash: "5 4", width: 1.5, label: "on axis (≈ 0.43 Eπ)" },
                { x: curves.E, y: curves.off, color: COL.ember, width: 2.2, label: `${mrad} mrad off axis` },
              ]}
              markers={th > 0 && M_PI / Math.sin(th) < 60 ? [{ x: M_PI / Math.sin(th), y: max, color: COL.white, r: 4 }] : []}
              xDomain={[0, 60]}
              yDomain={[0, 8]}
              xLabel="pion energy (GeV)"
              yLabel="neutrino energy (GeV)"
              height={260}
            />
            <p className="text-[11px] text-white/40 mt-1">Off axis the curve rises, tops out at the white dot, then falls. Near the top many different pion energies give almost the same neutrino energy.</p>
          </div>
          <div>
            <p className="text-sm text-white/70 mb-2">Toy neutrino spectrum (area normalised)</p>
            <LinePlot
              ariaLabel="Normalised toy neutrino energy spectrum on axis and at the chosen angle"
              series={[
                { x, y: [...hOn.norm, 0], color: COL.grey, step: true, dash: "5 4", width: 1.5, label: "on axis" },
                { x, y: [...hOff.norm, 0], color: COL.ember, step: true, width: 2.2, label: `${mrad} mrad` },
              ]}
              xDomain={[0, 8]}
              yDomain={[0, ymax]}
              xLabel="neutrino energy (GeV)"
              yLabel="probability density"
              height={240}
              interactive={false}
            />
            <p className="text-[11px] text-white/40 mt-1">The sharp edge at the top is what a single angle gives; the real source is a line of decays, seen by a detector of finite size, so the real edge is softer.</p>
          </div>
        </div>
      </div>
      <Callout title="How the report uses this">
        <p>
          The report says that “taking a linear combination of the different beam fluxes produces a neutrino energy spectrum close to that expected at the FD”. This is the reason it can: each off-axis position is a narrower slice of energy, and a weighted sum of slices can be shaped like the far-detector flux. The full construction is not in the report and is not attempted here.
        </p>
      </Callout>
    </Widget>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-white/50">{k}</span>
      <span className="font-mono text-[var(--accent)] text-xs whitespace-nowrap">{v}</span>
    </div>
  );
}
