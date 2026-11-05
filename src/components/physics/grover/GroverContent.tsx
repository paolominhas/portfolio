"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import results from "@/data/grover-results.json";
import {
  MAX_QUBITS,
  bits,
  meanOf,
  optimalIterations,
  stages,
  successProbability,
} from "@/lib/physics/grover";

/**
 * GROVER CONTENT
 * ─────────────────────────────────────────────────────────────────
 * Same skin as the other physics pages (abyss, bg-stars, ember/kelp accents,
 * font-bodoni headings). Three parts:
 *   1. the idea, in words;
 *   2. a playground that runs Grover on a plain amplitude array and shows
 *      the oracle and diffuser one half-step at a time;
 *   3. the results from the Qiskit repo: exact, noisy simulation, and
 *      (only if a hardware file has been merged in) real IBM hardware.
 * Results come from src/data/grover-results.json, which is a copy of the
 * grover repo's results/site.json. Nothing here calls IBM.
 */

/* ------------------------------ results types ------------------------------ */

interface RunRow {
  n_qubits: number;
  marked: string;
  iterations: number;
  shots: number;
  success_probability: number;
  ideal_probability: number;
  random_guess_probability: number;
  depth?: number;
  two_qubit_gates?: number;
}
interface RunFile {
  kind: string;
  backend?: string;
  date?: string;
  shots?: number;
  results?: RunRow[];
}
interface SiteResults {
  generated?: string;
  ideal?: { sizes?: Record<string, { marked: string; k_opt: number; p_exact: number[]; p_theory: number[] }> };
  noisy?: RunFile[];
  hardware?: RunFile[];
}
const R = results as unknown as SiteResults;

const pct = (x: number) => `${(x * 100).toFixed(x < 0.1 ? 1 : 0)}%`;

/* ------------------------------ playground ------------------------------ */

