"use client";

import React from "react";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import CoverArt from "../research/CoverArt";
import SectionNav, { type NavItem } from "../dune-nd/SectionNav";
import { A, Callout, Figure, H2, P, Plain, Stat, Term } from "../daml/ui";
import Haystack from "./Haystack";
import CutRuler from "./CutRuler";
import NetLab from "./NetLab";
import SigMeter from "./SigMeter";
import SculptLab from "./SculptLab";
import { FIGS as F, N } from "@/data/exotic-search";

/**
 * EXOTIC SEARCH (DAML PROJECT 4 / WEEK 9) PAGE
 * ─────────────────────────────────────────────────────────────────
 * A report on a coursework search for a 1 TeV resonance. Every number is printed in
 * the Week 9 notebook (see data/exotic-search.ts). The haystack picture shows the
 * real proportions with a seeded stand-in for the events; the cut ruler lays out
 * the notebook's own quantiles; the significance meter runs its recipe; the mass-
 * sculpting lab is a toy with one real ingredient and says so. "How far to trust
 * it" records what I found on re-reading the notebook, in a neutral tone, including
 * that the square-cut fit was run on background alone.
 */

const NAV: NavItem[] = [
  { id: "question", label: "The question" },
  { id: "features", label: "What the events look like" },
  { id: "cuts", label: "Square cuts" },
  { id: "net", label: "A neural network" },
  { id: "fit", label: "Fitting and the sigma" },
  { id: "sculpt", label: "Mass sculpting" },
  { id: "trust", label: "How far to trust it" },
];

const pc = (v: number) => `${(v * 100).toFixed(0)}%`;

