"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "./plot";
import { COL, Seg, Slider, Widget } from "./ui";
import { NUMBERS } from "@/data/globes";
import flux from "@/data/globes/flux.json";
import { makeEngine, stdParams } from "@/lib/physics/neutrinoOsc";

type FluxSet = { E: number[]; nue: number[]; numu: number[]; nuebar: number[]; numubar: number[] };
const F = flux as unknown as Record<"fdFHC" | "fdRHC" | "ndFHC" | "ndRHC", FluxSet> & {
  xsec: { E: number[]; numu: number[]; numubar: number[]; nue: number[]; nuebar: number[] };
};

function lerp(xs: number[], ys: number[], x: number): number {
  if (x <= xs[0]) return ys[0] * (x < xs[0] - 1e-9 ? 0 : 1);
  if (x >= xs[xs.length - 1]) return 0;
  let lo = 0;
  let hi = xs.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (xs[m] <= x) lo = m;
    else hi = m;
  }
  const t = (x - xs[lo]) / (xs[hi] - xs[lo]);
  return ys[lo] + t * (ys[hi] - ys[lo]);
}

/** Flux × cross-section × probability, the three factors GLoBES multiplies for every channel (before smearing and efficiencies). */
export default function FluxPipeline() {
  const [site, setSite] = useState<"fd" | "nd">("fd");
  const [mode, setMode] = useState<"FHC" | "RHC">("FHC");
  const [sp, setSp] = useState<"numu" | "numubar" | "nue" | "nuebar">("numu");
  const [lDm, setLDm] = useState(0.0);
  const [l24, setL24] = useState(-1.0);

  const L = site === "fd" ? NUMBERS.baselineFD : NUMBERS.baselineND;
  const set = F[`${site}${mode}` as "fdFHC"];
  const anti = sp === "numubar" || sp === "nuebar";
  const flav = sp === "numu" || sp === "numubar" ? "numu" : "nue";
  const xsKey = sp;

  const d = useMemo(() => {
    const N = 320;
    const lo = 0.25;
    const hi = 8;
    const std = stdParams(285, "NO");
    const e0 = makeEngine(std, null);
    const e1 = makeEngine(std, {
      d41: Math.pow(10, lDm),
      t14: 0,
      t24: Math.asin(Math.sqrt(Math.pow(10, l24))),
      t34: 0,
      d1: 0,
      d2: 0,
    });
    const E: number[] = [];
    const fl: number[] = [];
    const xs: number[] = [];
    const ev0: number[] = [];
    const ev1: number[] = [];
    const idx = flav === "numu" ? 1 : 0;
    for (let i = 0; i <= N; i++) {
      const e = lo + ((hi - lo) * i) / N;
      E.push(e);
      const f = lerp(set.E, set[sp], e);
      const s = lerp(F.xsec.E, F.xsec[xsKey], e); // σ(E), converted from the file's σ/E when the data were exported
      fl.push(f);
      xs.push(s);
      const rho = NUMBERS.density;
      // average over a ±6% spread in energy (a stand-in for the detector's energy resolution) so that
      // very fast oscillations are drawn as their average instead of as sampling noise
      let P0 = 0;
      let P1 = 0;
      const M = 9;
      for (let j = 0; j < M; j++) {
        const ee = e * (1 + 0.06 * ((2 * j) / (M - 1) - 1));
        P0 += e0.probs(ee, L, rho, anti)[idx * 3 + idx];
        P1 += e1.probs(ee, L, rho, anti)[idx * 4 + idx];
      }
      P0 /= M;
      P1 /= M;
      ev0.push(f * s * P0);
      ev1.push(f * s * P1);
    }
    const mf = Math.max(...fl) || 1;
    const mx = Math.max(...xs) || 1;
    const un = fl.map((f, i) => f * xs[i]);
    const mev = Math.max(...un) || 1;
    const win = E.map((e) => e >= 0.5);
    const sum = (a: number[]) => a.reduce((s, v, i) => s + (win[i] ? v : 0), 0);
    return {
      E,
      fl: fl.map((v) => v / mf),
      xs: xs.map((v) => v / mx),
      un: un.map((v) => v / mev),
      ev0: ev0.map((v) => v / mev),
      ev1: ev1.map((v) => v / mev),
      lost: 1 - sum(ev1) / Math.max(sum(ev0), 1e-30),
    };
  }, [set, sp, flav, xsKey, anti, L, lDm, l24]);

  const spName: Record<string, string> = { numu: "νμ", numubar: "ν̄μ", nue: "νe", nuebar: "ν̄e" };

  return (
    <Widget eyebrow="Interactive · real beam files" title="From beam to events: flux × cross-section × probability">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        For every channel GLoBES multiplies three things in each true-energy bin: how many neutrinos the beam makes (the flux files in the repository), how likely each is to interact (the GENIE cross-sections), and the oscillation probability. The detector then smears and thins the result. Below, the first two are the project’s own input files and the third is the live engine, for the survival of the species you pick, with and without a sterile neutrino.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Seg label="Detector" value={site} onChange={setSite} options={[["fd", "Far"], ["nd", "Near"]]} />
        <Seg label="Beam mode" value={mode} onChange={setMode} options={[["FHC", "Neutrino (FHC)"], ["RHC", "Antineutrino (RHC)"]]} />
        <Seg label="Species" value={sp} onChange={setSp} options={[["numu", "νμ"], ["numubar", "ν̄μ"], ["nue", "νe"], ["nuebar", "ν̄e"]]} />
        <div className="space-y-4">
          <Slider label="Sterile Δm²₄₁" value={lDm} min={-3.5} max={2} step={0.05} onChange={setLDm} format={(v) => `${Math.pow(10, v).toPrecision(2)} eV²`} />
          <Slider label="Sterile sin²θ₂₄" value={l24} min={-4} max={-0.1} step={0.05} onChange={setL24} format={(v) => Math.pow(10, v).toExponential(1)} />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div>
          <p className="text-xs font-mono tracking-wider text-white/40 mb-1">1 · flux of {spName[sp]}</p>
          <LinePlot ariaLabel="Beam flux against energy" series={[{ x: d.E, y: d.fl, color: COL.sky, fill: true }]} xDomain={[0.25, 8]} yDomain={[0, 1.05]} xLabel="E (GeV)" yLabel="flux (relative)" height={210} legend={false} />
        </div>
        <div>
          <p className="text-xs font-mono tracking-wider text-white/40 mb-1">2 · × cross-section</p>
          <LinePlot ariaLabel="Interactions per bin against energy" series={[{ x: d.E, y: d.un, color: COL.kelp, fill: true }]} xDomain={[0.25, 8]} yDomain={[0, 1.05]} xLabel="E (GeV)" yLabel="interactions (relative)" height={210} legend={false} />
        </div>
        <div>
          <p className="text-xs font-mono tracking-wider text-white/40 mb-1">3 · × survival probability</p>
          <LinePlot
            ariaLabel="Surviving interactions against energy with and without the sterile neutrino"
            series={[
              { x: d.E, y: d.ev0, color: COL.grey, dash: "5 4", label: "no sterile" },
              { x: d.E, y: d.ev1, color: COL.ember, label: "with sterile" },
            ]}
            xDomain={[0.25, 8]}
            yDomain={[0, 1.05]}
            xLabel="E (GeV)"
            yLabel="events (relative)"
            height={210}
            legend={false}
          />
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
        With these settings the sterile neutrino removes <strong className="text-white">{(Math.max(0, d.lost) * 100).toFixed(d.lost < 0.01 ? 2 : 1)}%</strong> of the {spName[sp]} interactions between 0.5 and 8 GeV at the {site === "fd" ? "far" : "near"} detector{d.lost < -0.001 ? " (negative: the sterile fit gains events here because the standard νμ rate already oscillates)" : ""}. In the real analysis GLoBES compares the two spectra bin by bin, with the systematic uncertainties on flux and cross-section allowed to absorb some of the difference.
      </div>
      <p className="mt-3 text-[11px] text-white/35">
        Survival probabilities are averaged over a ±6% energy spread to stand in for the detector’s energy resolution. Flux and σ/E tables are read from flux/*.txt and xsec/xsec_cc.dat in the repository, shown in relative units; smearing matrices and efficiencies are not applied here. Standard parameters: NuFit 6.0, normal ordering, δCP = 285°, matter on.
      </p>
    </Widget>
  );
}
