"use client";

import React, { useEffect, useState } from "react";
import { FIGS, type Fig } from "@/data/ppss";

/** Shared building blocks for the PPSS report. */

export function Widget({
  eyebrow = "Interactive",
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-12 rounded-2xl border border-[var(--accent-border)] bg-white/[0.03] p-5 md:p-8 shadow-[0_0_40px_rgba(255,107,61,0.08)]">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent)] mb-2">{eyebrow}</p>
      <h3 className="font-bodoni text-2xl md:text-3xl text-white mb-5">{title}</h3>
      {children}
    </div>
  );
}

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: "note" | "warn";
  title: string;
  children: React.ReactNode;
}) {
  const c = tone === "warn" ? "border-[var(--accent)]/50 bg-[var(--accent)]/[0.07]" : "border-[#2F9E7C]/50 bg-[#2F9E7C]/[0.07]";
  const t = tone === "warn" ? "text-[var(--accent)]" : "text-[#5FD0A8]";
  return (
    <aside className={`my-8 rounded-xl border-l-4 ${c} p-5 text-base`}>
      <p className={`text-xs font-mono uppercase tracking-[0.18em] mb-2 ${t}`}>{title}</p>
      <div className="text-white/70 leading-relaxed space-y-3">{children}</div>
    </aside>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center">
      <div className="font-bodoni text-3xl text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/45">{label}</div>
    </div>
  );
}

/** A plot on a light card (the plots have white backgrounds), click to enlarge. */
export function Figure({ id, className = "" }: { id: keyof typeof FIGS | Fig; className?: string }) {
  const fig: Fig = typeof id === "string" ? FIGS[id] : id;
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
        <img src={fig.src} alt={fig.alt} loading="lazy" className="w-full h-auto rounded-lg" />
      </button>
      <figcaption className="mt-3 text-sm text-white/55 leading-relaxed">
        {fig.caption} <span className="text-white/35">{fig.source}.</span>
      </figcaption>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fig.alt}
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fig.src} alt={fig.alt} className="max-h-[90vh] max-w-[95vw] rounded-lg bg-white p-2" />
          <button
            type="button"
            className="absolute top-4 right-4 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </figure>
  );
}

/** Inline jargon with a plain-English tooltip (also shown in the glossary). */
export function Term({ children, def }: { children: React.ReactNode; def: string }) {
  return (
    <abbr title={def} className="cursor-help underline decoration-dotted decoration-white/40 underline-offset-4">
      {children}
    </abbr>
  );
}

export const btn =
  "px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 disabled:opacity-30 transition-colors";
export const btnOn = "px-4 py-2 rounded-full bg-ember text-abyss font-bold hover:bg-ember/85 disabled:opacity-30";
