"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export interface Series {
  x: number[];
  y: number[];
  color: string;
  label?: string;
  dash?: string;
  width?: number;
  step?: boolean; // histogram-style: x are bin LEFT edges, last point closes the final bin
  fill?: boolean;
  fillRight?: boolean; // shade from the curve to the right-hand edge (for exclusion regions)
}
export interface Marker {
  x: number;
  y: number;
  color: string;
  r?: number;
}
export interface VLine {
  x: number;
  label?: string;
  color?: string;
}
export interface HLine {
  y: number;
  label?: string;
  color?: string;
}

function niceTicks(lo: number, hi: number, n = 5): number[] {
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const raw = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / mag;
  const step = (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return out;
}
function logTicks(lo: number, hi: number): number[] {
  const out: number[] = [];
  for (let p = Math.ceil(Math.log10(lo) - 1e-9); p <= Math.floor(Math.log10(hi) + 1e-9); p++) out.push(Math.pow(10, p));
  return out;
}
const fmtTick = (v: number) => {
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e4 || a < 1e-3) return v.toExponential(0).replace("e+", "e");
  return String(parseFloat(v.toPrecision(3)));
};

/** Measures an element's width so the SVG can be drawn at true pixel size (readable on phones). */
function useWidth(initial = 640): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth || initial);
    const ro = new ResizeObserver(() => setW(el.clientWidth || initial));
    ro.observe(el);
    return () => ro.disconnect();
  }, [initial]);
  return [ref, w];
}

function interp(s: Series, x: number): number | null {
  const { x: xs, y: ys } = s;
  if (xs.length === 0 || x < xs[0] || x > xs[xs.length - 1]) return null;
  let lo = 0;
  let hi = xs.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (xs[m] <= x) lo = m;
    else hi = m;
  }
  if (s.step) return ys[Math.min(lo, ys.length - 1)];
  const t = xs[hi] === xs[lo] ? 0 : (x - xs[lo]) / (xs[hi] - xs[lo]);
  return ys[lo] + t * (ys[hi] - ys[lo]);
}

