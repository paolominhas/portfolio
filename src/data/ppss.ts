/**
 * PPSS / IFJ PAN internship: all the numbers and figure metadata used by the
 * interactive report at /research/ppss.
 *
 * SOURCES (so every figure on the page can be checked):
 *   notes   = ProjectNotes.pdf in the repo (daily diary, 26 pages)
 *   slides  = FinalProjectPresentation.pdf in the repo
 *   readme  = README.md in the repo (includes the final training log)
 *   code    = XGBoostProcessor.py, PlotStats.py, fit_lc2pemu.C in the repo
 * Nothing here is estimated: if a number is not in one of those, it is not here.
 */

export const REPO = "https://github.com/paolominhas/PPSS-IFJ-PAN-Summer-Internship-2025";
export const NOTES_PDF = `${REPO}/blob/main/ProjectNotes.pdf`;
export const SLIDES_PDF = `${REPO}/blob/main/FinalProjectPresentation.pdf`;

export const img = (name: string) => `/images/ppss/${name}.png`;

/* ------------------------------ headline numbers ------------------------------ */

export const NUMBERS = {
  /** slides: "MC signal root ntuple file has 1,727 events compared to 214,977 background data events" */
  signalMC: 1727,
  backgroundRaw: 214977,
  variables: 675, // slides
  candidateFeatures: 36, // slides: "from a list of 36 already calculated"
  selectedFeatures: 18, // notes + slides + readme
  /** readme training log (final run) */
  backgroundAfterSideband: 79128,
  totalTrain: 80855,
  trainSize: 56598,
  testSize: 24257,
  testSignal: 518,
  testBackground: 23739,
  punziCut: 0.2456, // readme log
  punziMax: 0.0203, // readme log
  // readme classification report at the default 0.5 threshold
  sigPrecision: 0.7,
  sigRecall: 0.16,
  accuracy: 0.9806,
} as const;

/** Slide: "BR_sig = n_sig/n_ref x eff_ref/eff_sig x BR_ref" with these values. */
export const LIMIT_DEFAULTS = {
  nSig: 28.0,
  nRef: 354.136,
  effRef: 0.000194665,
  effSig: 0.000166151,
  brLcPphi: 1.05e-3, // slides (PDG): 1.05 +- 0.14 x 10^-3
  brPhiMuMu: 2.86e-4, // slides (PDG): 2.86 +- 0.19 x 10^-4
  pdgLimit: 1.9e-5, // slides: "current PDG limit of 1.9 x 10^-5"
} as const;

export const LC_MASS = 2286.46; // MeV/c^2, used in fit_lc2pemu.C

/* ------------------------------ figures ------------------------------ */

export interface Fig {
  src: string;
  alt: string;
  caption: string;
  source: string; // where it comes from, shown under the caption
}

