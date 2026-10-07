"use client";

import "katex/dist/katex.min.css";
import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import CodePanel from "@/components/simulations/CodePanel";
import Playground from "./Playground";

/**
 * OPTION PRICING LAB — page content
 *
 * Same visual system as MphysContent (abyss + stars, ember glow, Bodoni
 * headlines, max-w-3xl reading column) with one wider section for the
 * playground. The numbers in the "Results" section are from the Python
 * library (optionlab); the playground is a TypeScript port of the same
 * engine (src/lib/physics/options.ts), checked against Python by
 * scripts/check-options.ts.
 */

const PYTHON_SOURCE = `def mc_price(p, kind="call", n_paths=100_000, seed=None, antithetic=False, z=None):
    """Monte Carlo price of a European option under geometric Brownian motion."""
    check_kind(kind)
    if z is None:
        rng = np.random.default_rng(seed)
        z = rng.standard_normal(n_paths // 2 if antithetic else n_paths)

    disc = exp(-p.r * p.t)
    if antithetic:
        # pair each draw Z with -Z; the pair averages are the independent samples
        samples = 0.5 * (
            payoff(terminal_price(p, z), p.k, kind) + payoff(terminal_price(p, -z), p.k, kind)
        )
        total = 2 * len(z)
    else:
        samples = payoff(terminal_price(p, z), p.k, kind)
        total = len(z)

    discounted = disc * samples
    return MCResult(
        price=float(discounted.mean()),
        std_err=float(discounted.std(ddof=1) / sqrt(len(discounted))),
        n_paths=total,
    )`;