export default function LinePlot({
  series,
  markers = [],
  vlines = [],
  hlines = [],
  xDomain,
  yDomain,
  xLog = false,
  yLog = false,
  xLabel,
  yLabel,
  height = 300,
  ariaLabel,
  formatX = (v) => fmtTick(v),
  formatY = (v) => (Math.abs(v) < 0.01 && v !== 0 ? v.toExponential(2) : String(parseFloat(v.toPrecision(4)))),
  xTicks,
  formatYTick,
  legend = true,
  interactive = true,
}: {
  series: Series[];
  markers?: Marker[];
  vlines?: VLine[];
  hlines?: HLine[];
  xDomain: [number, number];
  yDomain: [number, number];
  xLog?: boolean;
  yLog?: boolean;
  xLabel: string;
  yLabel: string;
  height?: number;
  ariaLabel: string;
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
  xTicks?: number[];
  formatYTick?: (v: number) => string;
  legend?: boolean;
  interactive?: boolean;
}) {
  const [ref, W] = useWidth();
  const cid = "c" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const m = { l: 52, r: 12, t: 12, b: 42 };
  const iw = Math.max(120, W - m.l - m.r);
  const ih = height - m.t - m.b;
  const fx = (v: number) => {
    const [a, b] = xDomain;
    return m.l + (xLog ? (Math.log10(v) - Math.log10(a)) / (Math.log10(b) - Math.log10(a)) : (v - a) / (b - a)) * iw;
  };
  const fy = (v: number) => {
    const [a, b] = yDomain;
    const t = yLog ? (Math.log10(Math.max(v, 1e-300)) - Math.log10(a)) / (Math.log10(b) - Math.log10(a)) : (v - a) / (b - a);
    return m.t + (1 - t) * ih;
  };
  const inv = (px: number) => {
    const t = (px - m.l) / iw;
    const [a, b] = xDomain;
    return xLog ? Math.pow(10, Math.log10(a) + t * (Math.log10(b) - Math.log10(a))) : a + t * (b - a);
  };
  const xt = xTicks ?? (xLog ? logTicks(...xDomain) : niceTicks(...xDomain, Math.max(3, Math.floor(iw / 90))));
  const yt = yLog ? logTicks(...yDomain) : niceTicks(...yDomain, 5);

  const paths = useMemo(
    () =>
      series.map((s) => {
        let d = "";
        const n = Math.min(s.x.length, s.y.length);
        if (s.step) {
          for (let i = 0; i < n - 1; i++) {
            const x0 = fx(s.x[i]);
            const x1 = fx(s.x[i + 1]);
            const yy = fy(s.y[i]);
            d += i === 0 ? `M${x0},${yy}` : `L${x0},${yy}`;
            d += `L${x1},${yy}`;
          }
        } else {
          let pen = false;
          for (let i = 0; i < n; i++) {
            const yv = s.y[i];
            if (!Number.isFinite(yv) || (yLog && yv <= 0) || (xLog && s.x[i] <= 0)) {
              pen = false;
              continue;
            }
            d += `${pen ? "L" : "M"}${fx(s.x[i]).toFixed(1)},${fy(yv).toFixed(1)}`;
            pen = true;
          }
        }
        return d;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, W, xDomain, yDomain, xLog, yLog, height]
  );

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    if (!interactive || px < m.l || px > m.l + iw) return setHover(null);
    setHover(inv(px));
  };
  const hx = hover;
  const tip =
    hx === null
      ? null
      : series
          .filter((s) => s.label)
          .map((s) => ({ s, v: interp(s, hx) }))
          .filter((o) => o.v !== null);

  return (
    <div ref={ref} className="w-full min-w-0">
      <div className="relative w-full" style={{ height }}>
      <svg
        width={W}
        height={height}
        role="img"
        aria-label={ariaLabel}
        className="absolute left-0 top-0 block touch-pan-y select-none"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <rect x={m.l} y={m.t} width={iw} height={ih} fill="rgba(255,255,255,0.02)" />
        {yt.map((v) => (
          <g key={`y${v}`}>
            <line x1={m.l} x2={m.l + iw} y1={fy(v)} y2={fy(v)} stroke="rgba(255,255,255,0.08)" />
            <text x={m.l - 6} y={fy(v) + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.5)">
              {(formatYTick ?? fmtTick)(v)}
            </text>
          </g>
        ))}
        {xt.map((v) => (
          <g key={`x${v}`}>
            <line x1={fx(v)} x2={fx(v)} y1={m.t} y2={m.t + ih} stroke="rgba(255,255,255,0.08)" />
            <text x={fx(v)} y={m.t + ih + 16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)">
              {formatX(v)}
            </text>
          </g>
        ))}
        <rect x={m.l} y={m.t} width={iw} height={ih} fill="none" stroke="rgba(255,255,255,0.22)" />
        <text x={m.l + iw / 2} y={height - 6} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.65)">
          {xLabel}
        </text>
        <text transform={`translate(13 ${m.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.65)">
          {yLabel}
        </text>
        <clipPath id={cid}>
          <rect x={m.l} y={m.t} width={iw} height={ih} />
        </clipPath>
        <g clipPath={`url(#${cid})`}>
          {hlines.map((h, i) => (
            <g key={`h${i}`}>
              <line x1={m.l} x2={m.l + iw} y1={fy(h.y)} y2={fy(h.y)} stroke={h.color ?? "rgba(255,255,255,0.4)"} strokeDasharray="4 4" />
              {h.label && (
                <text x={m.l + iw - 4} y={fy(h.y) - 4} textAnchor="end" fontSize="10.5" fill={h.color ?? "rgba(255,255,255,0.55)"}>
                  {h.label}
                </text>
              )}
            </g>
          ))}
          {vlines.map((v, i) => (
            <g key={`v${i}`}>
              <line x1={fx(v.x)} x2={fx(v.x)} y1={m.t} y2={m.t + ih} stroke={v.color ?? "rgba(255,255,255,0.4)"} strokeDasharray="4 4" />
              {v.label && (
                <text x={fx(v.x) + 4} y={m.t + 12} fontSize="10.5" fill={v.color ?? "rgba(255,255,255,0.55)"}>
                  {v.label}
                </text>
              )}
            </g>
          ))}
          {series.map((s, i) =>
            s.fillRight ? (
              <path key={`fr${i}`} d={`${paths[i]}L${fx(xDomain[1])},${fy(s.y[s.y.length - 1])}L${fx(xDomain[1])},${fy(s.y[0])}Z`} fill={s.color} opacity="0.16" />
            ) : null
          )}
          {series.map((s, i) =>
            s.fill ? (
              <path key={`f${i}`} d={`${paths[i]}L${fx(s.x[s.x.length - 1])},${fy(yDomain[0])}L${fx(s.x[0])},${fy(yDomain[0])}Z`} fill={s.color} opacity="0.18" />
            ) : null
          )}
          {series.map((s, i) => (
            <path key={`p${i}`} d={paths[i]} fill="none" stroke={s.color} strokeWidth={s.width ?? 1.8} strokeDasharray={s.dash} strokeLinejoin="round" />
          ))}
          {markers.map((k, i) => (
            <circle key={`m${i}`} cx={fx(k.x)} cy={fy(k.y)} r={k.r ?? 3} fill={k.color} />
          ))}
          {hx !== null && <line x1={fx(hx)} x2={fx(hx)} y1={m.t} y2={m.t + ih} stroke="rgba(255,255,255,0.5)" />}
        </g>
      </svg>
      </div>
      <div className="min-h-[2.25rem] mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55">
        {legend &&
          series
            .filter((s) => s.label)
            .map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <span className="inline-block w-4 h-0.5" style={{ background: s.color, borderTop: s.dash ? `2px dashed ${s.color}` : undefined }} />
                {s.label}
                {tip && tip.find((o) => o.s === s) && (
                  <span className="font-mono text-white/80">{formatY(tip.find((o) => o.s === s)!.v as number)}</span>
                )}
              </span>
            ))}
        {hx !== null && <span className="ml-auto font-mono text-white/45">x = {formatX(hx)}</span>}
      </div>
    </div>
  );
}
