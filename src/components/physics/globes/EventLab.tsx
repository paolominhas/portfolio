"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "./plot";
import { COL, Seg, Slider, Widget } from "./ui";
import ev from "@/data/globes/events.json";
import saved from "@/data/globes/saved.json";

type EV = {
  edges: number[];
  K: number;
  delta: number[];
} & Record<string, number[][]>;
const D = ev as unknown as EV;
const S = saved as unknown as { cp0: { sig: number[]; bkg: number[] }; cp285: { sig: number[]; bkg: number[] } };
const NB = D.edges.length - 1;
const centres = D.edges.slice(0, NB).map((e, i) => 0.5 * (e + D.edges[i + 1]));
const FIRST = centres.findIndex((c) => c >= 0.5);
const tot = (a: number[]) => a.slice(FIRST).reduce((s, v) => s + v, 0);

/** Electron-neutrino appearance at the far detector, from my engine run through the repo's flux, cross-section, smearing and efficiency files. */
export default function EventLab() {
  const [beam, setBeam] = useState<"FHC" | "RHC">("FHC");
  const [di, setDi] = useState(57); // index into delta grid: 285°
  const delta = D.delta[di];
  const get = (o: "NO" | "IO", k: "sig" | "bkg") => D[`${beam}_${o}_${k}`][di];
  const nS = get("NO", "sig");
  const iS = get("IO", "sig");
  const nB = get("NO", "bkg");
  const iB = get("IO", "bkg");

  const hist = useMemo(() => {
    const x = D.edges.slice(0, NB + 1);
    const pad = (a: number[]) => [...a, a[a.length - 1]];
    return { x, nS: pad(nS), iS: pad(iS), nB: pad(nB), iB: pad(iB) };
  }, [nS, iS, nB, iB]);

  const fileKey = delta === 0 ? "cp0" : delta === 285 ? "cp285" : null;
  const fileMarks = fileKey && beam === "FHC" ? centres.map((c, i) => ({ x: c, y: S[fileKey].sig[i], color: COL.white, r: 2.2 })).filter((m, i) => i >= 1) : [];
  const diffPct = fileKey && beam === "FHC" ? (100 * (tot(nS) - tot(S[fileKey].sig))) / tot(S[fileKey].sig) : null;

  // bi-event loops
  const loops = useMemo(() => {
    const mk = (o: "NO" | "IO") => {
      const x: number[] = [];
      const y: number[] = [];
      for (let i = 0; i <= D.delta.length; i++) {
        const k = i % D.delta.length;
        x.push(tot(D[`FHC_${o}_sig`][k]) + tot(D[`FHC_${o}_bkg`][k]));
        y.push(tot(D[`RHC_${o}_sig`][k]) + tot(D[`RHC_${o}_bkg`][k]));
      }
      return { x, y };
    };
    return { NO: mk("NO"), IO: mk("IO") };
  }, []);
  const nuN = (o: "NO" | "IO") => tot(D[`FHC_${o}_sig`][di]) + tot(D[`FHC_${o}_bkg`][di]);
  const nbN = (o: "NO" | "IO") => tot(D[`RHC_${o}_sig`][di]) + tot(D[`RHC_${o}_bkg`][di]);
  const allX = [...loops.NO.x, ...loops.IO.x];
  const allY = [...loops.NO.y, ...loops.IO.y];
  const pad = (lo: number, hi: number): [number, number] => [Math.floor(lo * 0.95), Math.ceil(hi * 1.05)];

  return (
    <Widget eyebrow="Interactive · real input files" title="Electron-neutrino appearance at the far detector">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        These spectra come from running my engine through the repository’s own flux, cross-section, smearing-matrix and efficiency files, with the ν and ν̄ exposures and the background channels of the GLoBES detector file. Because the GLoBES event files in the repository exist only for two δCP values, the white dots mark them: pick δCP = 0° or 285° with the neutrino beam and they should sit on the line.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Seg label="Beam mode" value={beam} onChange={setBeam} options={[["FHC", "Neutrino (FHC)"], ["RHC", "Antineutrino (RHC)"]]} />
        <Slider label="δCP" value={di} min={0} max={D.delta.length - 1} step={1} onChange={setDi} format={(i) => `${D.delta[i]}°`} hint="Steps of 5°. 285° ≈ −75°, close to maximal CP violation." />
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div>
          <p className="text-xs font-mono tracking-wider text-white/40 mb-1">events per 0.125 GeV bin (reconstructed energy), 3.5 years of {beam === "FHC" ? "ν" : "ν̄"} beam</p>
          <LinePlot
            ariaLabel="Electron appearance events against reconstructed energy for normal and inverted ordering"
            series={[
              { x: hist.x, y: hist.nS, color: COL.sky, step: true, label: "normal: signal", width: 1.8 },
              { x: hist.x, y: hist.iS, color: COL.ember, step: true, label: "inverted: signal", width: 1.8 },
              { x: hist.x, y: hist.nB, color: COL.grey, step: true, dash: "4 3", label: "background", width: 1.2 },
            ]}
            markers={fileMarks}
            xDomain={[0, 8]}
            yDomain={[0, Math.max(...hist.nS, ...hist.iS, ...hist.nB) * 1.12 || 1]}
            xLabel="reconstructed energy (GeV)"
            yLabel="events per bin"
            height={330}
          />
          {fileKey && beam === "FHC" ? (
            <p className="text-xs text-[#5FD0A8] mt-2">
              White dots: signal column of the GLoBES file {fileKey === "cp0" ? "events_out3_cp_0.dat" : "events_out3.dat"}. Total signal here {tot(nS).toFixed(0)} against {tot(S[fileKey].sig).toFixed(0)} in the file ({diffPct! >= 0 ? "+" : ""}{diffPct!.toFixed(2)}%).
            </p>
          ) : (
            <p className="text-xs text-white/40 mt-2">The repository holds GLoBES event files for neutrino mode at δCP = 0° and 285° only, so nothing is overlaid at this setting.</p>
          )}
        </div>
        <div>
          <p className="text-xs font-mono tracking-wider text-white/40 mb-1">the bi-event plot: ν events against ν̄ events as δCP runs round</p>
          <LinePlot
            ariaLabel="Bi-event plot: appearance events in neutrino mode against antineutrino mode as delta CP varies, for both mass orderings"
            series={[
              { x: loops.NO.x, y: loops.NO.y, color: COL.sky, width: 1.8 },
              { x: loops.IO.x, y: loops.IO.y, color: COL.ember, width: 1.8 },
            ]}
            markers={[
              { x: nuN("NO"), y: nbN("NO"), color: COL.sky, r: 5 },
              { x: nuN("IO"), y: nbN("IO"), color: COL.ember, r: 5 },
            ]}
            xDomain={pad(Math.min(...allX), Math.max(...allX))}
            yDomain={pad(Math.min(...allY), Math.max(...allY))}
            xLabel="events, neutrino beam (0.5–8 GeV)"
            yLabel="events, antineutrino beam"
            height={330}
            legend={false}
          />
          <p className="text-xs text-white/45 mt-2">
            <span style={{ color: COL.sky }}>●</span> normal <span style={{ color: COL.ember }}>●</span> inverted. Each loop is one ordering as δCP sweeps 0–355°; the dots show the current δCP. Statistical error on a point is about ±{Math.sqrt(nuN("NO")).toFixed(0)} (ν) and ±{Math.sqrt(nbN("NO")).toFixed(0)} (ν̄) events.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-6 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">Signal events, 0.5–8 GeV</p>
          <p className="text-white/70">normal <span className="text-white">{tot(nS).toFixed(0)}</span> · inverted <span className="text-white">{tot(iS).toFixed(0)}</span></p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">Inverted / normal</p>
          <p className="text-white/70"><span className="text-white">{(tot(iS) / tot(nS)).toFixed(2)}</span> in {beam === "FHC" ? "ν" : "ν̄"} mode at δCP = {delta}°</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">Signal / background</p>
          <p className="text-white/70">normal <span className="text-white">{(tot(nS) / tot(nB)).toFixed(1)}</span></p>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/55 max-w-[44rem]">
        In neutrino mode the two orderings give almost the same <em>shape</em> and differ mainly in <em>size</em> (the inverted ordering is lower), as the report notes; in antineutrino mode the effect reverses. A size difference alone would not be a measurement, because θ₂₃, δCP and the flux and cross-section normalisations also move the totals. The bi-event plot shows the combined ν and ν̄ picture: with every other parameter held fixed and statistical errors only, the two loops never touch (their closest points are roughly seven statistical standard deviations apart), but varying those other parameters moves and widens the loops, which is why the real analysis fits appearance and disappearance together with systematic uncertainties.
      </p>
      <p className="mt-2 text-[11px] text-white/35">
        Normalisation: one overall factor (9.5×10¹³) fixed once by matching the saved neutrino-mode file at δCP = 0°; every other number follows from the input files. Statistical errors only, no systematics.
      </p>
    </Widget>
  );
}
