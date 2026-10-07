"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
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
  runningEstimate,
  simulatePaths,
  standardNormals,
  terminalDensity,
  type OptionKind,
  type OptionParams,
  type RunningPoint,
} from "@/lib/physics/options";
import {
  ChartSkeleton,
  Slider,
  Stat,
  Toggle,
  axisTick,
  chartColors,
  fmt,
  fmtInt,
  tooltipStyle,
  useIsClient,
  Card,
} from "./ui";

const PATHS_SHOWN = 40;
const PATH_STEPS = 80;

/* ───────────────────────── helpers ───────────────────────── */

/** ~60 log-spaced sample counts from a handful up to m, always ending exactly at m. */
function logCheckpoints(m: number): number[] {
  const start = Math.min(5, m);
  const out = new Set<number>();
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    out.add(Math.round(Math.exp(Math.log(start) + ((Math.log(m) - Math.log(start)) * i) / steps)));
  }
  out.add(m);
  return [...out].filter((n) => n >= 2 && n <= m).sort((a, b) => a - b);
}

const SUPERSCRIPT = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
function pow10Label(v: number): string {
  const k = Math.round(Math.log10(v));
  return `10${String(k)
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)])
    .join("")}`;
}

interface Bin {
  x: number;
  itm: number;
  otm: number;
  theory: number;
}

/** Histogram of simulated terminal prices as a density, with the lognormal density alongside. */
function buildHistogram(
  p: OptionParams,
  kind: OptionKind,
  z: Float64Array,
  antithetic: boolean,
): Bin[] {
  const drift = (p.r - p.q - 0.5 * p.sigma * p.sigma) * p.t;
  const s = p.sigma * Math.sqrt(p.t);
  const lo = p.s0 * Math.exp(drift - 3.5 * s);
  const hi = p.s0 * Math.exp(drift + 3.5 * s);
  const bins = 50;
  const width = (hi - lo) / bins;
  const counts = new Float64Array(bins);
  const limit = Math.min(z.length, 200_000);

  const add = (v: number) => {
    const idx = Math.floor((v - lo) / width);
    if (idx >= 0 && idx < bins) counts[idx]++;
  };
  for (let i = 0; i < limit; i++) {
    const e = s * z[i];
    add(p.s0 * Math.exp(drift + e));
    if (antithetic) add(p.s0 * Math.exp(drift - e));
  }
  const total = limit * (antithetic ? 2 : 1);

  return Array.from({ length: bins }, (_, i) => {
    const x = lo + (i + 0.5) * width;
    const density = counts[i] / (total * width);
    const inTheMoney = kind === "call" ? x > p.k : x < p.k;
    return {
      x,
      itm: inTheMoney ? density : 0,
      otm: inTheMoney ? 0 : density,
      theory: terminalDensity(p, x),
    };
  });
}

/* ───────────────────────── paths canvas ───────────────────────── */