const H2 = "font-bodoni text-3xl font-medium text-white mt-16 mb-6";
const P = "text-lg md:text-xl leading-relaxed text-white/60";

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-mono uppercase tracking-wider text-white/40">
            {head.map((h, i) => (
              <th key={h} className={`px-4 py-3 font-normal ${i === 0 ? "" : "text-right"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-white/5 last:border-0">
              {r.map((c, i) => (
                <td
                  key={i}
                  className={`px-4 py-3 ${i === 0 ? "text-white/80" : "text-right font-mono tabular-nums text-white/60"}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OptionPricingContent({ repoUrl }: { repoUrl?: string }) {
  return (
    <article className="relative min-h-screen overflow-hidden bg-abyss bg-stars pb-32 text-white/70 selection:bg-ember/30">
      {/* HEADER */}
      <header className="relative overflow-hidden border-b border-white/5 px-6 pb-20 pt-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-ember/15 blur-[130px]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <Link
            href="/research"
            className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Back to Research
          </Link>
          <div className="mb-6 flex flex-wrap gap-2">
            {["Monte Carlo", "Quantitative Finance", "Python", "TypeScript"].map((t) => (
              <span key={t} className="rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                {t}
              </span>
            ))}
          </div>
          <h1 className="mb-6 font-bodoni text-5xl font-medium leading-tight tracking-tight text-white [text-shadow:0_4px_40px_rgba(255,107,61,0.15)] md:text-7xl">
            Pricing an option three ways
          </h1>
          <p className="mb-10 text-xl font-light leading-relaxed text-white/50 md:text-2xl">
            Black–Scholes, Monte Carlo and finite-difference Greeks: three methods that should agree,
            and a playground to see what happens when the conditions change.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-medium text-white/40">
            <span>
              By <strong className="text-white/70">Paolo Minhas</strong>
            </span>
            <span>&bull;</span>
            <span>Independent learning project</span>
            {repoUrl && (
              <>
                <span>&bull;</span>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline"
                >
                  <Code2 size={14} /> View the code
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* INTRO */}
      <div className="mx-auto max-w-3xl space-y-6 px-6 pt-16">
        <p className="text-2xl font-light leading-relaxed text-white/80">
          Monte Carlo simulation is a standard tool in physics: Geant4, which I used for detector
          simulation on HIBEAM, is built on it. This project looks at the same idea from a different
          side, how it is used in finance to price and risk-manage derivatives.
        </p>
        <p className={P}>
          Under the Black–Scholes model the price of a European option can be written down exactly,
          which makes it a good test bed: the closed form tells you whether a simulation is right. The
          playground below lets you change the conditions and watch the methods respond.
        </p>
      </div>

      {/* PLAYGROUND */}
      <section id="playground" aria-labelledby="playground-title" className="mx-auto mt-14 max-w-6xl px-6">
        <h2 id="playground-title" className="mb-6 font-bodoni text-3xl font-medium text-white">
          Try it
        </h2>
        <Playground />
      </section>

      {/* HOW IT WORKS */}
      <div className="mx-auto max-w-3xl space-y-6 px-6">
        <h2 className={H2}>How the three methods work</h2>
        <p className={P}>
          A <em>call</em> pays <InlineMath math="\max(S_T - K,\,0)" /> at expiry, where{" "}
          <InlineMath math="S_T" /> is the asset price then and <InlineMath math="K" /> is the strike
          (a put pays <InlineMath math="\max(K - S_T,\,0)" />). The model assumes the price follows
          geometric Brownian motion, and under the risk-neutral measure that has an exact solution:
        </p>
        <BlockMath
          math={String.raw`S_T = S_0 \exp\!\Big(\big(r - q - \tfrac{1}{2}\sigma^2\big)T + \sigma\sqrt{T}\,Z\Big), \qquad Z \sim \mathcal{N}(0,1)`}
        />

        <h3 className="pt-4 text-xl font-semibold text-white">1. Black–Scholes closed form</h3>
        <p className={P}>Taking the discounted expected payoff exactly gives, for a call,</p>
        <BlockMath
          math={String.raw`C = S_0 e^{-qT}\,\Phi(d_1) - K e^{-rT}\,\Phi(d_2), \qquad d_{1,2} = \frac{\ln(S_0/K) + \big(r - q \pm \tfrac{1}{2}\sigma^2\big)T}{\sigma\sqrt{T}}`}
        />
        <p className={P}>
          with <InlineMath math="\Phi" /> the standard normal CDF. The Greeks (delta, gamma, vega,
          theta, rho) are its derivatives and have closed forms too. This is the benchmark.
        </p>

        <h3 className="pt-4 text-xl font-semibold text-white">2. Monte Carlo</h3>
        <p className={P}>
          Because <InlineMath math="S_T" /> is known exactly, no time-stepping is needed: draw{" "}
          <InlineMath math="Z" />, form the payoff, average and discount.
        </p>
        <BlockMath
          math={String.raw`V \approx \frac{e^{-rT}}{N}\sum_{i=1}^{N}\max\!\big(S_T^{(i)} - K,\,0\big), \qquad \mathrm{SE} = \frac{s}{\sqrt{N}}`}
        />
        <p className={P}>
          The standard error SE (<InlineMath math="s" /> is the sample standard deviation of the
          discounted payoffs) is what tells you how far to trust the answer, and it falls only as{" "}
          <InlineMath math="1/\sqrt{N}" />. <em>Antithetic variates</em> pair each draw{" "}
          <InlineMath math="Z" /> with <InlineMath math="-Z" /> and average the pair: the two payoffs
          are negatively correlated, so the average is less noisy for the same number of paths.
        </p>

        <h3 className="pt-4 text-xl font-semibold text-white">3. Greeks by bumping</h3>
        <BlockMath math={String.raw`\frac{\partial V}{\partial S} \approx \frac{V(S+h) - V(S-h)}{2h}`} />
        <p className={P}>
          With Monte Carlo prices this only works if both prices use the{" "}
          <em>same random numbers</em>. Otherwise each price carries independent noise, and dividing
          that noise by a small <InlineMath math="h" /> swamps the signal. Reusing the draws (common
          random numbers) makes the errors cancel. Gamma, a second difference, is the most
          sensitive to this.
        </p>

        {/* RESULTS */}
        <h2 className={H2}>Results from the Python library</h2>
        <p className={P}>
          The reference case is S = K = 100, r = 5%, σ = 20%, T = 1 year. The playground above is a
          TypeScript port of the same engine: its closed-form prices and Greeks agree with the Python
          values to about 10<sup>−15</sup>, which a script in the repository checks.
        </p>
        <Table
          head={["Method", "Call", "Put"]}
          rows={[
            ["Black–Scholes (closed form)", "10.4506", "5.5735"],
            ["Monte Carlo, 1M paths", "10.4276 ± 0.0147", "5.5608 ± 0.0086"],
            ["Monte Carlo, 1M paths, antithetic", "10.4284 ± 0.0104", "5.5576 ± 0.0066"],
          ]}
        />
        <p className={P}>
          The error shrinks as <InlineMath math="1/\sqrt{N}" />, as it should, and antithetic
          variates cut the standard error by about 30% here at no extra cost per path.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/option-pricing/convergence-dark.png"
          alt="Log-log plot of Monte Carlo RMS error against number of paths, following a 1/√N line, with antithetic variates lower than plain Monte Carlo."
          loading="lazy"
          className="w-full rounded-xl border border-white/10"
        />
        <p className="text-center text-xs text-white/40">RMS error against the Black–Scholes price, 30 seeds per point.</p>

        <Table
          head={["Greek (call)", "Analytic", "Common random numbers", "Independent draws"]}
          rows={[
            ["delta", "0.6368", "0.6368", "0.6463"],
            ["gamma", "0.01876", "0.01856", "−0.03789"],
            ["vega (per 1.00)", "37.524", "37.601", "39.521"],
          ]}
        />
        <p className={P}>
          Bump-and-reprice with 400,000 paths. With independent draws the gamma comes out negative,
          which is impossible for a long option. Across 100 repeated runs, sharing the random numbers
          cut the spread of the delta estimate by roughly a factor of 40.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/option-pricing/common_random_numbers-dark.png"
          alt="Strip plot of 100 delta estimates: widely scattered with independent draws, tightly clustered on the analytic value with common random numbers."
          loading="lazy"
          className="w-full rounded-xl border border-white/10"
        />

        {/* LIMITATIONS */}
        <h2 className={H2}>Limitations</h2>
        <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-white/60 marker:text-white/30">
          <li>Constant volatility (geometric Brownian motion), so no volatility smile or skew.</li>
          <li>European exercise only: no early exercise and no path-dependent payoffs.</li>
          <li>Gamma by bumping is noisy because the payoff has a kink. Pathwise or likelihood-ratio estimators are the usual fix.</li>
          <li>A learning project, not a trading tool. It uses no market data and the numbers are not advice.</li>
        </ul>

        {/* CODE */}
        <h2 className={H2}>The code</h2>
        <p className={P}>
          The Python library has 20 tests: put–call parity, the Monte Carlo price landing within a few
          standard errors of Black–Scholes, the 1/√N scaling, and the bump-and-reprice Greeks against
          the analytic ones. The core of the Monte Carlo pricer:
        </p>
        <CodePanel code={PYTHON_SOURCE} language="python" caption="optionlab/mc.py: mc_price" />
        {repoUrl && (
          <p className={P}>
            The full library, tests and the script that regenerates these figures are{" "}
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
              on GitHub
            </a>
            .
          </p>
        )}
      </div>
    </article>
  );
}
