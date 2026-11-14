"use client";

import React, { useMemo, useState } from "react";
import { Check, Slider, Widget } from "./ui";
import { buildU, NUFIT, stdParams } from "@/lib/physics/neutrinoOsc";

const pow10 = (v: number) => Math.pow(10, v);
const FL = ["e", "μ", "τ", "s"];

/** |U_αi|² for the three-flavour and four-flavour mixing matrices, built exactly as SNU multiplies its rotations. */
export default function MixingMatrix() {
  const [four, setFour] = useState(false);
  const [dcp, setDcp] = useState(285);
  const [l14, setL14] = useState(-2);
  const [l24, setL24] = useState(-1.3);
  const [l34, setL34] = useState(-2);

  const { n, rows, rowSums } = useMemo(() => {
    const p = stdParams(dcp, "NO");
    const s = four
      ? {
          d41: 1,
          t14: Math.asin(Math.sqrt(pow10(l14))),
          t24: Math.asin(Math.sqrt(pow10(l24))),
          t34: Math.asin(Math.sqrt(pow10(l34))),
          d1: 0,
          d2: 0,
        }
      : null;
    const { U, n } = buildU(p, s);
    const rows: number[][] = [];
    for (let a = 0; a < n; a++) {
      const r: number[] = [];
      for (let i = 0; i < n; i++) r.push(U[2 * (a * n + i)] ** 2 + U[2 * (a * n + i) + 1] ** 2);
      rows.push(r);
    }
    return { n, rows, rowSums: rows.map((r) => r.reduce((a, b) => a + b, 0)) };
  }, [four, dcp, l14, l24, l34]);

  return (
    <Widget eyebrow="Interactive · the mixing matrix" title="How much of each mass state is in each flavour">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        Each row is a flavour and each column a mass state; a cell shows the fraction (|U|²) of that mass state inside that flavour. The three-flavour matrix is the familiar one built from θ₁₂, θ₁₃, θ₂₃ and δCP. Adding a sterile neutrino makes it 4×4, built from six rotations multiplied in the order {"{3,4},{2,4},{1,4},{2,3},{1,3},{1,2}"} with the phases attached as in the report’s appendix.
      </p>
      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
        <div>
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `2rem repeat(${n}, minmax(3.3rem, 4.2rem))` }}>
            <div />
            {Array.from({ length: n }, (_, i) => (
              <div key={i} className="text-center text-xs font-mono text-white/45 pb-1">
                ν<sub>{i + 1}</sub>
              </div>
            ))}
            {rows.map((r, a) => (
              <React.Fragment key={a}>
                <div className="text-xs font-mono text-white/45 self-center">ν<sub>{FL[a]}</sub></div>
                {r.map((v, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md flex items-center justify-center text-[11px] font-mono"
                    style={{
                      background: `rgba(255,107,61,${Math.min(0.95, Math.sqrt(v) * 0.95)})`,
                      color: v > 0.35 ? "#0b0f19" : "rgba(255,255,255,0.8)",
                    }}
                    title={`|U_${FL[a]}${i + 1}|² = ${v.toExponential(3)}`}
                  >
                    {v >= 0.001 ? v.toFixed(3) : v < 1e-9 ? "0" : v.toExponential(0)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[11px] text-white/35 mt-3">Each row sums to {rowSums.map((s) => s.toFixed(6)).join(", ")} (unitarity check).</p>
        </div>
        <div className="space-y-4">
          <Check label="Four flavours (add a sterile neutrino)" checked={four} onChange={setFour} />
          <Slider label="δCP" value={dcp} min={0} max={360} step={5} onChange={setDcp} format={(v) => `${v}°`} hint={`sin²θ₁₂ ${NUFIT.s2t12} · sin²θ₁₃ ${NUFIT.s2t13} · sin²θ₂₃ ${NUFIT.s2t23} (NuFit 6.0)`} />
          {four && (
            <>
              <Slider label="sin²θ₁₄" value={l14} min={-4} max={-0.1} step={0.05} onChange={setL14} format={(v) => pow10(v).toExponential(1)} />
              <Slider label="sin²θ₂₄" value={l24} min={-4} max={-0.1} step={0.05} onChange={setL24} format={(v) => pow10(v).toExponential(1)} />
              <Slider label="sin²θ₃₄" value={l34} min={-4} max={-0.1} step={0.05} onChange={setL34} format={(v) => pow10(v).toExponential(1)} />
              <p className="text-xs text-white/45">
                The fourth column shows how much sterile content each flavour acquires, and the fourth row how much of each active mass state the sterile neutrino carries. At small angles the active 3×3 block is only slightly changed, which is why a sterile neutrino has to be searched for as a small distortion of oscillations.
              </p>
            </>
          )}
        </div>
      </div>
    </Widget>
  );
}
