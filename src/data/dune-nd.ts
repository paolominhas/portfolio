/**
 * DATA FOR THE DUNE NEAR-DETECTOR PAGE
 * ─────────────────────────────────────────────────────────────────
 * Every number on the page comes from one of four places, and this file says which:
 *   • "report"   – SeniorHonoursReport.pdf in the project repository
 *   • "repo"     – the ROOT/CAFAna macros and the PNG outputs in the repository
 *   • "digitised"– read off the repository's PNGs by pixel colour (tools/dune-nd/digitise_stack.py); approximate, and labelled
 *   • "check"    – my own re-implementation (src/lib/physics/ndReco.ts, neutrinoOsc.ts) or arithmetic, labelled wherever it is used
 *
 * The repository holds the code and the plots but not the simulated events (the CAF files lived on a server in
 * Edinburgh), so nothing on this page re-runs the analysis. Where a widget is a toy it says so.
 */

export const REPO = "https://github.com/paolominhas/CPV-DUNE-ND";
export const REPORT_PDF = `${REPO}/blob/main/SeniorHonoursReport.pdf`;

export const NUMBERS = {
  baselineFD: 1300, // km, "around 1300km away" (report §1)
  baselineND: 574, // m, target to near detector (report Figure 5)
  decayPipe: 221, // m (report §2.2)
  protonGeV: [60, 120] as const, // report §2.2
  powerMW: [1.03, 1.2] as const, // report §2.2
  lartpcPerYear: 1e8, // νμ-CC events per year (report §2.3)
  maxima: [2.4, 0.8] as const, // GeV, first and second oscillation maxima (report §2.2)
  weeks: 10,
  // constants hard-coded in every macro
  mP: 0.938,
  mN: 0.939,
  mMu: 0.106,
  Eb: 0.028,
  // the modes, as the macros define them
  modes: { QE: 1, DIS: 3, RES: 4, MEC: 10 },
  // sample sizes printed in the Figure 13 sub-captions (POT)
  pot: { lArFHC: 5.0034e17, gArFHC: 2.1495e19, lArRHC: 5.50078e19, gArRHC: 4.35867e19 },
  macroPot: 1e20, // every macro scales its histograms to this
} as const;

/* ------------------------------------------------------------------ figures used inline */

export interface Fig {
  src: string;
  alt: string;
  caption: string;
  source: string;
  n?: number;
}

const own = (n: number, file: string, alt: string, caption: string): Fig => ({
  n,
  src: `/images/dune-nd/${file}.png`,
  alt,
  caption,
  source: `My plot, Figure ${n} of the report`,
});

export const FIGS = {
  fhcBeam: own(
    12,
    "NDGArFHCSpectrumErrors",
    "Log-scale histogram of event counts against true neutrino energy for muon neutrinos, muon antineutrinos, electron neutrinos and electron antineutrinos at the NDGAr in forward horn current, with error bars",
    "True neutrino energy of the forward-horn-current beam at the NDGAr, with statistical error bars. The y axis is logarithmic, so the muon-neutrino error bars are almost invisible while the electron-antineutrino ones are huge."
  ),
  rhcLar: own(
    13,
    "NDLArRHCSpectrum",
    "Log-scale histogram of event counts against true neutrino energy at the NDLAr in reverse horn current, muon antineutrinos peaking near 2 GeV with a muon-neutrino shoulder that rises above them at high energy",
    "Reverse-horn-current beam at the NDLAr (panel c of the report’s Figure 13). The antineutrino peak is the signal; the solid muon-neutrino line is the wrong-sign background, and it overtakes the antineutrinos at high energy."
  ),
  recoLar: own(
    19,
    "RecoMethodLF",
    "Histogram of neutrino energy calculated five ways for NDLAr forward horn current, with the reconstructed curves piled up at low energy and the true energy peaking near 2 GeV",
    "Five ways of getting the neutrino energy of a one-muon-one-proton sample at the NDLAr. The three reconstructed curves (dashed) are pushed to low energy with a spike below 1 GeV; the two true-energy versions peak near 2 GeV."
  ),
  smearAll: own(
    22,
    "SmearingMatrixFinalLF",
    "Two-dimensional histogram of reconstructed against true neutrino energy for all interactions at the NDLAr, with a bright diagonal and a broad blob at low reconstructed energy",
    "True against reconstructed energy for every interaction at the NDLAr in forward horn current (Figure 22b). A bright diagonal is a perfect reconstruction; the broad blob below it, around 2 GeV true, is the problem."
  ),
  smearCc0pi: own(
    22,
    "SmearingMatrixCC0piLF",
    "Two-dimensional histogram of reconstructed against true neutrino energy for the CC0pi selection at the NDLAr with a thin bright diagonal and little weight below it",
    "The same plane after selecting the CC0π final state (Figure 22a). The weight is concentrated on the diagonal and the broad low-energy blob is much reduced."
  ),
  stack: own(
    17,
    "StackedCC0piLF",
    "Stacked histogram of the CC0pi sample at the NDLAr split into CCQE, resonant, deep inelastic and meson exchange interactions, peaking near 2 GeV",
    "The CC0π sample at the NDLAr split by interaction type (Figure 17a). CCQE is the largest layer, but it is far from the whole sample."
  ),
} satisfies Record<string, Fig>;