export default function ExoticSearchContent() {
  const nn1Sig = 3800.71 / N.signalWeighted;
  return (
    <article className="min-h-screen bg-abyss bg-stars text-white/65 selection:bg-ember/30 pb-32 relative overflow-x-clip">
      {/* ------------------------------ hero ------------------------------ */}
      <header className="relative pt-32 pb-14 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[800px] h-[400px] bg-kelp/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto xl:pl-52 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] items-center">
          <div className="min-w-0">
            <Link href="/research" className="inline-block text-sm text-[var(--accent)]/80 hover:text-[var(--accent)] mb-8">
              ← Back to research
            </Link>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Collider physics", "Machine learning", "Hypothesis testing", "Coursework"].map((t) => (
                <span key={t} className="px-3 py-1 text-xs font-bold tracking-normal text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="font-bodoni text-5xl md:text-7xl font-medium text-white tracking-tight leading-tight mb-6">Hunting a 1 TeV particle</h1>
            <p className="text-xl md:text-2xl text-white/55 leading-relaxed font-light max-w-3xl">
              A coursework search for a heavy Higgs-like resonance in simulated collider events: cuts chosen by eye against a neural network that learns them, and an honest look at what a quoted significance does and does not mean.
            </p>
            <p className="mt-8 text-sm text-white/45">
              <strong className="text-white/75">Paolo Minhas</strong> · Project 4 (the Week 9 report) of the DAML course, School of Physics and Astronomy, University of Edinburgh
            </p>
          </div>
          <div className="min-w-0 hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-white/10 aspect-[16/10]">
              <CoverArt kind="exotic" seed="exotic-search" loop className="h-full w-full" />
            </div>
          </div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto xl:pl-52 mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat value="6.8 M" label="simulated background events" />
          <Stat value="50,013" label="signal events" />
          <Stat value="1 in 1,287" label="events is signal before any selection" />
          <Stat value="0.943" label="area under the first network’s ROC curve" />
        </div>
      </header>

      <SectionNav items={NAV} />

      <div className="max-w-4xl mx-auto px-6 text-lg leading-relaxed space-y-6">
        <Callout title="The short version">
          <p>
            The signal is a hypothetical particle of 1 TeV mass, a heavy cousin of the Higgs boson. It is buried in three simulated backgrounds, and before any selection only one event in about 1,300 is signal. Five cuts chosen by eye keep {pc(N.cuts.sigEff)} of the signal and remove {pc(N.cuts.bgRej)} of the background, which raises the signal share two and a half times. A small neural network does better, and a second one that is shown the reconstructed mass does best on paper.
          </p>
          <p>
            The interesting part is what comes after. The notebook quotes 5.6σ for the cuts and 14.6σ for the network, and on a second look neither is a discovery: the first comes from fitting a sample with no signal in it. And the network that does best on paper is the one that must not be used for this kind of search, because a classifier that sees the mass can build a peak out of background. You can make that happen below.
          </p>
        </Callout>

        {/* ------------------------------ 1 ------------------------------ */}
        <H2 id="question" n={1}>The question</H2>
        <P>
          New heavy particles, if they exist, would show up as a bump in a mass spectrum: collisions that produced the particle pile up at its mass, on top of a smooth background of ordinary events. The sample here is a simulated 1 TeV particle (the file is called <code className="font-mono text-white/80">ggH1000</code>) decaying through a Z boson into two leptons, with the rest of the decay showing up as one wide jet of particles, a &ldquo;fat jet&rdquo;. The quantity to look at is the mass of that whole system, <code className="font-mono text-white/80">reco_zv_mass</code>.
        </P>
        <P>
          The backgrounds are three simulated samples of ordinary processes that can fake the signature: pairs of gauge bosons (diboson), top quarks, and a Z boson produced with jets. Together there are {N.backgroundEntries.toLocaleString()} background events against {N.signalEntries.toLocaleString()} signal events. The events also carry weights that say how many real events each simulated one stands for, and the weighted sums are what matter: {Math.round(N.backgroundWeighted).toLocaleString()} background against {N.signalWeighted.toFixed(0)} signal. The files store energies in MeV; I show GeV or TeV here.
        </P>

        <Haystack />

        <Plain>
          Looking for the signal is like finding a particular grain of sand on a beach, where all you know is that it tends to be a little heavier than the rest. You can shovel away sand that is obviously too light, which is cutting, or train something to feel for the right weight, which is a classifier. Either way the whole question is how much sand you can throw away without losing the grain.
        </Plain>

        {/* ------------------------------ 2 ------------------------------ */}
        <H2 id="features" n={2}>What the events look like</H2>
        <P>
          Each event comes as a row of numbers: the momenta and angles of the two leptons, the fat jet&rsquo;s momentum and <Term def="D2: a jet-substructure variable. It is small for a jet that came from a heavy particle splitting into two quarks and larger for a jet from a single quark or gluon.">D2</Term> value, the dilepton mass and momentum, and the missing transverse energy. I plotted each one for the signal against the backgrounds. Almost everything overlaps. That is why choosing cuts takes thought.
        </P>
        <Figure fig={F.features} />

        <CutRuler />

        <P>
          The notebook printed the signal&rsquo;s 10th and 25th percentiles and the background&rsquo;s 75th and 90th for each variable, and I used them to place cuts where they cost the signal little. The ruler above shows the numbers beside the final cut for each variable. It also shows why some variables got no cut: when the two sets of percentiles are interleaved there is nothing to cut on.
        </P>

        {/* ------------------------------ 3 ------------------------------ */}
        <H2 id="cuts" n={3}>Square cuts</H2>
        <P>
          The final set is five cuts: D2 below 4, missing energy below 55 GeV, dilepton mass between 80 and 100 GeV, fat-jet momentum above 240 GeV and second-lepton momentum above 43 GeV. Together they keep {N.cuts.sigEntries.toLocaleString()} of {N.signalEntries.toLocaleString()} signal events and {N.cuts.bgEntries.toLocaleString()} of {N.backgroundEntries.toLocaleString()} background events. Weighted, that is {(N.cuts.sigEff * 100).toFixed(1)}% of the signal and {(N.cuts.bgRej * 100).toFixed(1)}% of the background removed, and the signal share goes from 0.0008 to 0.0019.
        </P>
        <P>
          That is a modest gain, and the plot shows why. Normalised to the same area, the signal is a narrow peak at 1 TeV (bottom left below); in absolute numbers it is a barely visible sliver at the foot of a huge background (top right).
        </P>
        <Figure fig={F.squareCuts} />
        <P>
          The tuning was slow. Harder cuts changed the shape of the background until its peak lined up with the signal&rsquo;s, so I kept them gentle, and the fat-jet momentum cut was the one I worried about most. A first set that had worked without the Z+jets background was not good enough once it was added.
        </P>

        {/* ------------------------------ 4 ------------------------------ */}
        <H2 id="net" n={4}>A neural network</H2>
        <P>
          The alternative is to let a model learn the cuts. I built a small fully connected network in PyTorch and trained it on a balanced sample, {N.signalEntries.toLocaleString()} signal and {N.signalEntries.toLocaleString()} background events drawn at random, scaled to zero mean and unit variance, with 70% for training and 30% held back. It sees all eight kinematic variables and does not see the reconstructed mass.
        </P>

        <NetLab />

        <P>
          On the held-out events it finds 90% of the signal and keeps out 86% of the background, with an area under the ROC curve of {N.nn1.auc}. Run over the whole signal and diboson samples, it keeps {pc(nn1Sig)} of the weighted signal.
        </P>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
          <Figure fig={F.training} />
          <Figure fig={F.roc} className="max-w-xs" />
        </div>

        {/* ------------------------------ 5 ------------------------------ */}
        <H2 id="fit" n={5}>Fitting and the sigma</H2>
        <P>
          To turn a selection into a claim, fit the mass spectrum two ways between 0.7 and 2.0 TeV, in 40 bins. <InlineMath math="H_0" /> is a smooth cubic for the background alone. <InlineMath math="H_1" /> adds a Gaussian for the signal, with its position and width fixed from a fit to the signal sample. The significance is <InlineMath math="\sqrt{\Delta\chi^2}" /> where <InlineMath math="\Delta\chi^2 = \chi^2_{H_0}-\chi^2_{H_1}" />: how much better the signal term makes the fit.
        </P>
        <P>The notebook&rsquo;s results were these:</P>
        <div className="max-w-xl overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <caption className="text-left text-xs text-white/45 px-4 pt-3 pb-2">Printed fit results</caption>
            <thead className="text-[11px] tracking-normal text-white/45 bg-white/[0.03]">
              <tr><th className="px-4 py-2 font-normal">Selection</th><th className="px-4 py-2 font-normal">χ² (H0 → H1)</th><th className="px-4 py-2 font-normal">Fitted signal</th><th className="px-4 py-2 font-normal">Significance</th></tr>
            </thead>
            <tbody className="text-white/75 font-mono">
              <tr className="border-t border-white/5"><td className="px-4 py-2 font-sans">Square cuts</td><td className="px-4 py-2">{N.fits.square.chi2H0} → {N.fits.square.chi2H1}</td><td className="px-4 py-2">{N.fits.square.amp.toLocaleString("en", { maximumFractionDigits: 0 })}</td><td className="px-4 py-2">{N.fits.square.sigma}σ</td></tr>
              <tr className="border-t border-white/5"><td className="px-4 py-2 font-sans">Network</td><td className="px-4 py-2">{N.fits.nn.chi2H0} → {N.fits.nn.chi2H1}</td><td className="px-4 py-2">+{N.fits.nn.amp.toLocaleString("en", { maximumFractionDigits: 0 })}</td><td className="px-4 py-2">{N.fits.nn.sigma}σ</td></tr>
            </tbody>
          </table>
        </div>
        <P>
          The network&rsquo;s 14.6σ is nearly three times the cuts&rsquo; 5.6σ, and the notebook&rsquo;s own comment is that this is impressive. Look at the sign of the first row, though, and then at the plot:
        </P>
        <Figure fig={F.fitSquare} className="max-w-3xl" />
        <Callout tone="warn" title="A negative signal">
          <p>
            The square-cut fit was run on the background sample alone, with no signal events in the histogram, so the fitted signal is negative (a dip at 1 TeV, the dashed red line) and the 5.58σ measures how badly a cubic describes the background. The network&rsquo;s histogram does include signal, and its fitted amplitude is positive. The two significances were measured on different samples, so the factor of three is not a like-for-like comparison.
          </p>
        </Callout>

        <SigMeter />

        <Figure fig={F.fitNn} className="max-w-3xl" />
        <P>
          The network&rsquo;s fit has a real shoulder to explain, but even there both curves miss the points on either side of it, and the χ² per degree of freedom is about 12 for the network&rsquo;s best fit and 5.5 for the square-cut one. When the background model does not describe the data, any reasonable extra term will improve it a lot, and a large Δχ² follows.
        </P>

        {/* ------------------------------ 6 ------------------------------ */}
        <H2 id="sculpt" n={6}>Mass sculpting</H2>
        <P>
          The last part of the project asked what happens if the reconstructed mass is included among the network&rsquo;s inputs. The second network&rsquo;s numbers look excellent: {(N.nn2.accuracy * 100).toFixed(1)}% accuracy and, over every event, {pc(N.nn2.sigW / N.signalWeighted)} of the signal kept for only {(N.nn2.bgW / N.backgroundWeighted * 100).toFixed(1)}% of the background, a signal share of 0.0098 against 0.0019 for the cuts.
        </P>
        <P>
          They are a warning. A network told the mass can learn that events near 1 TeV are more likely to be signal and favour them, whatever else they look like. The background that survives is then no longer smooth: it has a bump at the signal mass, made by the selection. Fit it with a smooth background plus a Gaussian and the Gaussian soaks the bump up. Below, there is no signal at all.
        </P>

        <SculptLab />

        <P>
          The effect in the notebook is a smaller version of the same thing. Its background histogram for the mass-trained network has visibly more events in the second bin than the other network&rsquo;s, so the shape has changed (the figure&rsquo;s x axis runs out to 5×10⁷ MeV, which squeezes that into the first two bars). The notebook&rsquo;s conclusion is the one to keep: the reason to leave the mass out is that otherwise the selection can reshape the background to match the signal, and the thing you are searching for must not be something the selection can make.
        </P>
        <Figure fig={F.sculpting} className="max-w-3xl" />

        {/* ------------------------------ 7 ------------------------------ */}
        <H2 id="trust" n={7}>How far to trust it</H2>
        <P>These are the checks I made on the notebook while building this page, in a neutral tone, and what they could and could not settle.</P>
        <ul className="max-w-[44rem] space-y-4 list-disc pl-5 marker:text-[var(--accent)]">
          <li>
            <strong className="text-white/85">The 5.58σ is not a measurement of signal.</strong> The data histogram for the square-cut fit is built from <code className="font-mono text-white/80">background_cut</code> only, the fitted signal amplitude is −1,115 events, and the notebook itself notes that the fit &ldquo;has not worked correctly&rdquo;. The network fit uses signal plus background. A like-for-like test would fit the same signal-plus-background sample after each selection.
          </li>
          <li>
            <strong className="text-white/85">All four fits describe the data poorly.</strong> χ² per degree of freedom is between 5 and 18. √Δχ² assumes the background model is right, so with these numbers it is a figure of merit for how much better the signal term fits, not a probability that the signal is real.
          </li>
          <li>
            <strong className="text-white/85">The training curves do not show overfitting.</strong> The notebook suspected it. In the plot, the training and test curves lie on top of each other, early stopping never triggered, and accuracy is still creeping up at epoch 200 (about 0.88). A longer run is the likelier improvement. The 0.943 AUC and the confusion matrix are on a balanced held-out sample, not on the real signal-to-background ratio.
          </li>
          <li>
            <strong className="text-white/85">The with-mass and without-mass numbers are not on the same sample.</strong> The network without the mass was applied to signal plus diboson only (3,800.7 signal and 8,433.3 background, weighted); the one with the mass was applied to signal plus all three backgrounds (3,959.8 and 405,859.9). The side-by-side plot the notebook meant to draw hit an error (an array of 205,140 where 6,876,972 were expected), so it never rendered.
          </li>
          <li>
            <strong className="text-white/85">The cuts were tuned on the samples they are judged on.</strong> With millions of events that is a small effect, but there is no held-out set for the cut-based result, and the cut values came from reading the quantile printout.
          </li>
          <li>
            <strong className="text-white/85">Nothing was re-run.</strong> The event files are not part of what I had to hand. Every number here is a printed output of the notebook or arithmetic on one; the confusion-matrix counts are read from its plot. The mass-sculpting lab is a toy, labelled as one, with a single real ingredient: the background curve.
          </li>
        </ul>

        <Callout title="What I would do next">
          <p>
            Fit the same signal-plus-background histogram after each selection; use a fit range and function that give a sensible χ²; train the network for longer and compare it with the cuts on identical samples; and, if the mass has to be used, keep the selection from depending on it (by leaving it out, as the exercise intended, or by decorrelating the score from it).
          </p>
        </Callout>

        <p className="max-w-[44rem] pt-8 text-sm text-white/45">
          Source: the Week 9 notebook (Project 4) for the DAML course; samples supplied with the course. Back to <A href="/research">all research</A>.
        </p>
      </div>
    </article>
  );
}
