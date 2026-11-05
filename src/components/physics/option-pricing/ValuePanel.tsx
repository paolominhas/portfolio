"use client";

import { useMemo } from "react";
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
import {
  bsPrice,
  payoff,
  probInTheMoney,
  type OptionKind,
  type OptionParams,
} from "@/lib/physics/options";
import { Stat, axisTick, chartColors, fmt, tooltipStyle } from "./ui";

interface Point {
  s: number;
  payoff: number;
  value: number;
}

/** Payoff at expiry and Black–Scholes value today, across a range of spot prices. */
function buildCurve(p: OptionParams, kind: OptionKind): Point[] {
  const lo = Math.min(0.5 * p.k, 0.85 * p.s0);
  const hi = Math.max(1.5 * p.k, 1.15 * p.s0);
  const n = 120;
  const spots: number[] = [];
  for (let i = 0; i <= n; i++) spots.push(lo + ((hi - lo) * i) / n);
  spots.push(p.k); // put a point exactly on the kink
  spots.sort((a, b) => a - b);
  return spots.map((s) => ({
    s,
    payoff: payoff(s, p.k, kind),
    value: bsPrice({ ...p, s0: s }, kind),
  }));
}

function moneyness(p: OptionParams, kind: OptionKind): string {
  const ratio = p.s0 / p.k;
  if (Math.abs(ratio - 1) < 0.005) return "at the money";
  const itm = kind === "call" ? ratio > 1 : ratio < 1;
  return itm ? "in the money" : "out of the money";
}

export default function ValuePanel({ p, kind }: { p: OptionParams; kind: OptionKind }) {
  const data = useMemo(() => buildCurve(p, kind), [p, kind]);
  const price = bsPrice(p, kind);
  const intrinsic = payoff(p.s0, p.k, kind);
  const timeValue = price - intrinsic;
  const chance = probInTheMoney(p, kind);

  return (
    <div>
      <div
        role="img"
        aria-label={`Chart of the option's value today and its payoff at expiry against the spot price. At spot ${fmt(p.s0, 0)} the ${kind} is worth ${fmt(price)}.`}
        className="h-[320px] w-full"
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
              label={{ value: "spot price at the time", position: "insideBottom", offset: -2, fill: chartColors.axis, fontSize: 11 }}
              height={36}
            />
            <YAxis tick={axisTick} stroke={chartColors.axis} width={44} tickFormatter={(v: number) => fmt(v, 0)} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(v) => `spot ${fmt(Number(v), 1)}`}
              formatter={(value, name) => [fmt(Number(value)), String(name)]}
            />
            <ReferenceLine x={p.k} stroke={chartColors.dim} strokeDasharray="4 4" label={{ value: "strike", fill: chartColors.axis, fontSize: 11, position: "top" }} />
            <ReferenceLine x={p.s0} stroke={chartColors.kelp} strokeDasharray="2 4" label={{ value: "spot now", fill: chartColors.kelp, fontSize: 11, position: "insideTopRight" }} />
            <Line
              name="Payoff at expiry"
              dataKey="payoff"
              stroke={chartColors.dim}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              name="Value today (Black–Scholes)"
              dataKey="value"
              stroke={chartColors.ember}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/50">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 bg-ember" /> value today
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 bg-white/30" /> payoff at expiry
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Intrinsic value" value={fmt(intrinsic, 4)} sub={`${moneyness(p, kind)} right now`} />
        <Stat
          label="Time value"
          value={fmt(timeValue, 4)}
          sub={price > 1e-9 ? `${fmt((100 * timeValue) / price, 0)}% of the price` : undefined}
        />
        <Stat label="Chance of finishing in the money" value={`${fmt(100 * chance, 1)}%`} sub="under the model's risk-neutral measure" />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/45">
        The grey line is what the option pays at expiry. The orange curve is what it is worth today:
        always above the payoff, because there is still time for the price to move. Shorten the
        expiry or lower the volatility and the curve collapses onto the payoff; lengthen it or raise
        the volatility and it lifts away.
      </p>
    </div>
  );
}
