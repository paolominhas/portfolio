"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Widget, Callout, btn } from "./ui";
import { LIMIT_DEFAULTS as D } from "@/data/ppss";

function Sci({ x, d = 2 }: { x: number; d?: number }) {
  if (!isFinite(x) || x === 0) return <>–</>;
  const e = Math.floor(Math.log10(Math.abs(x)));
  return (
    <>
      {(x / 10 ** e).toFixed(d)} × 10<sup>{e}</sup>
    </>
  );
}

type Key = "nSig" | "nRef" | "effSig" | "effRef" | "brA" | "brB" | "pdg";

export default function LimitCalculator() {
  const init: Record<Key, string> = {
    nSig: String(D.nSig),
    nRef: String(D.nRef),
    effSig: String(D.effSig),
    effRef: String(D.effRef),
    brA: String(D.brLcPphi),
    brB: String(D.brPhiMuMu),
    pdg: String(D.pdgLimit),
  };
  const [v, setV] = useState(init);
  const num = (k: Key) => parseFloat(v[k]);
  const set = (k: Key) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });

  const brRef = num("brA") * num("brB");
  const ratioYield = num("nSig") / num("nRef");
  const ratioEff = num("effRef") / num("effSig");
  const brSig = ratioYield * ratioEff * brRef;
  const vsPdg = num("pdg") / brSig;

  const fields: { k: Key; label: string; hint: string }[] = [
    { k: "nSig", label: "n_sig", hint: "signal yield used (final slide)" },
    { k: "nRef", label: "n_ref", hint: "reference-channel yield from the fit" },
    { k: "effSig", label: "ε_sig", hint: "efficiency for the signal channel" },
    { k: "effRef", label: "ε_ref", hint: "efficiency for the reference channel" },
    { k: "brA", label: "B(Λc⁺ → p φ)", hint: "1.05 × 10⁻³ (slides, PDG)" },
    { k: "brB", label: "B(φ → μ⁺μ⁻)", hint: "2.86 × 10⁻⁴ (slides, PDG)" },
    { k: "pdg", label: "Previous limit", hint: "1.9 × 10⁻⁵ (slides, PDG)" },
  ];

  return (
    <Widget title="From a yield to a branching-fraction limit">
      <div className="overflow-x-auto max-w-full py-1"><BlockMath math="\mathcal{B}_{\text{sig}} \;=\; \frac{n_{\text{sig}}}{n_{\text{ref}}}\times\frac{\varepsilon_{\text{ref}}}{\varepsilon_{\text{sig}}}\times\mathcal{B}_{\text{ref}}, \qquad \mathcal{B}_{\text{ref}}=\mathcal{B}(\Lambda_c^+\!\to p\phi)\,\mathcal{B}(\phi\to\mu^+\mu^-)" /></div>
      <p className="text-sm text-white/55 mb-4">
        The defaults are the numbers on the final slides. Change any of them and watch the answer move. Entries like <code className="font-mono">1.05e-3</code> work.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.k} className="block">
            <span className="text-xs text-white/50">{f.label} <span className="text-white/30">· {f.hint}</span></span>
            <input
              inputMode="decimal"
              value={v[f.k]}
              onChange={set(f.k)}
              aria-label={f.label}
              className="mt-1 w-full rounded-lg bg-abyss border border-white/15 px-3 py-2 font-mono text-sm text-white focus:border-[var(--accent)] outline-none"
            />
          </label>
        ))}
      </div>
      <div className="mt-4">
        <button className={btn} onClick={() => setV(init)}>Reset to the slide values</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mt-6 text-center" aria-live="polite">
        <div className="rounded-lg border border-white/10 p-3">
          <div className="text-xs uppercase tracking-wider text-white/40">n_sig / n_ref</div>
          <div className="font-bodoni text-2xl text-white">{isFinite(ratioYield) ? ratioYield.toFixed(4) : "–"}</div>
        </div>
        <div className="rounded-lg border border-white/10 p-3">
          <div className="text-xs uppercase tracking-wider text-white/40">ε_ref / ε_sig</div>
          <div className="font-bodoni text-2xl text-white">{isFinite(ratioEff) ? ratioEff.toFixed(4) : "–"}</div>
        </div>
        <div className="rounded-lg border border-white/10 p-3">
          <div className="text-xs uppercase tracking-wider text-white/40">B_ref</div>
          <div className="font-bodoni text-2xl text-white"><Sci x={brRef} d={3} /></div>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-[var(--accent)]/50 bg-[var(--accent)]/[0.07] p-5 text-center">
        <div className="text-xs uppercase tracking-wider text-white/45">Branching-fraction limit</div>
        <div className="font-bodoni text-3xl md:text-4xl text-white">B(Λc⁺ → p e μ) &lt; <Sci x={brSig} /></div>
        <div className="mt-2 text-sm text-white/60">
          {isFinite(vsPdg) ? `${vsPdg.toFixed(0)} times smaller than the previous limit you entered.` : ""}
        </div>
      </div>

      <Callout tone="warn" title="Checking the slides' arithmetic">
        <p>
          With the slide values this gives 2.78 × 10⁻⁸, which matches the &ldquo;≈ 2.8 × 10⁻⁸&rdquo; on the slide (a later summary slide says 2.9 × 10⁻⁸). The summary also says that is &ldquo;about 100 times smaller&rdquo; than the previous limit of 1.9 × 10⁻⁵, but 1.9 × 10⁻⁵ divided by 2.8 × 10⁻⁸ is about 680, so &ldquo;about 700 times&rdquo; is what the numbers say. I have left the slides as they are and noted it here.
        </p>
      </Callout>
    </Widget>
  );
}