export const FIGS: Record<string, Fig> = {
  punzi0993: {
    src: img("punzi-0993"),
    alt: "Punzi significance against BDT cut, rising to a very sharp peak at 0.993",
    caption: "The first Punzi plot: a razor-sharp maximum at a BDT cut of 0.993.",
    source: "Notes, p. 14 (Wed 23 Jul)",
  },
  punzi0948: {
    src: img("punzi-0948"),
    alt: "Punzi significance against BDT cut with optimum at 0.948",
    caption: "After swapping in the corrected signal file: the optimum moves to 0.948. Better, not yet right.",
    source: "Notes, p. 15 (Wed 23 Jul)",
  },
  punzi0862: {
    src: img("punzi-0862"),
    alt: "Punzi significance against BDT cut with optimum at 0.862",
    caption: "With the updated data file the optimum is 0.862.",
    source: "Notes, p. 16 (Thu 24 Jul)",
  },
  punzi0922: {
    src: img("punzi-0922"),
    alt: "Punzi significance against BDT cut with optimum at 0.922",
    caption: "Feature selection removed to test it: 0.922, and the notes call it arguably worse.",
    source: "Notes, p. 19 (Fri 25 Jul)",
  },
  punzi0338: {
    src: img("punzi-0338"),
    alt: "Punzi significance against BDT cut with optimum at 0.338, a broad maximum",
    caption: "Putting back only the subsample = 0.5 setting: a broad maximum, optimum 0.338.",
    source: "Notes, p. 23 (Mon 28 Jul)",
  },
  punzi0933: {
    src: img("punzi-0933"),
    alt: "Punzi significance against BDT cut with a sharp spike at 0.933",
    caption: "Putting back only scale_pos_weight: the spike near 1 returns (optimum 0.933).",
    source: "Notes, p. 23 (Mon 28 Jul)",
  },
  punzi0246: {
    src: img("punzi-0246"),
    alt: "Punzi significance against BDT cut with a broad maximum near 0.25",
    caption: "The final settings: a broad, gentle maximum, optimum 0.246. This is the cut used.",
    source: "Notes, p. 22 (Mon 28 Jul)",
  },
  punziRef: {
    src: img("punzi-ref-0882"),
    alt: "Punzi significance for the muon reference channel",
    caption: "The same pipeline on the muon reference channel: a different shape again (optimum 0.882).",
    source: "Notes, p. 24 (Wed 30 Jul)",
  },
  rocRef: {
    src: img("roc-ref"),
    alt: "ROC curve for the reference-channel model: training AUC 0.988, test AUC 0.985",
    caption: "Reference-channel model: training AUC 0.988, test AUC 0.985. The notes read the reference-channel plots as overtrained.",
    source: "Repository results folder (roc-ref.png)",
  },
  rocOver: {
    src: img("roc-overtrained"),
    alt: "ROC curve: training AUC 0.963, test AUC 0.870",
    caption: "Overtrained model (400 trees, subsample 0.5, class weighting): training AUC 0.963, test AUC 0.870.",
    source: "Notes, p. 18 (Fri 25 Jul)",
  },
  rocFinal: {
    src: img("roc-final"),
    alt: "ROC curve: training AUC 0.922, test AUC 0.864",
    caption: "Final settings: training AUC 0.922, test AUC 0.864. A much smaller gap.",
    source: "Notes, p. 22 (Mon 28 Jul)",
  },
  scoresFinal: {
    src: img("scores-final"),
    alt: "Model output score distributions for the final model",
    caption: "Final model: how the scores spread for background (class 0) and signal simulation (class 1), train vs test.",
    source: "Notes, p. 22 (Mon 28 Jul)",
  },
  gbcRoc: {
    src: img("gbc-roc"),
    alt: "ROC curve for the scikit-learn gradient boosting classifier",
    caption: "scikit-learn gradient boosting: training AUC 0.922, test AUC 0.894.",
    source: "Notes, p. 12 (Mon 21 Jul)",
  },
  gbcScores: {
    src: img("gbc-scores"),
    alt: "GBC score distribution with extreme peaks at 0 and 1",
    caption: "The gradient-boosting scores pile up at 0 and 1: confident, and so not very nuanced.",
    source: "Notes, p. 12 (Mon 21 Jul)",
  },
  xgbRoc: {
    src: img("xgb-roc"),
    alt: "ROC curve for XGBoost",
    caption: "XGBoost: training AUC 0.925, test AUC 0.892.",
    source: "Notes, p. 12 (Mon 21 Jul)",
  },
  xgbScores: {
    src: img("xgb-scores"),
    alt: "XGBoost score distribution",
    caption: "XGBoost scores are spread more evenly, especially for background.",
    source: "Notes, p. 12 (Mon 21 Jul)",
  },
  gbcImportance: {
    src: img("gbc-importance"),
    alt: "Feature importance bars for 36 variables",
    caption: "Importance of all 36 variables in the gradient-boosting model: many contribute very little.",
    source: "Notes, p. 12 (Mon 21 Jul)",
  },
  xgbImportance: {
    src: img("xgb-importance"),
    alt: "Feature importance bars for the 18 selected variables",
    caption: "Importance of the 18 variables that were kept.",
    source: "Notes, p. 12 (Mon 21 Jul)",
  },
  fitFirst: {
    src: img("fit-first"),
    alt: "Mass distribution of the first RooFit run with a crystal ball fit",
    caption: "First RooFit run on 22 Jul: the signal-shape fit to simulation works here.",
    source: "Notes, p. 13 (Tue 22 Jul)",
  },
  fitBad: {
    src: img("fit-bad"),
    alt: "A fit that does not follow the data",
    caption: "...and here it does not: the fit curve misses the peak. The notes say some plots did not work as planned.",
    source: "Notes, p. 13 (Tue 22 Jul)",
  },
  clsScan: {
    src: img("cls-scan"),
    alt: "CLs against the signal-to-reference branching-fraction ratio, with expected bands",
    caption: "CLs as a function of the signal to reference branching-fraction ratio, with observed and expected curves and the ±1σ and ±2σ bands, in the LHCb plotting style.",
    source: "Repo results folder (Fig8-S.png)",
  },
  pemuMass: {
    src: img("pemu-mass"),
    alt: "Invariant mass of p e mu candidates with fit components",
    caption: "Invariant-mass fit of the p e μ candidates with signal, p π π and combinatorial components.",
    source: "Repo results folder (Lc2pemu_mass.png)",
  },
  pmumuData: {
    src: img("pmumu-data"),
    alt: "Reference channel mass peak fitted with a crystal ball and an exponential",
    caption: "The reference channel: a clean Λc peak on a flat background.",
    source: "Repo results folder (Lc2pmumu_data.png)",
  },
  refCb: {
    src: img("ref-cb"),
    alt: "Crystal ball shape fitted to the reference channel",
    caption: "Crystal Ball shape fitted to the reference channel.",
    source: "Repo results folder (RefShapeCB.png)",
  },
  sigShape: {
    src: img("sig-cb-gauss"),
    alt: "Signal shape from simulation fitted with a crystal ball plus a Gaussian",
    caption: "The signal shape from simulation: a Crystal Ball plus a wide Gaussian, fitted to the Monte Carlo after selection.",
    source: "Repo results folder (SignalShapeCB_Gauss.png)",
  },
  effCumul: {
    src: img("eff-cumul"),
    alt: "Cumulative signal efficiency against BDT cut",
    caption: "Signal efficiency left after a cut at each BDT value.",
    source: "Repo results folder (eff_punzi.png)",
  },
  bkgCumul: {
    src: img("bkg-cumul"),
    alt: "Cumulative number of background events against BDT cut",
    caption: "Background left after a cut at each BDT value.",
    source: "Repo results folder (bkg_punzi.png)",
  },
  fomPunzi: {
    src: img("fom-punzi"),
    alt: "Punzi figure of merit against BDT cut from the ROOT macro",
    caption: "The Punzi figure of merit from the ROOT macro, built from the two curves above.",
    source: "Repo results folder (fom_punzi.png)",
  },
};

