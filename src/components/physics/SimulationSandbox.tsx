"use client";

import type { ReactNode } from "react";

/**
 * SIMULATION SANDBOX
 * ─────────────────────────────────────────────────────────────────
 * The reusable wrapper for every /physics/simulations/[slug] page —
 * the warm, painterly, glassmorphism half of the two-reference brief
 * (the dark starfield half lives in physics/page.tsx, the index).
 *
 * Deliberately generic: it owns the layout chrome (gradient/grain
 * background, glass canvas frame, glass control panel, section
 * headings) and takes the actual simulation visual + controls as
 * props, so the *next* simulation built on this — Game of Life, SIRS,
 * Cahn-Hilliard, whichever's next — reuses this file unchanged and
 * only needs its own physics engine + canvas component (see
 * src/lib/physics/ising.ts and IsingCanvas.tsx for that pattern) plus
 * a page that wires sliders from the exports below into state.
 *
 * The thin white/translucent borders and backdrop-blur panels are the
 * "let the painterly background bleed through" treatment from the
 * reference — solid opaque cards would defeat the point of the warm
 * gradient sitting underneath.
 */

interface SimulationSandboxProps {
  title: string;
  subtitle?: string;
  canvas: ReactNode;
  controls: ReactNode;
  stats?: ReactNode;
  sourceCode?: ReactNode;
}

export default function SimulationSandbox({
  title,
  subtitle,
  canvas,
  controls,
  stats,
  sourceCode,
}: SimulationSandboxProps) {
  return (
    <div className="relative sandbox-gradient bg-canvas-grain min-h-screen pt-32 pb-24 px-6 md:px-10 overflow-hidden">
      {/* Ambient glow, atmospheric only — echoes the ember/kelp pairing from the index */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-kelp/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-ember/20 blur-[110px]"
      />

      <div className="relative max-w-6xl mx-auto">
        <header className="mb-10 md:mb-14 text-center md:text-left">
          <h1 className="font-bodoni text-4xl md:text-6xl font-medium tracking-tight text-white mb-3 [text-shadow:0_2px_24px_rgba(0,0,0,0.3)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/85 text-base md:text-lg max-w-2xl mx-auto md:mx-0 leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]">
              {subtitle}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-start">
          {/* Canvas stage */}
          <div className="relative aspect-square w-full rounded-2xl border border-white/40 bg-white/10 backdrop-blur-md p-3 md:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            {canvas}
          </div>

          {/* Control panel */}
          <div className="rounded-2xl border border-white/40 bg-white/15 backdrop-blur-md p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/70 mb-5">
              Controls
            </p>
            <div className="flex flex-col gap-5">{controls}</div>

            {stats && (
              <div className="mt-7 pt-6 border-t border-white/25">
                <p className="font-mono text-[11px] uppercase tracking-widest text-white/70 mb-4">
                  Live readout
                </p>
                <div className="grid grid-cols-2 gap-3">{stats}</div>
              </div>
            )}
          </div>
        </div>

        {sourceCode && <div className="mt-10 max-w-3xl">{sourceCode}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Control primitives — shared glass styling for every future sandbox page
// ---------------------------------------------------------------------------

interface SandboxSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function SandboxSlider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  formatValue,
}: SandboxSliderProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="font-mono text-xs text-white bg-black/20 px-2 py-0.5 rounded-full">
          {formatValue ? formatValue(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-white/30 accent-ember cursor-pointer"
      />
    </label>
  );
}

interface SandboxToggleOption<T extends string> {
  value: T;
  label: string;
}

interface SandboxToggleProps<T extends string> {
  label: string;
  value: T;
  options: SandboxToggleOption<T>[];
  onChange: (value: T) => void;
}

export function SandboxToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: SandboxToggleProps<T>) {
  return (
    <div>
      <span className="block text-sm font-medium text-white mb-2">{label}</span>
      <div className="flex rounded-full border border-white/40 bg-black/10 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
              value === opt.value
                ? "bg-white text-abyss"
                : "text-white/70 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SandboxStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/15 border border-white/20 px-3 py-2.5">
      <p className="font-mono text-[10px] uppercase tracking-wide text-white/60 mb-1">
        {label}
      </p>
      <p className="font-mono text-sm text-white font-semibold">{value}</p>
    </div>
  );
}

interface SandboxButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "solid" | "outline";
}

export function SandboxButton({
  onClick,
  children,
  variant = "outline",
}: SandboxButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
        variant === "solid"
          ? "bg-white text-abyss hover:bg-white/90"
          : "border border-white/40 text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
