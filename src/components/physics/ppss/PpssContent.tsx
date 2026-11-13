"use client";

import React from "react";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { Callout, Figure, Stat, Term } from "./ui";
import SectionNav, { type NavItem } from "./SectionNav";
import LeptonFlavour from "./LeptonFlavour";
import TriggerFunnel from "./TriggerFunnel";
import DataFlow from "./DataFlow";
import FeatureExplorer from "./FeatureExplorer";
import BdtLab from "./BdtLab";
import PunziStory from "./PunziStory";
import MassFit from "./MassFit";
import LimitCalculator from "./LimitCalculator";
import Timeline from "./Timeline";
import { NOTES_PDF, NUMBERS as N, REPO, SLIDES_PDF } from "@/data/ppss";

/**
 * PPSS / IFJ PAN INTERNSHIP REPORT
 * ─────────────────────────────────────────────────────────────────
 * Written like a report (question, data, method, results, discussion) but with
 * a widget wherever a number or an idea is easier to feel than to read.
 * Every number comes from data/ppss.ts, which says where each one was found
 * (notes, slides, README or code in the repo). The widgets that use invented
 * data (the toy BDT and the toy mass spectrum) say so in their own text.
 */

const NAV: NavItem[] = [
  { id: "question", label: "The question" },
  { id: "data", label: "The data" },
  { id: "plan", label: "The plan" },
  { id: "classifier", label: "The classifier" },
  { id: "cut", label: "Choosing the cut" },
  { id: "fit", label: "Fitting the mass" },
  { id: "limit", label: "The limit" },
  { id: "diary", label: "Day by day" },
  { id: "honest", label: "What this shows" },
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
    <p className="text-xs font-mono uppercase tracking-[0.18em] text-white/40 mb-2">In plain English</p>
    <div className="text-white/70 text-base leading-relaxed">{children}</div>
  </div>
);

const GLOSSARY: [string, string][] = [
  ["Baryon", "A particle made of three quarks, such as a proton or a Λc⁺."],
  ["Branching fraction (BR)", "The share of a particle's decays that go a particular way."],
  ["BDT (boosted decision tree)", "A model made of many small decision trees added together, each one correcting the mistakes of the last."],
  ["CLs", "A statistical method for turning “no clear signal” into an upper limit on how big a signal could be."],
  ["Hyperparameter", "A setting chosen before training, such as how many trees to use."],
  ["Invariant mass", "The mass of a parent particle worked out from the momenta of what it decayed into."],
  ["Lepton flavour", "Which family a lepton belongs to: electron, muon or tau."],
  ["Monte Carlo (MC)", "A computer simulation of the decay and the detector, used here as the signal sample."],
  ["Ntuple", "A table of numbers, one row per candidate event and one column per measured variable."],
  ["Overtraining", "When a model learns its training examples by heart and then does worse on new ones."],
  ["Punzi figure of merit", "A score that picks the cut giving the best sensitivity for a search without knowing the signal size in advance."],
  ["ROC curve / AUC", "How well a classifier trades catching signal against letting background through. The AUC is the area under that curve: 0.5 is guessing, 1 is perfect."],
  ["Sideband", "A region of the mass spectrum away from the peak, used to study the background."],
  ["Trigger", "The system that decides, within microseconds, which collisions are worth keeping."],
];

