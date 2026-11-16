"use client";

import React, { useState } from "react";
import { Seg, Widget, COL } from "../daml/ui";
import { N } from "@/data/mini-cms";

/**
 * Fire a particle through the layers. The layer thicknesses are the ones in the
 * notebook (50 cm ECAL, 1.9 m HCAL), but the picture is a schematic, not to scale,
 * and what each layer "does" for each particle is textbook behaviour, not
 * simulation output. The measured identification rates under the picture are real.
 */

type Particle = "electron" | "muon" | "pion" | "kaon";
type Mode = Particle | "all";
type Level = "hit" | "big" | "small" | "none";

const CX = 260, CY = 260, RHO = 330;

const LAYERS = [
  { id: "t1", name: "Tracker 1", r0: 48, r1: 52, fill: "rgba(255,255,255,0.55)", blurb: "A thin silicon ring that records where a charged particle crosses (its angles phi and theta)." },
  { id: "t2", name: "Tracker 2", r0: 82, r1: 86, fill: "rgba(255,255,255,0.55)", blurb: "A second ring. The two crossing points give the bend of the track in the magnetic field, and so the momentum." },
  { id: "rich", name: "RICH", r0: 104, r1: 138, fill: "rgba(110,168,255,0.22)", blurb: "Added late in the project: a cylinder of water that makes Cherenkov light, with an air layer outside it where photons are counted." },
  { id: "ecal", name: "ECAL", r0: 150, r1: 182, fill: "rgba(255,107,61,0.22)", blurb: "The electromagnetic calorimeter, a 50 cm lead-tungstate cylinder. It sums the energy deposited per event." },
  { id: "hcal", name: "HCAL", r0: 186, r1: 238, fill: "rgba(63,191,149,0.18)", blurb: "The hadronic calorimeter, 1.9 m thick, summing energy per event. For electrons and muons the project did not need it." },
  { id: "mu", name: "Muon chamber", r0: 244, r1: 251, fill: "rgba(242,193,78,0.35)", blurb: "A thin layer of air round the outside. A hit here plus a track means a particle got through everything: a muon." },
] as const;

type LayerId = (typeof LAYERS)[number]["id"];

const BEHAVIOUR: Record<Particle, { label: string; colour: string; stop: LayerId | "through"; levels: Record<LayerId, Level>; story: string; measured: string }> = {
  electron: {
    label: "Electron", colour: COL.sky, stop: "ecal",
    levels: { t1: "hit", t2: "hit", rich: "small", ecal: "big", hcal: "none", mu: "none" },
    story: "An electron showers in the ECAL and stops there: nearly all its energy shows up in that one layer.",
    measured: `Identified correctly ${Math.round(N.emu.ecalOnly.electron * 100)}% of the time (flat 0.2 to 20 GeV), and never below about 2 GeV.`,
  },
  muon: {
    label: "Muon", colour: COL.ember, stop: "through",
    levels: { t1: "hit", t2: "hit", rich: "small", ecal: "small", hcal: "small", mu: "hit" },
    story: "A muon barely interacts. It leaves a little energy in each calorimeter and comes out of the other side.",
    measured: `Identified ${Math.round(N.emu.ecalOnly.muon * 100)}% of the time from the ECAL alone, ${Math.round(N.emu.withMuonChamber.muon * 100)}% once the muon chamber is used.`,
  },
  pion: {
    label: "Pion", colour: COL.kelp, stop: "hcal",
    levels: { t1: "hit", t2: "hit", rich: "small", ecal: "small", hcal: "big", mu: "none" },
    story: "A pion is a hadron. It usually starts to shower late and stops in the HCAL.",
    measured: `The HCAL-fraction cut calls ${Math.round(N.piK.hcalCut.pion * 100)}% of pions pions, and ${Math.round((1 - N.piK.hcalCut.kaon) * 100)}% of kaons pions too.`,
  },
  kaon: {
    label: "Kaon", colour: COL.gold, stop: "hcal",
    levels: { t1: "hit", t2: "hit", rich: "small", ecal: "small", hcal: "big", mu: "none" },
    story: "A kaon is also a hadron and behaves almost exactly like a pion in the calorimeters. That is the problem.",
    measured: `Only ${Math.round(N.piK.hcalCut.kaon * 100)}% of kaons are called kaons by the HCAL-fraction cut.`,
  },
};

const LEVEL_TEXT: Record<Level, string> = { hit: "hit", big: "large deposit", small: "small deposit or none to speak of", none: "nothing" };
const LEVEL_GLYPH: Record<Level, string> = { hit: "●", big: "●", small: "◐", none: "○" };

const ANGLES: Record<Particle, number> = { electron: -38, muon: 20, pion: 150, kaon: 214 };