function PathsCanvas({
  paths,
  p,
  kind,
}: {
  paths: Float64Array;
  p: OptionParams;
  kind: OptionKind;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const pad = { l: 46, r: 12, t: 12, b: 26 };
      const w = width - pad.l - pad.r;
      const h = height - pad.t - pad.b;

      let lo = Math.min(p.k, p.s0);
      let hi = Math.max(p.k, p.s0);
      for (let i = 0; i < paths.length; i++) {
        if (paths[i] < lo) lo = paths[i];
        if (paths[i] > hi) hi = paths[i];
      }
      const margin = 0.05 * (hi - lo || 1);
      lo -= margin;
      hi += margin;

      const x = (j: number) => pad.l + (w * j) / PATH_STEPS;
      const y = (v: number) => pad.t + h * (1 - (v - lo) / (hi - lo));

      // grid + y labels
      ctx.font = "11px ui-monospace, monospace";
      ctx.textBaseline = "middle";
      ctx.textAlign = "right";
      ctx.lineWidth = 1;
      const ticks = 4;
      for (let i = 0; i <= ticks; i++) {
        const v = lo + ((hi - lo) * i) / ticks;
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.beginPath();
        ctx.moveTo(pad.l, y(v));
        ctx.lineTo(width - pad.r, y(v));
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillText(fmt(v, 0), pad.l - 6, y(v));
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("today", pad.l, height - pad.b + 8);
      ctx.textAlign = "right";
      ctx.fillText(`expiry (${fmt(p.t, 2)}y)`, width - pad.r, height - pad.b + 8);

      // paths: out of the money first, in the money on top
      const stride = PATH_STEPS + 1;
      const count = paths.length / stride;
      for (const wantItm of [false, true]) {
        ctx.lineWidth = wantItm ? 1.3 : 1;
        ctx.strokeStyle = wantItm ? "rgba(255,107,61,0.6)" : "rgba(255,255,255,0.2)";
        for (let i = 0; i < count; i++) {
          const end = paths[i * stride + PATH_STEPS];
          if (payoff(end, p.k, kind) > 0 !== wantItm) continue;
          ctx.beginPath();
          for (let j = 0; j <= PATH_STEPS; j++) {
            const px = x(j);
            const py = y(paths[i * stride + j]);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // strike
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.l, y(p.k));
      ctx.lineTo(width - pad.r, y(p.k));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const labelW = ctx.measureText("strike").width + 10;
      ctx.fillStyle = "rgba(10,14,26,0.85)";
      ctx.fillRect(width - pad.r - labelW - 2, y(p.k) - 9, labelW, 18);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText("strike", width - pad.r - labelW + 3, y(p.k));

      // starting point
      ctx.fillStyle = chartColors.kelp;
      ctx.beginPath();
      ctx.arc(x(0), y(p.s0), 3.5, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [paths, p, kind]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={`${PATHS_SHOWN} simulated price paths from today to expiry. Orange paths finish in the money.`}
      className="block h-full w-full"
    />
  );
}

/* ───────────────────────── panel ───────────────────────── */

export default function MonteCarloPanel({ p, kind }: { p: OptionParams; kind: OptionKind }) {
  const isClient = useIsClient();
  const [nExp, setNExp] = useState(5); // 10^5 = 100,000 paths
  const [antithetic, setAntithetic] = useState(false);
  const [seed, setSeed] = useState(1);

  const deferredExp = useDeferredValue(nExp);
  const nTotal = Math.round(10 ** deferredExp);
  const m = antithetic ? Math.floor(nTotal / 2) : nTotal;
  const exact = bsPrice(p, kind);

  const sim = useMemo(() => {
    if (!isClient) return null;
    const z = standardNormals(m, seed);
    const run = runningEstimate(p, kind, z, antithetic, logCheckpoints(m));
    return { run, final: run[run.length - 1], hist: buildHistogram(p, kind, z, antithetic) };
  }, [isClient, p, kind, m, antithetic, seed]);

  const paths = useMemo(
    () => (isClient ? simulatePaths(p, PATHS_SHOWN, PATH_STEPS, seed + 12345) : null),
    [isClient, p, seed],
  );

  const runChart = useMemo(() => {
    if (!sim) return null;
    const { run, final } = sim;
    const ref: RunningPoint = run.find((r) => r.n >= 1000) ?? final;
    const half = Math.max(2.5 * 1.96 * ref.stdErr, 6 * 1.96 * final.stdErr, 1e-4);
    const ticks = [10, 100, 1e3, 1e4, 1e5, 1e6].filter((t) => t >= run[0].n && t <= final.n);
    return {
      data: run.map((r) => ({
        n: r.n,
        price: r.price,
        lower: r.price - 1.96 * r.stdErr,
        upper: r.price + 1.96 * r.stdErr,
      })),
      domain: [exact - half, exact + half] as [number, number],
      ticks,
      xDomain: [run[0].n, final.n] as [number, number],
    };
  }, [sim, exact]);

  const final = sim?.final;
  const zScore = final ? (final.price - exact) / final.stdErr : 0;

  return (
    <div className="space-y-5">
      <Card className="grid gap-5 md:grid-cols-[1fr_auto_auto] md:items-end">
        <Slider
          label="Number of paths N"
          value={nExp}
          min={2}
          max={6}
          step={0.25}
          onChange={setNExp}
          display={fmtInt(Math.round(10 ** nExp))}
          hint="Log scale, 100 to 1,000,000."
        />
        <div className="md:w-56">
          <Toggle
            label="Antithetic variates"
            checked={antithetic}
            onChange={setAntithetic}
            hint="Pair each random draw with its negative."
          />
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-lg border border-[var(--accent-border)] px-4 py-2 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--accent-muted)]"
        >
          Re-roll random numbers
        </button>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h4 className="mb-1 text-sm font-medium text-white">{PATHS_SHOWN} sample price paths</h4>
          <p className="mb-3 text-xs leading-snug text-white/40">
            Orange paths finish in the money. For the picture only: the estimate below draws terminal
            prices directly, which under this model is exact.
          </p>
          <div className="h-[260px] w-full">
            {paths ? <PathsCanvas paths={paths} p={p} kind={kind} /> : <ChartSkeleton height={260} />}
          </div>
        </Card>

        <Card>
          <h4 className="mb-1 text-sm font-medium text-white">Where the paths end</h4>
          <p className="mb-3 text-xs leading-snug text-white/40">
            Histogram of simulated terminal prices (up to 200,000 are binned) against the exact
            lognormal curve. The option pays out only in the orange region.
          </p>
          <div
            role="img"
            aria-label="Histogram of simulated terminal prices with the lognormal density overlaid"
            className="h-[260px] w-full"
          >
            {sim ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={sim.hist} margin={{ top: 22, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke={chartColors.grid} vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tick={axisTick}
                    stroke={chartColors.axis}
                    tickFormatter={(v: number) => fmt(v, 0)}
                    height={26}
                  />
                  <YAxis hide />
                  <Area type="step" dataKey="otm" stackId="h" stroke="none" fill={chartColors.dim} isAnimationActive={false} />
                  <Area type="step" dataKey="itm" stackId="h" stroke="none" fill={chartColors.ember} fillOpacity={0.7} isAnimationActive={false} />
                  <Line dataKey="theory" stroke={chartColors.kelp} strokeWidth={2} dot={false} isAnimationActive={false} />
                  <ReferenceLine x={p.k} stroke="rgba(255,255,255,0.55)" strokeDasharray="4 4" label={{ value: "strike", fill: chartColors.axis, fontSize: 11, position: "top" }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <ChartSkeleton height={260} />
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/50">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-2.5 w-4 rounded-sm bg-ember/70" /> simulated, pays out
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-5 bg-kelp" /> exact lognormal density
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Monte Carlo price"
          value={final ? fmt(final.price, 4) : "…"}
          sub={final ? `± ${fmt(final.stdErr, 4)} standard error` : undefined}
          emphasis
        />
        <Stat label="Black–Scholes price" value={fmt(exact, 4)} sub="the exact answer" />
        <Stat
          label="Difference"
          value={final ? `${zScore >= 0 ? "+" : "−"}${fmt(Math.abs(zScore), 2)} SE` : "…"}
          sub={final ? `${fmt(final.price - exact, 4)} in price` : undefined}
        />
        <Stat
          label="Exact price inside the 95% interval?"
          value={final ? (Math.abs(zScore) <= 1.96 ? "Yes" : "No") : "…"}
          sub={final ? `interval ${fmt(final.price - 1.96 * final.stdErr, 3)} to ${fmt(final.price + 1.96 * final.stdErr, 3)}` : undefined}
        />
      </div>

      <Card>
        <h4 className="mb-1 text-sm font-medium text-white">The estimate settling onto the answer</h4>
        <p className="mb-3 text-xs leading-snug text-white/40">
          Running Monte Carlo price as paths accumulate, with its 95% band. The band narrows like
          1/√N: a hundred times more paths for ten times the precision. In about 1 run in 20 the final
          band will miss the green line; press re-roll to see it happen.
        </p>
        <div
          role="img"
          aria-label="Running Monte Carlo price against number of paths, converging on the Black–Scholes price"
          className="h-[280px] w-full"
        >
          {runChart ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={runChart.data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis
                  dataKey="n"
                  type="number"
                  scale="log"
                  domain={runChart.xDomain}
                  ticks={runChart.ticks}
                  tickFormatter={pow10Label}
                  tick={axisTick}
                  stroke={chartColors.axis}
                  height={30}
                  label={{ value: "paths N", position: "insideBottom", offset: -2, fill: chartColors.axis, fontSize: 11 }}
                />
                <YAxis
                  domain={runChart.domain}
                  allowDataOverflow
                  tick={axisTick}
                  stroke={chartColors.axis}
                  width={50}
                  tickFormatter={(v: number) => fmt(v, 2)}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(v) => `${fmtInt(Number(v))} paths`}
                  formatter={(value, name) => [fmt(Number(value), 4), String(name)]}
                />
                <ReferenceLine y={exact} stroke={chartColors.kelp} strokeWidth={1.5} />
                <Line name="upper 95%" dataKey="upper" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" dot={false} isAnimationActive={false} />
                <Line name="lower 95%" dataKey="lower" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" dot={false} isAnimationActive={false} />
                <Line name="Monte Carlo estimate" dataKey="price" stroke={chartColors.ember} strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ChartSkeleton height={280} />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/50">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-5 bg-ember" /> Monte Carlo estimate
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-5 border-t border-dashed border-white/40" /> 95% band
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-5 bg-kelp" /> Black–Scholes (exact)
          </span>
        </div>
      </Card>
    </div>
  );
}