/* ------------------------------ the Punzi story ------------------------------ */

export interface PunziStep {
  date: string;
  cut: string;
  title: string;
  fig: keyof typeof FIGS;
  what: string;
}

export const PUNZI_STORY: PunziStep[] = [
  {
    date: "Mon 21 Jul",
    cut: "0.993",
    title: "A peak that is too good",
    fig: "punzi0993",
    what:
      "The first Punzi plot rose steadily and then spiked at a cut of 0.993. Prof. Witek called the maximum extremely high and unrealistic. A healthy plot has a gentle peak in the middle, around 0.7 or 0.8. I tried changing the formula and checking the efficiencies, but the formula was not the problem.",
  },
  {
    date: "Wed 23 Jul",
    cut: "0.948",
    title: "The problem was in the data, not the code",
    fig: "punzi0948",
    what:
      "Prof. Witek found it: to get more events into the simulated signal file, a cut had been removed from the preselection. That made the simulation look fundamentally different from real data, so XGBoost stopped looking for signal and learned to tell simulation from data using other variables. It identified them very well, hence the spike. The corrected file helped, though not enough.",
  },
  {
    date: "Thu 24 Jul",
    cut: "0.862",
    title: "A new data file and a mass cut",
    fig: "punzi0862",
    what:
      "More inputs needed fixing: an incorrect data file, and a cut on low masses (below 2300) to remove background from other sources. The data file was updated and the plot moved again. The notes also flag significant overtraining from the hyperparameters.",
  },
  {
    date: "Fri 25 Jul",
    cut: "0.922",
    title: "Blaming the wrong thing",
    fig: "punzi0922",
    what:
      "My suspect was the automatic feature selection, so I took it out. The plot got arguably worse, and the overtraining was clearer. Looking closer, Prof. Witek's code also used a preliminary model, so the selection went back in.",
  },
  {
    date: "Mon 28 Jul",
    cut: "0.338 / 0.933",
    title: "One setting at a time",
    fig: "punzi0933",
    what:
      "I compared the two models line by line (400 trees vs 100, min child weight 10 vs 1, subsample 0.5 vs 1.0, class weighting vs none). Changing to the simpler settings fixed the plot. Then I put settings back one at a time: subsample alone gave a broad maximum at 0.338 (left plot below); class weighting alone brought the spike back at 0.933 (right plot).",
  },
  {
    date: "Mon 28 Jul",
    cut: "0.246",
    title: "A gentle peak at last",
    fig: "punzi0246",
    what:
      "With 100 trees, depth 3, learning rate 0.1, no subsampling and no class weighting, the plot has the broad, gentle maximum the supervisor expected. The optimal cut is 0.246 and this is the one used for the rest of the analysis.",
  },
];

