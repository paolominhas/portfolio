/**
 * MINI-CMS (DAML PROJECT 3): numbers and figures
 * ─────────────────────────────────────────────────────────────────
 * Every number below is printed in the Project 3 notebook (output cells), or
 * is arithmetic on those numbers and says so. Nothing here is re-simulated.
 * Figures are the notebook's own matplotlib plots, saved as webp.
 */
import type { Fig } from "@/components/physics/daml/ui";

const SRC = "Project 3 notebook";
const img = (n: string) => `/images/mini-cms/${n}.webp`;

export const N = {
  /** First run: the 45.5 GeV lepton file. */
  run1: { events: 2000, pairsFound: 511, momentumMaxGeV: 45.5 },
  /** Constants in the reconstruction code. */
  geometry: { r1: 4.0, r2: 8.0, B: 2.0, k: 0.3 },
  /** Second run: particle gun, flat 0.2 to 20 GeV, 2000 events (e-, mu-, mu+). */
  emu: {
    ecalOnly: { electron: 0.634, muon: 0.849, overall: 0.742, sigmaE: 0.314, sigmaMu: 0.139, meanE: -0.132, meanMu: -0.885 },
    withMuonChamber: { electron: 0.634, muon: 0.941, overall: 0.787 },
    thresholdGeV: 1.0,
    target: 0.7,
  },
  /** Pion/kaon runs, 500 of each. */
  piK: {
    hcalCut: { pion: 0.844, kaon: 0.17, overall: 0.507, sigmaPi: 0.159, sigmaK: 0.191 },
    gradientBoosting: { accuracy: 0.487, thresholdAccuracy: 0.507 },
    richRun: {
      hcalOnly: { pion: 0.852, kaon: 0.146, overall: 0.499 },
      richOnly: { pion: 0.64, kaon: 0.324, overall: 0.482 },
      combined: { pion: 0.962, kaon: 0.04, overall: 0.501 },
    },
  },
  cherenkov: { n: 1.33, mPion: 0.1396, mKaon: 0.4937 },
};

/** Real event 6 from the first run (both track pairs), used by the curvature lab. */
export const EVENT6 = [
  { label: "Pair 1", phi1: 2.61381, phi2: 2.58737, theta: 1.62829, pReco: 45.466192, pTruth: 45.4997 },
  { label: "Pair 2", phi1: -0.474675, phi2: -0.448162, theta: 1.51317, pReco: 45.341382, pTruth: 45.3381 },
];

/** Informedness J = efficiency(class A) + efficiency(class B) - 1; 0 means no better than a weighted coin. */
export interface Attempt { id: string; label: string; group: "e/mu" | "pi/K"; a: number; b: number; note?: string }
export const ATTEMPTS: Attempt[] = [
  { id: "ecal", label: "Electron vs muon: ECAL energy over 1 GeV", group: "e/mu", a: N.emu.ecalOnly.electron, b: N.emu.ecalOnly.muon },
  { id: "muon", label: "Electron vs muon: plus a muon chamber", group: "e/mu", a: N.emu.withMuonChamber.electron, b: N.emu.withMuonChamber.muon },
  { id: "hcal1", label: "Pion vs kaon: HCAL fraction over 0.5", group: "pi/K", a: N.piK.hcalCut.pion, b: N.piK.hcalCut.kaon },
  { id: "gbc", label: "Pion vs kaon: gradient-boosted trees", group: "pi/K", a: N.piK.gradientBoosting.accuracy, b: N.piK.gradientBoosting.accuracy, note: "from the accuracy of 0.487, assuming a balanced test sample" },
  { id: "hcal2", label: "Pion vs kaon: HCAL fraction (RICH run)", group: "pi/K", a: N.piK.richRun.hcalOnly.pion, b: N.piK.richRun.hcalOnly.kaon },
  { id: "rich", label: "Pion vs kaon: RICH photon count over 5", group: "pi/K", a: N.piK.richRun.richOnly.pion, b: N.piK.richRun.richOnly.kaon },
  { id: "comb", label: "Pion vs kaon: RICH, falling back to HCAL", group: "pi/K", a: N.piK.richRun.combined.pion, b: N.piK.richRun.combined.kaon },
];
export const informedness = (a: Attempt) => a.a + a.b - 1;