/* ------------------------------------------------------------------ the figure explorer */

export type Kind = "beam" | "qefind" | "stack" | "reco" | "smear" | "chan";
export type Det = "LAr" | "GAr";
export type Horn = "FHC" | "RHC";
export type Chan = "QE" | "RES" | "DIS" | "MEC" | "CC0pi" | "All";

export interface Shot {
  kind: Kind;
  det: Det;
  horn: Horn;
  chan?: Chan;
  variant?: "plain" | "errors";
  file: string;
  /** where it appears in the report, if it does */
  fig?: string;
  /** a note when the PDF panel and the repository file are not obviously the same render */
  caveat?: string;
}

const S = (kind: Kind, det: Det, horn: Horn, file: string, fig?: string, extra: Partial<Shot> = {}): Shot => ({ kind, det, horn, file, fig, ...extra });

export const SHOTS: Shot[] = [
  S("beam", "LAr", "FHC", "NDLArFHCSpectrum", "13a"),
  S("beam", "GAr", "FHC", "NDGArFHCSpectrum", "13b"),
  S("beam", "LAr", "RHC", "NDLArRHCSpectrum", "13c"),
  S("beam", "GAr", "RHC", "NDGArRHCSpectrum", "13d"),
  S("beam", "GAr", "FHC", "NDGArFHCSpectrumErrors", "12", { variant: "errors" }),

  S("qefind", "GAr", "FHC", "Task2GArFHCLessData", "16b"),
  S("qefind", "GAr", "FHC", "Task2GArFHCError", "16a", { variant: "errors" }),
  S("qefind", "LAr", "FHC", "Task2LArFHCLessData", "16d"),
  S("qefind", "LAr", "FHC", "Task2LArFHCError", "16c", { variant: "errors" }),
  S("qefind", "GAr", "RHC", "Task2GArRHCError", "14", { variant: "errors" }),
  S("qefind", "GAr", "RHC", "Task2GArRHCLessData"),
  S("qefind", "LAr", "RHC", "Task2LArRHCLessData", "15", { caveat: "The report prints this render as Figure 15, whose caption says “the same detector setup as Figure 14”; Figure 14 is the NDGAr." }),
  S("qefind", "LAr", "RHC", "Task2LArRHCError", undefined, { variant: "errors" }),

  S("stack", "LAr", "FHC", "StackedCC0piLF", "17a"),
  S("stack", "GAr", "FHC", "StackedCC0piGF", "17b"),

  S("reco", "GAr", "FHC", "RecoMethodGF", "18"),
  S("reco", "LAr", "FHC", "RecoMethodLF", "19"),
  S("reco", "GAr", "RHC", "RecoMethodGR"),
  S("reco", "LAr", "RHC", "RecoMethodLR"),

  S("smear", "LAr", "FHC", "OldSmearingMatrixLF", "20a", { caveat: "Closest file in the repository; the PDF panel uses a different colour scale, so it is probably a re-render of the same histogram." }),
  S("smear", "GAr", "FHC", "OldSmearingMatrixGF", "20b", { caveat: "Closest file in the repository; the PDF panel uses a different colour scale." }),
  S("smear", "LAr", "RHC", "OldSmearingMatrixLR", "20c", { caveat: "Closest file in the repository; the PDF panel uses a different colour scale." }),
  S("smear", "GAr", "RHC", "OldSmearingMatrixGR", "20d", { caveat: "Closest file in the repository; the PDF panel uses a different colour scale." }),

  S("chan", "LAr", "FHC", "SmearingMatrixQELF", "21a", { chan: "QE" }),
  S("chan", "LAr", "FHC", "SmearingMatrixRESLF", "21b", { chan: "RES" }),
  S("chan", "LAr", "FHC", "SmearingMatrixDISLF", "21c", { chan: "DIS" }),
  S("chan", "LAr", "FHC", "SmearingMatrixMECLF", "21d", { chan: "MEC" }),
  S("chan", "LAr", "FHC", "SmearingMatrixCC0piLF", "22a", { chan: "CC0pi" }),
  S("chan", "LAr", "FHC", "SmearingMatrixFinalLF", "22b", { chan: "All" }),
];

