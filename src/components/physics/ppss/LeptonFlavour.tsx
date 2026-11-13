"use client";

import { useState } from "react";
import { Widget } from "./ui";

/** Quantum numbers of the particles used below. Anything not listed is 0. */
type Q = { Q: number; B: number; Le: number; Lm: number };
const z = (p: Partial<Q>): Q => ({ Q: 0, B: 0, Le: 0, Lm: 0, ...p });

const PARTICLES: Record<string, Q> = {
  "Λc⁺": z({ Q: 1, B: 1 }),
  p: z({ Q: 1, B: 1 }),
  "e⁻": z({ Q: -1, Le: 1 }),
  "e⁺": z({ Q: 1, Le: -1 }),
  "μ⁻": z({ Q: -1, Lm: 1 }),
  "μ⁺": z({ Q: 1, Lm: -1 }),
  γ: z({}),
  "ν̄ₑ": z({ Le: -1 }),
  "νμ": z({ Lm: 1 }),
};

const DECAYS = [
  { id: "mu", label: "μ⁻ → e⁻ ν̄ₑ νμ", note: "Ordinary muon decay. The neutrinos carry the flavour away.", from: ["μ⁻"], to: ["e⁻", "ν̄ₑ", "νμ"] },
  { id: "mug", label: "μ⁻ → e⁻ γ", note: "No neutrinos to carry the flavour away, so a muon would simply turn into an electron.", from: ["μ⁻"], to: ["e⁻", "γ"] },
  { id: "sig", label: "Λc⁺ → p e⁻ μ⁺", note: "This project's signal channel.", from: ["Λc⁺"], to: ["p", "e⁻", "μ⁺"] },
  { id: "sig2", label: "Λc⁺ → p e⁺ μ⁻", note: "Its partner: the search covers both charge combinations.", from: ["Λc⁺"], to: ["p", "e⁺", "μ⁻"] },
  { id: "ref", label: "Λc⁺ → p μ⁺ μ⁻", note: "Allowed. This is the final state of the reference channel (via a φ meson).", from: ["Λc⁺"], to: ["p", "μ⁺", "μ⁻"] },
];

const sum = (names: string[], k: keyof Q) => names.reduce((s, n) => s + PARTICLES[n][k], 0);

const LAWS: { k: keyof Q; name: string }[] = [
  { k: "Q", name: "Electric charge" },
  { k: "B", name: "Baryon number" },
  { k: "Le", name: "Electron-flavour number" },
  { k: "Lm", name: "Muon-flavour number" },
];

export default function LeptonFlavour() {
  const [id, setId] = useState("sig");
  const d = DECAYS.find((x) => x.id === id)!;
  const rows = LAWS.map((l) => {
    const a = sum(d.from, l.k);
    const b = sum(d.to, l.k);
    return { ...l, a, b, ok: a === b };
  });
  const flavourBroken = rows.filter((r) => (r.k === "Le" || r.k === "Lm") && !r.ok).length > 0;
  const totalL = sum(d.to, "Le") + sum(d.to, "Lm") - (sum(d.from, "Le") + sum(d.from, "Lm"));

  return (
    <Widget title="Which conservation laws does a decay break?">
      <p className="text-sm text-white/55 mb-4">
        Pick a decay. The table adds up each quantity before and after. Everything is computed from a small particle table, nothing is typed in by hand.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {DECAYS.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            aria-pressed={x.id === id}
            className={`px-3 py-2 rounded-lg text-sm font-mono border transition-colors ${
              x.id === id ? "bg-ember text-abyss border-ember font-bold" : "border-white/20 text-white/70 hover:bg-white/10"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <p className="text-white/70 mb-4">{d.note}</p>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Before</th>
              <th className="px-4 py-3 font-medium">After</th>
              <th className="px-4 py-3 font-medium">Kept?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-t border-white/10">
                <td className="px-4 py-3 text-white">{r.name}</td>
                <td className="px-4 py-3 font-mono">{r.a > 0 ? `+${r.a}` : r.a}</td>
                <td className="px-4 py-3 font-mono">{r.b > 0 ? `+${r.b}` : r.b}</td>
                <td className={`px-4 py-3 font-semibold ${r.ok ? "text-[#5FD0A8]" : "text-[var(--accent)]"}`}>{r.ok ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-white/70" aria-live="polite">
        {flavourBroken ? (
          <>
            This decay <strong className="text-[var(--accent)]">changes lepton flavour</strong>.{" "}
            {totalL === 0
              ? "Total lepton number (electron plus muon) still adds up: one flavour appears and the other disappears."
              : "Total lepton number changes as well."}
          </>
        ) : (
          <>Every flavour number is kept, so the Standard Model allows it.</>
        )}
      </p>
    </Widget>
  );
}
