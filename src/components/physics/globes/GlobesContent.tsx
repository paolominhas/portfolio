"use client";

import React from "react";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { Callout, Figure, Stat, Term } from "./ui";
import SectionNav, { type NavItem } from "./SectionNav";
import Beamline from "./Beamline";
import OscLab from "./OscLab";
import MixingMatrix from "./MixingMatrix";
import FluxPipeline from "./FluxPipeline";
import CodeWalk from "./CodeWalk";
import EventLab from "./EventLab";
import CpChi2 from "./CpChi2";
import SensitivityLab from "./SensitivityLab";
import Validation from "./Validation";
import { CAVEATS, GLOSSARY, NUMBERS as N, POSTER_PDF, REPO, REPORT_PDF, SETUP } from "@/data/globes";

/**
 * DUNE / GLoBES PROJECT PAGE
 * ─────────────────────────────────────────────────────────────────
 * Written like a report (question, method, results, checks) with a live widget wherever an idea is easier to
 * feel than to read. The widgets that use the project's own files say so; the ones that rest on my independent
 * re-implementation of the calculation (oscillation engine, event rates, sensitivity map) say that too, and the
 * "How far to trust this" section lists what was and was not reproduced. Numbers live in data/globes.ts.
 */

const NAV: NavItem[] = [
  { id: "question", label: "The question" },
  { id: "beam", label: "Beam and detectors" },
  { id: "physics", label: "The physics" },
  { id: "simulation", label: "The simulation" },
  { id: "statistics", label: "From events to a result" },
  { id: "standard", label: "Ordering and CP" },
  { id: "sterile", label: "A fourth neutrino" },
  { id: "trust", label: "How far to trust it" },
  { id: "further", label: "Further results" },
  { id: "more", label: "Sources" },
];

const P = ({ children }: { children: React.ReactNode }) => <p className="max-w-[44rem]">{children}</p>;

const H2 = ({ id, n, children }: { id: string; n: number; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-32 font-bodoni text-3xl md:text-4xl font-medium text-white pt-14 max-w-[44rem]">
    <span className="font-mono text-sm text-[var(--accent)] mr-3 align-middle">{String(n).padStart(2, "0")}</span>
    {children}
  </h2>
);

const Plain = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-[44rem] my-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
    <p className="text-xs font-mono tracking-[0.02em] text-white/40 mb-2">In plain English</p>
    <div className="text-white/70 text-base leading-relaxed">{children}</div>
  </div>
);

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className="text-[var(--accent)]/90 hover:text-[var(--accent)] underline underline-offset-4" href={href}>
    {children}
  </a>
);