export const KINDS: Record<Kind, { label: string; macro: string; what: string; look: string }> = {
  beam: {
    label: "Beam contents",
    macro: "ESpectra.C",
    what: "True neutrino energy of the four species in the beam (νμ solid blue, ν̄μ dashed blue, νe solid red, ν̄e dashed red), counts per 0.1 GeV bin on a log axis, every histogram scaled to 10²⁰ protons on target.",
    look: "In forward horn current the muon neutrinos peak near 2 GeV and the largest background, muon antineutrinos, sits about one to two orders of magnitude below. In reverse horn current the roles flip, but the wrong-sign neutrinos are not small: they come level with the antineutrinos at high energy (by eye, around 5 to 6 GeV at the NDLAr). The electron-flavour lines are low and, in the gas detector, noisy.",
  },
  qefind: {
    label: "Finding CCQE",
    macro: "InteractionType.C",
    what: "Three ways of picking out quasi-elastic events against true neutrino energy: the CC0π final state (green), the generator’s own CCQE label (black or blue) and the strict one-muon-one-proton final state (red).",
    look: "At the peak the strict final state keeps just under half of the true CCQE events (read from the plots, about 46 to 49% in all four detector and horn combinations), while the looser CC0π selection collects about 1.55 to 1.65 times as many events as true CCQE, because other interactions leak into it. Neither reproduces the truth label, which is the point of the next section.",
  },
  stack: {
    label: "CC0π composition",
    macro: "StackedHistogram.C",
    what: "The CC0π sample split by the generator’s interaction mode: CCQE (orange), resonant (green), deep inelastic (red) and meson exchange current (blue).",
    look: "CCQE is the biggest layer at every energy, but the others add up to well over a third of the sample. Both detectors give the same picture.",
  },
  reco: {
    label: "Reconstruction methods",
    macro: "RecoMethods.C",
    what: "A one-muon-one-proton sample, with the neutrino energy computed five ways: true energy, energy conservation with true or reconstructed inputs, the quasi-elastic formula, and the energy stored in the CAF.",
    look: "At the gas detector the five curves track each other broadly, with modest differences below 2 GeV. At the liquid-argon detector the three reconstructed curves pile up below 1 GeV and fall short of the true peak near 2 GeV.",
  },
  smear: {
    label: "Smearing matrices",
    macro: "SmearMatrix.C",
    what: "Reconstructed against true neutrino energy for all events: the diagonal is a perfect reconstruction, anything below it is an underestimate.",
    look: "Most of the weight sits on or below the diagonal. The liquid-argon matrices carry a broad bright region below it at true energies of about 1 to 3 GeV; the gas-detector ones are much closer to a clean line, with scattered single events at high energy, some of them above the diagonal.",
  },
  chan: {
    label: "By interaction",
    macro: "SmearMatrix.C",
    what: "The liquid-argon, forward-horn-current smearing matrix cut by interaction type (CCQE, resonant, deep inelastic, meson exchange), then for the CC0π final state and for everything.",
    look: "CCQE and meson-exchange events lie close to the diagonal with a thin low tail, resonant events spread below it, and deep inelastic events form a broad blob well below the diagonal. The CC0π selection is the cleanest of the lot.",
  },
};

/* ------------------------------------------------------------------ digitised stack */

