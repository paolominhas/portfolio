"use client";

import { useId, useSyncExternalStore, type ReactNode } from "react";

/**
 * SHARED UI PRIMITIVES for the /research/option-pricing page.
 * Styled to match the rest of /physics (abyss background, ember accent,
 * white/opacity text), so the playground reads as part of the same site.
 */

/* ───────────────────────── client-only flag ───────────────────────── */

const subscribe = () => () => {};

/**
 * False during server render and hydration, true afterwards. The Monte Carlo
 * panels do real number-crunching, so they wait for this rather than running
 * on the server and risking a hydration mismatch.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/* ───────────────────────── chart theme ───────────────────────── */

export const chartColors = {
  grid: "rgba(255,255,255,0.08)",
  axis: "rgba(255,255,255,0.35)",
  text: "rgba(255,255,255,0.7)",
  ember: "#FF6B3D",
  kelp: "#2F9E7C",
  dim: "rgba(255,255,255,0.22)",
} as const;

export const tooltipStyle = {
  backgroundColor: "rgba(10,14,26,0.96)",
  border: "1px solid rgba(255,107,61,0.3)",
  borderRadius: 8,
  color: "#f8fafc",
  fontSize: 12,
} as const;

export const axisTick = { fill: chartColors.axis, fontSize: 11 } as const;

/* ───────────────────────── number formatting ───────────────────────── */

/** toFixed that never prints "-0.00". Avoids toLocaleString so server and client agree. */
export function fmt(x: number, dp = 2): string {
  if (!Number.isFinite(x)) return "–";
  const rounded = Number(x.toFixed(dp));
  return (rounded === 0 ? 0 : rounded).toFixed(dp);
}

export function fmtInt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ───────────────────────── components ───────────────────────── */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 ${className}`}>
      {children}
    </div>
  );
}

interface SliderProps {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  /** text shown for the current value, e.g. "20%" */
  display: string;
  hint?: string;
}

/** Keeps a maths symbol (σ, S, K...) in its own case inside an uppercase label. */
export function Sym({ children }: { children: ReactNode }) {
  return <span className="normal-case">{children}</span>;
}

export function Slider({ label, value, min, max, step, onChange, display, hint }: SliderProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label htmlFor={id} className="text-xs font-mono uppercase tracking-wider text-white/50">
          {label}
        </label>
        <span className="text-sm font-mono text-white tabular-nums">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={display}
        className="w-full h-1.5 rounded-full appearance-none bg-white/20 accent-ember cursor-pointer"
      />
      {hint && <p className="mt-1 text-[11px] leading-snug text-white/30">{hint}</p>}
    </div>
  );
}

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  /** used to link each tab to its panel (see panelId) */
  idPrefix: string;
  ariaLabel: string;
}

export const panelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;
const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;

export function Tabs<T extends string>({ tabs, value, onChange, idPrefix, ariaLabel }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            id={tabId(idPrefix, t.id)}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={panelId(idPrefix, t.id)}
            onClick={() => onChange(t.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  idPrefix,
  id,
  children,
}: {
  idPrefix: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={panelId(idPrefix, id)}
      aria-labelledby={tabId(idPrefix, id)}
      className="mt-4"
    >
      {children}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-xs font-mono uppercase tracking-wider text-white/50">{label}</span>
        <span
          aria-hidden
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
            checked ? "bg-ember" : "bg-white/20"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
              checked ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
      {hint && <p className="mt-1 text-[11px] leading-snug text-white/30">{hint}</p>}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  emphasis = false,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-[11px] font-mono uppercase tracking-wider text-white/40">{label}</div>
      <div
        className={`mt-1 font-mono tabular-nums ${
          emphasis ? "text-2xl text-[var(--accent)]" : "text-lg text-white"
        }`}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px] leading-snug text-white/35">{sub}</div>}
    </div>
  );
}

export function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      aria-hidden
      className="w-full animate-pulse rounded-xl bg-white/[0.04]"
      style={{ height }}
    />
  );
}