export default function GlobesContent() {
  return (
    <article className="min-h-screen bg-abyss bg-stars text-white/65 selection:bg-ember/30 pb-32 relative overflow-x-clip">
      {/* ------------------------------ hero ------------------------------ */}
      <header className="relative pt-32 pb-14 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ember/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Link href="/research" className="inline-block text-sm text-[var(--accent)]/80 hover:text-[var(--accent)] mb-8">
            ← Back to research
          </Link>
          <div className="flex flex-wrap gap-2 mb-6">
            {["Neutrino physics", "DUNE", "GLoBES", "Simulation"].map((t) => (
              <span key={t} className="px-3 py-1 text-xs font-bold tracking-normal text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-bodoni text-5xl md:text-7xl font-medium text-white tracking-tight leading-tight mb-6">Looking for a fourth neutrino</h1>
          <p className="text-xl md:text-2xl text-white/55 leading-relaxed font-light max-w-3xl">
            Predicting what DUNE&rsquo;s near and far detectors could tell us about CP violation, the neutrino mass ordering and a hypothetical sterile neutrino, with the GLoBES simulator.
          </p>
          <p className="mt-8 text-sm text-white/40">
            <strong className="text-white/70">Paolo Minhas</strong> · supervised by Dr Gabriela Vitti Stenico · Career Development Summer Scholarship, School of Physics and Astronomy, University of Edinburgh · June–July 2025
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat value="1,284.9 km" label="far-detector baseline" />
            <Stat value="574 m" label="near-detector baseline" />
            <Stat value="3.5 + 3.5 yr" label="neutrino + antineutrino beam" />
            <Stat value="4 × 4" label="mixing matrix, 92 parameters" />
          </div>
        </div>
      </header>

      <SectionNav items={NAV} />

      <div className="max-w-4xl mx-auto px-6 text-lg leading-relaxed space-y-6">
        <Callout title="The short version">
          <p>
            DUNE will send a beam of neutrinos from Fermilab to a detector in South Dakota and watch the flavours change on the way. Before the data exist, physicists simulate what the experiment could learn. I used the standard tool, GLoBES, to recreate DUNE&rsquo;s published sensitivity to CP violation and the mass ordering, then extended it with a fourth, sterile neutrino and added the near detector.
          </p>
          <p>
            The result that stands out is the near detector: 574 m from the source it sees a sterile neutrino of around 1 eV² at the top of its oscillation, while the far detector loses sensitivity where the sterile splitting happens to match the ordinary atmospheric one. This page lets you run the physics, and after the results it shows the checks I made on the work since, including the places where the repository does not quite hold together.
          </p>
        </Callout>

        {/* ------------------------------ 1 ------------------------------ */}
        <H2 id="question" n={1}>The question</H2>
        <P>
          A neutrino made as one flavour (electron, muon or tau) can be found as another after it has travelled far enough, because the flavours are mixtures of states with slightly different masses. DUNE, the Deep Underground Neutrino Experiment, is built to measure that mixing precisely over roughly 1,300 km, and it is expected to start taking data in 2027.
        </P>
        <P>
          Three things are being asked of it. Does the oscillation of neutrinos differ from that of antineutrinos (CP violation, controlled by one phase, <InlineMath math="\delta_{CP}" />)? Is the third neutrino mass state heavier or lighter than the other two (the <Term def="Normal: the third mass state is the heaviest. Inverted: it is the lightest.">mass ordering</Term>)? And is there a <Term def="A hypothetical fourth neutrino that does not feel the weak force. It could only show itself through oscillations.">sterile neutrino</Term>, a fourth state with no weak interactions? Hints from older experiments, most famously LSND, once pointed that way; more recent results suggest a sterile neutrino is not the most likely explanation, but DUNE can still constrain what it would do.
        </P>
        <P>
          The project asks the predictive version: if the answer were one thing or the other, what would DUNE&rsquo;s data look like, and could it tell the difference? That is a statistics question as much as a physics one, and the answer is a <Term def="A number that grows as a prediction moves away from the data, weighted by how uncertain each bin is.">χ²</Term> map of which parameter values could be ruled out at 90% or 99% confidence.
        </P>
        <Plain>
          It is a forecast, not a measurement. We invent the data a detector would record if the world were standard, then ask how different a world with a sterile neutrino would look, once we include everything the detector cannot be sure of.
        </Plain>

        {/* ------------------------------ 2 ------------------------------ */}
        <H2 id="beam" n={2}>The beam and the two detectors</H2>
        <P>
          Protons hit a target; the particles that come off are focused by magnetic horns and decay in a long pipe into muons and neutrinos. With the horns in forward mode (FHC) the beam is mostly neutrinos; reversed (RHC) it is mostly antineutrinos. In the far-detector flux files the neutrino-mode beam is, by number between 0.5 and 8 GeV, about 93% muon neutrinos, 6% muon antineutrinos and under 1% electron-type, with the mirror image in antineutrino mode. The report assumes 3.5 years of each.
        </P>
        <P>
          The neutrinos are made all along the decay pipe, so from the near detector the source is a line, not a point. At 1,300 km that is negligible; at 574 m it matters, which is why the near detector in this project is described by several input files (see section 4).
        </P>
        <P>
          Why two detectors? The oscillation probability for a mass splitting <InlineMath math="\Delta m^2" /> depends on <InlineMath math="L/E" />, and a given splitting is only visible where <InlineMath math="L/E" /> is about right. Try it below: the ordinary splittings peak at 1,285 km, and a splitting of a few eV² peaks at hundreds of metres.
        </P>

        <Beamline />

        <Plain>
          Imagine two clocks with very different hand speeds. The far detector is the right distance to read the slow one (the ordinary neutrino masses); the near detector is the right distance to read the fast one (a heavy sterile neutrino). A fast clock is a blur from far away, but from close by it is clearly ticking.
        </Plain>

        {/* ------------------------------ 3 ------------------------------ */}
        <H2 id="physics" n={3}>The physics in the code</H2>
        <P>
          For two flavours the probability of changing from one to the other is
        </P>
        <div className="max-w-[44rem] overflow-x-auto">
          <BlockMath math="P_{\alpha\to\beta}=\sin^2(2\theta)\,\sin^2\!\left(\frac{\Delta m^2 L}{4E}\right)\;\approx\;\sin^2(2\theta)\,\sin^2\!\left(1.267\,\frac{\Delta m^2[\mathrm{eV}^2]\,L[\mathrm{km}]}{E[\mathrm{GeV}]}\right)" />
        </div>
        <P>
          In rock the electron neutrinos also scatter coherently on electrons, adding a potential <InlineMath math="V=\sqrt2\,G_F N_e" /> that changes the effective angle and splitting, with the opposite sign for antineutrinos. The real analysis needs three flavours, and for the sterile neutrino four. DUNE&rsquo;s two most important channels are muon-neutrino disappearance (<InlineMath math="\nu_\mu\to\nu_\mu" />) and electron-neutrino appearance (<InlineMath math="\nu_\mu\to\nu_e" />).
        </P>
        <P>
          For the sterile neutrino the report uses the short-baseline mass splitting <InlineMath math="\Delta m^2_{41}\sim1\,\mathrm{eV}^2" /> and, in an effective two-flavour picture,
        </P>
        <div className="max-w-[44rem] overflow-x-auto">
          <BlockMath math="P_{\nu_\mu\to\nu_\mu}\approx1-\sin^2(2\theta_{\mu\mu})\sin^2\!\left(\frac{\Delta m^2_{41}L}{4E}\right),\qquad P_{\nu_\mu\to\nu_e}\approx\sin^2(2\theta_{\mu e})\sin^2\!\left(\frac{\Delta m^2_{41}L}{4E}\right)" />
        </div>
        <P>
          The code does not use these approximations. The project used J. Kopp&rsquo;s SNU library, which builds a full mixing matrix from rotations and phases, adds the matter potential to the Hamiltonian, and solves for the probabilities exactly. Appendix B of the report lists the rotation order for three and for four flavours; below, the matrix is built that way.
        </P>

        <MixingMatrix />

        <P>
          The same calculation runs in the lab below: a 3 or 3+1 engine written for this page following the SNU Hamiltonian, with matter, both mass orderings, δCP, antineutrinos and all six sterile parameters. Section 8 shows how closely it matches GLoBES&rsquo; own output.
        </P>

        <OscLab />

        <Callout title="One thing to notice" tone="note">
          <p>
            Put the sterile splitting at the atmospheric value (the third preset) and look at νμ → νμ at the far detector: the sterile neutrino changes the curve in ways that a shifted Δm²₃₁ or θ₂₃ can partly imitate. That is why the report finds the far detector loses sensitivity there. It is hard to tell a fourth neutrino from a slightly different <InlineMath math="\Delta m^2_{31}" /> or <InlineMath math="\theta_{23}" />.
          </p>
        </Callout>

        {/* ------------------------------ 4 ------------------------------ */}
        <H2 id="simulation" n={4}>The simulation</H2>
        <P>
          GLoBES (the General Long Baseline Experiment Simulator) is a C library. You describe an experiment in a text file: the beam flux, the cross-sections, how a true energy is smeared into the energy the detector would reconstruct, how efficient each selection is, and the systematic error on every channel. GLoBES multiplies those with the oscillation probability to predict events per bin. The set-up in this project:
        </P>
        <div className="max-w-[44rem] overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/45 text-xs tracking-normal">
                <th className="px-4 py-2">Ingredient</th>
                <th className="px-4 py-2">Value</th>
                <th className="px-4 py-2 hidden sm:table-cell">Where</th>
              </tr>
            </thead>
            <tbody>
              {SETUP.map(([a, b, c]) => (
                <tr key={a} className="border-t border-white/5 align-top">
                  <td className="px-4 py-2 text-white/85 whitespace-nowrap">{a}</td>
                  <td className="px-4 py-2 text-white/65">{b}</td>
                  <td className="px-4 py-2 font-mono text-[11px] text-white/35 hidden sm:table-cell">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Below, the first two steps of that multiplication use the project&rsquo;s own flux and cross-section files, and the third uses the live engine.
        </P>

        <FluxPipeline />

        <P>
          And this is how it is wired together in C. The code is the repository&rsquo;s own, abridged.
        </P>

        <CodeWalk />

        <Plain>
          GLoBES normally knows only about three neutrinos. The trick of the project is to unplug its probability calculator and plug in a four-neutrino one from a library, then ask the same question as before, many times over a grid of sterile-neutrino parameters.
        </Plain>

        {/* ------------------------------ 5 ------------------------------ */}
        <H2 id="statistics" n={5}>From events to a result</H2>
        <P>
          The statistic is a χ² between a &ldquo;true&rdquo; prediction (the standard world) and a &ldquo;test&rdquo; prediction (an alternative), summed over all bins and channels and weighted by the uncertainty:
        </P>
        <div className="max-w-[44rem] overflow-x-auto">
          <BlockMath math="\chi^2=\sum_{\text{bins}}\frac{(x_{\text{true}}-x_{\text{test}})^2}{\sigma^2_{\text{test}}}" />
        </div>
        <P>
          Parameters that are not being scanned are left free and the χ² is minimised over them; systematic uncertainties (flux, cross-section, detector response) enter as <Term def="A nuisance parameter that lets a systematic uncertainty shift within its error, at a χ² cost.">pulls</Term> that the fit may use at a cost. The project first wrote its own simple χ² and then switched to GLoBES&rsquo; built-in multi-experiment function, which was faster and more robust, with the known parameters taken from NuFit 6.0.
        </P>
        <P>
          Reading a χ² difference as a confidence level depends on how many parameters are scanned. For the sterile map there are two (sin²θ₂₄ and Δm²₄₁), so a 90% region is where Δχ² exceeds 4.61 and a 99% region where it exceeds 9.21. For a single parameter such as δCP, a significance of <InlineMath math="n\sigma" /> corresponds to <InlineMath math="\Delta\chi^2=n^2" />, so 5σ is 25. The report calls the method &ldquo;Bayesian&rdquo;; as implemented it is the frequentist χ² difference described here.
        </P>

        {/* ------------------------------ 6 ------------------------------ */}
        <H2 id="standard" n={6}>The standard three-flavour sector</H2>
        <P>
          First the checks that the simulation reproduces what DUNE has published. For the mass ordering the report asks how well normal ordering could be distinguished from inverted when both DUNE and T2K are fitted. Figure 4 shows that DUNE has the smaller acceptance region, and that combining it with T2K is barely worse than DUNE alone.
        </P>
        <Figure id="ordering" />
        <P>
          The electron-appearance rate is the first thing to check, since it is where both ordering and δCP show up. The report&rsquo;s Figure 5 shows the inverted ordering with the same shape as the normal one but a smaller rate in neutrino mode, which makes the two hard to separate on shape alone. The next widget redoes that calculation from the input files, for both beam modes, and adds the combined picture.
        </P>

        <EventLab />

        <Figure id="events" />

        <P>
          Next, CP violation. The report recreates the TDR&rsquo;s δCP-sensitivity curve: sensitivity is lowest at δCP = 0 and π, where CP is conserved, and highest near ±π/2. The curve below is read straight from the GLoBES output files. It has the same two-humped shape as the TDR curve, and the dip at δCP/π ≈ 0.5 the report points out; its height is above the TDR&rsquo;s, which I come back to in section 8.
        </P>

        <CpChi2 part="cpv" />

        <Figure id="cpv" />

        {/* ------------------------------ 7 ------------------------------ */}
        <H2 id="sterile" n={7}>Adding a fourth neutrino</H2>
        <P>
          The sterile neutrino goes in through the four-flavour engine. The first check is that the new engine does not break the old physics: with all the sterile parameters set to zero it has to reproduce the three-flavour result.
        </P>

        <CpChi2 part="valid" />

        <Figure id="threeVsFour" />

        <P>
          With that passed, the far detector alone is scanned over sin²θ₂₄ and Δm²₄₁, the two parameters with the strongest influence on νe appearance and νμ disappearance. The sensitivity is generally better at smaller sin²θ₂₄, but there is a clear drop where Δm²₄₁ is close to the atmospheric splitting, Δm²₃₁ ≈ 2.5 × 10⁻³ eV². There a sterile neutrino can pass for a change in the ordinary parameters (mainly δCP and θ₂₃), and the two scenarios are hard to separate. The far-detector sensitivity is also limited by systematic uncertainties on flux and cross-section, because far-detector data can only be interpreted relative to the near detector.
        </P>

        <Figure id="fdSterile" />

        <h3 className="font-bodoni text-2xl text-white pt-4 max-w-[44rem]">The near detector</h3>
        <P>
          Adding the near detector means a second GLoBES detector file at 574 m and, to represent a source that is a line and not a point, a row of such files at baselines between 394 m and 574 m in 20 m steps. The final loop passes all of them through and adds their χ² to the far detector&rsquo;s. The report notes the weakness of this method: the decays were first assumed uniform along the pipe, then weighted towards the start of it, which is still a rough estimate; the proper fix would be a full model of the beam facility.
        </P>
        <P>
          Because the near detector is so close, its statistics are enormous, and it is sensitive to sterile effects in many channels at once. The report puts the L/E range the near detector probes at Δm²₄₁ of about 0.01 to 1 eV²; the map below shows its reach continuing to larger splittings.
        </P>

        <SensitivityLab />

        <Figure id="ndFd" />

        <P>
          The report&rsquo;s Figure 11 (above) and the map you can drive agree on the main points: the far detector alone has the characteristic notch at the atmospheric splitting; the near detector greatly extends the reach at larger Δm²₄₁; and the shape differs in detail from the TDR&rsquo;s curve, which the report puts down mainly to the systematic errors and to the simplifications in the simulation, chiefly treating the source as a single point in the final combined plot.
        </P>

        {/* ------------------------------ 8 ------------------------------ */}
        <H2 id="trust" n={8}>How far to trust this</H2>
        <P>
          A simulation is only as good as its checks. After the project I rebuilt the central pieces independently, from the same input files, to see whether the repository&rsquo;s numbers could be reproduced. This is what that showed, and it is also what stands behind the three widgets above that use my own engine rather than the saved GLoBES output.
        </P>

        <Validation />

        <h3 className="font-bodoni text-2xl text-white pt-4 max-w-[44rem]">Things to know about the repository and report</h3>
        <P>
          These are the places where, looking back, something does not line up. None changes the main picture (a far-detector notch at the atmospheric splitting, a large near-detector gain at larger Δm²₄₁), but they limit what can be quoted as a result.
        </P>
        <div className="max-w-[44rem] space-y-3">
          {CAVEATS.map((c) => (
            <details key={c.title} className="group rounded-xl border border-white/10 bg-white/[0.03] open:bg-white/[0.05] p-4">
              <summary className="cursor-pointer text-white/90 font-medium leading-snug marker:text-[var(--accent)]">{c.title}</summary>
              <p className="mt-3 text-base text-white/60 leading-relaxed">{c.body}</p>
            </details>
          ))}
        </div>

        {/* ------------------------------ 9 ------------------------------ */}
        <H2 id="further" n={9}>Further results</H2>
        <P>
          The remaining plots from the project. The first two show the oscillation probabilities with and without matter; the others, in the report&rsquo;s appendix, apply the same machinery to T2K, to a simulated 50 kt liquid-scintillator detector and to LSND.
        </P>
        <div className="grid md:grid-cols-2 gap-x-6">
          <Figure id="matter" />
          <Figure id="probs" />
          <Figure id="t2k" />
          <Figure id="scint" />
          <Figure id="lsnd" className="md:col-span-1" />
        </div>

        {/* ------------------------------ 10 ------------------------------ */}
        <H2 id="more" n={10}>What I took from it, and sources</H2>
        <P>
          This was my first time with C, GLoBES, compilers, makefiles and memory management (mostly learned through segmentation faults), and the first time I implemented a χ² test the way particle physicists do. I also read E. Lisi&rsquo;s notes on the theory of neutrino oscillations in detail. The most lasting lesson is the one section 8 is about: a plot that looks right is not the same as a result that has been checked.
        </P>
        <ul className="max-w-[44rem] space-y-2">
          <li><A href={REPO}>The repository</A>: GLoBES inputs, C code, Python plotting scripts and saved outputs.</li>
          <li><A href={REPORT_PDF}>Project report (PDF)</A> and <A href={POSTER_PDF}>poster (PDF)</A>.</li>
          <li>B. Abi et al. (DUNE), <em>Deep Underground Neutrino Experiment, Far Detector Technical Design Report, Volume II: DUNE Physics</em> (2020).</li>
          <li>P. Huber, J. Kopp, M. Lindner, M. Rolinec and W. Winter, <em>GLoBES: General Long Baseline Experiment Simulator</em>, Comput. Phys. Commun. 177, 439 (2007).</li>
          <li>J. Kopp, <em>Sterile neutrinos and non-standard neutrino interactions in GLoBES</em> (SNU library), <A href="https://www.mpi-hd.mpg.de/personalhomes/globes/tools/snu-1.0.pdf">documentation</A>.</li>
          <li>I. Esteban et al., <em>NuFIT 6.0: updated global analysis of three-flavour neutrino oscillations</em> (2024).</li>
          <li>B. Dasgupta and J. Kopp, <em>Sterile neutrinos</em>, Phys. Rep. 928, 1 (2021).</li>
          <li>I. Krasnov, <em>DUNE prospects in the search for sterile neutrinos</em>, Phys. Rev. D 100, 075023 (2019).</li>
        </ul>
        <p className="max-w-[44rem] text-base text-white/55">
          Thank you to Dr Gabriela Vitti Stenico for supervising the project and providing the resources; to Dr Miquel Nebot-Guinot, Dr Cheryl Patrick and Dr Pedro Pasquini for their help on DUNE and the physics behind it; and to the School of Physics and Astronomy at the University of Edinburgh for funding it through the Career Development Summer Scholarships.
        </p>
        <p className="max-w-[44rem] text-sm text-white/40">
          The published DUNE sensitivity plots (the report&rsquo;s Figures 1, 2, 3, 6 and 10) are not reproduced on this page; they are in the report and in the DUNE TDR.
        </p>

        <details className="max-w-[44rem] mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <summary className="cursor-pointer text-white font-semibold">Glossary</summary>
          <dl className="mt-4 space-y-3 text-base">
            {GLOSSARY.map(([t, d]) => (
              <div key={t}>
                <dt className="text-white">{t}</dt>
                <dd className="text-white/60">{d}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </article>
  );
}
