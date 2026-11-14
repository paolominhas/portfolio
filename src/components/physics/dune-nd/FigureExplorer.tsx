"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, Seg, Widget } from "./ui";
import { KINDS, SHOTS, type Chan, type Det, type Horn, type Kind, type Shot } from "@/data/dune-nd";

const CH_LABEL: Record<Chan, string> = { QE: "CCQE", RES: "RES", DIS: "DIS", MEC: "MEC", CC0pi: "CC0π", All: "All events" };
const TITLE: Record<Kind, (s: Shot) => string> = {
  beam: (s) => `Beam contents · ${s.det === "LAr" ? "NDLAr" : "NDGAr"} · ${s.horn}`,
  qefind: (s) => `Finding CCQE · ${s.det === "LAr" ? "NDLAr" : "NDGAr"} · ${s.horn}`,
  stack: (s) => `CC0π composition · ${s.det === "LAr" ? "NDLAr" : "NDGAr"} · ${s.horn}`,
  reco: (s) => `Reconstruction methods · ${s.det === "LAr" ? "NDLAr" : "NDGAr"} · ${s.horn}`,
  smear: (s) => `Smearing matrix · ${s.det === "LAr" ? "NDLAr" : "NDGAr"} · ${s.horn}`,
  chan: (s) => `Smearing matrix · NDLAr · FHC · ${CH_LABEL[s.chan ?? "All"]}`,
};

/** The project's own output plots, organised by what they show, with a plain statement of what to look for. */
export default function FigureExplorer() {
  const [kind, setKind] = useState<Kind>("beam");
  const [det, setDet] = useState<Det>("LAr");
  const [horn, setHorn] = useState<Horn>("FHC");
  const [chan, setChan] = useState<Chan>("All");
  const [errors, setErrors] = useState(false);
  const [compare, setCompare] = useState(false);
  const [zoom, setZoom] = useState<Shot | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [zoom]);

  const pool = useMemo(() => SHOTS.filter((s) => s.kind === kind), [kind]);
  const hasDet = kind !== "chan";
  const hasHorn = kind !== "chan" && kind !== "stack";
  const hasErr = pool.some((s) => s.variant === "errors") && pool.some((s) => s.variant !== "errors" && s.det === det && s.horn === (hasHorn ? horn : s.horn));

  const pick = (d: Det): Shot | undefined => {
    let c = pool.filter((s) => s.det === d && (hasHorn ? s.horn === horn : true));
    if (kind === "chan") c = pool.filter((s) => s.chan === chan);
    if (!c.length) return undefined;
    const want = errors ? "errors" : "plain";
    return c.find((s) => (s.variant ?? "plain") === want) ?? c[0];
  };
  const main = pick(det);
  const other = pick(det === "LAr" ? "GAr" : "LAr");
  const shots = kind === "chan" ? (main ? [main] : []) : compare && other ? (det === "LAr" ? [main, other] : [other, main]) : main ? [main] : [];
  const info = KINDS[kind];

  const Img = ({ s }: { s: Shot }) => (
    <figure className="min-w-0">
      <button
        type="button"
        onClick={() => setZoom(s)}
        className="block w-full rounded-xl bg-white p-1.5 cursor-zoom-in hover:shadow-[0_0_30px_rgba(255,107,61,0.25)] transition-shadow"
        aria-label={`Enlarge: ${TITLE[kind](s)}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/dune-nd/${s.file}.png`} alt={TITLE[kind](s)} loading="lazy" className="w-full h-auto rounded-lg" />
      </button>
      <figcaption className="mt-2 text-xs text-white/50 leading-relaxed">
        <span className="text-white/75">{TITLE[kind](s)}</span> ·{" "}
        {s.fig ? `Figure ${s.fig} of the report` : <span className="text-[var(--accent)]/80">in the repository, not in the report</span>} · <span className="font-mono">{s.file}.png</span>
      </figcaption>
      {s.caveat && <p className="mt-1 text-[11px] text-white/40">{s.caveat}</p>}
    </figure>
  );

  return (
    <Widget eyebrow="Interactive · the project’s own plots" title="Every result figure, in one place">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        These are the plots in the repository, which are the plots in the report, produced by the five macros. Pick a kind of plot, then the detector and the horn mode, and read the note beside it for what to look for. Click any plot to enlarge it.
      </p>
      <div className="grid lg:grid-cols-[17rem_1fr] gap-8">
        <div className="space-y-5">
          <Seg label="Plot" value={kind} onChange={setKind} options={(Object.keys(KINDS) as Kind[]).map((k) => [k, KINDS[k].label])} />
          {hasDet && <Seg label="Detector" value={det} onChange={setDet} options={[["LAr", "NDLAr (liquid)"], ["GAr", "NDGAr (gas)"]]} />}
          {hasHorn && <Seg label="Horn mode" value={horn} onChange={setHorn} options={[["FHC", "FHC (ν)"], ["RHC", "RHC (ν̄)"]]} />}
          {kind === "chan" && (
            <Seg label="Interaction" value={chan} onChange={setChan} options={(["QE", "RES", "DIS", "MEC", "CC0pi", "All"] as Chan[]).map((c) => [c, CH_LABEL[c]])} />
          )}
          <div className="flex flex-col gap-2">
            {hasDet && <Check label="Show both detectors side by side" checked={compare} onChange={setCompare} />}
            {hasErr && <Check label="With error bars" checked={errors} onChange={setErrors} />}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed space-y-3">
            <p>
              <span className="text-xs font-mono tracking-normal text-white/40 block mb-1">What it shows</span>
              <span className="text-white/65">{info.what}</span>
            </p>
            <p>
              <span className="text-xs font-mono tracking-normal text-[var(--accent)]/80 block mb-1">What to look for</span>
              <span className="text-white/70">{info.look}</span>
            </p>
            <p className="text-[11px] text-white/40">
              Made by <span className="font-mono">{info.macro}</span>. The macros scale every histogram to 10²⁰ protons on target, so the counts are comparable between plots; the report’s Figure 13 sub-captions give the (different) sample sizes actually simulated.
            </p>
          </div>
        </div>
        <div className={`grid gap-4 content-start ${shots.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {shots.length === 0 && <p className="text-white/50">No plot for this combination.</p>}
          {shots.map((s) => s && <Img key={s.file} s={s} />)}
        </div>
      </div>
      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={TITLE[zoom.kind](zoom)} className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoom(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/dune-nd/${zoom.file}.png`} alt={TITLE[zoom.kind](zoom)} className="max-h-[90vh] max-w-[95vw] rounded-lg bg-white p-2" />
          <button type="button" className="absolute top-4 right-4 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20" onClick={() => setZoom(null)}>
            Close
          </button>
        </div>
      )}
    </Widget>
  );
}
