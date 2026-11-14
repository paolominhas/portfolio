"use client";

import React from "react";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { Callout, Figure, Stat, Term } from "./ui";
import SectionNav, { type NavItem } from "./SectionNav";
import BeamLab from "./BeamLab";
import CutMachine from "./CutMachine";
import Composition from "./Composition";
import CodeWalk from "./CodeWalk";
import RecoLab from "./RecoLab";
import OscResolution from "./OscResolution";
import FigureExplorer from "./FigureExplorer";
import { CAVEATS, GLOSSARY, NUMBERS as N, REFS, REPO, REPORT_PDF, VALIDATION } from "@/data/dune-nd";

/**
 * DUNE NEAR-DETECTOR (SENIOR HONOURS) PAGE
 * ─────────────────────────────────────────────────────────────────
 * Written like a report: question, method, results, checks. The plots in the figure explorer and the figures
 * inline are the project's own. The composition chart is read off one of them (and says so). The reconstruction lab
 * and the oscillation lab are toys built on the project's formulas and are labelled as such; "How far to trust it"
 * lists what was and was not checked, and the repository/report inconsistencies I found, in a neutral tone.
 * Numbers live in data/dune-nd.ts.
 */

const NAV: NavItem[] = [
  { id: "question", label: "The question" },
  { id: "beam", label: "Beam and detectors" },
  { id: "interactions", label: "What the detector sees" },
  { id: "method", label: "Simulation and code" },
  { id: "spectra", label: "The beam, simulated" },
  { id: "reco", label: "Reconstructing energy" },
  { id: "cp", label: "Why it matters for δCP" },
  { id: "plots", label: "Every plot" },
  { id: "conclusions", label: "Conclusions" },
  { id: "trust", label: "How far to trust it" },
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

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className="text-[var(--accent)]/90 hover:text-[var(--accent)] underline underline-offset-4" href={href}>
    {children}
  </a>
);

