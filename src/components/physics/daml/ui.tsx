"use client";

import React, { useEffect, useId, useState } from "react";

/**
 * Shared building blocks for the two coursework pages (mini-cms, exotic-search):
 * the same widgets as the other research reports, with figures passed in as
 * objects so each page keeps its own list.
 */

export interface Fig {
  src: string;
  alt: string;
  caption: string;
  /** Intrinsic pixel size, so the browser can reserve space before a lazy image loads. */
  w?: number;
  h?: number;
  /** Where it came from, e.g. "Project 3 notebook". */
  source?: string;
}

export function Widget({ eyebrow = "Interactive", title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="my-12 rounded-2xl border border-[var(--accent-border)] bg-white/[0.03] p-5 md:p-8 shadow-[0_0_40px_rgba(255,107,61,0.08)]">
      <p className="text-xs font-mono tracking-[0.02em] text-[var(--accent)] mb-2">{eyebrow}</p>
      <h3 className="font-bodoni text-2xl md:text-3xl text-white mb-5">{title}</h3>
      {children}
    </div>
  );
}

export function Callout({ tone = "note", title, children }: { tone?: "note" | "warn"; title: string; children: React.ReactNode }) {
  const c = tone === "warn" ? "border-[var(--accent)]/50 bg-[var(--accent)]/[0.07]" : "border-[#2F9E7C]/50 bg-[#2F9E7C]/[0.07]";
  const t = tone === "warn" ? "text-[var(--accent)]" : "text-[#5FD0A8]";
  return (
    <aside className={`my-8 rounded-xl border-l-4 ${c} p-5 text-base`}>
      <p className={`text-xs font-mono tracking-[0.02em] mb-2 ${t}`}>{title}</p>
      <div className="text-white/70 leading-relaxed space-y-3">{children}</div>
    </aside>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center">
      <div className="font-bodoni text-3xl text-white">{value}</div>
      <div className="mt-1 text-xs tracking-wide text-white/50">{label}</div>
    </div>
  );
}

/** A plot on a light card (the notebook plots have white backgrounds), click to enlarge. */
export function Figure({ fig, className = "" }: { fig: Fig; className?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <figure className={`my-6 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full rounded-xl bg-white p-2 shadow-lg hover:shadow-[0_0_30px_rgba(255,107,61,0.25)] transition-shadow cursor-zoom-in"
        aria-label={`Enlarge: ${fig.alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fig.src} alt={fig.alt} width={fig.w} height={fig.h} loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
      </button>
      <figcaption className="mt-3 text-sm text-white/55 leading-relaxed">
        {fig.caption} {fig.source && <span className="text-white/35">{fig.source}.</span>}
      </figcaption>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={fig.alt} className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fig.src} alt={fig.alt} className="max-h-[90vh] max-w-[95vw] rounded-lg bg-white p-2" />
          <button type="button" className="absolute top-4 right-4 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      )}
    </figure>
  );
}

/** Inline jargon with a plain-English tooltip. */
export function Term({ children, def }: { children: React.ReactNode; def: string }) {
  return (
    <abbr title={def} className="cursor-help underline decoration-dotted decoration-white/40 underline-offset-4">
      {children}
    </abbr>
  );
}

export function Slider({
  label, value, min, max, step, onChange, format, hint,
}: {
  label: React.ReactNode; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string; hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm text-white/65">
        <span>{label}</span>
        <span className="font-mono text-[var(--accent)] text-xs whitespace-nowrap">{format(value)}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-[var(--accent)] mt-1" />
      {hint && <p className="text-[11px] text-white/40 mt-0.5">{hint}</p>}
    </div>
  );
}

export function Seg<T extends string>({ label, value, options, onChange }: { label?: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div>
      {label && <p className="text-xs tracking-normal text-white/45 mb-1.5">{label}</p>}
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${value === v ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/70 hover:bg-white/10"}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export const COL = { ember: "#FF6B3D", kelp: "#3FBF95", sky: "#7FB7FF", gold: "#F2C14E", violet: "#B79CFF", grey: "#9AA3AD", white: "#F2F4F7" };

/* page furniture shared by both reports */

export const P = ({ children }: { children: React.ReactNode }) => <p className="max-w-[44rem]">{children}</p>;

export const H2 = ({ id, n, children }: { id: string; n: number; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-32 font-bodoni text-3xl md:text-4xl font-medium text-white pt-14 max-w-[44rem]">
    <span className="font-mono text-sm text-[var(--accent)] mr-3 align-middle">{String(n).padStart(2, "0")}</span>
    {children}
  </h2>
);

export const Plain = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-[44rem] my-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
    <p className="text-xs font-mono tracking-[0.02em] text-white/45 mb-2">In plain English</p>
    <div className="text-white/70 text-base leading-relaxed">{children}</div>
  </div>
);

export const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className="text-[var(--accent)]/90 hover:text-[var(--accent)] underline underline-offset-4" href={href}>
    {children}
  </a>
);

/** Tiny seeded generator so server and client render the same dots. */
export function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