function Playground() {
  const [n, setN] = useState(4);
  const [marked, setMarked] = useState(5);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);

  const N = 2 ** n;
  const kOpt = optimalIterations(n);
  const maxIter = Math.min(kOpt * 2 + 1, 12);
  const all = useMemo(() => stages(n, marked, maxIter), [n, marked, maxIter]);
  const cur = all[stage];
  const k = Math.floor(stage / 2);
  const mid = stage % 2 === 1;
  const mean = meanOf(cur.amps);
  const pMarked = cur.amps[marked] ** 2;

  // Reset when the problem changes.
  useEffect(() => {
    setStage(0);
    setPlaying(false);
  }, [n, marked]);

  useEffect(() => {
    if (!playing) return;
    if (stage >= all.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStage((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [playing, stage, all.length]);

  const changeN = (v: number) => {
    setN(v);
    setMarked((m) => Math.min(m, 2 ** v - 1));
  };

  // Bar chart geometry
  const W = 640;
  const H = 280;
  const mid0 = H / 2;
  const scale = (H / 2 - 18) / 1; // amplitude 1 fills the half-height
  const bw = W / N;

  // Probability curve geometry
  const curveK = Math.min(kOpt * 2 + 2, 14);
  const pts = Array.from({ length: curveK + 1 }, (_, i) => successProbability(n, i));
  const CW = 640;
  const CH = 150;
  const cx = (i: number) => 24 + (i / curveK) * (CW - 48);
  const cy = (p: number) => CH - 20 - p * (CH - 40);

  return (
    <div className="my-12 rounded-2xl border border-[var(--accent-border)] bg-white/[0.03] p-5 md:p-8 shadow-[0_0_40px_rgba(255,107,61,0.08)]">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent)] mb-2">Interactive</p>
          <h3 className="font-bodoni text-2xl md:text-3xl text-white">Search {N} items for one</h3>
        </div>
        <label className="text-sm text-white/60 flex items-center gap-3">
          <span className="whitespace-nowrap">
            Qubits <strong className="text-white">{n}</strong>
          </span>
          <input
            type="range"
            min={2}
            max={MAX_QUBITS}
            value={n}
            onChange={(e) => changeN(Number(e.target.value))}
            aria-label="Number of qubits"
            className="accent-[#FF6B3D]"
          />
        </label>
      </div>

      <p className="text-sm text-white/50 mb-3">
        Bars are amplitudes, one per item. Click a bar to choose which item is marked (the one the oracle recognises).
        The dashed line is the mean amplitude.
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-lg bg-abyss border border-white/10"
        role="img"
        aria-label={`Amplitude of each of ${N} items after ${k} iterations`}
      >
        <line x1={0} x2={W} y1={mid0} y2={mid0} stroke="rgba(255,255,255,0.25)" />
        {cur.amps.map((a, i) => {
          const h = Math.abs(a) * scale;
          const isM = i === marked;
          return (
            <g key={i} onClick={() => setMarked(i)} style={{ cursor: "pointer" }}>
              <rect x={i * bw} y={0} width={bw} height={H} fill="transparent" />
              <rect
                x={i * bw + bw * 0.12}
                y={a >= 0 ? mid0 - h : mid0}
                width={bw * 0.76}
                height={Math.max(h, 0.5)}
                rx={1.5}
                fill={isM ? "#FF6B3D" : "#2F9E7C"}
                opacity={isM ? 1 : 0.75}
              />
            </g>
          );
        })}
        <line
          x1={0}
          x2={W}
          y1={mid0 - mean * scale}
          y2={mid0 - mean * scale}
          stroke="#ffffff"
          strokeDasharray="4 4"
          opacity={0.7}
        />
      </svg>
      {N <= 16 && (
        <div className="flex mt-1" aria-hidden>
          {Array.from({ length: N }, (_, i) => (
            <span
              key={i}
              className={`text-center font-mono text-[10px] ${i === marked ? "text-[var(--accent)]" : "text-white/30"}`}
              style={{ width: `${100 / N}%` }}
            >
              {bits(i, n)}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 text-white/80 min-h-[3rem]" aria-live="polite">
        {cur.label}.
      </p>
      <p className="text-sm text-white/50">
        Chance of measuring the marked item now: <strong className="text-white">{pct(pMarked)}</strong>
        {" "}(guessing: {pct(1 / N)}). Best number of iterations for {N} items: <strong className="text-white">{kOpt}</strong>.
      </p>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          onClick={() => setStage((s) => Math.max(0, s - 1))}
          disabled={stage === 0}
          className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 disabled:opacity-30"
        >
          Back
        </button>
        <button
          onClick={() => setStage((s) => Math.min(all.length - 1, s + 1))}
          disabled={stage >= all.length - 1}
          className="px-4 py-2 rounded-full bg-ember text-abyss font-bold hover:bg-ember/85 disabled:opacity-30"
        >
          Next half-step
        </button>
        <button
          onClick={() => {
            if (stage >= all.length - 1) setStage(0);
            setPlaying((p) => !p);
          }}
          className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setStage(0);
          }}
          className="px-4 py-2 rounded-full border border-white/20 text-white/60 hover:bg-white/10"
        >
          Reset
        </button>
      </div>
      <p className="sr-only">
        Stage {stage} of {all.length - 1}; {mid ? "between oracle and diffuser" : `after ${k} full iterations`}.
      </p>

      <h4 className="font-bodoni text-xl text-white mt-10 mb-2">Why you must stop at the right moment</h4>
      <p className="text-sm text-white/50 mb-3">
        Success probability after <InlineMath math="k" /> iterations. It rises, peaks, then falls again: Grover is a
        rotation, and carrying on rotates past the target.
      </p>
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="w-full h-auto rounded-lg bg-abyss border border-white/10"
        role="img"
        aria-label="Success probability against number of iterations"
      >
        <line x1={24} x2={CW - 24} y1={cy(0)} y2={cy(0)} stroke="rgba(255,255,255,0.2)" />
        <line x1={24} x2={CW - 24} y1={cy(1)} y2={cy(1)} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 5" />
        <polyline
          points={pts.map((p, i) => `${cx(i)},${cy(p)}`).join(" ")}
          fill="none"
          stroke="#2F9E7C"
          strokeWidth={2}
        />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={cx(i)}
            cy={cy(p)}
            r={i === k ? 6 : i === kOpt ? 5 : 3}
            fill={i === k ? "#FF6B3D" : "#2F9E7C"}
            stroke={i === kOpt ? "#fff" : "none"}
          />
        ))}
        {pts.map((_, i) => (
          <text key={i} x={cx(i)} y={CH - 4} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.4)">
            {i}
          </text>
        ))}
      </svg>
      <p className="text-xs text-white/40 mt-2">
        Orange dot: where the stepper is. White ring: the optimum, {kOpt} iteration{kOpt === 1 ? "" : "s"}. Horizontal
        axis: iterations.
      </p>
    </div>
  );
}

