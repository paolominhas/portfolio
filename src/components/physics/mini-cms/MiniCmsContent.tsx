"use client";

import React from "react";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import CoverArt from "../research/CoverArt";
import SectionNav, { type NavItem } from "../dune-nd/SectionNav";
import { A, Callout, Figure, H2, P, Plain, Stat, Term } from "../daml/ui";
import DetectorLab from "./DetectorLab";
import CurvatureLab from "./CurvatureLab";
import CherenkovLab from "./CherenkovLab";
import { EmuBench, InformednessChart } from "./IdBench";
import { FIGS as F, N } from "@/data/mini-cms";

/**
 * MINI-CMS (DAML PROJECT 3) PAGE
 * ─────────────────────────────────────────────────────────────────
 * Written as a story of what worked and what didn't. Every number is printed in
 * the Project 3 notebook (see data/mini-cms.ts); the layer picture is a schematic;
 * the curvature lab and Cherenkov lab run the notebook's own formulas; the
 * "informedness" chart is arithmetic on the notebook's efficiencies and says so.
 * Two readings that the notebook does not make (why electrons below ~2 GeV are
 * never identified, why the simulated RICH angles miss the theory) are labelled
 * as readings, and the last section lists what was and was not checked.
 */

const NAV: NavItem[] = [
  { id: "task", label: "The task and the detector" },
  { id: "momentum", label: "Momentum from a bent track" },
  { id: "tidy", label: "A beam that was too tidy" },
  { id: "emu", label: "Electrons and muons" },
  { id: "pik", label: "Pions and kaons" },
  { id: "cherenkov", label: "The Cherenkov idea" },
  { id: "rich", label: "What the RICH returned" },
  { id: "trust", label: "How far to trust it" },
  { id: "plots", label: "More plots" },
];

