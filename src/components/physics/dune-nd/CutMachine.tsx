"use client";

import React, { useState } from "react";
import { btn, Widget } from "./ui";

/**
 * The three final-state cuts from the macros, written exactly as they are in the code, applied to a final state the
 * reader builds. A "final state" here is the list of particle counts the CAF event record stores (nP, nN, nipip, ...).
 */

interface FS {
  mu: boolean; // charged-current muon neutrino event: LepPDG == 13
  p: number;
  n: number;
  pip: number;
  pim: number;
  pi0: number;
  k: number; // nikp + nikm + nik0
  em: number; // niem: photons / electrons
  frag: number; // nNucleus: nuclear fragments
}
const EMPTY: FS = { mu: true, p: 0, n: 0, pip: 0, pim: 0, pi0: 0, k: 0, em: 0, frag: 0 };

/* InteractionType.C and RecoMethods.C: kHasQEFinalState */
const qeFS = (f: FS) => f.mu && f.p === 1 && f.n + f.pip + f.pim + f.pi0 + f.k + f.em + f.frag === 0;
/* InteractionType.C: kHasCC0PiFinalState */
const cc0piA = (f: FS) => f.mu && f.p >= 1 && f.pip + f.pim + f.pi0 === 0;
/* StackedHistogram.C: kCC0pi (no lepton or proton requirement; it relies on the mode cut it is combined with) */
const cc0piB = (f: FS) => f.pip + f.pim + f.pi0 === 0 && f.k + f.em + f.frag === 0;

const PRESETS: { name: string; fs: Partial<FS>; note: string }[] = [
  { name: "Clean CCQE", fs: { p: 1 }, note: "A muon and one proton: the textbook quasi-elastic final state." },
  { name: "CCQE, neutron also leaves", fs: { p: 1, n: 1 }, note: "Quasi-elastic at the vertex, but a neutron escapes (or is made in final-state interactions). It still counts as CC0π but not as a strict one-muon-one-proton event." },
  { name: "CCQE, proton knocks out another", fs: { p: 2 }, note: "Final-state interactions can turn one proton into two. The truth label is still CCQE; the strict cut rejects it." },
  { name: "2p2h (MEC)", fs: { p: 2 }, note: "Two nucleons knocked out together. The final state is identical to the line above, which is why the detector cannot tell them apart event by event." },
  { name: "RES, pion escapes", fs: { p: 1, pip: 1 }, note: "A Δ decays to a proton and a pion that gets out. It carries a pion, so both CC0π cuts reject it." },
  { name: "RES, pion absorbed", fs: { p: 1, n: 1 }, note: "The same Δ, but the pion is absorbed in the nucleus. The final state now looks quasi-elastic: this is how resonant events end up in a CC0π sample." },
  { name: "DIS", fs: { p: 2, pip: 1, pim: 1, pi0: 1 }, note: "A hadronic shower. It would have to lose every pion to enter CC0π." },
  { name: "Kaon produced", fs: { p: 1, k: 1 }, note: "No pions, so the InteractionType.C version of CC0π lets it through; the StackedHistogram.C version rejects it." },
];