/* ------------------------------ results ------------------------------ */

function ResultsTable({ title, note, rows, measured = "Measured" }: { title: string; note: string; rows: RunRow[]; measured?: string }) {
  return (
    <div className="my-8">
      <h3 className="font-bodoni text-2xl text-white mb-1">{title}</h3>
      <p className="text-sm text-white/50 mb-4">{note}</p>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 font-medium">Qubits</th>
              <th className="px-4 py-3 font-medium">Iterations</th>
              <th className="px-4 py-3 font-medium">Ideal</th>
              <th className="px-4 py-3 font-medium">{measured}</th>
              <th className="px-4 py-3 font-medium">Guessing</th>
              <th className="px-4 py-3 font-medium">Two-qubit gates</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.n_qubits} className="border-t border-white/10">
                <td className="px-4 py-3 text-white">{r.n_qubits}</td>
                <td className="px-4 py-3">{r.iterations}</td>
                <td className="px-4 py-3">{pct(r.ideal_probability)}</td>
                <td className="px-4 py-3 text-white font-semibold">{pct(r.success_probability)}</td>
                <td className="px-4 py-3">{pct(r.random_guess_probability)}</td>
                <td className="px-4 py-3">{r.two_qubit_gates ?? "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Results() {
  const noisy = R.noisy?.[0];
  const hardware = R.hardware ?? [];
  return (
    <>
      {noisy?.results && (
        <ResultsTable
          title="Noisy simulation"
          note={`Simulated, not measured on a real chip: the noise model comes from a calibration snapshot of IBM's ${noisy.backend ?? "fake"} device (${noisy.shots ?? "?"} shots).`}
          rows={noisy.results}
        />
      )}
      {hardware.length > 0 ? (
        hardware.map((h, i) => (
          <ResultsTable
            key={i}
            title={`Real hardware${h.backend ? `: ${h.backend}` : ""}`}
            note={`Measured on a real IBM quantum computer${h.date ? ` on ${h.date.slice(0, 10)}` : ""} (${h.shots ?? "?"} shots per circuit).`}
            rows={h.results ?? []}
          />
        ))
      ) : (
        <div className="my-8 rounded-xl border border-dashed border-white/20 p-6 text-white/50">
          <h3 className="font-bodoni text-2xl text-white mb-1">Real hardware</h3>
          <p>
            No hardware run has been added yet. The numbers above are simulations, and I am not going to present them
            as anything else. The run is a button in the repository (it needs my IBM credentials, which live in GitHub
            secrets); once it has been done, this section fills in automatically.
          </p>
        </div>
      )}
    </>
  );
}

/* ------------------------------ page ------------------------------ */

export default function GroverContent() {
  return (
    <article className="min-h-screen bg-abyss bg-stars text-white/70 selection:bg-ember/30 pb-32 relative overflow-x-clip">
      <header className="relative pt-32 pb-16 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ember/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {["Quantum Computing", "Qiskit", "IBM Quantum"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-bodoni text-5xl md:text-7xl font-medium text-white tracking-tight mb-6 leading-tight">
            Grover&apos;s algorithm
          </h1>
          <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
            Searching an unsorted list in about √N steps instead of N/2: built in Qiskit, checked against the theory,
            and then pushed towards real, noisy hardware.
          </p>
          <p className="mt-8 text-sm font-medium text-white/40">
            By <strong className="text-white/70">Paolo Minhas</strong>
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-14 text-lg leading-relaxed space-y-6 text-white/60">
        <Link href="/research" className="inline-block text-sm text-[var(--accent)]/80 hover:text-[var(--accent)]">
          ← Back to research
        </Link>

        <h2 className="font-bodoni text-3xl font-medium text-white pt-6">The problem</h2>
        <p>
          You have <InlineMath math="N" /> boxes and exactly one contains a prize. You can open a box to check, but you
          have no clue which. On average you open half of them: about <InlineMath math="N/2" /> tries, and the cost
          grows in direct proportion to <InlineMath math="N" />.
        </p>
        <p>
          Grover&apos;s 1996 algorithm finds the prize with about <InlineMath math="\frac{\pi}{4}\sqrt{N}" /> checks. For
          a million boxes that is roughly 800 instead of 500,000. That is a real speed-up, but it is only a quadratic
          one. It is not the exponential speed-up that quantum computers are sometimes said to give for everything; for
          unstructured search, it can be proven that nothing does better.
        </p>

        <h2 className="font-bodoni text-3xl font-medium text-white pt-6">How it works</h2>
        <p>
          Start with <InlineMath math="n" /> qubits in an equal superposition of all <InlineMath math="N = 2^n" />{" "}
          items: each has the same amplitude <InlineMath math="1/\sqrt{N}" />, so measuring now is just a random guess.
          Then repeat two moves.
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong className="text-white">The oracle</strong> flips the sign of the marked item&apos;s amplitude and
            touches nothing else. It is a black box that recognises the answer without saying where it is.
          </li>
          <li>
            <strong className="text-white">The diffuser</strong> reflects every amplitude about the average. Because
            the marked item now sits below the average, it is thrown up above it, and a little more each time.
          </li>
        </ul>
        <p>
          Geometrically, each round rotates the state by an angle <InlineMath math="2\theta" /> towards the marked
          item, where <InlineMath math="\sin\theta = 1/\sqrt{N}" />. After <InlineMath math="k" /> rounds:
        </p>
        <BlockMath math="P(k) = \sin^2\!\big((2k+1)\,\theta\big), \qquad k_{\text{opt}} \approx \frac{\pi}{4}\sqrt{N}" />
        <p>
          Because it is a rotation, it overshoots if you keep going. Try it below: step through the sign flip and the
          reflection, and watch the probability curve.
        </p>

        <Playground />

        <h2 className="font-bodoni text-3xl font-medium text-white pt-6">The Qiskit version</h2>
        <p>
          The playground above shuffles a list of numbers. The real thing is a quantum circuit: Hadamard gates make the
          superposition, a multi-controlled Z gate (surrounded by X gates that select the target bit pattern) is the
          oracle, and Hadamards plus another multi-controlled Z make the diffuser. I built these by hand rather than
          using a library routine, then wrote tests that check the circuit&apos;s output probabilities against{" "}
          <InlineMath math="\sin^2((2k+1)\theta)" /> for every iteration count up to six qubits. A circuit that fails
          to match the formula is a bug, so the formula is the test.
        </p>

        <h2 className="font-bodoni text-3xl font-medium text-white pt-6">Results</h2>
        <p>
          Three ways of running the same circuits. The <em>ideal</em> numbers are exact. The <em>noisy simulation</em>{" "}
          adds the error rates from a snapshot of a real IBM device. <em>Real hardware</em> is a physical machine.
        </p>
        <div className="text-base">
          <ResultsTable
            title="Ideal"
            measured="Exact"
            note="Exact statevector results at the optimal number of iterations."
            rows={Object.entries(R.ideal?.sizes ?? {})
              .filter(([n]) => Number(n) <= 4)
              .map(([n, s]) => ({
                n_qubits: Number(n),
                marked: s.marked,
                iterations: s.k_opt,
                shots: 0,
                success_probability: s.p_exact[s.k_opt],
                ideal_probability: s.p_theory[s.k_opt],
                random_guess_probability: 1 / 2 ** Number(n),
              }))}
          />
          <Results />
        </div>

        <h2 className="font-bodoni text-3xl font-medium text-white pt-6">What the noise says</h2>
        <p>
          Grover needs the circuit to get deeper as the list grows, and every two-qubit gate adds error. In the noisy
          simulation the success probability falls from near-certain at two qubits to well below the ideal at four,
          while the circuit&apos;s two-qubit gate count climbs steeply (the table shows it). The quadratic speed-up
          only helps once the hardware is good enough to run the longer circuits faithfully, which today&apos;s
          devices are not, for problems of any useful size. That is the honest conclusion: this is a demonstration of
          the algorithm and of its limits, not a practical search engine.
        </p>

        <footer className="mt-20 pt-8 border-t border-white/10 text-base">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Notes</h4>
          <ul className="list-disc pl-6 space-y-2 text-white/50">
            <li>The marked item for each size is an arbitrary fixed choice so runs can be compared.</li>
            <li>Bitstrings follow Qiskit&apos;s convention: the rightmost bit is qubit 0.</li>
            <li>
              The website never contacts IBM. It displays a results file that is regenerated by a manual GitHub Action
              (credentials stay in GitHub secrets).
            </li>
          </ul>
        </footer>
      </div>
    </article>
  );
}