function trackPath(phi0: number, sign: number, rMax: number) {
  let d = "";
  for (let r = 4; r <= rMax; r += 4) {
    const a = (phi0 * Math.PI) / 180 + sign * Math.asin(Math.min(1, r / (2 * RHO)));
    d += `${d ? "L" : "M"}${(CX + r * Math.cos(a)).toFixed(1)} ${(CY + r * Math.sin(a)).toFixed(1)}`;
  }
  return d;
}
const pointAt = (phi0: number, sign: number, r: number): [number, number] => {
  const a = (phi0 * Math.PI) / 180 + sign * Math.asin(Math.min(1, r / (2 * RHO)));
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const annulus = (r0: number, r1: number) => `M${CX - r1} ${CY}a${r1} ${r1} 0 1 0 ${2 * r1} 0a${r1} ${r1} 0 1 0 ${-2 * r1} 0ZM${CX - r0} ${CY}a${r0} ${r0} 0 1 1 ${2 * r0} 0a${r0} ${r0} 0 1 1 ${-2 * r0} 0Z`;

export default function DetectorLab() {
  const [mode, setMode] = useState<Mode>("electron");
  const [run, setRun] = useState(0);
  const [layer, setLayer] = useState<LayerId>("ecal");
  const shown: Particle[] = mode === "all" ? ["electron", "muon", "pion", "kaon"] : [mode];
  const focus = mode === "all" ? null : BEHAVIOUR[mode];
  const info = LAYERS.find((l) => l.id === layer)!;

  const fire = (m: Mode) => {
    setMode(m);
    setRun((n) => n + 1);
  };

  return (
    <Widget title="Fire a particle through the detector">
      <style>{`
        @keyframes dl-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
        @keyframes dl-fade{from{opacity:0}to{opacity:1}}
        .dl-track{stroke-dasharray:1;animation:dl-draw 1.5s cubic-bezier(.3,.6,.3,1) both}
        .dl-spray{animation:dl-fade .5s ease-out 1.3s both}
        @media (prefers-reduced-motion:reduce){.dl-track,.dl-spray{animation:none}}
      `}</style>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] items-start">
        <div className="min-w-0">
          <svg viewBox="0 0 520 520" role="img" aria-label="End-on schematic of the detector: two tracker rings, a RICH, an electromagnetic calorimeter, a hadronic calorimeter and a muon chamber, with the chosen particle's track drawn through it" className="w-full h-auto max-w-[26rem] mx-auto block">
            {LAYERS.map((l) => (
              <g key={l.id}>
                <path d={annulus(l.r0, l.r1)} fill={l.fill} fillRule="evenodd" stroke={layer === l.id ? "#fff" : "rgba(255,255,255,0.3)"} strokeWidth={layer === l.id ? 1.6 : 0.8} />
              </g>
            ))}
            {shown.map((p) => {
              const b = BEHAVIOUR[p];
              const sign = p === "muon" || p === "kaon" ? -1 : 1;
              const phi = ANGLES[p];
              const stopLayer = b.stop === "through" ? null : LAYERS.find((l) => l.id === b.stop)!;
              const rStop = stopLayer ? (stopLayer.r0 + stopLayer.r1) / 2 + (stopLayer.id === "hcal" ? 8 : 0) : 256;
              const end = pointAt(phi, sign, rStop);
              const hits = ["t1", "t2"].map((id) => LAYERS.find((l) => l.id === id)!).map((l) => pointAt(phi, sign, (l.r0 + l.r1) / 2));
              return (
                <g key={`${p}-${run}`}>
                  <path d={trackPath(phi, sign, rStop)} pathLength={1} className="dl-track" fill="none" stroke={b.colour} strokeWidth={2.8} strokeLinecap="round" />
                  {hits.map((h, i) => (
                    <circle key={i} className="dl-spray" cx={h[0]} cy={h[1]} r="3.6" fill={b.colour} />
                  ))}
                  {stopLayer &&
                    Array.from({ length: 8 }, (_, k) => {
                      const a = (phi * Math.PI) / 180 + sign * Math.asin(rStop / (2 * RHO)) + (k - 3.5) * 0.19;
                      const len = 12 + ((k * 5) % 9);
                      return <line key={k} className="dl-spray" x1={end[0]} y1={end[1]} x2={end[0] + len * Math.cos(a)} y2={end[1] + len * Math.sin(a)} stroke={b.colour} strokeWidth="1.6" strokeOpacity=".8" />;
                    })}
                  {!stopLayer && <circle className="dl-spray" cx={pointAt(phi, sign, 247)[0]} cy={pointAt(phi, sign, 247)[1]} r="6.5" fill={b.colour} />}
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r="4" fill="#fff" />
            <text x="260" y="512" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.45)">Schematic, not to scale</text>
          </svg>
        </div>

        <div className="min-w-0 space-y-5">
          <Seg<Mode>
            label="Fire at the same momentum"
            value={mode}
            onChange={fire}
            options={[["electron", "Electron"], ["muon", "Muon"], ["pion", "Pion"], ["kaon", "Kaon"], ["all", "All four"]]}
          />
          <p className="text-white/70 text-base leading-relaxed min-h-[3.5rem]">
            {focus ? focus.story : "Four particles, one momentum. The electron stops in the ECAL, the muon goes right through, and the pion and kaon both stop in the HCAL. The last two are the ones that give the project trouble."}
          </p>

          <div role="group" aria-label="Detector layers" className="grid gap-1.5">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={layer === l.id}
                onClick={() => setLayer(l.id)}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${layer === l.id ? "border-[var(--accent)] bg-white/[0.06] text-white" : "border-white/10 text-white/65 hover:bg-white/5"}`}
              >
                <span>{l.name}</span>
                <span className="font-mono text-xs text-white/60 text-right">
                  {focus ? (
                    <>
                      <span aria-hidden>{LEVEL_GLYPH[focus.levels[l.id as LayerId]]} </span>
                      {LEVEL_TEXT[focus.levels[l.id as LayerId]]}
                    </>
                  ) : (
                    "choose one particle"
                  )}
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-white/55 leading-relaxed">
            <strong className="text-white/80">{info.name}.</strong> {info.blurb}
          </p>
          {focus && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-mono text-white/45 mb-1">What the simulation measured</p>
              <p className="text-white/75 text-sm leading-relaxed">{focus.measured}</p>
            </div>
          )}
          <p className="text-xs text-white/40">What each layer does for each particle is textbook behaviour, not simulation output. The percentages come from the project notebook.</p>
        </div>
      </div>
    </Widget>
  );
}