export const FIGS: Record<string, Fig> = {
  momentumResolution: { src: img("momentum-resolution"), w: 571, h: 443, alt: "Histogram of fractional momentum error, sharply peaked at zero with a small tail of under-estimates", caption: "Momentum rebuilt from track curvature against the true momentum, first run: most events sit within about half a percent of zero, with a thin tail of under-estimates out to about −10%.", source: SRC },
  ecalDeposits: { src: img("ecal-deposits"), w: 630, h: 470, alt: "Histogram of ECAL energy deposits for electrons and muons on a log scale with a 1 GeV threshold line", caption: "Energy deposited in the ECAL, electrons (blue) and muons (red), with the 1 GeV threshold. Muons pile up below it; electrons spread out to 20 GeV, but there is also a spike of electrons that deposited almost nothing.", source: SRC },
  resolutionVsEnergy: { src: img("resolution-vs-energy"), w: 630, h: 470, alt: "Energy resolution against true energy for electrons and muons", caption: "Spread of (reconstructed − true)/true energy in bins of true energy. It is erratic at low energy, where the bins hold few events.", source: SRC },
  efficiencyEcal: { src: img("efficiency-ecal"), w: 630, h: 470, alt: "Classification efficiency against energy for electrons and muons with ECAL only", caption: "Efficiency by energy with the ECAL alone. No electron below about 2 GeV is identified, so every low-energy particle is called a muon (which is why the muon curve sits at 1). Electrons pass the 70% target only above about 10 GeV.", source: SRC },
  muonHits: { src: img("muon-hits"), w: 630, h: 470, alt: "Histogram of muon-chamber hit counts for electrons and muons", caption: "Hits in the outer muon chamber per event. Most events have none; a hit, together with a track, is called a muon.", source: SRC },
  efficiencyMuon: { src: img("efficiency-muon-chamber"), w: 1189, h: 494, alt: "Efficiency for electrons and muons with and without the muon chamber", caption: "Efficiency with and without the muon chamber. The chamber lifts muons above about 5 GeV (green band) and leaves electrons untouched.", source: SRC },
  hcalFraction: { src: img("hcal-fraction"), w: 630, h: 470, alt: "Histograms of the HCAL energy fraction for pions and kaons, almost identical", caption: "HCAL energy as a share of ECAL plus HCAL, for pions and kaons. Both pile up near 0 (stopped early) and near 1 (punched through), and the two histograms sit on top of each other: the 0.5 cut has nothing to cut on.", source: SRC },
  ecalVsHcal: { src: img("ecal-vs-hcal"), w: 630, h: 470, alt: "Scatter of ECAL against HCAL deposits for pions and kaons", caption: "ECAL against HCAL deposit, one dot per event. The two species fill the same region.", source: SRC },
  kpEfficiency: { src: img("kp-efficiency"), w: 630, h: 470, alt: "Efficiency against energy for pions and kaons with the HCAL cut", caption: "Efficiency by energy for the HCAL-fraction cut. The pion curve looks good because nearly everything is called a pion.", source: SRC },
  gradientBoosting: { src: img("gradient-boosting"), w: 1489, h: 390, alt: "Feature importances, efficiency against energy, and score distributions for the gradient-boosted classifier", caption: "The gradient-boosted classifier. Left, which inputs it leaned on (total deposit and HCAL fraction most). Middle, efficiency by energy for the cut (faint) and the trees (solid). Right, its kaon score for pions and kaons: the two overlap almost completely around the 0.5 decision line.", source: SRC },
  richPhotons: { src: img("rich-photons"), w: 630, h: 470, alt: "Histogram of RICH photon counts for pions and kaons", caption: "Photons recorded in the RICH per event. Pions and kaons share the same distribution, a few thousand photons with a tail past 70,000, so a cut at 5 photons only separates the events that recorded none.", source: SRC },
  richComparison: { src: img("rich-comparison"), w: 1289, h: 494, alt: "Efficiency against energy for HCAL only, RICH only and combined classifiers, for pions and kaons", caption: "HCAL only, RICH only and combined, by energy. At each energy the pion and kaon efficiencies of the RICH rule add to about 1: it calls nearly everything the same thing, switching from kaon to pion as the photon count grows.", source: SRC },
  cherenkovTheory: { src: img("cherenkov-theory"), w: 1289, h: 494, alt: "Theoretical Cherenkov angle against momentum for pions and kaons in water", caption: "Theory, water (n = 1.33): the pion turns on at 0.16 GeV and the kaon at 0.56 GeV, and the two angles converge on about 41° as momentum grows.", source: SRC },
  cherenkovAngles: { src: img("cherenkov-angles"), w: 1500, h: 466, alt: "Simulated RICH hit angles, angle against momentum with theory overlaid, and the pion-kaon angle difference", caption: "Left and middle, the angles of the simulated hits: they spread from 45° to 135° and do not sit on the theory curves. Right, the theoretical pion−kaon angle difference, large just above the kaon threshold and nearly zero at high momentum.", source: SRC },
  photonYield: { src: img("photon-yield"), w: 1189, h: 494, alt: "RICH photon count against momentum for pions and kaons", caption: "Photons per event against momentum. Below about 2 to 3 GeV the count is close to zero for both species; above it, there are thousands for both.", source: SRC },
  cherenkovRing: { src: img("cherenkov-ring"), w: 1490, h: 495, alt: "Cherenkov ring of one event, angle distribution and a pion against kaon comparison", caption: "One event, drawn in the particle frame, with the expected pion (41.1°) and kaon (38.9°) rings at 1.85 GeV. This event recorded no photons, so there is no ring to compare against.", source: SRC },
};

export const REPO_NOTE = "The Geant4 code (the extra detector volumes, EnergyCounter, the macros) lives in the MiniCMS project; the analysis is a single Jupyter notebook.";
