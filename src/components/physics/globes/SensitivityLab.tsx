"use client";

import React, { useMemo, useState } from "react";
import LinePlot, { type Series } from "./plot";
import { Callout, COL, Seg, Slider, Widget } from "./ui";
import grids from "@/data/globes/sens.json";

type G = { x: number[]; y: number[]; sys: number[]; FD: number[][][]; ND1: number[][][]; ND11: number[][][] };
const D = grids as unknown as G;

const SUP: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const pw = (v: number) => "10" + String(Math.round(v)).split("").map((c) => SUP[c] ?? c).join("");

/** Per Δm² row, the sin²θ24 where Δχ² first reaches the threshold (interpolated in log χ²). NaN → never within the grid. */
function boundary(chi: number[][], thr: number): number[] {
  const nx = D.x.length;
  const ny = D.y.length;
  const out: number[] = [];
  for (let iy = 0; iy < ny; iy++) {
    let b = NaN;
    for (let ix = 0; ix < nx; ix++) {
      const c = chi[ix][iy];
      if (c >= thr) {
        if (ix === 0) b = D.x[0];
        else {
          const c0 = Math.max(chi[ix - 1][iy], 1e-12);
          const t = (Math.log(thr) - Math.log(c0)) / (Math.log(c) - Math.log(c0));
          b = D.x[ix - 1] + t * (D.x[ix] - D.x[ix - 1]);
        }
        break;
      }
    }
    out.push(b);
  }
  return out;
}

const SETS = [
  ["fd", "Far detector only", COL.sky],
  ["nd1", "Near detector (one file)", COL.kelp],
  ["nd11", "Near detector (11 files)", COL.gold],
  ["all", "Far + near (11 files)", COL.ember],
] as const;
type SetId = (typeof SETS)[number][0];

