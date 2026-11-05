"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { bsGreeks, type Greeks, type OptionKind, type OptionParams } from "@/lib/physics/options";
import { Stat, axisTick, chartColors, fmt, tooltipStyle } from "./ui";

type GreekName = keyof Greeks;

/** Display units: practitioner conventions, converted from the engine's per-1.00 / per-year units. */
const GREEKS: {
  id: GreekName;
  label: string;
  unit: string;
  meaning: string;
  scale: number;
  dp: number;
}[] = [
  { id: "delta", label: "Delta", unit: "per 1.00 move in spot", meaning: "How much the price moves when spot moves by 1.", scale: 1, dp: 4 },
  { id: "gamma", label: "Gamma", unit: "per 1.00 move in spot", meaning: "How fast delta itself changes as spot moves.", scale: 1, dp: 5 },
  { id: "vega", label: "Vega", unit: "per 1 volatility point", meaning: "How much the price moves when volatility rises by one percentage point.", scale: 0.01, dp: 4 },
  { id: "theta", label: "Theta", unit: "per day", meaning: "How much value is lost to the passage of one day, all else equal.", scale: 1 / 365, dp: 4 },
  { id: "rho", label: "Rho", unit: "per 1% in the rate", meaning: "How much the price moves when the interest rate rises by one percentage point.", scale: 0.01, dp: 4 },
];

/** What the curve does, stated only where it is true for a vanilla option under Black–Scholes. */
function shapeNote(greek: GreekName, kind: OptionKind): string {
  switch (greek) {
    case "delta":
      return kind === "call" ? "Between 0 and 1, rising with spot" : "Between −1 and 0, rising with spot";
    case "gamma":
    case "vega":
      return "Always positive, peaking near the strike";
    case "theta":
      return "Usually negative: value is lost as time passes";
    case "rho":
      return kind === "call" ? "Positive, growing as spot rises" : "Negative, larger in size as spot falls";
  }
}

export default function GreeksPanel({ p, kind }: { p: OptionParams; kind: OptionKind }) {
  const [selected, setSelected] = useState<GreekName>("delta");
  const meta = GREEKS.find((g) => g.id === selected) ?? GREEKS[0];
  const now = bsGreeks(p, kind);

  const data = useMemo(() => {
    const lo = Math.min(0.5 * p.k, 0.85 * p.s0);
    const hi = Math.max(1.5 * p.k, 1.15 * p.s0);
    const n = 120;
    return Array.from({ length: n + 1 }, (_, i) => {
      const s = lo + ((hi - lo) * i) / n;
      return { s, y: bsGreeks({ ...p, s0: s }, kind)[selected] * meta.scale };
    });
  }, [p, kind, selected, meta.scale]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {GREEKS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSelected(g.id)}
            aria-pressed={g.id === selected}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              g.id === selected
                ? "border-[var(--accent-border)] bg-[var(--accent-muted)]"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/40">{g.label}</div>
            <div className="mt-1 font-mono text-lg tabular-nums text-white">{fmt(now[g.id] * g.scale, g.dp)}</div>
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/50">
        <strong className="text-white/80">{meta.label}</strong> ({meta.unit}). {meta.meaning} The curve
        shows how it changes with the spot price; the dashed line marks where spot is now.
      </p>

      <div
        role="img"
        aria-label={`Chart of ${meta.label} against spot price. Currently ${fmt(now[selected] * meta.scale, meta.dp)} ${meta.unit}.`}
        className="mt-3 h-[280px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="s"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={axisTick}
              tickFormatter={(v: number) => fmt(v, 0)}
              stroke={chartColors.axis}
              label={{ value: "spot price", position: "insideBottom", offset: -2, fill: chartColors.axis, fontSize: 11 }}
              height={36}
            />
            <YAxis tick={axisTick} stroke={chartColors.axis} width={54} tickFormatter={(v: number) => fmt(v, selected === "gamma" ? 3 : 2)} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(v) => `spot ${fmt(Number(v), 1)}`}
              formatter={(value) => [fmt(Number(value), meta.dp), meta.label]}
            />
            <ReferenceLine x={p.k} stroke={chartColors.dim} strokeDasharray="4 4" />
            <ReferenceLine x={p.s0} stroke={chartColors.kelp} strokeDasharray="2 4" />
            <Line dataKey="y" stroke={chartColors.ember} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Stat
          label="Reading the shape"
          value={shapeNote(selected, kind)}
          sub="Dotted line: strike. Dashed green line: spot now."
        />
        <Stat
          label="Units"
          value={meta.unit}
          sub="Converted from the engine's per-1.00 / per-year units for display."
        />
      </div>
    </div>
  );
}