/* ------------------------------ timeline ------------------------------ */

export type Tag = "setup" | "ml" | "stats" | "bug" | "learn";

export const TAG_LABEL: Record<Tag, string> = {
  setup: "Setup and tools",
  ml: "Machine learning",
  stats: "Statistics and fits",
  bug: "Debugging",
  learn: "Physics and discussion",
};

export interface Day {
  date: string;
  tag: Tag[];
  title: string;
  body: string;
}

export const TIMELINE: Day[] = [
  {
    date: "Mon 14 Jul",
    tag: ["learn", "setup"],
    title: "First meeting with Prof. Witek",
    body:
      "We went through the whole project in outline. The data LHCb records is far too large to keep, so a trigger throws most of it away, and cuts on the rest will decide whether any signal is visible. The tools are split in two: ROOT (with its machine-learning package TMVA) for the ntuples, and Python. Getting at the ntuple on the server did not work at first.",
  },
  {
    date: "Tue 15 Jul",
    tag: ["setup", "ml"],
    title: "A TMVA macro, and non-finite values",
    body:
      "I wrote a C++ ROOT macro for TMVA that loads the signal and background trees, reads the list of variables and trains a boosted decision tree. TMVA cannot train on NaN or infinite values, so a cut to remove non-finite values was added. Getting the data meant a hard drive and AirDrop from Timur's laptop, then a newly built server reached over ssh. I also wrote down the difference between ssh (get a shell on a remote machine) and scp (copy files to or from it).",
  },
  {
    date: "Wed 16 Jul",
    tag: ["ml", "stats"],
    title: "Four papers and a task list",
    body:
      "TMVA was overtraining unexpectedly. We discussed what confidence level means and I was given four papers and three jobs: reduce the number of input variables, tune the BDT hyperparameters, and choose the cut with the Punzi method. In the morning I started converting ROOT ntuples to pandas, and hit conflicting Python versions.",
  },
  {
    date: "Thu 17 Jul",
    tag: ["ml", "setup"],
    title: "Same analysis in Python",
    body:
      "Switching to uproot sidestepped the Python clash. I rebuilt the TMVA analysis with scikit-learn's gradient boosting, with the same 70/30 train/test split. It gave a test AUC of 0.855, lower than the ROC Prof. Witek had shown with a different algorithm. A variable that was listed twice had to be removed. Timur was not well, and it rained a lot.",
  },
  {
    date: "Fri 18 Jul",
    tag: ["learn"],
    title: "No meeting",
    body: "Prof. Witek was on leave. I carried on with the same tasks.",
  },
  {
    date: "Mon 21 Jul",
    tag: ["ml", "bug", "learn"],
    title: "XGBoost, and the first suspicious plot",
    body:
      "The code was split into files for plotting and statistics, with a ROOT output holding the BDT score. I moved to XGBoost and used a preliminary model to cut 36 variables to 18. The ROC curves were fine, but the Punzi maximum sat at 0.993, 'extremely high and unrealistic'. Timur asked whether lepton number is conserved. It is not guaranteed: neutrino oscillations already break lepton flavour, and total lepton number being conserved is 'almost a coincidence'.",
  },
  {
    date: "Tue 22 Jul",
    tag: ["stats"],
    title: "First RooFit plots",
    body:
      "Prof. Witek sent a new file and I ran the RooFit analysis on it. Some plots worked and some did not. I read three statistics papers: a practical guide to statistical techniques in particle physics, and two on the CLs method.",
  },
  {
    date: "Wed 23 Jul",
    tag: ["bug"],
    title: "The root cause",
    body:
      "A lecture and a tour of the IFJ facilities ran until 14:00. Then Prof. Witek explained the spike: a cut removed from the signal file's preselection made the simulation differ from data, so XGBoost learned to spot simulation. The signal file was replaced (the old one renamed Lc2pemu_MC_old.root).",
  },
  {
    date: "Thu 24 Jul",
    tag: ["stats", "bug"],
    title: "CLs, and more input fixes",
    body:
      "We discussed applying the CLs method. The remaining Punzi problems were attributed to the hyperparameters, a missing cut on low masses and an incorrect data file. The new data file gave a cut of 0.862.",
  },
  {
    date: "Fri 25 Jul",
    tag: ["bug", "ml"],
    title: "Comparing my code with the supervisor's",
    body:
      "I put the two training scripts side by side. Removing feature selection made things worse, and both scripts turned out to use a preliminary model, so it went back in. A zfit environment in conda did not work and was set aside.",
  },
  {
    date: "Mon 28 Jul",
    tag: ["bug", "ml"],
    title: "Overtraining fixed",
    body:
      "The hyperparameters were the cause. With 100 trees and the simpler settings the Punzi plot looked right (cut 0.246). Adding settings back one at a time showed which one reintroduced the spike. A fresh conda environment for zfit took about ten minutes to build and ran with the same initial warning.",
  },
  {
    date: "Wed 30 Jul",
    tag: ["stats", "setup"],
    title: "Finalising the chain",
    body:
      "The C++ macro produced the final graphs, but the Python code still had array-size errors, and the input files for the final plots were Prof. Witek's rather than mine. I downloaded the muon reference-channel data, ran it through my XGBoost processor and found it looked very different from the signal channel, with strong overtraining. That was left for the meeting. The slides needed figures and a lot less jargon.",
  },
];