export default function SensitivityLab() {
  const [si, setSi] = useState(2);
  const [cl, setCl] = useState<"90" | "99">("90");
  const [on, setOn] = useState<Record<SetId, boolean>>({ fd: true, nd1: false, nd11: false, all: true });
  const [probe, setProbe] = useState(0.0);
  const thr = cl === "90" ? 4.61 : 9.21;

  const bounds = useMemo(() => {
    const fd = D.FD[si];
    const n1 = D.ND1[si];
    const n11 = D.ND11[si];
    const all = fd.map((row, ix) => row.map((v, iy) => v + n11[ix][iy]));
    return { fd: boundary(fd, thr), nd1: boundary(n1, thr), nd11: boundary(n11, thr), all: boundary(all, thr) } as Record<SetId, number[]>;
  }, [si, thr]);

  const series: Series[] = SETS.filter(([id]) => on[id]).map(([id, label, color]) => ({
    x: bounds[id].map((v) => (Number.isFinite(v) ? v : 0)),
    y: D.y,
    color,
    label,
    width: id === "all" ? 2.4 : 1.6,
    fillRight: id === "all" || (id === "fd" && !on.all),
  }));

  const iy = Math.round((probe - D.y[0]) / (D.y[1] - D.y[0]));
  const lim = (id: SetId) => {
    const v = bounds[id][iy];
    if (!Number.isFinite(v)) return "no sensitivity in this range";
    if (v <= D.x[0] + 1e-9) return `at or below the grid edge, sin²θ₂₄ < ${pw(D.x[0])}`;
    return `sin²θ₂₄ < ${(Math.pow(10, v) >= 0.001 ? Math.pow(10, v).toPrecision(2) : Math.pow(10, v).toExponential(1))}`;
  };

  return (
    <Widget eyebrow="Interactive · my re-derivation, not the GLoBES output" title="Sensitivity to a sterile neutrino: near and far detector">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        The curves bound the region of (sin²θ₂₄, Δm²₄₁) that DUNE could rule out: to the right of a curve, a sterile neutrino would change the predicted νμ disappearance spectrum by more than the chosen confidence level allows. Switch the near detector on and off, change how large the systematic uncertainties are, and read off the limit at any Δm².
      </p>
      <Callout tone="warn" title="What this map is">
        <p>
          The saved sterile χ² grids in the repository contain failed points (negative χ² values, which are impossible, and values up to 10¹⁴ in the far-detector file), so I did not plot them. Instead I recomputed the same kind of map independently: the repository’s flux, cross-section, smearing and efficiency files, the SNU Hamiltonian, the detector file’s signal and background channels with their systematic errors, and a χ² with those errors fitted analytically. It uses the νμ disappearance rules only, with every other parameter held at its true value (no marginalisation), so it is a simplified cousin of the GLoBES calculation, not a copy of it. The features are the ones the report describes (the notch, the near-detector gain), but the near-detector reach depends on its assumed event count: at Δm²₄₁ of a few eV² mine reaches roughly an order of magnitude further in sin²θ₂₄ than the report’s Figure 11 does (section 8). Read the absolute reach as approximate and the shapes as the result.
        </p>
      </Callout>
      <div className="grid md:grid-cols-2 gap-6 mb-5">
        <div className="space-y-4">
          <Seg label="Size of systematic errors" value={String(si) as "0"} onChange={(v) => setSi(Number(v))} options={D.sys.map((s, i) => [String(i) as "0", s === 0 ? "none (statistics only)" : s === 1 ? "as in the detector file" : `${s}× the detector file`])} />
          <Seg label="Confidence level (2 parameters)" value={cl} onChange={setCl} options={[["90", "90%  (Δχ² = 4.61)"], ["99", "99%  (Δχ² = 9.21)"]]} />
        </div>
        <div>
          <p className="text-xs tracking-normal text-white/40 mb-1.5">Curves</p>
          <div className="flex flex-wrap gap-1.5">
            {SETS.map(([id, label, color]) => (
              <button
                key={id}
                type="button"
                aria-pressed={on[id]}
                onClick={() => setOn((o) => ({ ...o, [id]: !o[id] }))}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${on[id] ? "text-abyss font-bold" : "text-white/60 border-white/20 hover:bg-white/10"}`}
                style={on[id] ? { background: color, borderColor: color } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <LinePlot
        ariaLabel="Sterile neutrino exclusion boundaries in the plane of sin squared theta 24 and delta m squared 41"
        series={series}
        hlines={[{ y: probe, label: "probe", color: COL.white }]}
        xDomain={[-5, 0]}
        xTicks={[-5, -4, -3, -2, -1, 0]}
        yDomain={[-4, 2]}
        xLabel="sin²θ₂₄"
        yLabel="Δm²₄₁ (eV²)"
        formatX={pw}
        formatY={pw}
        formatYTick={pw}
        height={420}
        interactive={false}
      />
      <div className="mt-4 max-w-md">
        <Slider label="Read the limit at Δm²₄₁ =" value={probe} min={-4} max={2} step={0.1} onChange={setProbe} format={(v) => `${pw(v)} eV²`} hint="Atmospheric splitting Δm²₃₁ ≈ 2.5×10⁻³ eV² = 10⁻²·⁶" />
      </div>
      <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/70">
        {SETS.map(([id, label, color]) => (
          <li key={id} className="flex gap-2">
            <span className="mt-1.5 inline-block w-2.5 h-2.5 rounded-full flex-none" style={{ background: color }} />
            <span>
              <span className="text-white/90">{label}:</span> {lim(id)}
            </span>
          </li>
        ))}
      </ul>
      <div className="grid md:grid-cols-3 gap-3 mt-6 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono tracking-normal text-white/40 mb-1">The notch</p>
          <p className="text-white/70">The far-detector curve moves sharply right near Δm²₄₁ = 10⁻²·⁶ eV², the atmospheric splitting: there a sterile neutrino mimics a shift in the ordinary parameters.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono tracking-normal text-white/40 mb-1">The near detector</p>
          <p className="text-white/70">Below roughly 10⁻² eV² the near detector has little to see (almost no oscillation has started over 574 m). Above about 1 eV² its reach is more than two orders of magnitude below the far detector’s in sin²θ₂₄, though the exact value depends on its assumed event count.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono tracking-normal text-white/40 mb-1">Systematics</p>
          <p className="text-white/70">With the systematic errors switched off, the far detector’s reach at large Δm²₄₁ improves by roughly a factor of three in sin²θ₂₄. The flux and cross-section errors are part of what limits it; the near detector sees the beam before it oscillates, so it constrains them.</p>
        </div>
      </div>
    </Widget>
  );
}