export const STACK = {
  // Digitised from StackedCC0piLF.png / StackedCC0piGF.png (see tools/dune-nd/digitise_stack.py). 80 bins of 0.125 GeV, 0–10 GeV.
  // Bottom to top in the figure: CCQE, RES, DIS, MEC. LAr is rounded to 100 events, GAr to 5; read-off precision is about ±2 px (≈ ±1,800 and ±27 events at the peak).
  LF: {
    QE: [0, 3700, 30900, 53600, 100000, 127100, 164800, 200700, 232200, 246200, 261100, 269800, 262800, 290800, 284700, 296100, 289100, 277700, 281200, 261100, 254900, 227800, 211200, 190200, 161300, 143800, 133300, 107000, 96500, 85100, 68500, 65000, 58000, 44000, 37900, 36100, 33500, 26500, 28200, 20400, 18600, 20400, 17700, 14200, 15100, 13300, 12500, 9000, 13300, 10700, 9000, 6300, 9800, 9000, 9000, 5500, 7200, 6300, 6300, 5500, 6300, 8100, 6300, 6300, 6300, 3700, 3700, 7200, 5500, 5500, 3700, 3700, 4600, 3700, 5500, 5500, 4600, 3700, 2800, 3700],
    RES: [0, 0, 0, 0, 6100, 9600, 22800, 32400, 43800, 52500, 60400, 71800, 72600, 85800, 95400, 99800, 87500, 87500, 98900, 89300, 86700, 76100, 73500, 63000, 58600, 56900, 45500, 44600, 40300, 29800, 25400, 24500, 18400, 16600, 15800, 13100, 13100, 10500, 8800, 8800, 9600, 8800, 7000, 4400, 5300, 4400, 2600, 5300, 3500, 2600, 2600, 4400, 3500, 4400, 3500, 3500, 2600, 0, 2600, 0, 0, 0, 0, 3500, 0, 0, 2600, 0, 2600, 0, 0, 2600, 0, 2600, 0, 0, 0, 0, 0, 2600],
    DIS: [0, 0, 0, 0, 0, 0, 2600, 2600, 7900, 10500, 14900, 13100, 24500, 22800, 25400, 26300, 31500, 33300, 33300, 39400, 33300, 34100, 32400, 29800, 27100, 26300, 21900, 20100, 14900, 15800, 14000, 12300, 10500, 8800, 7900, 7900, 7900, 4400, 5300, 7000, 4400, 3500, 3500, 3500, 2600, 2600, 0, 2600, 0, 0, 0, 2600, 2600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4400, 0, 0, 0, 2600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    MEC: [0, 0, 0, 4400, 9600, 21900, 22800, 35000, 40300, 44600, 53400, 53400, 56000, 56900, 63900, 62100, 57800, 61300, 57800, 56000, 54300, 42900, 43800, 42000, 35900, 31500, 28000, 27100, 20100, 18400, 16600, 15800, 10500, 10500, 9600, 11400, 4400, 7900, 4400, 4400, 5300, 2600, 3500, 3500, 3500, 2600, 5300, 2600, 4400, 4400, 0, 0, 0, 0, 3500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  GF: {
    QE: [0, 110, 430, 810, 1310, 1960, 2430, 2905, 3460, 3865, 3985, 4350, 4380, 4580, 4705, 4525, 4580, 4610, 4310, 4040, 4120, 3635, 3285, 3110, 2660, 2460, 2055, 1795, 1635, 1325, 1135, 1095, 930, 730, 730, 595, 445, 390, 420, 340, 285, 255, 205, 215, 230, 120, 160, 135, 95, 190, 110, 80, 110, 110, 70, 80, 95, 80, 80, 95, 95, 95, 80, 110, 95, 40, 80, 70, 120, 40, 55, 55, 70, 95, 80, 70, 70, 55, 55, 70],
    RES: [0, 0, 0, 0, 40, 175, 405, 500, 690, 770, 840, 1095, 1080, 1430, 1365, 1485, 1285, 1340, 1430, 1500, 1190, 1190, 1110, 1055, 960, 795, 730, 620, 620, 430, 405, 270, 325, 255, 190, 190, 95, 175, 110, 95, 95, 70, 110, 40, 80, 70, 70, 80, 40, 40, 55, 55, 40, 40, 40, 0, 55, 0, 0, 0, 0, 0, 40, 55, 0, 40, 40, 55, 40, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    DIS: [0, 0, 0, 0, 0, 0, 55, 110, 80, 150, 190, 190, 190, 340, 380, 365, 405, 420, 475, 445, 460, 430, 500, 405, 420, 380, 380, 340, 285, 245, 160, 150, 135, 175, 150, 110, 80, 70, 70, 70, 70, 40, 0, 70, 0, 0, 0, 40, 55, 0, 40, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55],
    MEC: [0, 0, 0, 110, 150, 270, 430, 515, 660, 715, 690, 880, 945, 840, 1025, 1040, 890, 960, 985, 825, 755, 770, 675, 580, 610, 555, 475, 420, 365, 350, 190, 245, 190, 205, 120, 110, 120, 95, 80, 80, 70, 55, 80, 0, 0, 55, 0, 0, 0, 55, 0, 0, 40, 0, 70, 0, 0, 0, 0, 0, 0, 0, 0, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
} as const;

export const STACK_META = {
  binWidth: 0.125,
  nBins: 80,
  layers: ["QE", "RES", "DIS", "MEC"] as const,
  /** events per image pixel in each figure: a layer thinner than a couple of pixels cannot be read, so the page only shows fractions where the whole column is at least MIN_PX tall */
  pxEvents: { LF: 1e5 / 114.25, GF: 2000 / 148 } as Record<string, number>,
  minPx: 20,
  names: { QE: "CCQE", RES: "Resonant (RES)", DIS: "Deep inelastic (DIS)", MEC: "Meson exchange (MEC / 2p2h)" } as Record<string, string>,
};

/* ------------------------------------------------------------------ the five macros */

export interface Macro {
  id: string;
  file: string;
  lines: number;
  title: string;
  figs: string;
  code: string;
  plain: string;
}

export const MACROS: Macro[] = [
  {
    id: "espectra",
    file: "ESpectra.C",
    lines: 69,
    title: "Beam contents",
    figs: "Figures 12 and 13",
    code: `Spectrum sTrueENumu   (loader, axTrue, kIsNumuCC  && !kIsAntiNu);
Spectrum sTrueENumubar(loader, axTrue, kIsNumuCC  &&  kIsAntiNu);
Spectrum sTrueENue    (loader, axTrue, kIsBeamNue && !kIsAntiNu);
Spectrum sTrueENuebar (loader, axTrue, kIsBeamNue &&  kIsAntiNu);
loader.Go();                         // one pass over the files fills all four
TH1D *h = sTrueENumu.ToTH1(1e20, kBlue);   // scale to 10^20 protons on target`,
    plain: "Four spectra of true neutrino energy, one per species, filled in a single pass over the simulated files (CAFAna collects every Spectrum you declare, then loader.Go() loops over the events once). The 1e20 is only a scale so that samples of different size can sit on one plot.",
  },
  {
    id: "interaction",
    file: "InteractionType.C",
    lines: 111,
    title: "Three ways to find quasi-elastic events",
    figs: "Figures 14 to 16",
    code: `const Cut kIsCCQE = kIsQE && kIsNumuCC && !kIsAntiNu;   // the generator's label: mode == 1

const Cut kHasQEFinalState([](const caf::SRProxy* sr) {  // what a detector could see
  const int totOthers = sr->nN + sr->nipip + sr->nipim + sr->nipi0
                      + sr->nikp + sr->nikm + sr->nik0 + sr->niem + sr->nNucleus;
  return sr->LepPDG == PDG_MU && sr->nP == 1 && totOthers == 0;
});

const Cut kHasCC0PiFinalState([](const caf::SRProxy* sr) {
  const int totPi = sr->nipip + sr->nipim + sr->nipi0;
  return sr->LepPDG == PDG_MU && sr->nP >= 1 && totPi == 0;
});`,
    plain: "The same events are selected three ways: by the generator’s interaction label (which only exists in simulation), by an exact one-muon-one-proton final state, and by the looser rule “a muon, at least one proton, no pions”. The three histograms differ by how many events each rule collects, which is the whole point of the comparison.",
  },
  {
    id: "stacked",
    file: "StackedHistogram.C",
    lines: 93,
    title: "What is inside CC0π",
    figs: "Figure 17",
    code: `const Cut kCC0pi([](const caf::SRProxy* sr) {
  const int totalPions   = sr->nipip + sr->nipim + sr->nipi0;
  const int otherHadrons = sr->nikp + sr->nikm + sr->nik0 + sr->niem + sr->nNucleus;
  return totalPions == 0 && otherHadrons == 0;
});
Spectrum sMEC (loader, axTrue, kMEC  && kCC0pi);   // mode == 10
Spectrum sDIS (loader, axTrue, kDIS  && kCC0pi);   // mode == 3
Spectrum sRES (loader, axTrue, kRES  && kCC0pi);   // mode == 4
Spectrum sCCQE(loader, axTrue, kCCQE && kCC0pi);   // mode == 1
THStack* hs = new THStack("hs", "Stacked CC0pi Interaction Types");`,
    plain: "Take the CC0π final state, then split it by the generator’s mode label and stack the four layers. This is the plot that shows resonant, deep-inelastic and meson-exchange events hiding inside a sample that looks quasi-elastic.",
  },
  {
    id: "reco",
    file: "RecoMethods.C",
    lines: 170,
    title: "Five ways to compute the neutrino energy",
    figs: "Figures 18 and 19",
    code: `double QEFormula(double Emu, double cosmu) {
  const double pmu   = sqrt(sqr(Emu) - sqr(M_MU));
  const double num   = sqr(M_P) - sqr(M_N - E_B) - sqr(M_MU) + 2*(M_N - E_B)*Emu;
  const double denom = 2*(M_N - E_B - Emu + pmu*cosmu);
  return num/denom;
}
// energy conservation, from reconstructed inputs
return Emu_reco + (protonKE_reco + M_P) - (M_N - E_B);`,
    plain: "Two formulas that turn what the detector measured into a neutrino energy: one uses only the muon’s energy and angle, the other adds up the muon and proton energies. They are drawn on top of the true energy and of the energy the simulation itself reconstructs, for a sample of one-muon-one-proton events.",
  },
  {
    id: "smear",
    file: "SmearMatrix.C",
    lines: 128,
    title: "True against reconstructed energy",
    figs: "Figures 20 to 22",
    code: `const HistAxis axTrue("True Energy (GeV)", binsTrue, kTrueEnergy);
const HistAxis axReco("Reco Energy (GeV)", binsReco, kRecoEnergy);
const Cut kValidReco([](const caf::SRProxy* sr) { return sr->Ev_reco > 0; });

Spectrum sSmearing(loader, axTrue, axReco, kValidReco && kMECOnly);  // swap the cut for each plot
TH2* hSmearing = sSmearing.ToTH2(1e20);
hSmearing->Draw("COLZ");`,
    plain: "A two-dimensional spectrum: every event adds one to the cell (true energy, reconstructed energy). A perfect detector would fill only the diagonal. Changing the cut, one line, gives the matrices for each interaction type, for CC0π and for everything.",
  },
];

/* ------------------------------------------------------------------ checks */

export const VALIDATION: { what: string; how: string; result: string }[] = [
  {
    what: "The QE formula, line for line",
    how: "Solve the two-body kinematics for the muon energy at a given neutrino energy and angle (target at rest, 28 MeV removal energy), feed it back through qeFormula(), over 7 energies × 6 angles.",
    result: "Round trip returns the neutrino energy to a relative error of 2×10⁻¹⁵.",
  },
  {
    what: "The toy generator",
    how: "Nucleon at rest, no smearing: both reconstruction formulas should return the true energy exactly, and the final state should be a proton on mass shell. 20,000 events.",
    result: "Largest error 4×10⁻¹⁴ GeV (QE formula) and 1×10⁻¹⁵ GeV (conservation); proton mass-squared residual 9×10⁻¹⁵ GeV².",
  },
  {
    what: "The Fermi-gas bias",
    how: "With a moving nucleon, energy conservation (which assumes it is at rest) should overshoot by about ⟨p²⟩/2M = 0.6 pF²/2M on average. 40,000 events at Eν = 2 GeV, pF = 240 MeV/c.",
    result: "Simulated mean +18.2 MeV; analytic estimate +18.4 MeV.",
  },
  {
    what: "The decay kinematics",
    how: "Maximise the neutrino energy over all pion energies numerically and compare with the closed form E*/sin θ; check the on-axis ratio against 1 − mμ²/mπ².",
    result: "Agreement to four digits at 5, 10, 20 and 40 mrad (5.958, 2.979, 1.490, 0.745 GeV); on-axis ratio 0.42691 both ways.",
  },
  {
    what: "The oscillation engine",
    how: "The same code as the GLoBES page, there compared with GLoBES’s own output file. Here, the first and second maxima of νμ → νe over 1,300 km in matter at δCP = −90° are compared with the 2.4 and 0.8 GeV the report quotes.",
    result: "In the GLoBES check, median difference 8×10⁻⁷ and worst 3×10⁻⁴. Maxima here at 2.24 and 0.81 GeV: the second matches, the first sits 0.16 GeV below the report’s round number (the position moves with δCP and with matter).",
  },
  {
    what: "The digitised composition",
    how: "Read each column of the stacked plots back by colour and compare with the axis. Check the two detectors against each other.",
    result: "Peak bin reads 484,000 events at the NDLAr (the plot’s tallest column is just under 500,000). The detectors’ shares agree to within a point over the whole range (CCQE 62, RES 18, DIS 7, MEC 13% against 64, 18, 6, 13%), as the report says they should. Above about 6 GeV the layers are too thin to read, and the plot’s legend swatches sit in that corner, which is why the page masks those bins (an unmasked read-out wrongly gave 95% CCQE there).",
  },
  {
    what: "The digitised composition against a second plot",
    how: "The “finding CCQE” plots give CC0π and true CCQE as separate curves. Read their peak heights (tools/dune-nd/digitise_lines.py) and compare the implied CCQE share of CC0π with the stacked-plot read-out over the same energies.",
    result: "At 1.5 to 2.5 GeV the share is 61% (NDLAr) and 62% (NDGAr) from the stacked plot, against 61% and 64% from the curves. Over the four detector and horn samples CC0π holds 1.55 to 1.64 times as many events as true CCQE, and the strict one-muon-one-proton state 46 to 49% as many.",
  },
  {
    what: "The “LessData” plots",
    how: "Compare the green CC0π curve pixel by pixel between each “…Error.png” and its “…LessData.png”, all four detector and horn combinations.",
    result: "Median vertical difference 0 pixels over 558 columns in every pair: the curves are identical, so the “LessData” files differ in drawing style, not in the amount of data.",
  },
];

/* ------------------------------------------------------------------ caveats */

export const CAVEATS: { title: string; body: string }[] = [
  {
    title: "The repository holds the code and the plots, not the events",
    body: "The simulated files (CAFs) were read from a server in Edinburgh and are not in the repository, so nothing on this page re-runs the analysis. The real results here are my plots, shown as they are, and a read-out of one of them (the stacked composition). The reconstruction lab runs the project’s formulas on toy events, and says so.",
  },
  {
    title: "The report’s simulated “reconstruction” is parameterised",
    body: "Section 3 says the detector response is a parameterised reconstruction, because the detectors do not exist yet. So the low-energy excess at the NDLAr shows how that parameterisation behaves; carrying it over to the real detector would need the real reconstruction. The report gives two explanations for the excess and the simulation as published does not separate them: Section 4.3 points to broken tracks and final-state interactions in the denser argon, while the conclusions point to neutrons escaping.",
  },
  {
    title: "The mixing-angle values in equations 4 and 5 look swapped",
    body: "The report prints sin²θ₁₃ = 0.561 and sin²θ₂₃ = 0.02195. The global fits it cites give them the other way round (about 0.022 and 0.56), and the page uses those. Equation 3 and the rest of the appendix are unaffected.",
  },
  {
    title: "Figure 15 does not match its caption",
    body: "The caption says “the same detector setup as Figure 14 with a factor of 10 less data files”. Figure 14 is the NDGAr in reverse horn current; the panel printed as Figure 15 is the NDLAr in reverse horn current. In the repository the “LessData” plots have exactly the same curves as the “Error” ones (checked pixel by pixel), so they look like a different drawing style rather than a smaller sample. A reduced-statistics run may exist that is not in the repository.",
  },
  {
    title: "Figure 12 and its text",
    body: "The text calls Figure 12 the NDLAr; its caption and the plot say NDGAr. The text says 40 bins and ESpectra.C has 100. The sample is described as containing “10¹7 events” (presumably 10¹⁷), where Figure 13a’s caption gives 5.0 × 10¹⁷ protons on target, a different quantity. The counts on the plots are all scaled to 10²⁰ protons on target by the macros, so they are comparable between plots but are not the sizes of the simulated samples.",
  },
  {
    title: "Two definitions of “CC0π”",
    body: "InteractionType.C requires a muon, at least one proton and no pions. StackedHistogram.C requires no pions and no kaons, photons, electrons or nuclear fragments, but does not look at the lepton or the protons, so it relies on the interaction-mode cut it is combined with. If the input sample includes neutral-current events, the second version could let them in. I cannot check that without the events. The Cut Machine above lets you see the difference.",
  },
  {
    title: "RecoMethods.C reads a smaller set of files",
    body: "Its file pattern is CAF_*_90*.root where the other macros use CAF_*_9**.root, which is a narrower selection. That fits the visibly noisier histograms in Figures 18 and 19 (the NDGAr reverse-horn version, which is not in the report, is the noisiest of all) but I could not confirm the sizes of the two sets.",
  },
  {
    title: "Figure 20 and the repository’s smearing matrices",
    body: "The four matrices in the report’s Figure 20 use a rainbow colour scale. The closest files in the repository, named OldSmearingMatrix…, use a green-to-red scale, so they are probably earlier renders of the same histograms. Figures 21 and 22 match the repository’s cubehelix plots.",
  },
  {
    title: "Small things",
    body: "The conclusion refers to “Figure ??”. The list of species in Figures 13 and 20 reads “νμ, νe, ν̄e and ν̄e” (the fourth should be ν̄μ). Section 2.3 says “MPC” once for the MPD. The 10⁸ νμ-CC events per year for the NDLAr, the 574 m distance and the 221 m decay pipe all agree with the figures and text they refer to.",
  },
  {
    title: "What the digitised numbers can and cannot say",
    body: "They are read from an image, so they carry about two pixels of error on each layer edge (a few percent of the peak, more for the thin DIS layer), and only where the columns are tall. The macro’s four modes (CCQE, RES, DIS, MEC) are not every interaction: coherent scattering and the rest are not in the stack. The fractions are shares of this CC0π stack, not of all events.",
  },
];

export const GLOSSARY: [string, string][] = [
  ["CAF / CAFAna", "Common Analysis File: the DUNE event format. CAFAna is the framework that loops over CAFs and fills histograms from cuts and variables."],
  ["CC / NC", "Charged current (a W boson is exchanged and the neutrino becomes a charged lepton, which tags its flavour) and neutral current (a Z, and the neutrino carries on unseen)."],
  ["CCQE", "Charged-current quasi-elastic: a neutrino knocks one nucleon out of the nucleus and nothing else is produced. A muon and a proton."],
  ["CC0π", "A charged-current event whose final state has no pions. A mixture: CCQE, 2p2h, and resonant or deep-inelastic events whose pions were absorbed."],
  ["2p2h / MEC", "Two particles, two holes: two nucleons are knocked out together, through a meson exchanged between a correlated pair. Looks quasi-elastic but carries away extra energy."],
  ["DIS", "Deep inelastic scattering: a high-energy neutrino breaks a nucleon up and a hadronic shower results."],
  ["RES", "Resonant production: the nucleon is excited to a Δ, which decays to a nucleon and a pion."],
  ["DUNE-PRISM", "Moving the near detector sideways, off the beam axis, to sample a family of narrower neutrino spectra."],
  ["FHC / RHC", "Forward and reverse horn current: the two beam modes, mostly neutrinos and mostly antineutrinos."],
  ["FSI", "Final-state interactions: particles produced inside the nucleus rescatter, change energy, or are absorbed before they get out."],
  ["GENIE", "The Monte Carlo neutrino-interaction generator used to simulate the events."],
  ["LArTPC / GArTPC", "Time projection chambers filled with liquid argon (NDLAr) or high-pressure gaseous argon (NDGAr, part of the multi-purpose detector)."],
  ["POT", "Protons on target: how much beam a sample represents."],
  ["Smearing matrix", "Reconstructed against true energy. The diagonal is perfect; anything off it is a measurement error."],
  ["True / reconstructed", "In simulation, the generator knows the true energy; the reconstruction is what the (simulated) detector would infer from what it saw."],
  ["Wrong-sign", "Neutrinos of the unwanted kind in a beam: antineutrinos in a neutrino beam and the reverse."],
];

export const REFS: { n: number; text: string }[] = [
  { n: 13, text: "I. Esteban, M. C. Gonzalez-Garcia, M. Maltoni, T. Schwetz, A. Zhou. The fate of hints: updated global analysis of three-flavor neutrino oscillations. JHEP 2020(9):178." },
  { n: 14, text: "I. Esteban et al. NuFit-6.0: updated global analysis of three-flavor neutrino oscillations. 2024." },
  { n: 16, text: "V. Papadimitriou. Design of the LBNF Beamline. 38th International Conference on High Energy Physics, 2017." },
  { n: 17, text: "B. Abi et al. Volume I. Introduction to DUNE. JINST 15(08):T08008, 2020." },
  { n: 19, text: "B. Abi et al. Deep Underground Neutrino Experiment (DUNE), Far Detector Technical Design Report, Volume II: DUNE Physics, 2020." },
  { n: 18, text: "A. Aduszkiewicz et al. (NA61/SHINE). Measurements of hadron production in π⁺ + C and π⁺ + Be interactions at 60 GeV/c. Phys. Rev. D 100:112004, 2019." },
  { n: 32, text: "C. Andreopoulos et al. The GENIE neutrino Monte Carlo generator: physics and user manual, 2015." },
  { n: 31, text: "R. Brun, F. Rademakers. ROOT: an object oriented data analysis framework. Nucl. Instrum. Meth. A 389:81–86, 1997." },
];

/** Per-bin flag: is the column tall enough for its layers to be read reliably? */
export function stackValid(det: "LF" | "GF"): boolean[] {
  const d = STACK[det];
  return d.QE.map((_, i) => d.QE[i] + d.RES[i] + d.DIS[i] + d.MEC[i] >= STACK_META.minPx * STACK_META.pxEvents[det]);
}