/* ------------------------------ the 18 selected variables ------------------------------ */

export interface Feature {
  name: string;
  group: string;
  plain: string;
}

export const FEATURE_GROUPS = [
  "Where it came from",
  "How long it lived",
  "Fit quality",
  "Momentum",
  "Particle ID",
  "Isolation",
] as const;

export const FEATURES: Feature[] = [
  { name: "Lc_IPCHI2_OWNPV", group: "Where it came from", plain: "How badly the Λc's path misses the primary collision point (a χ² of its impact parameter)." },
  { name: "Lc_FD_OWNPV", group: "Where it came from", plain: "How far the Λc flew before decaying." },
  { name: "Lc_DIRA_OWNPV", group: "Where it came from", plain: "Whether the Λc's momentum points back to where it was made (direction angle)." },
  { name: "p_FITPV_IP", group: "Where it came from", plain: "Impact parameter of the proton track." },
  { name: "p_FITPV_IPCHI2", group: "Where it came from", plain: "The same for the proton, as a χ²." },
  { name: "Lc_transformed_TAU", group: "How long it lived", plain: "A transformed version of the Λc's measured decay time." },
  { name: "Lc_TAUCHI2", group: "How long it lived", plain: "How well the decay-time fit agrees with the vertex positions." },
  { name: "Lc_FITPV_PVLTIME", group: "How long it lived", plain: "Decay time from the fit to the primary vertex." },
  { name: "DTF_CHI2", group: "Fit quality", plain: "χ² of the decay-tree fit: how well all the tracks fit one decay." },
  { name: "p_PT", group: "Momentum", plain: "Proton momentum across the beam direction." },
  { name: "l_PT", group: "Momentum", plain: "Transverse momentum of the lepton track." },
  { name: "mu_PT", group: "Momentum", plain: "Transverse momentum of the muon." },
  { name: "p_FITPV_PT", group: "Momentum", plain: "Proton transverse momentum after the vertex fit." },
  { name: "l_FITPV_PT", group: "Momentum", plain: "Lepton transverse momentum after the vertex fit." },
  { name: "mu_FITPV_PT", group: "Momentum", plain: "Muon transverse momentum after the vertex fit." },
  { name: "p_uniProbNNp", group: "Particle ID", plain: "A neural network's probability that the proton track really is a proton." },
  { name: "relinfo_VTXISOBDTHARDFIRSTVALUE", group: "Isolation", plain: "How isolated the decay vertex is from other tracks (a BDT output)." },
  { name: "relinfo_TrackIsoBDTp_TRKISOBDTTHIRDVALUE", group: "Isolation", plain: "How isolated the proton track is from other tracks (a BDT output)." },
];
