"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { lifeSteps } from "@/data/euco-ticketing-case-study";

type Row = Record<string, string | number | null>;

function Table({ title, rows, prev }: { title: string; rows: Row | null; prev: Row | null }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-4 font-mono text-xs">
      <div className="text-zinc-500 uppercase tracking-widest mb-2">{title}</div>
      {rows === null ? (
        <div className="text-zinc-600 italic">no row yet</div>
      ) : (
        <dl className="space-y-1">
          {Object.entries(rows).map(([k, v]) => {
            const changed = !prev || prev[k] !== v;
            return (
              <div key={k} className={`flex justify-between gap-4 rounded px-2 py-0.5 ${changed ? "bg-indigo-500/15 text-white" : "text-zinc-400"}`}>
                <dt>{k}</dt>
                <dd className="text-right break-all">{v === null ? "null" : String(v)}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}

export default function LifecycleStepper() {
  const [i, setI] = useState(0);
  const step = lifeSteps[i];
  const prev = i > 0 ? lifeSteps[i - 1] : null;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <ol className="lg:col-span-2 space-y-2">
        {lifeSteps.map((s, idx) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setI(idx)}
              aria-current={idx === i ? "step" : undefined}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                idx === i ? "border-indigo-400/70 bg-indigo-500/10" : "border-white/10 bg-zinc-900/40 hover:border-white/25"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${idx <= i ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400"}`}>{idx + 1}</span>
                <span>
                  <span className="block text-sm font-semibold text-white">{s.title}</span>
                  <span className="block text-xs text-zinc-500">{s.who}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-zinc-900/50 p-6" aria-live="polite">
        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
        <p className="text-zinc-400 leading-relaxed mb-5">{step.body}</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <Table title="orders" rows={step.order} prev={prev?.order ?? null} />
          <Table title="tickets" rows={step.ticket} prev={prev?.ticket ?? null} />
        </div>
        <p className="flex gap-2 text-sm text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" /> {step.guard}
        </p>
        <div className="flex justify-between mt-5">
          <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} className="inline-flex items-center gap-1 text-sm text-zinc-300 disabled:opacity-30 hover:text-white">
            <ChevronLeft size={16} /> Back
          </button>
          <button type="button" onClick={() => setI(Math.min(lifeSteps.length - 1, i + 1))} disabled={i === lifeSteps.length - 1} className="inline-flex items-center gap-1 text-sm text-zinc-300 disabled:opacity-30 hover:text-white">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
