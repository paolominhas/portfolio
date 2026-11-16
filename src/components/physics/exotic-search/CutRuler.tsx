"use client";

import React, { useState } from "react";
import { Seg, Widget, COL } from "../daml/ui";
import { FEATURES, type Feature } from "@/data/exotic-search";

/**
 * Where the cuts came from. The notebook printed four quantiles per variable (the
 * signal's 10th and 25th percentiles, the background's 75th and 90th). This lays
 * them on a ruler beside the cut that was applied. Units are GeV (files hold MeV).
 */

function domain(f: Feature): [number, number] {
  if (f.id === "zll_mass") return [70, 110];
  const hi = Math.max(f.sig10, f.sig25, f.bg75, f.bg90, f.cut?.lo ?? 0, f.cut?.hi ?? 0);
  return [0, Math.ceil(hi * 1.15)];
}

export default function CutRuler() {
  const [id, setId] = useState(FEATURES[0].id);
  const f = FEATURES.find((x) => x.id === id)!;
  const [a, b] = domain(f);
  const W = 700, L = 14, R = 14, y0 = 74;
  const x = (v: number) => L + ((v - a) / (b - a)) * (W - L - R);
  const ticks = Array.from({ length: 6 }, (_, i) => a + ((b - a) * i) / 5);
  const keepLo = f.cut?.kind === "gt" ? f.cut.lo! : f.cut?.kind === "window" ? f.cut.lo! : a;
  const keepHi = f.cut?.kind === "lt" ? f.cut.hi! : f.cut?.kind === "window" ? f.cut.hi! : b;
  const fmt = (v: number) => (v < 10 || f.id === "zll_mass" ? String(parseFloat(v.toFixed(1))) : String(Math.round(v)));
  const cutText = !f.cut ? "No cut" : f.cut.kind === "gt" ? `Keep above ${f.cut.lo}` : f.cut.kind === "lt" ? `Keep below ${f.cut.hi}` : `Keep ${f.cut.lo} to ${f.cut.hi}`;
  const u = f.unit ? ` ${f.unit}` : "";

  return (
    <Widget eyebrow="Read off the notebook's printout" title="Where a cut can go">
      <div className="mb-5">
        <Seg value={id} onChange={setId} label="Variable" options={FEATURES.map((x) => [x.id, x.label] as [string, string])} />
      </div>
      <div className="overflow-x-auto -mx-1 px-1"><svg viewBox={`0 0 ${W} 130`} role="img" aria-label={`${f.label}: signal 10th and 25th percentiles at ${f.sig10} and ${f.sig25}; background 75th and 90th percentiles at ${f.bg75} and ${f.bg90}; ${cutText}`} className="h-auto w-full min-w-[34rem]">
        {f.cut && <rect x={x(keepLo)} y="20" width={Math.max(0, x(keepHi) - x(keepLo))} height="84" fill="rgba(47,158,124,0.16)" stroke="rgba(47,158,124,0.55)" strokeDasharray="4 4" />}
        <line x1={L} x2={W - R} y1={y0} y2={y0} stroke="rgba(255,255,255,0.4)" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={y0} y2={y0 + 6} stroke="rgba(255,255,255,0.4)" />
            <text x={x(t)} y={y0 + 20} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)">{fmt(t)}</text>
          </g>
        ))}
        {[["10th", f.sig10], ["25th", f.sig25]].map(([n, v]) => (
          <g key={`s${n}`}>
            <path d={`M${x(v as number)} ${y0 - 4}l-7 -14h14z`} fill={COL.ember} />
            <text x={x(v as number)} y={y0 - 24} textAnchor="middle" fontSize="10.5" fill={COL.ember}>{n}</text>
          </g>
        ))}
        {[["75th", f.bg75], ["90th", f.bg90]].map(([n, v]) => (
          <g key={`b${n}`}>
            <path d={`M${x(v as number)} ${y0 + 4}l-7 14h14z`} fill={COL.sky} transform="translate(0 0)" />
            <text x={x(v as number)} y={y0 + 40} textAnchor="middle" fontSize="10.5" fill={COL.sky}>{n}</text>
          </g>
        ))}
      </svg></div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/60">
        <span><span className="text-[var(--accent)]">▲</span> signal percentiles (10th, 25th): {f.sig10}, {f.sig25}{u}</span>
        <span><span style={{ color: COL.sky }}>▲</span> background percentiles (75th, 90th): {f.bg75}, {f.bg90}{u}</span>
        <span><span style={{ color: COL.kelp }}>▬</span> {cutText}{f.cut ? u : ""}</span>
      </div>
      <p className="mt-4 text-base text-white/70 leading-relaxed max-w-[44rem]">{f.why}</p>
    </Widget>
  );
}
