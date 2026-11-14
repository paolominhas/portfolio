"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "./plot";
import { Check, COL, Seg, Widget } from "./ui";
import chi from "@/data/globes/chi.json";

const C = chi as unknown as {
  cpv: { x: number[]; chi0: number[]; chipi: number[] };
  t285: { x: number[]; chi3: number[]; chi31: number[] };
};

/** The two δCP χ² results in the repository, replotted from the saved GLoBES output files. */
export default function CpChi2({ part }: { part: "cpv" | "valid" }) {
  const [unit, setUnit] = useState<"chi2" | "sigma">("chi2");
  const [parts, setParts] = useState(false);
  const [amp, setAmp] = useState(false);

  const f = (v: number) => (unit === "chi2" ? v : Math.sqrt(Math.max(v, 0)));
  const mn = useMemo(() => C.cpv.chi0.map((a, i) => Math.min(a, C.cpv.chipi[i])), []);
  const peak = Math.max(...mn);
  const peakAt = C.cpv.x[mn.indexOf(peak)];
  const pos = C.cpv.x.map((x, i) => ({ x, v: mn[i] })).filter((o) => o.x > 0);
  const neg = C.cpv.x.map((x, i) => ({ x, v: mn[i] })).filter((o) => o.x < 0);
  const pPos = pos.reduce((a, b) => (b.v > a.v ? b : a));
  const pNeg = neg.reduce((a, b) => (b.v > a.v ? b : a));

  const diff = C.t285.chi31.map((v, i) => v - C.t285.chi3[i]);
  const maxd = Math.max(...diff.map(Math.abs));
  const iz = C.t285.x.findIndex((x) => Math.abs(x) < 1e-6);
  const chiCons = Math.min(C.t285.chi3[iz], C.t285.chi3[0], C.t285.chi3[C.t285.chi3.length - 1]);

  if (part === "cpv")
    return (
      <Widget eyebrow="Interactive · replotted from the saved GLoBES output" title="CP violation: the δCP χ² curve">
        <p className="text-white/60 text-base mb-5 max-w-[44rem]">
          These are the numbers GLoBES wrote to <code className="text-white/80">delta_cp_zero.dat</code> and <code className="text-white/80">delta_cp_pi.dat</code>, replotted so you can read values off them. Nothing here is recomputed.
        </p>
      <h4 className="font-bodoni text-xl text-white mb-1">Sensitivity to CP violation</h4>
      <p className="text-white/55 text-sm mb-4 max-w-[44rem]">
        At each δCP the curve is the smaller of the χ² against the two CP-conserving values, δCP = 0 and δCP = π. DUNE can claim CP violation when both are strongly disfavoured, which happens for δCP near ±π/2.
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-3 mb-3">
        <Seg value={unit} onChange={setUnit} options={[["chi2", "χ²"], ["sigma", "σ = √χ²"]]} />
        <Check label="Show the two components" checked={parts} onChange={setParts} />
      </div>
      <LinePlot
        ariaLabel="Sensitivity to CP violation against delta CP over pi"
        series={[
          ...(parts
            ? [
                { x: C.cpv.x, y: C.cpv.chi0.map(f), color: COL.sky, dash: "4 3", label: "vs δCP = 0", width: 1.2 },
                { x: C.cpv.x, y: C.cpv.chipi.map(f), color: COL.kelp, dash: "4 3", label: "vs δCP = π", width: 1.2 },
              ]
            : []),
          { x: C.cpv.x, y: mn.map(f), color: COL.ember, label: "min of the two", width: 2.2 },
        ]}
        hlines={unit === "chi2" ? [{ y: 9, label: "3σ", color: COL.gold }, { y: 25, label: "5σ", color: COL.gold }] : [{ y: 3, label: "3σ", color: COL.gold }, { y: 5, label: "5σ", color: COL.gold }]}
        xDomain={[-1, 1]}
        yDomain={[0, unit === "chi2" ? 140 : 12]}
        xLabel="δCP / π"
        yLabel={unit === "chi2" ? "χ²" : "σ"}
        height={310}
        formatY={(v) => v.toFixed(unit === "chi2" ? 1 : 2)}
        formatX={(v) => v.toFixed(2).replace(/\.?0+$/, "")}
      />
      <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">Highest point</p>
          <p className="text-white/70">χ² = <span className="text-white">{peak.toFixed(0)}</span> (σ ≈ {Math.sqrt(peak).toFixed(1)}) at δCP/π = {peakAt.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">The two humps</p>
          <p className="text-white/70">negative side χ² ≈ <span className="text-white">{pNeg.v.toFixed(0)}</span> at {pNeg.x.toFixed(2)}; positive side <span className="text-white">{pPos.v.toFixed(0)}</span> at {pPos.x.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/[0.06] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] mb-1">Reading it honestly</p>
          <p className="text-white/70">This is χ², so the 5σ line is at 25. The published TDR curve is σ and peaks near 5σ for its staged 7-year exposure; this one is higher, and rough between δCP/π ≈ 0.45 and 0.65, which includes the dip at 0.5 the report mentions.</p>
        </div>
      </div>

      </Widget>
    );
  return (
    <Widget eyebrow="Interactive · replotted from the saved GLoBES output" title="Does the four-flavour engine reduce to three flavours?">
      <h4 className="font-bodoni text-xl text-white mb-1">The validation: three flavours against 3+1 with the sterile angles set to zero</h4>
      <p className="text-white/55 text-sm mb-4 max-w-[44rem]">
        With the true value at δCP = 285° (−0.42π), the χ² to every test δCP, marginalised over θ₂₃. If the four-flavour engine is wired correctly with the sterile parameters at zero, it has to reproduce the three-flavour answer.
      </p>
      <div className="mb-3"><Check label="Plot the difference between the two curves instead" checked={amp} onChange={setAmp} /></div>
      <LinePlot
        ariaLabel="Chi-squared against test delta CP from the three-flavour code and the four-flavour engine with sterile parameters zero"
        series={
          amp
            ? [{ x: C.t285.x, y: diff, color: COL.ember, label: "χ²(3+1, all sterile = 0) − χ²(3ν)", width: 1.8 }]
            : [
                { x: C.t285.x, y: C.t285.chi3, color: COL.sky, label: "3 flavours", width: 2.4 },
                { x: C.t285.x, y: C.t285.chi31, color: COL.ember, dash: "5 4", label: "3+1, sterile = 0", width: 1.6 },
              ]
        }
        xDomain={[-1, 1]}
        yDomain={amp ? [-0.4, 0.4] : [0, 160]}
        xLabel="test δCP / π"
        yLabel={amp ? "difference in χ²" : "χ²"}
        height={290}
        formatY={(v) => v.toFixed(amp ? 2 : 1)}
        formatX={(v) => v.toFixed(2).replace(/\.?0+$/, "")}
      />
      <p className="mt-3 text-sm text-white/65 max-w-[44rem]">
        The curves agree to within <strong className="text-white">{maxd.toFixed(2)}</strong> in χ² everywhere (at most {((100 * maxd) / 148).toFixed(2)}% of the peak, 148). Not bit-identical, as the report’s “identical” might suggest, but at the level of the numerical noise of the minimiser, so the validation passes. At this true value the nearer CP-conserving point (δCP = ±π) sits at χ² ≈ {chiCons.toFixed(0)}, or σ ≈ {Math.sqrt(chiCons).toFixed(1)}; δCP = 0 is further away, at χ² ≈ {C.t285.chi3[iz].toFixed(0)}.
      </p>
    </Widget>
  );
}
