"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  bsGreeks,
  fdGreeks,
  mulberry32,
  type OptionKind,
  type OptionParams,
} from "@/lib/physics/options";
import {
  Card,
  Slider,
  Stat,
  Toggle,
  axisTick,
  chartColors,
  fmt,
  fmtInt,
  useIsClient,
} from "./ui";

const REPEATS = 40;
const REPEAT_PATHS = 20_000;

interface Experiment {
  key: string;
  crn: number[];
  indep: number[];
  analytic: number;
  sdCrn: number;
  sdIndep: number;
}

const std = (xs: number[]) => {
  const m = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

export default function BumpingPanel({ p, kind }: { p: OptionParams; kind: OptionKind }) {
  const isClient = useIsClient();
  const [nExp, setNExp] = useState(5.25); // ≈ 178,000 paths
  const [spotBumpPct, setSpotBumpPct] = useState(1);
  const [volBumpPts, setVolBumpPts] = useState(1);
  const [crn, setCrn] = useState(true);
  const [antithetic, setAntithetic] = useState(true);
  const [seed, setSeed] = useState(0);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [running, setRunning] = useState(false);

  const deferredExp = useDeferredValue(nExp);
  const nPaths = Math.round(10 ** deferredExp);
  const analytic = bsGreeks(p, kind);

  const fd = useMemo(
    () =>
      isClient
        ? fdGreeks(p, kind, {
            nPaths,
            seed,
            spotBump: spotBumpPct / 100,
            volBump: volBumpPts / 100,
            antithetic,
            crn,
          })
        : null,
    [isClient, p, kind, nPaths, seed, spotBumpPct, volBumpPts, antithetic, crn],
  );

  const settingsKey = JSON.stringify([p, kind, spotBumpPct, volBumpPts]);

  const runExperiment = () => {
    setRunning(true);
    // Let the "running" state paint before the ~half-second of number-crunching.
    setTimeout(() => {
      const base = {
        nPaths: REPEAT_PATHS,
        spotBump: spotBumpPct / 100,
        volBump: volBumpPts / 100,
        antithetic: true,
      };
      const withCrn: number[] = [];
      const without: number[] = [];
      for (let s = 1; s <= REPEATS; s++) {
        withCrn.push(fdGreeks(p, kind, { ...base, seed: s, crn: true }).delta);
        without.push(fdGreeks(p, kind, { ...base, seed: s, crn: false }).delta);
      }
      setExperiment({
        key: settingsKey,
        crn: withCrn,
        indep: without,
        analytic: bsGreeks(p, kind).delta,
        sdCrn: std(withCrn),
        sdIndep: std(without),
      });
      setRunning(false);
    }, 40);
  };

  const rows = fd
    ? [
        { name: "Delta", unit: "per 1.00 in spot", a: analytic.delta, f: fd.delta, dp: 4 },
        { name: "Gamma", unit: "per 1.00 in spot", a: analytic.gamma, f: fd.gamma, dp: 5 },
        { name: "Vega", unit: "per vol point", a: analytic.vega * 0.01, f: fd.vega * 0.01, dp: 4 },
      ]
    : [];

  const strip = useMemo(() => {
    if (!experiment) return null;
    const rand = mulberry32(7);
    const jitter = () => (rand() - 0.5) * 0.45;
    const all = [...experiment.crn, ...experiment.indep, experiment.analytic];
    const pad = 0.01;
    return {
      indep: experiment.indep.map((x) => ({ x, y: 1 + jitter() })),
      crn: experiment.crn.map((x) => ({ x, y: 0 + jitter() })),
      domain: [Math.min(...all) - pad, Math.max(...all) + pad] as [number, number],
    };
  }, [experiment]);

  const stale = experiment !== null && experiment.key !== settingsKey;
  const negativeGamma = fd !== null && fd.gamma < 0;

  return (
    <div className="space-y-5">
      <Card>
        <p className="mb-5 text-sm leading-relaxed text-white/50">
          Greeks can also be measured without a formula: nudge an input, reprice, and divide the
          change by the nudge. With Monte Carlo that works only if the two prices share the{" "}
          <em className="text-white/70">same random numbers</em>. Switch that off and watch the
          answers fall apart.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <Slider
            label="Number of paths N"
            value={nExp}
            min={3}
            max={5.75}
            step={0.25}
            onChange={setNExp}
            display={fmtInt(Math.round(10 ** nExp))}
          />
          <Slider
            label="Spot bump"
            value={spotBumpPct}
            min={0.1}
            max={5}
            step={0.1}
            onChange={setSpotBumpPct}
            display={`${fmt(spotBumpPct, 1)}% of spot`}
            hint="Smaller bumps are more accurate in theory, but noisier."
          />
          <Slider
            label="Volatility bump"
            value={volBumpPts}
            min={0.1}
            max={4}
            step={0.1}
            onChange={setVolBumpPts}
            display={`${fmt(volBumpPts, 1)} vol points`}
          />
          <div className="grid gap-4">
            <Toggle
              label="Common random numbers"
              checked={crn}
              onChange={setCrn}
              hint="Reuse the same draws for every bumped price."
            />
            <Toggle label="Antithetic variates" checked={antithetic} onChange={setAntithetic} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="mt-5 rounded-lg border border-[var(--accent-border)] px-4 py-2 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--accent-muted)]"
        >
          Re-roll random numbers
        </button>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-white/40">
                <th className="py-2 pr-4 font-normal">Greek</th>
                <th className="py-2 pr-4 text-right font-normal">Analytic</th>
                <th className="py-2 pr-4 text-right font-normal">Bump and reprice</th>
                <th className="py-2 text-right font-normal">Error</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-white/30">
                    Computing…
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const err = r.f - r.a;
                  return (
                    <tr key={r.name} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 text-white">
                        {r.name} <span className="text-xs text-white/35">{r.unit}</span>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums text-white/70">{fmt(r.a, r.dp)}</td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums text-[var(--accent)]">{fmt(r.f, r.dp)}</td>
                      <td className="py-3 text-right font-mono tabular-nums text-white/60">
                        {err >= 0 ? "+" : "−"}
                        {fmt(Math.abs(err), r.dp)}
                        <span className="ml-2 text-xs text-white/30">
                          {Math.abs(r.a) > 1e-12 ? `${fmt(Math.abs(100 * err) / Math.abs(r.a), 1)}%` : ""}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {negativeGamma && (
          <p className="mt-4 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-muted)] px-4 py-3 text-sm text-white/70">
            That gamma is negative, which is impossible for a long option. It is pure noise: each
            bumped price was drawn independently, so the Monte Carlo error is far larger than the
            tiny price change being measured. Turn common random numbers back on.
          </p>
        )}
      </Card>

      <Card>
        <h4 className="mb-1 text-sm font-medium text-white">Is that one run typical? Repeat it {REPEATS} times.</h4>
        <p className="mb-4 text-xs leading-snug text-white/40">
          Estimates delta {REPEATS} times at {fmtInt(REPEAT_PATHS)} paths with different seeds, with and
          without common random numbers, using the bump sizes above.
        </p>
        <button
          type="button"
          onClick={runExperiment}
          disabled={!isClient || running}
          className="rounded-lg border border-[var(--accent-border)] px-4 py-2 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--accent-muted)] disabled:opacity-50"
        >
          {running ? "Running…" : experiment ? "Run again" : `Run ${REPEATS} repeats`}
        </button>

        {experiment && strip && (
          <div className="mt-5">
            {stale && (
              <p className="mb-3 text-xs text-white/40">
                The settings have changed since this run. Press &ldquo;Run again&rdquo; to update it.
              </p>
            )}
            <div
              role="img"
              aria-label={`${REPEATS} delta estimates with and without common random numbers. With: standard deviation ${fmt(experiment.sdCrn, 4)}. Without: ${fmt(experiment.sdIndep, 4)}.`}
              className="h-[180px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, bottom: 4, left: 16 }}>
                  <CartesianGrid stroke={chartColors.grid} horizontal={false} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={strip.domain}
                    tick={axisTick}
                    stroke={chartColors.axis}
                    tickFormatter={(v: number) => fmt(v, 2)}
                    height={28}
                  />
                  <YAxis type="number" dataKey="y" domain={[-0.6, 1.6]} hide />
                  <ReferenceLine x={experiment.analytic} stroke="rgba(255,255,255,0.6)" strokeDasharray="4 4" />
                  <Scatter data={strip.indep} fill={chartColors.ember} fillOpacity={0.8} isAnimationActive={false} />
                  <Scatter data={strip.crn} fill={chartColors.kelp} fillOpacity={0.9} isAnimationActive={false} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/50">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ember" /> independent draws (top row)
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-kelp" /> common random numbers (bottom row)
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-0.5 w-5 bg-white/60" /> analytic delta
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Stat label="Spread, independent" value={fmt(experiment.sdIndep, 4)} sub="standard deviation of delta" />
              <Stat label="Spread, common numbers" value={fmt(experiment.sdCrn, 4)} sub="standard deviation of delta" />
              <Stat
                label="Noise reduction"
                value={`×${fmt(experiment.sdIndep / experiment.sdCrn, 0)}`}
                sub="smaller spread with shared draws"
                emphasis
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