export default function PpssContent() {
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
            {["LHCb", "Flavour physics", "Machine learning", "Student project"].map((t) => (
              <span key={t} className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-bodoni text-5xl md:text-7xl font-medium text-white tracking-tight leading-tight mb-6">
            Hunting for a forbidden decay
          </h1>
          <p className="text-xl md:text-2xl text-white/55 leading-relaxed font-light max-w-3xl">
            A summer at IFJ PAN in Kraków, searching LHCb data for <InlineMath math="\Lambda_c^+ \to p\,e^-\mu^+" />, a decay the Standard Model says should not happen.
          </p>
          <p className="mt-8 text-sm text-white/40">
            <strong className="text-white/70">Paolo Minhas</strong> with Timur Knyazev · supervised by Prof. Dr hab. Mariusz Witek · Summer Particle Physics School, July 2025
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat value="675 → 18" label="variables per candidate, then kept" />
            <Stat value={N.signalMC.toLocaleString("en-GB")} label="simulated signal events" />
            <Stat value="0.246" label="BDT cut chosen by Punzi" />
            <Stat value="≈ 2.8 × 10⁻⁸" label="90% CL limit, final slides" />
          </div>
        </div>
      </header>

      <SectionNav items={NAV} />

      <div className="max-w-4xl mx-auto px-6 text-lg leading-relaxed space-y-6">
        <Callout title="The short version">
          <p>
            Some decays are so rare that you cannot hope to see them by eye. LHCb records an enormous number of particle decays, and a search for one forbidden decay means finding perhaps a handful of events among tens of thousands that look similar. I built the chain that does that: a machine-learning classifier to tell simulated signal from real background, a statistical figure of merit to choose how hard to cut, a fit to the mass spectrum, and a method (CLs) that turns &ldquo;nothing clear&rdquo; into an upper limit on the decay rate.
          </p>
          <p>
            It is a student exercise on collaboration data, so the result is preliminary and the real analysis is separate. The most useful thing I learned was not in the physics: it was how a plot that looks too good gives you away.
          </p>
        </Callout>

        {/* ------------------------------ 1 ------------------------------ */}
        <H2 id="question" n={1}>The question</H2>
        <P>
          Why is there more matter than antimatter? One ingredient is CP violation, a small asymmetry between matter and antimatter. Another idea is that the three charged leptons (electron, muon, tau) might not be strictly kept apart. If a muon could turn into an electron, that would be a new source of the imbalance, and a hint of physics beyond the Standard Model.
        </P>
        <P>
          In the Standard Model, a decay that changes lepton flavour without neutrinos to carry it away is vanishingly rare: for <InlineMath math="\mu \to e\gamma" /> the branching ratio is of order <InlineMath math="10^{-54}" />. But in the seesaw mechanism, which explains the tiny neutrino masses by adding very heavy right-handed neutrinos, these effects can be large enough to see. One place they could show up is the charmed-baryon decay <InlineMath math="\Lambda_c^+ \to p\,e^-\mu^+" />.
        </P>

        <LeptonFlavour />

        <Plain>
          Think of electron-ness and muon-ness as two separate tallies that, as far as we know, only change through neutrino oscillations. The decay we search for would move one point from the muon tally to the electron tally with no neutrino in sight. Seeing even a few such events would be new physics.
        </Plain>

        <P>
          Lepton flavour is not a sacred law: neutrino oscillations already break it, and my notes record the answer I was given when Timur asked about it: the conservation of <em>total</em> lepton number is &ldquo;almost a coincidence&rdquo;, not a rule. The method here follows the 2023 PhD thesis of Dr Maciej Dudek (Kraków), who searched for <InlineMath math="\Lambda_c^+ \to p\mu^+\mu^-" />. Our decay swaps the muon pair for an electron and a muon. The previous limit on this channel, as quoted on our slides from the PDG, is <InlineMath math="1.9\times10^{-5}" />.
        </P>

        {/* ------------------------------ 2 ------------------------------ */}
        <H2 id="data" n={2}>The data</H2>
        <P>
          LHCb sees collisions up to 40 million times a second, far more than can be stored. A trigger decides in real time what to keep, in three layers: one in hardware, two in software. By the time the data reaches an analyst it has already been thinned by orders of magnitude, and my notes record that cuts on top of that decide whether any signal is visible at all.
        </P>

        <TriggerFunnel />

        <P>
          What I worked with was <Term def="A table of numbers, one row per candidate event and one column per measured variable.">ntuples</Term>: ROOT files in which each candidate (a proton, an electron and a muon that might have come from one Λc decay) has 675 measured variables attached. There are two samples. The <strong className="text-white">signal</strong> is Monte Carlo, a simulation of the decay passing through the detector: 1,727 events. The <strong className="text-white">background</strong> is real LHCb data, 214,977 candidates, almost all unrelated tracks that happen to look a little like the decay.
        </P>

        <DataFlow />

        <Callout tone="warn" title="The imbalance is the whole difficulty">
          <p>
            Only about 2% of the training table is signal. That is generous compared with reality (the real decay, if it exists at all, is far rarer), and it already means that a classifier can look excellent while being useless. More on that in a moment.
          </p>
        </Callout>

        {/* ------------------------------ 3 ------------------------------ */}
        <H2 id="plan" n={3}>The plan</H2>
        <P>Six steps, each handing a cleaner sample to the next:</P>
        <ol className="max-w-[44rem] space-y-3">
          {[
            ["Train a classifier", "A boosted decision tree learns to score every candidate between 0 (looks like background) and 1 (looks like signal).", "#classifier"],
            ["Choose where to cut", "Punzi's figure of merit picks the score threshold with the best sensitivity.", "#cut"],
            ["Fit the mass", "Fit the invariant-mass spectrum of what survives with a signal shape taken from simulation.", "#fit"],
            ["Do the same on a known decay", "Repeat for Λc⁺ → p φ(→ μ⁺μ⁻), a well-measured reference channel.", "#limit"],
            ["Set a limit with CLs", "With no clear excess, ask how large a signal the data can rule out at 90% confidence.", "#limit"],
            ["Convert to a branching fraction", "Compare with the reference channel so most detector effects cancel.", "#limit"],
          ].map(([t, d, h], k) => (
            <li key={t} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="font-bodoni text-2xl text-[var(--accent)] w-8 shrink-0">{k + 1}</span>
              <div>
                <a href={h} className="text-white font-semibold hover:text-[var(--accent)]">{t}</a>
                <p className="text-base text-white/60">{d}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* ------------------------------ 4 ------------------------------ */}
        <H2 id="classifier" n={4}>Teaching a classifier to spot the signal</H2>
        <P>
          A single cut on one variable throws away signal. A classifier combines many weak hints: a decay that flew a plausible distance, whose tracks fit one vertex, whose proton looks like a proton, and which sits alone rather than in a spray of other tracks. A <Term def="A model made of many small decision trees added together, each one correcting the mistakes of the last.">boosted decision tree</Term> does this by building lots of small trees, each one trying to fix what the previous ones got wrong.
        </P>
        <P>
          I came to it the long way round. The first attempt was a ROOT macro using TMVA, which needs non-finite values removed before it will run. The second was scikit-learn&rsquo;s gradient boosting in Python: my first version scored a test AUC of 0.855, and after tuning it reached 0.894 (shown below). The third, which I kept, was XGBoost, with a preliminary model to cut the list of variables from 36 to 18.
        </P>

        <FeatureExplorer />

        <h3 className="font-bodoni text-2xl text-white pt-4 max-w-[44rem]">How good is it? ROC curves and AUC</h3>
        <P>
          A <Term def="How well a classifier trades catching signal against letting background through. The AUC is the area under that curve.">ROC curve</Term> plots how much real signal you keep against how much background sneaks through, as you slide the cut. A model that guesses lies on the diagonal (AUC 0.5); a perfect one hugs the top left (AUC 1). The AUC is also the chance that a random signal event scores higher than a random background event.
        </P>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          <Figure id="gbcRoc" />
          <Figure id="xgbRoc" />
        </div>
        <P>
          The two algorithms ended up close on AUC, but their scores look different: gradient boosting piled almost everything at 0 or 1, while XGBoost spread them out, which gives a more nuanced ranking to cut on.
        </P>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          <Figure id="gbcScores" />
          <Figure id="xgbScores" />
        </div>

        <h3 className="font-bodoni text-2xl text-white pt-4 max-w-[44rem]">Overtraining, on a toy you can break</h3>
        <P>
          The enemy is <Term def="When a model learns its training examples by heart and then does worse on new ones.">overtraining</Term>: a model with enough trees and depth can memorise its training events perfectly and then fail on new ones. The sign is a gap between the AUC on the training half and on the held-out half. You can reproduce the effect below. The data is invented, but the behaviour is the same as in my real runs.
        </P>

        <BdtLab />

        <Callout title="The accuracy trap">
          <p>
            The final training log reports an accuracy of 98.06% on the test half, which sounds superb. But {N.testBackground.toLocaleString("en-GB")} of the {N.testSize.toLocaleString("en-GB")} test events are background, so a model that answers &ldquo;background&rdquo; every single time scores {((N.testBackground / N.testSize) * 100).toFixed(2)}%. At the default threshold of 0.5 the model finds only 16% of the signal (recall 0.16, precision 0.70). That is exactly why the cut is not 0.5 and why we need a figure of merit.
          </p>
        </Callout>

        {/* ------------------------------ 5 ------------------------------ */}
        <H2 id="cut" n={5}>Choosing the cut</H2>
        <P>
          The classifier gives each candidate a score. Where to cut? Cut tight and you keep little signal but almost no background; cut loose and the opposite. A search needs a number that balances them without knowing the signal rate in advance, since that is what we are trying to find out. Punzi&rsquo;s figure of merit (2003) does exactly that:
        </P>
        <div className="overflow-x-auto max-w-[44rem]"><BlockMath math="\mathrm{FoM}(c) \;=\; \frac{\varepsilon_{\text{sig}}(c)}{\tfrac{n_\sigma}{2} + \sqrt{B(c)}}" /></div>
        <P>
          Here <InlineMath math="c" /> is the cut on the BDT score, <InlineMath math="\varepsilon_{\text{sig}}" /> is the fraction of signal that survives it, <InlineMath math="B" /> is the number of background events that survive, and <InlineMath math="n_\sigma" /> is the significance you want (5 in my code). You compute the number at every possible cut and pick the maximum. A healthy plot has a gentle hill in the middle. A sharp spike at the far right is a warning.
        </P>

        <div className="grid gap-4 md:grid-cols-3 max-w-4xl">
          <Figure id="effCumul" />
          <Figure id="bkgCumul" />
          <Figure id="fomPunzi" />
        </div>

        <Callout title="Why my plot spiked">
          <p>
            My first Punzi plot was the opposite of a gentle hill: it climbed steadily and spiked at a cut of 0.993, which Prof. Witek called extremely high and unrealistic. I spent a couple of days changing the formula and checking efficiencies. The main cause was in the input: to get more events into the simulated signal file, a cut had been removed from its preselection. That made the simulation different from the data in a fundamental way, and the classifier learned to recognise <em>simulation</em>, not <em>signal</em>. It was not the only problem: a wrong data file, an extra mass cut and heavy overtraining were all in the mix too.
          </p>
          <p>
            The toy above reproduces this in one click (<em>Simulation gives itself away</em>). If you only watched the AUC you would think you had built a miracle.
          </p>
        </Callout>

        <PunziStory />

        <h3 className="font-bodoni text-2xl text-white pt-4 max-w-[44rem]">The overtraining behind it</h3>
        <P>
          Fixing the data was only part of it. On 24 Jul Prof. Witek listed the likely culprits: significant overtraining, an extra cut below 2300 in the mass, and the wrong data file. My script set far more options than his, which mostly used the library defaults with a depth of 3. On 28 Jul I compared the two line by line, moved to the simpler settings, then put my extras back one at a time: subsampling alone gave a broad maximum, but class weighting alone brought the spike straight back. The table shows the three versions:
        </P>
        <div className="max-w-[44rem] overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3 font-medium">Setting</th>
                <th className="px-4 py-3 font-medium">My first model</th>
                <th className="px-4 py-3 font-medium">Prof. Witek&rsquo;s (library defaults, depth 3)</th>
                <th className="px-4 py-3 font-medium">Final</th>
              </tr>
            </thead>
            <tbody className="[&_td]:px-4 [&_td]:py-3 [&_tr]:border-t [&_tr]:border-white/10">
              <tr><td>Trees</td><td>400</td><td>default</td><td>100</td></tr>
              <tr><td>Max depth</td><td>3</td><td>3</td><td>3</td></tr>
              <tr><td>Learning rate</td><td>0.1</td><td>default</td><td>0.1</td></tr>
              <tr><td>Min child weight</td><td>10</td><td>default</td><td>default (see note)</td></tr>
              <tr><td>Subsample</td><td>0.5</td><td>default</td><td>off</td></tr>
              <tr><td>Class weighting</td><td>on</td><td>not used</td><td>off</td></tr>
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          <Figure id="rocOver" />
          <Figure id="rocFinal" />
        </div>
        <Callout title="A typo XGBoost never mentioned">
          <p>
            The final script sets <code className="font-mono text-sm">min_child_rate=10</code>. That is not an XGBoost parameter (the real one is <code className="font-mono text-sm">min_child_weight</code>), and XGBoost does not stop: the training log in the repo says <em>Parameters: &#123; &quot;min_child_rate&quot;, &quot;use_label_encoder&quot; &#125; are not used</em>. The model therefore ran with the default value of 1, which happens to match Prof. Witek&rsquo;s. It is a good reminder that a setting you think you changed may not have changed anything.
          </p>
        </Callout>
        <P>
          The final model gave an optimal cut of <strong className="text-white">{N.punziCut}</strong> and a maximum Punzi value of {N.punziMax}. The same pipeline run on the muon reference channel looked very different, with an optimum at 0.882 and test AUC of 0.985. The notes call those plots excessively overtrained and say they were taken to that day&rsquo;s meeting; they do not record the outcome.
        </P>
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl">
          <Figure id="punziRef" />
          <Figure id="rocRef" />
          <Figure id="scoresFinal" />
        </div>

        {/* ------------------------------ 6 ------------------------------ */}
        <H2 id="fit" n={6}>Fitting the mass</H2>
        <P>
          Once the cut is applied, what is left is a list of candidates, each with a reconstructed <Term def="The mass of a parent particle worked out from the momenta of what it decayed into.">invariant mass</Term>. A real Λc⁺ decay reconstructs at its mass, 2286.46 MeV/c², so a signal would appear as a small bump there on top of a smooth falling background. The fit has three ingredients.
        </P>
        <ul className="max-w-[44rem] list-disc pl-6 space-y-3">
          <li>
            <strong className="text-white">Signal shape from simulation:</strong> a Crystal Ball (a Gaussian core with a long tail on one side, from energy lost in the detector) plus a wide Gaussian, fitted to the simulated signal after selection.
          </li>
          <li>
            <strong className="text-white">Smooth background:</strong> an exponential for the combinatorial background of unrelated tracks.
          </li>
          <li>
            <strong className="text-white">A fake peak:</strong> the macro includes a second component for <InlineMath math="\Lambda_c^+ \to p\pi^+\pi^-" />, a real decay that can mimic the signal if the pions are mistaken for leptons.
          </li>
        </ul>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          <Figure id="sigShape" />
          <Figure id="refCb" />
        </div>
        <P>
          The first RooFit run (22 Jul) was messy: some of the shape fits worked and some missed the data entirely. Getting zfit to run took three attempts across two days, each blocked by clashing Python packages, before I fell back on the C++ ROOT macro for the final plots.
        </P>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          <Figure id="fitFirst" />
          <Figure id="fitBad" />
        </div>

        <MassFit />

        <P>
          The repo&rsquo;s results folder has the final mass fits. The README summarises them as a peak of around 2σ: enough to tighten the constraint on the branching fraction, nowhere near enough to claim new physics. By the notes&rsquo; own scheme (above 5σ is a signal, 3σ to 5σ is evidence, below 3σ you give an upper limit), that makes it an upper limit.
        </P>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          <Figure id="pemuMass" />
          <Figure id="pmumuData" />
        </div>

        {/* ------------------------------ 7 ------------------------------ */}
        <H2 id="limit" n={7}>Turning &ldquo;nothing clear&rdquo; into a limit</H2>
        <P>
          When the data show no significant excess, you cannot just say &ldquo;nothing there&rdquo;. You ask a better question: how large could the signal be and still be compatible with what we see? The <Term def="A statistical method for turning “no clear signal” into an upper limit on how big a signal could be.">CLs method</Term> answers it. Scan a range of hypothetical signal strengths; for each, work out CLs; the largest strength for which CLs stays below 0.10 is the upper limit at 90% confidence.
        </P>
        <Figure id="clsScan" className="max-w-xl" />
        <P>
          That gives a limit on a yield. To turn it into a branching fraction you compare with a well-measured decay of the same parent particle, so the production rate and most detector effects cancel. Our reference mode was <InlineMath math="\Lambda_c^+ \to p\phi(\to\mu^+\mu^-)" />, with branching fractions from the PDG. Try the arithmetic yourself:
        </P>

        <LimitCalculator />

        <P>
          The result on the final slides is a 90% confidence-level upper limit of about <InlineMath math="2.8\times10^{-8}" /> on the branching fraction, several hundred times below the previous limit of <InlineMath math="1.9\times10^{-5}" />.
        </P>

        {/* ------------------------------ 8 ------------------------------ */}
        <H2 id="diary" n={8}>Three weeks, day by day</H2>
        <P>
          That tidy chain hides how it actually went. This is the diary behind it: meetings, dead ends and the days spent on the wrong suspect.
        </P>
        <Timeline />

        {/* ------------------------------ 9 ------------------------------ */}
        <H2 id="honest" n={9}>What this does and does not show</H2>
        <P>
          This was a three-week student project on a collaboration dataset. I would not want any number on this page quoted as a physics result.
        </P>
        <ul className="max-w-[44rem] list-disc pl-6 space-y-3">
          <li>
            <strong className="text-white">It is preliminary.</strong> The README says the collaboration&rsquo;s own analysis is expected to appear most likely in 2026. Anything here that disagrees with that analysis should be read as a student&rsquo;s exercise.
          </li>
          <li>
            <strong className="text-white">No systematic uncertainties</strong> are estimated in my notes. A real limit needs them: efficiency uncertainties, the shape of the background, the uncertainty on the reference branching fractions, and more.
          </li>
          <li>
            <strong className="text-white">The repository is partial.</strong> The data files are too big to host, and the CLs scan code is not in it (the scan figure is in the LHCb plotting style), so I have shown that figure as the method&rsquo;s output rather than as something you can rerun from the repo.
          </li>
          <li>
            <strong className="text-white">The slides have small inconsistencies.</strong> The limit is 2.8 on one slide and 2.9 on another, and the claimed improvement over the previous limit does not match the arithmetic (see the calculator).
          </li>
        </ul>

        <h3 className="font-bodoni text-2xl text-white pt-4 max-w-[44rem]">What I would do differently</h3>
        <ul className="max-w-[44rem] list-disc pl-6 space-y-3">
          <li>Inspect the inputs before tuning the model. Days of work on the Punzi formula would have been saved by checking that simulation and data differ only where they should.</li>
          <li>Treat a spectacular score as a bug until proven otherwise.</li>
          <li>Change one setting at a time and keep a record, as I eventually did on 28 Jul.</li>
          <li>Judge a classifier on a rare-signal problem by its recall and the Punzi curve, not by accuracy.</li>
          <li>Pin the Python environment from day one. Conflicting package versions cost me more hours than any physics.</li>
        </ul>

        {/* ------------------------------ 10 ------------------------------ */}
        <H2 id="more" n={10}>Sources and further reading</H2>
        <ul className="max-w-[44rem] space-y-2">
          <li><a className="text-[var(--accent)]/90 hover:text-[var(--accent)] underline underline-offset-4" href={REPO}>The repository</a>: scripts, results plots, README with the training log.</li>
          <li><a className="text-[var(--accent)]/90 hover:text-[var(--accent)] underline underline-offset-4" href={NOTES_PDF}>Project notes (PDF)</a>: the diary this page is based on.</li>
          <li><a className="text-[var(--accent)]/90 hover:text-[var(--accent)] underline underline-offset-4" href={SLIDES_PDF}>Final presentation (PDF)</a>, made with Timur Knyazev.</li>
          <li><a className="text-[var(--accent)]/90 hover:text-[var(--accent)] underline underline-offset-4" href="https://inspirehep.net/literature/2894042">M. Dudek, Search for the Λc⁺ → pμ⁺μ⁻ decay at the LHCb experiment (Kraków, 2023)</a>.</li>
          <li>G. Punzi, <em>Sensitivity of searches for new signals and its optimization</em>, arXiv:physics/0308063 (2003).</li>
          <li>A. L. Read, <em>Presentation of search results: the CLs technique</em>, J. Phys. G 28, 2693 (2002).</li>
          <li>K. Mukaida, K. Schmitz and M. Yamada, <em>Baryon asymmetry of the Universe from lepton flavor violation</em>, Phys. Rev. Lett. 129, 011803 (2022).</li>
        </ul>
        <p className="max-w-[44rem] text-base text-white/55">
          Thank you to Prof. Dr hab. Mariusz Witek for his guidance throughout, and to Timur Knyazev for the company, the shared hard drive and the final presentation.
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