export default function DuneNdContent() {
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
            {["Neutrino physics", "DUNE", "Near detector", "Data analysis"].map((t) => (
              <span key={t} className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-bodoni text-5xl md:text-7xl font-medium text-white tracking-tight leading-tight mb-6">Can we trust the energy?</h1>
          <p className="text-xl md:text-2xl text-white/55 leading-relaxed font-light max-w-3xl">
            Using simulated DUNE near-detector events to find where a reconstructed neutrino energy can and cannot be trusted, and why that decides how well DUNE can measure CP violation.
          </p>
          <p className="mt-8 text-sm text-white/40">
            <strong className="text-white/70">Paolo Minhas</strong> · supervised by Dr C. Patrick and Dr M. Nebot-Guinot · Senior Honours project, School of Physics and Astronomy, University of Edinburgh · ten weeks, report dated March 2025
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat value="4" label="samples: liquid or gas argon × ν or ν̄ beam" />
            <Stat value="5" label="ROOT macros, 571 lines" />
            <Stat value="10⁸" label="νμ-CC events a year, NDLAr design goal" />
            <Stat value="29" label="result plots in the repository" />
          </div>
        </div>
      </header>

      <SectionNav items={NAV} />

      <div className="max-w-4xl mx-auto px-6 text-lg leading-relaxed space-y-6">
        <Callout title="The short version">
          <p>
            DUNE will fire a neutrino beam from Fermilab to a detector 1,300 km away and look for differences between how neutrinos and antineutrinos change flavour on the way: that difference is CP violation. The comparison rests on knowing each neutrino’s energy, which nobody measures directly. It is inferred from whatever the interaction leaves behind, and the inference can go wrong.
          </p>
          <p>
            I used simulated near-detector events, in liquid and gaseous argon, to see where it goes wrong. For some interactions the reconstructed energy comes out systematically low; the liquid-argon detector shows a large spurious excess below 1 GeV; and selecting events by what comes out of the nucleus (a muon and no pions) rather than by interaction label gives a cleaner reconstruction. This page lets you build the final states, switch the causes of a mis-reconstruction on one at a time, and browse every plot, and at the end it lists the checks I made afterwards and where the report and repository don’t quite agree.
          </p>
        </Callout>

        {/* ------------------------------ 1 ------------------------------ */}
        <H2 id="question" n={1}>The question</H2>
        <P>
          A neutrino made as one flavour can later be found as another, because the flavours are mixtures of states with slightly different masses. The mixing is described by the PMNS matrix, which has three angles and one complex phase, <InlineMath math="\delta_{CP}" />. If that phase is neither 0 nor π, neutrinos and antineutrinos oscillate differently, <InlineMath math="P(\nu_\alpha\to\nu_\beta)\neq P(\bar\nu_\alpha\to\bar\nu_\beta)" />: this is <Term def="Charge-conjugation and parity: swapping matter for antimatter and mirroring space. If nature were symmetric under it, neutrinos and antineutrinos would oscillate identically.">CP violation</Term> in the lepton sector, and a candidate ingredient in why the universe contains more matter than antimatter.
        </P>
        <P>
          DUNE tests it by sending a beam from Fermilab, Illinois, to a far detector about 1,300 km away and counting electron neutrinos that appear in a muon-neutrino beam, once with the beam made of neutrinos and once of antineutrinos. But a count at the far detector means nothing without knowing what left the source. That is the job of the <strong className="text-white/85">near detector</strong>: it measures the beam before any significant fraction has oscillated, and its measurement is used to predict what the far detector should see if nothing odd happened.
        </P>
        <P>
          The catch is that a near detector does not see the beam. It sees the beam’s <Term def="Flux × cross-section × detector response. A single measurement mixes the three, which is why each has to be constrained separately.">flux, convolved with the interaction cross-section and the detector’s response</Term>, and each of those has its own uncertainty. This project asks one slice of the question with simulated events: where, and for which interactions, does the energy a detector reconstructs differ from the true neutrino energy, and can the analysis be arranged to avoid it?
        </P>
        <Plain>
          To read an oscillation pattern you have to know the neutrino’s energy, the way you need the units to read a ruler. Nobody gets to measure the energy directly. You add up what flew out of the collision and hope you caught all of it. When some of it is invisible, the answer comes out low, and an error in the energy looks like an error in the physics.
        </Plain>

        {/* ------------------------------ 2 ------------------------------ */}
        <H2 id="beam" n={2}>The beam and the near-detector complex</H2>
        <P>
          Protons of 60 to 120 GeV from the Fermilab Main Injector (beam power 1.03 to 1.20 MW, doubling later with PIP-II) hit a graphite target. The pions and kaons that come off are sorted by charge and focused by three magnetic horns, then decay in a {N.decayPipe} m pipe into muons and neutrinos, and an absorber at the end removes what is left of the hadrons. Reversing the horn current swaps which sign is focused: forward horn current (FHC) gives mostly neutrinos, reverse (RHC) mostly antineutrinos. The beam is deliberately wide-band so that it covers both the first and second oscillation maxima, which the report puts at 2.4 and 0.8 GeV.
        </P>
        <div className="max-w-[44rem] overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <caption className="text-left text-xs text-white/40 px-4 pt-3 pb-2">What comes off the target (the report’s Table 1, from NA61/SHINE measurements)</caption>
            <thead className="text-[11px] uppercase tracking-wider text-white/45 bg-white/[0.03]">
              <tr><th className="px-4 py-2 font-normal">Particle</th><th className="px-4 py-2 font-normal">Decays to</th><th className="px-4 py-2 font-normal">Share of the beam</th></tr>
            </thead>
            <tbody className="text-white/70">
              {[
                ["π⁺", "μ⁺ νμ", "about 60%"],
                ["π⁻", "μ⁻ ν̄μ", "about 30%"],
                ["K⁺", "μ⁺ νμ or π⁺ π⁰", "5 to 10%"],
                ["K⁻", "μ⁻ ν̄μ or π⁻ π⁰", "1 to 3%"],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-white/5"><td className="px-4 py-2 font-mono">{r[0]}</td><td className="px-4 py-2">{r[1]}</td><td className="px-4 py-2">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Two things in that table matter later. The beam is never one species, and there are more positive than negative pions to begin with, so neutrino mode and antineutrino mode are not mirror images, which is a fact about beam production and not about CP violation.
        </P>

        <BeamLab />

        <P>
          The near-detector complex is three detectors. The liquid-argon TPC (NDLAr, 35 chambers) uses the same nucleus as the far detector, so many detector and nuclear effects cancel, and it is built to record about 10⁸ νμ charged-current events a year, but it cannot contain muons above about 0.7 GeV/c. So muon momentum and charge come from the multi-purpose detector downstream, whose high-pressure gaseous-argon TPC (NDGAr) is far less dense. Fewer secondary interactions and a lower proton threshold make it a cleaner picture of the same interactions, at about 2 × 10⁶ events a year. A third detector, SAND, monitors the beam. Both of the first two can move off axis, the DUNE-PRISM idea from the lab above. This report simulates the NDLAr and the NDGAr.
        </P>

        {/* ------------------------------ 3 ------------------------------ */}
        <H2 id="interactions" n={3}>What the detector sees</H2>
        <P>
          Neutrinos are invisible, so the detector sees what they do to argon nuclei. Five kinds of interaction matter, and the energy at which each dominates is different:
        </P>
        <p className="sm:hidden text-[11px] text-white/40 mb-1">Swipe the table sideways to see every column.</p>
                <div className="max-w-[44rem] overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm min-w-[34rem]">
            <thead className="text-[11px] uppercase tracking-wider text-white/45 bg-white/[0.03]">
              <tr><th className="px-4 py-2 font-normal">Interaction</th><th className="px-4 py-2 font-normal">What happens</th><th className="px-4 py-2 font-normal">What goes wrong for the energy</th></tr>
            </thead>
            <tbody className="text-white/70 align-top">
              {[
                ["CCQE", "The neutrino knocks one nucleon out of the nucleus: a muon and a proton.", "The cleanest case, but the nucleon was moving and bound, which the simple formulas ignore."],
                ["RES", "A nucleon is excited to a Δ that decays to a nucleon and a pion.", "If the pion is absorbed the event looks quasi-elastic; if not, its energy has to be counted."],
                ["DIS", "A high-energy neutrino breaks a nucleon apart: a hadronic shower.", "Many particles, some neutral or invisible, so energy is easily missed."],
                ["MEC / 2p2h", "The neutrino hits a correlated pair of nucleons; two come out.", "Looks like CCQE but carries off more energy, so the neutrino seems lower in energy than it was."],
                ["COH", "The neutrino scatters off the whole nucleus (neutral current).", "Barely visible; not part of this analysis."],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-white/5"><td className="px-4 py-2 font-mono text-white/85 whitespace-nowrap">{r[0]}</td><td className="px-4 py-2">{r[1]}</td><td className="px-4 py-2">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          The generator knows which of these happened to each simulated event. A real detector does not: it sees a final state. Cross-section measurements have therefore moved from “the CCQE cross-section” to measuring a <em>final state</em>, most often one muon and no pions, <Term def="Charged-current events with no pions in the final state. It collects CCQE, 2p2h and resonant events whose pion was absorbed, so it is not a pure interaction type.">CC0π</Term>, sometimes called CCQE-like. The widget below applies the report’s actual cuts to a final state you build.
        </P>

        <CutMachine />

        <P>
          So what is in a CC0π sample? The generator’s label is available in simulation, and the stacked plot in the report (Figure 17) shows the answer. Reading it back by colour gives the chart below.
        </P>

        <Composition />

        <P>
          Roughly 60 to 65% of the sample is CCQE, and the rest is resonant, meson-exchange and deep-inelastic events that have the same final state. The shares move with energy in a physical direction: CCQE falls as the energy rises while deep inelastic scattering grows, and meson exchange stays near an eighth. Both detectors give the same picture, as the report notes, which is reassuring since they see the same beam.
        </P>

        {/* ------------------------------ 4 ------------------------------ */}
        <H2 id="method" n={4}>The simulation and the code</H2>
        <P>
          The events were produced by <Term def="The GENIE Monte Carlo neutrino-interaction generator, which models every interaction type on argon.">GENIE</Term> and stored as ROOT ntuples in <Term def="Common Analysis Files: the DUNE event format, read by the CAFAna framework.">CAFs</Term>, for the NDLAr and NDGAr in FHC and RHC. Each event holds a true record and a reconstructed one. Because the detectors do not exist yet, the report uses what it calls a parameterised reconstruction to stand in for the detector’s response. The files were copied from Fermilab to a server on the Edinburgh particle-physics network; the analysis ran in a container with CAFAna, driven from a laptop, with the macros written in vim and interpreted at run time, so nothing was compiled.
        </P>
        <P>
          Two formulas turn what the detector measured into a neutrino energy, and the report compares them with the energy stored in the CAF. Both assume the neutrino struck a neutron at rest, bound with removal energy <InlineMath math="E_b = 28\,\mathrm{MeV}" />, and that exactly a muon and a proton came out. Energy conservation adds up the muon energy and the proton’s kinetic energy:
        </P>
        <BlockMath math="E_\nu^{\rm cons} = E_\mu + (T_p + m_p) - (m_n - E_b)" />
        <P>and the quasi-elastic formula uses only the muon’s energy and angle:</P>
        <BlockMath math="E_\nu^{\rm QE} = \frac{m_p^2 - (m_n - E_b)^2 - m_\mu^2 + 2(m_n - E_b)E_\mu}{2\,(m_n - E_b - E_\mu + p_\mu\cos\theta_\mu)}" />
        <P>
          Both follow from that assumption; the second also uses four-momentum conservation to eliminate the proton. Everything the nucleus really does (the struck nucleon moves, a second nucleon joins in, a neutron leaves unseen, a pion is absorbed) breaks the assumption, and that is what the rest of the analysis is about. The five macros are short, each built around one question:
        </P>

        <CodeWalk />

        <Callout title="How the macros work">
          <p>
            Each macro declares the <span className="font-mono text-white/80">Spectrum</span> objects it wants (a variable, a binning and a cut), calls <span className="font-mono text-white/80">loader.Go()</span> once to loop over the files, and then draws the result. They are templates: the sample path and the cut are edited for each plot (the comments say “change this to use a different sample”), which is why a macro’s file name for its output is only the last plot it made.
          </p>
        </Callout>

        {/* ------------------------------ 5 ------------------------------ */}
        <H2 id="spectra" n={5}>The beam, as the detectors see it</H2>
        <P>
          Figure 12 shows the true neutrino energy of the beam in forward horn current. Muon neutrinos dominate and peak near 2 GeV. The largest background is muon antineutrinos, at least an order of magnitude below, which the report attributes to wrong-sign pions that the horns did not remove. The logarithmic axis hides the error bars on the big peak and exaggerates them on the electron-flavour lines, where there are few events.
        </P>
        <P>
          Reverse horn current (the right-hand plot) is not a mirror image. The wrong-sign neutrinos are a far larger fraction, and at the highest energies they outnumber the antineutrinos the beam is meant to deliver. The report’s explanation is beam physics: more positive pions are made, and at high momentum they travel nearly parallel to the axis, so the horns have little sideways component to push on and cannot divert them. This is not CP violation, but it is an asymmetry between the two beams that any ν-against-ν̄ comparison has to account for, which is a reason the near detector has to measure each beam on its own.
        </P>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <Figure id="fhcBeam" />
          <Figure id="rhcLar" />
        </div>

        {/* ------------------------------ 6 ------------------------------ */}
        <H2 id="reco" n={6}>Reconstructing the energy</H2>
        <P>
          The three ways of picking out quasi-elastic events (the generator’s label, a strict one-muon-one-proton final state, and CC0π) give very different counts. Reading the plots at their peaks, the strict final state keeps only 46 to 49% as many events as the true CCQE label does, while CC0π has about 1.6 times as many, in all four detector and horn combinations. The report puts it this way: CCQE is not the only source of CC0π, and one muon and one proton is not the only final state of CCQE. Neither selection reproduces the label, so which one to use becomes the question.
        </P>
        <P>
          Then the key comparison: the true energy against the energy calculated five ways, for a sample of one-muon-one-proton events. At the gas detector the five curves broadly track each other. At the liquid-argon detector they do not.
        </P>
        <Figure id="recoLar" className="max-w-2xl mx-auto" />
        <P>
          The three reconstructed curves (dashed) are pushed to low energy, with a spike below 1 GeV and too few events near the true peak at 2 GeV. The smearing matrix shows it from another angle: every event is a point at (true energy, reconstructed energy), so a perfect detector fills only the diagonal. Below it sits a broad blob of events whose energy came out too low.
        </P>
        <Figure id="smearAll" className="max-w-2xl mx-auto" />
        <P>
          The report’s explanation for the blob in §4.3 is that a single particle’s track is sometimes broken into two, which makes more low-energy particles, and that this is more common in liquid argon because of its density and the extra final-state interactions. Its conclusion, though, points to neutrons that leave without being counted. Both are plausible and the simulation as published does not separate them. What the interaction-by-interaction matrices suggest (Figure 21, in the plot explorer below) is where the blob comes from: the resonant and deep-inelastic matrices show broad regions below the diagonal in the same place, while the CCQE and meson-exchange matrices hug the diagonal with only a faint tail.
        </P>

        <RecoLab />

        <P>
          Running the lab shows the directions clearly and also its limit. A moving nucleon alone spreads the quasi-elastic-formula result by about ±4% at 2 GeV and pushes the energy-conservation result up by about 1%, close to the analytic <InlineMath math="\langle p^2\rangle/2M\approx 18\,\mathrm{MeV}" />. Each 10 MeV error in the assumed removal energy moves the quasi-elastic-formula result by about 0.6 to 0.8% at 2 GeV, and the energy-conservation result by about 0.5%. A 2p2h share of 17% (the digitised share of CCQE plus MEC) pulls the median down by about 1% and fattens the low tail, and a 2p2h event that looks on average 400 MeV too low puts 8 to 10% of events more than 20% too low. What none of it does is come anywhere near the size of the excess in the liquid-argon plots, where the reconstructed energies pile up far below the true ones. Those events are not in this toy: they are the pion-producing and showering events the real simulation contains, where more of the energy can leave unseen, which fits the matrices above.
        </P>
        <P>
          That is also the argument for selecting by final state. After the CC0π cut the matrix is much closer to a clean diagonal, and the broad blob near 2 GeV that the all-event matrix has is no longer there (the report’s Figure 22a, below), although a fainter band below the diagonal remains. CC0π as a selection already includes the effects of 2p2h and of final-state interactions, rather than trying to undo them event by event from an interaction label the real detector cannot see.
        </P>
        <Figure id="smearCc0pi" className="max-w-2xl mx-auto" />
        <Plain>
          Think of weighing a parcel by listening to what rattles inside. If you pick “parcels with a clock in them” you are choosing by a label you cannot check from outside, and often you are wrong. If you pick “parcels that sound like exactly this”, you get a mixed bag, but you know exactly what the mixed bag is, and you can calibrate it.
        </Plain>

        {/* ------------------------------ 7 ------------------------------ */}
        <H2 id="cp" n={7}>Why it matters for δCP</H2>
        <P>
          The ND’s reconstruction is only a means. What DUNE fits at the far detector is the shape of an oscillation pattern in energy, and the pattern depends on <InlineMath math="L/E" />, so a wrong or blurred energy distorts it directly. The calculation below is the far-detector appearance probability, computed live, as a detector with a given resolution and energy scale would see it. It is an illustration of the stakes, not a DUNE sensitivity: the real fit weights by the flux and cross-section and uses the full detector response.
        </P>

        <OscResolution />

        <P>
          The takeaway is that two kinds of error hurt in different ways. Resolution washes out the narrow second maximum faster than the broad first, and the report’s own Figure 3 caption notes that δCP shows up most at lower energies. A scale error is worse in one respect: it moves the pattern by a large fraction of the whole effect of changing δCP. Both are what the near detector is for: measure the cross-sections and the detector’s response on the beam before it oscillates, so the far-detector fit can be told what to expect. The report’s Figure 6 (taken from its reference 23 and not reproduced here) shows how all of these uncertainties compound.
        </P>

        {/* ------------------------------ 8 ------------------------------ */}
        <H2 id="plots" n={8}>Every plot</H2>
        <P>
          All 29 plots in the repository, grouped by what they show. Two of the groups are not in the report’s body (the reverse-horn reconstruction-method plots, and two of the “finding CCQE” variants), and the tool marks which.
        </P>

        <FigureExplorer />

        {/* ------------------------------ 9 ------------------------------ */}
        <H2 id="conclusions" n={9}>Conclusions</H2>
        <P>
          The report’s conclusions, in order. The simulated near detectors show real difficulty in reconstructing some interactions. To avoid leaning on Monte Carlo corrections like these, one can concentrate on interactions that reconstruct well when looking for CP violation. The NDGAr is needed alongside the NDLAr, because the shortcomings of the liquid-argon detector (the large low-energy peaks) are most visible there, and the gas detector’s low-energy region is the place to constrain them. And selecting by final state rather than by interaction gives a better reconstruction, because the CC0π signature includes 2p2h and final-state interactions.
        </P>
        <P>
          The report also notes that, because of funding constraints, the NDGAr has been removed from the DUNE baseline, with a gas-argon detector possible in future but uncertain. That leaves the first conclusion carrying more weight: if the better detector is not there, the analysis has to be better instead.
        </P>
        <Callout title="What the plots leave open">
          <p>
            Three things the repository cannot settle by itself: whether re-running RecoMethods.C on the same files as the other macros changes Figures 18 and 19; how the CC0π smearing matrix divides by interaction type (the stack and the matrices are separate in the report); and which explanation for the liquid-argon excess is right, which could be tested by cutting on whether a neutron or a broken track is present in the true record. All three need the simulated files, which are not in the repository.
          </p>
        </Callout>

        {/* ------------------------------ 10 ------------------------------ */}
        <H2 id="trust" n={10}>How far to trust this page</H2>
        <P>
          There are three kinds of thing here: my plots shown as they are, two read-outs and re-derivations of mine, and the text. The checks below say how each was tested, and the notes after them list where the report and repository do not quite agree. I have kept the notes neutral; most are small and a few are worth fixing before the report is cited.
        </P>
        <div className="max-w-[44rem] space-y-3">
          {VALIDATION.map((v) => (
            <details key={v.what} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 group">
              <summary className="cursor-pointer text-white/85 text-base list-none flex items-start gap-3">
                <span className="text-[var(--accent)] mt-1 text-xs group-open:rotate-90 transition-transform">▶</span>
                <span>{v.what}</span>
              </summary>
              <div className="mt-3 pl-6 text-sm text-white/65 space-y-2">
                <p><span className="text-white/40 font-mono text-[11px] uppercase tracking-wider mr-2">How</span>{v.how}</p>
                <p><span className="text-[#5FD0A8] font-mono text-[11px] uppercase tracking-wider mr-2">Result</span>{v.result}</p>
              </div>
            </details>
          ))}
        </div>
        <h3 className="font-bodoni text-2xl text-white pt-6 max-w-[44rem]">Where the report and repository don’t quite agree</h3>
        <div className="max-w-[44rem] space-y-3">
          {CAVEATS.map((c) => (
            <details key={c.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 group">
              <summary className="cursor-pointer text-white/85 text-base list-none flex items-start gap-3">
                <span className="text-[var(--accent)] mt-1 text-xs group-open:rotate-90 transition-transform">▶</span>
                <span>{c.title}</span>
              </summary>
              <p className="mt-3 pl-6 text-sm text-white/65 leading-relaxed">{c.body}</p>
            </details>
          ))}
        </div>

        <Callout title="What the interactive parts are and are not" tone="warn">
          <p>
            The figure explorer shows the project’s own plots. The composition chart is a read-out of one of them. The reconstruction lab is a toy: it uses the project’s formulas and a digitised spectrum, but its events are not GENIE’s, it has no pion or final-state physics and its resolutions are invented. The oscillation lab is the same engine as the <Link className="underline underline-offset-4 text-[var(--accent)]/90" href="/research/globes">GLoBES page</Link>, with a made-up flat flux and a Gaussian response. The beam lab’s decay kinematics are exact and its pion spectrum is invented. Where a widget shows a number, it says which of those it is.
          </p>
        </Callout>

        {/* ------------------------------ 11 ------------------------------ */}
        <H2 id="more" n={11}>Sources and more</H2>
        <div className="max-w-[44rem] space-y-4">
          <p>
            Code and plots: <A href={REPO}>{REPO.replace("https://", "")}</A>. Full report: <A href={REPORT_PDF}>SeniorHonoursReport.pdf</A>. Related: <Link className="underline underline-offset-4 text-[var(--accent)]/90" href="/research/globes">simulating DUNE’s near and far detectors with GLoBES</Link>.
          </p>
          <p className="text-sm text-white/50">
            The report’s Figures 1 to 6, 10 and the beamline schematic come from other sources (CERN, DUNE collaboration talks and the technical reports) and are not reproduced here. Every plot on this page is one of mine from the repository.
          </p>
          <details className="rounded-xl border border-white/10 bg-white/[0.03] p-4 group">
            <summary className="cursor-pointer text-white/85 list-none flex items-start gap-3">
              <span className="text-[var(--accent)] mt-1 text-xs group-open:rotate-90 transition-transform">▶</span>
              <span>Key references (numbering as in the report)</span>
            </summary>
            <ol className="mt-3 pl-6 space-y-2 text-sm text-white/60 list-none">
              {REFS.map((r) => (
                <li key={r.n}><span className="font-mono text-white/35 mr-2">[{r.n}]</span>{r.text}</li>
              ))}
            </ol>
          </details>
          <details className="rounded-xl border border-white/10 bg-white/[0.03] p-4 group">
            <summary className="cursor-pointer text-white/85 list-none flex items-start gap-3">
              <span className="text-[var(--accent)] mt-1 text-xs group-open:rotate-90 transition-transform">▶</span>
              <span>Glossary</span>
            </summary>
            <dl className="mt-3 pl-6 space-y-3 text-sm">
              {GLOSSARY.map(([t, d]) => (
                <div key={t}>
                  <dt className="text-white/85">{t}</dt>
                  <dd className="text-white/55">{d}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </div>
    </article>
  );
}