export default function MiniCmsContent() {
  return (
    <article className="min-h-screen bg-abyss bg-stars text-white/65 selection:bg-ember/30 pb-32 relative overflow-x-clip">
      {/* ------------------------------ hero ------------------------------ */}
      <header className="relative pt-32 pb-14 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[800px] h-[400px] bg-ember/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto xl:pl-52 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] items-center">
          <div className="min-w-0">
            <Link href="/research" className="inline-block text-sm text-[var(--accent)]/80 hover:text-[var(--accent)] mb-8">
              ← Back to research
            </Link>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Detector simulation", "Geant4", "Particle identification", "Coursework"].map((t) => (
                <span key={t} className="px-3 py-1 text-xs font-bold tracking-normal text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="font-bodoni text-5xl md:text-7xl font-medium text-white tracking-tight leading-tight mb-6">Telling particles apart</h1>
            <p className="text-xl md:text-2xl text-white/55 leading-relaxed font-light max-w-3xl">
              I built a small CMS-style detector in Geant4 and asked it which particle was which. It can tell an electron from a muon. It cannot tell a pion from a kaon, five different ways, and the reason is in the physics.
            </p>
            <p className="mt-8 text-sm text-white/45">
              <strong className="text-white/75">Paolo Minhas</strong> · Project 3 of the DAML course, School of Physics and Astronomy, University of Edinburgh
            </p>
          </div>
          <div className="min-w-0 hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-white/10 aspect-[16/10]">
              <CoverArt kind="mini-cms" seed="mini-cms" loop className="h-full w-full" />
            </div>
          </div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto xl:pl-52 mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat value="6" label="layers: two trackers, RICH, two calorimeters, muon chamber" />
          <Stat value="94%" label="of muons identified with the muon chamber" />
          <Stat value="63%" label="of electrons identified, against a 70% target" />
          <Stat value="≈50%" label="pion-versus-kaon accuracy, whichever method" />
        </div>
      </header>

      <SectionNav items={NAV} />

      <div className="max-w-4xl mx-auto px-6 text-lg leading-relaxed space-y-6">
        <Callout title="The short version">
          <p>
            The third project of the course had four steps: simulate a detector, reconstruct what it sees, check the reconstruction, and discuss it. I started from a two-layer tracker and added calorimeters, a muon chamber and finally a RICH, then tried to identify electrons, muons, pions and kaons from what the layers recorded.
          </p>
          <p>
            Electrons and muons worked, with a muon chamber lifting muon identification to 94% and electrons stuck at 63% for a reason that may be geometry. Pions and kaons did not. Five attempts (a cut, a gradient-boosted classifier, and three rules on a second run that included the RICH) all came out at about 50%, which is chance. This page walks through the detector, lets you fire particles through it, bend a track and sweep the Cherenkov angle, and ends with what I checked afterwards and what I did not.
          </p>
        </Callout>

        {/* ------------------------------ 1 ------------------------------ */}
        <H2 id="task" n={1}>The task and the detector</H2>
        <P>
          The starting point was the two-layer tracker from the Week 6 Geant4 workshop. Each layer is a thin cylinder that records where a charged particle crosses it. I wrapped it in a 50 cm <Term def="Electromagnetic calorimeter: a block dense enough to stop electrons and photons and measure their total energy.">electromagnetic calorimeter</Term> of lead tungstate and a 1.9 m <Term def="Hadronic calorimeter: a thicker block that stops hadrons such as pions and kaons and measures their energy.">hadronic calorimeter</Term>, both Geant4 cylinders with their own sensitive detector that sums the energy deposited per event. A 2 T magnetic field runs along the beam so that tracks bend.
        </P>
        <P>
          Two more layers came later: a thin ring of air outside everything as a muon chamber, and, for the last part, a cylinder of water between the trackers and the calorimeters to make Cherenkov light. The aim was to identify particles from the pattern of layers that fire, with a 70% efficiency as the target.
        </P>

        <DetectorLab />

        <Plain>
          A detector never sees a particle. It sees where thin layers were crossed and how much energy thick layers soaked up. Naming the particle means reading that pattern the way you would name an animal from its footprints and how deep it sank in the mud.
        </Plain>

        {/* ------------------------------ 2 ------------------------------ */}
        <H2 id="momentum" n={2}>Reading momentum off a bent track</H2>
        <P>
          A charged particle in a magnetic field travels on a circle, and a bigger momentum means a flatter circle. With two tracker hits at 4 m and 8 m, the notebook turns the small difference in their azimuth angle, <InlineMath math="\Delta\phi" />, into a momentum:
        </P>
        <div className="max-w-[44rem] overflow-x-auto">
          <BlockMath math="s = \sin(\Delta\phi)\,r_1,\qquad R = \frac{r_2^{2}}{8s},\qquad p_T = 0.3\,B\,R,\qquad p = \frac{p_T}{\sin\theta}" />
        </div>
        <P>
          The lab below runs those lines. Its two presets are the real track pairs from event 6 of the first run, and it prints the notebook&rsquo;s recorded angle beside the one the formula predicts.
        </P>

        <CurvatureLab />

        <P>
          In the first run, a file of lepton pairs with each lepton near 45.5 GeV, I paired hits in the two trackers by their polar angle and ran the formulas. Track pairs were found in {N.run1.pairsFound} of the {N.run1.events.toLocaleString()} events, and for most of them the rebuilt momentum is within about half a percent of the truth.
        </P>
        <Figure fig={F.momentumResolution} className="max-w-xl mx-auto" />

        {/* ------------------------------ 3 ------------------------------ */}
        <H2 id="tidy" n={3}>A beam that was too tidy</H2>
        <P>
          My first attempt at identification used that same file. A hand-written rule on the calorimeter share and the track momentum labelled 447 track pairs electrons, 397 muons and 58 photons, and left 378 unknown, against truth labels of 818, 443 and 19. That is not usable, and I put it down to the data rather than the rule: every lepton was near 45.5 GeV, so there was no energy dependence to study.
        </P>
        <P>
          So I swapped the HepMC file reader for Geant4&rsquo;s <Term def="G4GeneralParticleSource: a built-in generator where you choose the particle, position, direction and energy spectrum in a macro file.">general particle source</Term>. A short macro fires one particle type from the centre, isotropically, with energies spread flat between 200 MeV and 20 GeV. That made the rest of the project possible: efficiency could now be measured as a function of energy.
        </P>

        {/* ------------------------------ 4 ------------------------------ */}
        <H2 id="emu" n={4}>Electrons and muons</H2>
        <P>
          The first run of the new setup had electrons, muons and antimuons, 2,000 events in all. The rule was a single line: more than {N.emu.thresholdGeV} GeV in the ECAL means electron, otherwise muon. An electron showers in the ECAL and leaves almost all its energy there; a muon passes through and leaves very little.
        </P>

        <EmuBench />

        <P>
          Muons look good because they are the default answer: anything that deposits under 1 GeV is called one. Electrons are the honest test, and at 63% they miss the 70% target. By energy the picture is stark: no electron below about 2 GeV is identified at all, and the efficiency only crosses 70% near 10 GeV.
        </P>
        <div className="grid gap-6 md:grid-cols-2">
          <Figure fig={F.efficiencyEcal} />
          <Figure fig={F.ecalDeposits} />
        </div>

        <Callout title="A reading worth testing, not a result">
          <p>
            The ECAL histogram has a spike of electrons that deposited almost nothing, and the efficiency curve switches on between about 2 and 4 GeV. In a 2 T field a particle of momentum <InlineMath math="p" /> travels on a circle of radius <InlineMath math="p/0.6" /> metres, so it only gets <InlineMath math="2R" /> from the centre. The curvature lab above puts the minimum for reaching 8 m at 2.4 GeV, which is where the efficiency begins to turn on.
          </p>
          <p>
            If the calorimeters sit outside the 8 m tracker, low-momentum electrons would curl up before reaching them, and a good part of the electron inefficiency would be geometry that no better rule could repair. I have not re-run the simulation with the field off to check, and the calorimeter radii are not in the notebook, so treat it as a lead.
          </p>
        </Callout>

        <P>
          The muon chamber is the obvious fix for the muon side. A hit in the outer air layer, together with a track, means the particle got through everything, so any hit overrides the ECAL and calls it a muon. Muon identification rises from {Math.round(N.emu.ecalOnly.muon * 100)}% to {Math.round(N.emu.withMuonChamber.muon * 100)}%, overall from {Math.round(N.emu.ecalOnly.overall * 100)}% to {Math.round(N.emu.withMuonChamber.overall * 100)}%, and electrons do not change, because the chamber has nothing to say about them. Most of the gain is above about 5 GeV.
        </P>
        <Figure fig={F.efficiencyMuon} />

        {/* ------------------------------ 5 ------------------------------ */}
        <H2 id="pik" n={5}>Pions and kaons</H2>
        <P>
          An electron and a muon look nothing alike to a calorimeter. A pion and a kaon do. Both are hadrons, both shower in the HCAL, and at the same momentum they carry similar energy. The project&rsquo;s later question was whether the calorimeters alone could separate them.
        </P>
        <P>
          The first rule used the share of the energy in the HCAL: above 0.5 means kaon. The 0.5 was a placeholder. It gave {Math.round(N.piK.hcalCut.pion * 100)}% for pions and {Math.round(N.piK.hcalCut.kaon * 100)}% for kaons, {N.piK.hcalCut.overall.toFixed(3)} overall. The pion figure looks respectable. It is not:
        </P>
        <Callout tone="warn" title="A number that fools you">
          <p>
            {Math.round(N.piK.hcalCut.pion * 100)}% of pions are called pions, but {Math.round((1 - N.piK.hcalCut.kaon) * 100)}% of kaons are called pions too. The rule says &ldquo;pion&rdquo; about 84% of the time whatever it is looking at. Efficiency for one class means nothing without the other.
          </p>
        </Callout>
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <Figure fig={F.hcalFraction} />
          <div className="my-6 text-base text-white/65 leading-relaxed space-y-3">
            <p>
              Here is why. Pions and kaons both split into two groups, those that stop early (HCAL share near 0) and those that punch through (near 1), and the two histograms lie on top of each other. A cut can only separate what differs, and nothing in this plot does.
            </p>
            <p>
              The next step, as the course suggested, was machine learning. I trained a gradient-boosted classifier on four inputs (ECAL deposit, HCAL deposit, the HCAL share of the total, and the total). Its test accuracy was {N.piK.gradientBoosting.accuracy}, a little worse than the cut&rsquo;s {N.piK.gradientBoosting.thresholdAccuracy}. A classifier cannot find structure that is not in its inputs.
            </p>
          </div>
        </div>
        <Figure fig={F.gradientBoosting} />

        {/* ------------------------------ 6 ------------------------------ */}
        <H2 id="cherenkov" n={6}>The Cherenkov idea</H2>
        <P>
          The standard answer in real experiments, ALICE and LHCb among them, is a ring-imaging Cherenkov detector. A charged particle moving faster than light does in a medium emits a cone of light, and the cone&rsquo;s opening angle depends on speed. Momentum comes from the track curvature, speed from the ring, and a pion and a kaon of the same momentum have different masses, so different speeds.
        </P>
        <P>
          I modelled it with water as the radiator (refractive index 1.33, a 10 m absorption length across four photon energies from 2 to 3.5 eV) and an air layer outside it where photons are counted. The water is not sensitive; the particles interact with it as they would in real life, and the photons are recorded afterwards. A first version of this detector wrote an empty output file, and the data used below come from the version that works.
        </P>

        <CherenkovLab />

        <P>
          The lab says something uncomfortable. A water RICH separates kaons from pions in a window from the kaon&rsquo;s threshold of 0.56 GeV up to a few GeV, and the beam I used runs flat to 20 GeV. Most of the kaons were never in the window.
        </P>

        {/* ------------------------------ 7 ------------------------------ */}
        <H2 id="rich" n={7}>What the RICH returned</H2>
        <P>
          The rules I tried were simple: more than 5 photons in the RICH means pion, otherwise kaon, with the HCAL share as the fallback for the combined version. The summary below is from 500 pions and 500 kaons.
        </P>
        <div className="max-w-xl overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <caption className="text-left text-xs text-white/45 px-4 pt-3 pb-2">Efficiency by rule, RICH run (flat 0.2 to 20 GeV)</caption>
            <thead className="text-[11px] tracking-normal text-white/45 bg-white/[0.03]">
              <tr><th className="px-4 py-2 font-normal">Rule</th><th className="px-4 py-2 font-normal">Pions</th><th className="px-4 py-2 font-normal">Kaons</th><th className="px-4 py-2 font-normal">Overall</th></tr>
            </thead>
            <tbody className="text-white/75 font-mono">
              {([["HCAL share only", N.piK.richRun.hcalOnly], ["RICH photons only", N.piK.richRun.richOnly], ["RICH, then HCAL", N.piK.richRun.combined]] as const).map(([name, r]) => (
                <tr key={name} className="border-t border-white/5">
                  <td className="px-4 py-2 font-sans">{name}</td><td className="px-4 py-2">{r.pion.toFixed(3)}</td><td className="px-4 py-2">{r.kaon.toFixed(3)}</td><td className="px-4 py-2">{r.overall.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Every overall figure is about one half, and in every row the pion and kaon columns add up to about 1. Put side by side, the seven classifiers of this project look like this:
        </P>

        <InformednessChart />

        <P>
          The efficiency curves by energy show the same thing in another way. The RICH-only rule does not separate the two species; it calls everything a kaon at low momentum and everything a pion at high momentum, switching over where the photon count rises.
        </P>
        <Figure fig={F.richComparison} />
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <Figure fig={F.photonYield} />
          <Figure fig={F.cherenkovAngles} />
        </div>
        <P>
          Two things in these plots are not what the theory says. First, pions should be glowing from 0.16 GeV, but both species record almost no photons until 2 or 3 GeV, and above that the pion and kaon counts overlap. Second, the simulated hit angles span 45° to 135° instead of clustering near 41°. The notebook takes a hit&rsquo;s polar angle as the Cherenkov angle, which would be right only if the particle were travelling along the polar axis; the hits are almost certainly measured from the beam axis instead, so each one would first have to be rotated into its own particle&rsquo;s frame. I did not find what was holding back the photon counts, nor make that rotation.
        </P>
        <Plain>
          I measured a ring in the wrong coordinates, so I could not see whether it was the right size. It&rsquo;s like trying to judge how wide a hula hoop is while only knowing the angle each point on it makes with the ceiling, and not with the hoop&rsquo;s own centre.
        </Plain>

        <Callout title="What the project showed, honestly">
          <p>
            The calorimeters cannot separate pions from kaons, and the RICH I built did not either. The theory says it should work in a window of about 0.6 to 3 GeV, but this simulation never produced a usable signal, so I cannot say how much of the failure is the physics and how much is my set-up. If I did it again I would first make the RICH work on pions alone (do the photon counts rise above 0.16 GeV, as they should?), then rotate the hits, and only then add the classifier.
          </p>
        </Callout>

        {/* ------------------------------ 8 ------------------------------ */}
        <H2 id="trust" n={8}>How far to trust it</H2>
        <P>These are the checks I made on the notebook while building this page, in a neutral tone, and what they could not settle.</P>
        <ul className="max-w-[44rem] space-y-4 list-disc pl-5 marker:text-[var(--accent)]">
          <li>
            <strong className="text-white/85">Every number is the notebook&rsquo;s.</strong> The efficiencies, resolutions and accuracies on this page are printed outputs. The informedness bars and the &ldquo;share of the beam&rdquo; figures are arithmetic on them (the beam share assumes a flat 0.2 to 20 GeV spectrum, as in the macros). Nothing was re-simulated, and the Geant4 code and sample files were not part of what I had to hand.
          </li>
          <li>
            <strong className="text-white/85">The tracker radii are the code&rsquo;s defaults.</strong> The 4 m and 8 m in the curvature lab are the values the reconstruction function takes as defaults (with the field at 2 T). I did not check them against the Geant4 geometry file, which is not part of what I had to hand.
          </li>
          <li>
            <strong className="text-white/85">There are no error bars on the efficiencies.</strong> From the binomial formula, an efficiency near 0.5 measured on about 500 events has an uncertainty of roughly ±2%. That makes the pion-and-kaon results consistent with chance, and it means the bin-by-bin curves, with a handful of events in each low-energy bin, are noisy.
          </li>
          <li>
            <strong className="text-white/85">The thresholds were first guesses.</strong> The 1 GeV electron cut, the 0.5 HCAL share and the 5-photon cut were each tried once and not scanned. A scan, and an ROC curve for each rule, would show whether any threshold does better than chance; I would expect not for pions and kaons, but the notebook does not show it.
          </li>
          <li>
            <strong className="text-white/85">The calorimeter calibration was a placeholder.</strong> An early cell sets calibration constants of 3.3 and 10 with a note to change them; the identification then uses raw deposits, so the energy-resolution plots are of uncalibrated sums.
          </li>
          <li>
            <strong className="text-white/85">The RICH angle is unconfirmed.</strong> As above, the hit angles are in detector coordinates, so the notebook cannot yet test the theory curves, and both the photon-count and the angle readings in section 7 are open questions.
          </li>
          <li>
            <strong className="text-white/85">Two readings are mine.</strong> The curl-up explanation of the electron efficiency (section 4) and the coordinate explanation of the RICH angles (section 7) are readings of the plots, not tests, and are labelled as such.
          </li>
        </ul>

        {/* ------------------------------ 9 ------------------------------ */}
        <H2 id="plots" n={9}>More plots from the notebook</H2>
        <P>The rest of the figures I used, with the same captions as in the notebook&rsquo;s own output. Click one to enlarge it.</P>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Figure fig={F.resolutionVsEnergy} />
          <Figure fig={F.muonHits} />
          <Figure fig={F.ecalVsHcal} />
          <Figure fig={F.kpEfficiency} />
          <Figure fig={F.richPhotons} />
          <Figure fig={F.cherenkovRing} />
        </div>
        <Figure fig={F.cherenkovTheory} />

        <p className="max-w-[44rem] pt-8 text-sm text-white/45">
          Source: the Project 3 notebook for the DAML course. Cherenkov formulas: see any detector-physics text, for example the PDG review on particle detectors. Back to <A href="/research">all research</A>.
        </p>
      </div>
    </article>
  );
}