function Row({ label, hint, v, set, max = 6 }: { label: string; hint?: string; v: number; set: (n: number) => void; max?: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
      <div className="min-w-0">
        <span className="text-white/80 text-sm">{label}</span>
        {hint && <span className="ml-2 font-mono text-[10px] text-white/35">{hint}</span>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button type="button" aria-label={`fewer ${label}`} onClick={() => set(Math.max(0, v - 1))} className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:bg-white/10">
          −
        </button>
        <span className="w-5 text-center font-mono text-white">{v}</span>
        <button type="button" aria-label={`more ${label}`} onClick={() => set(Math.min(max, v + 1))} className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:bg-white/10">
          +
        </button>
      </div>
    </div>
  );
}

function Verdict({ ok, name, code, why }: { ok: boolean; name: string; code: string; why: string }) {
  return (
    <div className={`rounded-xl border p-4 ${ok ? "border-[#2F9E7C]/60 bg-[#2F9E7C]/[0.08]" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-white text-sm font-semibold">{name}</p>
        <span className={`text-xs font-mono tracking-normal ${ok ? "text-[#5FD0A8]" : "text-white/40"}`}>{ok ? "passes" : "rejected"}</span>
      </div>
      <p className="font-mono text-[11px] text-white/40 mt-0.5">{code}</p>
      <p className="text-xs text-white/60 mt-2 leading-relaxed">{why}</p>
    </div>
  );
}

export default function CutMachine() {
  const [f, setF] = useState<FS>({ ...EMPTY, p: 1 });
  const [active, setActive] = useState<string | null>("Clean CCQE");
  const up = (k: keyof FS) => (v: number) => {
    setActive(null);
    setF((o) => ({ ...o, [k]: v }));
  };
  const pi = f.pip + f.pim + f.pi0;
  const others = f.n + f.pip + f.pim + f.pi0 + f.k + f.em + f.frag;
  const note = PRESETS.find((p) => p.name === active)?.note;

  return (
    <Widget eyebrow="Interactive · the code’s own logic" title="Which final states pass which cut?">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        Build a final state with the buttons, or start from a preset. The three verdicts are the three cuts exactly as they are written in the macros, so you can see for yourself why “one muon and one proton”, “CC0π” and “CCQE” are three different samples.
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={`${btn} text-sm ${active === p.name ? "!bg-ember !text-abyss !border-ember font-bold" : ""}`}
            onClick={() => {
              setActive(p.name);
              setF({ ...EMPTY, ...p.fs });
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs tracking-normal text-white/40 mb-2">Particles in the final state</p>
          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
            <span className="text-white/80 text-sm">
              Muon from a νμ charged-current event <span className="font-mono text-[10px] text-white/35">LepPDG == 13</span>
            </span>
            <button
              type="button"
              aria-pressed={f.mu}
              onClick={() => {
                setActive(null);
                setF((o) => ({ ...o, mu: !o.mu }));
              }}
              className={`px-3 py-1 rounded-full text-xs border ${f.mu ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/60"}`}
            >
              {f.mu ? "yes" : "no"}
            </button>
          </div>
          <Row label="Protons" hint="nP" v={f.p} set={up("p")} />
          <Row label="Neutrons" hint="nN" v={f.n} set={up("n")} />
          <Row label="π⁺" hint="nipip" v={f.pip} set={up("pip")} />
          <Row label="π⁻" hint="nipim" v={f.pim} set={up("pim")} />
          <Row label="π⁰" hint="nipi0" v={f.pi0} set={up("pi0")} />
          <Row label="Kaons" hint="nikp+nikm+nik0" v={f.k} set={up("k")} />
          <Row label="Photons / electrons" hint="niem" v={f.em} set={up("em")} />
          <Row label="Nuclear fragments" hint="nNucleus" v={f.frag} set={up("frag")} />
        </div>
        <div className="space-y-3">
          <Verdict
            ok={qeFS(f)}
            name="1 μ, 1 p (strict final state)"
            code="LepPDG == μ && nP == 1 && nothing else"
            why={
              qeFS(f)
                ? "Exactly one proton and nothing besides the muon."
                : !f.mu
                ? "Needs a muon from a νμ charged-current event."
                : f.p !== 1
                ? `Needs exactly one proton; this has ${f.p}.`
                : `Needs nothing else in the final state; this has ${others} other particle${others === 1 ? "" : "s"}.`
            }
          />
          <Verdict
            ok={cc0piA(f)}
            name="CC0π, as in InteractionType.C"
            code="LepPDG == μ && nP >= 1 && no pions"
            why={
              cc0piA(f)
                ? "A muon, at least one proton and no pions; neutrons, kaons and the rest are allowed."
                : !f.mu
                ? "Needs a muon from a νμ charged-current event."
                : f.p < 1
                ? "Needs at least one proton."
                : `Has ${pi} pion${pi === 1 ? "" : "s"}.`
            }
          />
          <Verdict
            ok={cc0piB(f)}
            name="CC0π, as in StackedHistogram.C"
            code="no pions && no kaons, EM or fragments"
            why={
              cc0piB(f)
                ? "No pions and no kaons, photons, electrons or fragments. This version never looks at the lepton or the protons: it relies on being combined with a mode cut."
                : pi > 0
                ? `Has ${pi} pion${pi === 1 ? "" : "s"}.`
                : `Has ${f.k + f.em + f.frag} kaon, EM or fragment particle${f.k + f.em + f.frag === 1 ? "" : "s"}.`
            }
          />
          {note && <p className="text-sm text-white/60 leading-relaxed border-l-2 border-[var(--accent)]/50 pl-4">{note}</p>}
          <p className="text-[11px] text-white/35">
            Whether an event is CCQE, MEC, RES or DIS is a different question: that is the generator’s <span className="font-mono">mode</span> label (1, 10, 4, 3), which exists only in simulation. These cuts use only what a detector could, in principle, see.
          </p>
        </div>
      </div>
    </Widget>
  );
}
