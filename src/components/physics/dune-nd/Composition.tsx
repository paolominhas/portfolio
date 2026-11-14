"use client";

import React, { useMemo, useState } from "react";
import { COL, Seg, Widget } from "./ui";
import { STACK, STACK_META as M } from "@/data/dune-nd";

type Det = "LF" | "GF";
const LAY = M.layers;
const COLOR: Record<string, string> = { QE: COL.gold, RES: COL.kelp, DIS: COL.ember, MEC: COL.sky };
const WINDOWS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 6],
];

/** What is inside the CC0π sample, read off the project's stacked histogram. */
export default function Composition() {
  const [det, setDet] = useState<Det>("LF");
  const [frac, setFrac] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const data = useMemo(() => {
    const d = STACK[det];
    const bins = d.QE.map((_, i) => {
      const v = { QE: d.QE[i], RES: d.RES[i], DIS: d.DIS[i], MEC: d.MEC[i] } as Record<string, number>;
      const total = v.QE + v.RES + v.DIS + v.MEC;
      return { i, lo: i * M.binWidth, v, total, ok: total >= M.minPx * M.pxEvents[det] };
    });
    const win = WINDOWS.map(([lo, hi]) => {
      const s: Record<string, number> = { QE: 0, RES: 0, DIS: 0, MEC: 0 };
      let T = 0;
      for (const b of bins) if (b.ok && b.lo >= lo - 1e-9 && b.lo < hi - 1e-9) for (const k of LAY) { s[k] += b.v[k]; T += b.v[k]; }
      return { lo, hi, T, f: Object.fromEntries(LAY.map((k) => [k, T ? s[k] / T : 0])) as Record<string, number> };
    });
    const all: Record<string, number> = { QE: 0, RES: 0, DIS: 0, MEC: 0 };
    let T = 0;
    for (const b of bins) if (b.ok) for (const k of LAY) { all[k] += b.v[k]; T += b.v[k]; }
    const peak = Math.max(...bins.map((b) => b.total));
    return { bins, win, all, T, peak };
  }, [det]);

  const W = 640, H = 300, ml = 52, mr = 10, mt = 10, mb = 38;
  const xmax = 8;
  const iw = W - ml - mr, ih = H - mt - mb;
  const ymax = frac ? 1 : data.peak * 1.08;
  const px = (e: number) => ml + (e / xmax) * iw;
  const py = (v: number) => mt + (1 - v / ymax) * ih;
  const nb = Math.round(xmax / M.binWidth);
  const hb = hover !== null ? data.bins[hover] : null;
  const fmt = (v: number) => (v >= 1e4 ? `${Math.round(v / 1000)}k` : String(Math.round(v)));
  const yTicks = frac ? [0, 0.25, 0.5, 0.75, 1] : [0, 0.25, 0.5, 0.75, 1].map((t) => t * Math.round((data.peak * 1.08) / 1000) * 1000);

  return (
    <Widget eyebrow="Interactive · digitised from the project’s plots" title="What is inside the CC0π sample?">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        The stacked histogram in the report (Figure 17) has the answer on it but only to the eye. I read the four layers back off the image by colour, bin by bin, so you can hover for the numbers and switch to fractions. It is an approximate read-out (about ±2 pixels on each edge, so a few percent of the peak), and it only trusts bins where the whole column is at least {M.minPx} pixels tall.
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
        <Seg label="Detector" value={det} onChange={setDet} options={[["LF", "NDLAr · FHC"], ["GF", "NDGAr · FHC"]]} />
        <Seg label="Show" value={frac ? "f" : "c"} onChange={(v) => setFrac(v === "f")} options={[["c", "Event counts"], ["f", "Fractions"]]} />
      </div>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-pan-y select-none" role="img" aria-label="Stacked histogram of the CC0π sample by interaction type against true neutrino energy" onPointerLeave={() => setHover(null)}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * W;
              const i = Math.floor(((x - ml) / iw) * xmax / M.binWidth);
              setHover(i >= 0 && i < nb ? i : null);
            }}>
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={ml} x2={W - mr} y1={py(t)} y2={py(t)} stroke="rgba(255,255,255,0.08)" />
                <text x={ml - 6} y={py(t) + 4} fontSize="11" textAnchor="end" fill="rgba(255,255,255,0.5)">{frac ? `${Math.round(t * 100)}%` : fmt(t)}</text>
              </g>
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
              <text key={t} x={px(t)} y={H - mb + 16} fontSize="11" textAnchor="middle" fill="rgba(255,255,255,0.5)">{t}</text>
            ))}
            {data.bins.slice(0, nb).map((b) => {
              const x0 = px(b.lo), w = (px(b.lo + M.binWidth) - x0);
              if (!b.ok) {
                const h = frac ? 0 : (b.total / ymax) * ih;
                return h > 0.5 ? <rect key={b.i} x={x0} y={py(b.total)} width={w} height={h} fill="rgba(255,255,255,0.18)" /> : null;
              }
              let acc = 0;
              return (
                <g key={b.i}>
                  {LAY.map((k) => {
                    const v = frac ? b.v[k] / b.total : b.v[k];
                    const y1 = py(acc + v), y0 = py(acc);
                    acc += v;
                    return <rect key={k} x={x0} y={y1} width={w + 0.4} height={Math.max(0, y0 - y1)} fill={COLOR[k]} opacity={hover === b.i ? 1 : 0.85} />;
                  })}
                </g>
              );
            })}
            {hover !== null && <rect x={px(hover * M.binWidth)} y={mt} width={px(M.binWidth) - px(0)} height={ih} fill="none" stroke="rgba(255,255,255,0.7)" />}
            <rect x={ml} y={mt} width={iw} height={ih} fill="none" stroke="rgba(255,255,255,0.22)" />
            <text x={ml + iw / 2} y={H - 4} fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.65)">true neutrino energy (GeV)</text>
            <text transform={`translate(12 ${mt + ih / 2}) rotate(-90)`} fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.65)">{frac ? "share of the sample" : "events (scaled to 10²⁰ POT)"}</text>
          </svg>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60 mt-1">
            {LAY.map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: COLOR[k] }} />{M.names[k]}</span>
            ))}
            <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-white/20" />too thin to read</span>
          </div>
          <div className="mt-3 min-h-[3.25rem] rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/65">
            {hb ? (
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                <span className="font-mono text-white/80">{hb.lo.toFixed(3)}–{(hb.lo + M.binWidth).toFixed(3)} GeV</span>
                {hb.ok ? LAY.map((k) => (
                  <span key={k}><span style={{ color: COLOR[k] }}>{k === "QE" ? "CCQE" : k}</span> {fmt(hb.v[k])} ({(100 * hb.v[k] / hb.total).toFixed(0)}%)</span>
                )) : <span className="text-white/45">column under {M.minPx} px tall: the layers cannot be separated reliably here (total ≈ {fmt(hb.total)})</span>}
              </div>
            ) : (
              <span className="text-white/40">Hover or touch the chart to read a bin.</span>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs tracking-normal text-white/40 mb-2">Share of the sample, by energy</p>
          <div className="rounded-xl border border-white/10 overflow-hidden text-sm">
            <table className="w-full text-left">
              <thead className="bg-white/[0.04] text-[11px] tracking-normal text-white/45">
                <tr><th className="px-3 py-2 font-normal">GeV</th>{LAY.map((k) => <th key={k} className="px-2 py-2 font-normal" style={{ color: COLOR[k] }}>{k === "QE" ? "CCQE" : k}</th>)}</tr>
              </thead>
              <tbody className="font-mono text-xs text-white/75">
                {data.win.map((w) => (
                  <tr key={w.lo} className="border-t border-white/5">
                    <td className="px-3 py-1.5 text-white/55">{w.lo}–{w.hi}</td>
                    {LAY.map((k) => <td key={k} className="px-2 py-1.5">{(100 * w.f[k]).toFixed(0)}%</td>)}
                  </tr>
                ))}
                <tr className="border-t border-white/15 bg-white/[0.03]">
                  <td className="px-3 py-1.5 text-white/55">all</td>
                  {LAY.map((k) => <td key={k} className="px-2 py-1.5 text-white">{(100 * data.all[k] / data.T).toFixed(0)}%</td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-white/40 mt-2 leading-relaxed">
            Only bins where the column is tall enough are counted ({Math.round(100 * data.bins.filter((b) => b.ok).reduce((a, b) => a + b.total, 0) / data.bins.reduce((a, b) => a + b.total, 0))}% of the events). Percentages carry a few points of read-off error, and more for the thin DIS layer.
          </p>
        </div>
      </div>
    </Widget>
  );
}
