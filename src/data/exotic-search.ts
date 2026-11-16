/**
 * EXOTIC SEARCH (DAML PROJECT 4 / WEEK 9): numbers and figures
 * ─────────────────────────────────────────────────────────────────
 * Every number is printed in the Week 9 notebook's output cells, or is simple
 * arithmetic on those numbers (labelled where it is). The samples are not in the
 * zip, so nothing is re-run; the mass-sculpting toy says what it is built from.
 */
import type { Fig } from "@/components/physics/daml/ui";

const SRC = "Week 9 notebook";
const img = (n: string) => `/images/exotic-search/${n}.webp`;

export const N = {
  signalEntries: 50013,
  backgroundEntries: 6826959,
  signalWeighted: 4200.16,
  backgroundWeighted: 5402673.57,
  /** Square cuts (final set). */
  cuts: { sigEntries: 30629, bgEntries: 1687010, sigW: 2564.92, bgW: 1319512.19, sigEff: 0.6107, bgRej: 0.7558 },
  /** First network, 8 inputs, trained on a 50/50 sample without the mass. Confusion matrix is read from the notebook's plot. */
  nn1: { auc: 0.943, tn: 12857, fp: 2136, fn: 1478, tp: 13537, params: 2041 },
  /** Second network, 9 inputs including the reconstructed mass. */
  nn2: { accuracy: 0.9292, passEntries: 582832, ofEntries: 6876972, sigW: 3959.75, bgW: 405859.86, params: 3721 },
  /** Fits to the reconstructed mass between 0.7 and 2.0 TeV in 40 bins. */
  fits: {
    square: { chi2H0: 224.09, chi2H1: 192.97, dchi2: 31.12, sigma: 5.58, p: 2.43e-8, amp: -1114.9 },
    nn: { chi2H0: 638.85, chi2H1: 424.67, dchi2: 214.17, sigma: 14.63, amp: 2385.6 },
    bins: 40,
    ndfH0: 36,
    ndfH1: 35,
  },
  /** Cubic fitted to the square-cut background in the 0.7 to 2.0 TeV window (the notebook's H0 parameters, x in MeV). */
  h0Cubic: [2.15999477e5, -3.38433196e-1, 1.82454929e-7, -3.34244623e-14] as const,
};

/** Quantiles the notebook printed (GeV; the files store MeV). D2 was printed as integers. */
export interface Feature {
  id: string;
  label: string;
  unit: string;
  sig10: number;
  sig25: number;
  bg75: number;
  bg90: number;
  cut?: { kind: "gt" | "lt" | "window"; lo?: number; hi?: number };
  why: string;
}
export const FEATURES: Feature[] = [
  { id: "lep2_pt", label: "Second lepton pT", unit: "GeV", sig10: 52, sig25: 86, bg75: 75, bg90: 115, cut: { kind: "gt", lo: 43 }, why: "The signal's lower quartile sits above where most background lives, but the tails overlap. A gentle cut at 43 GeV drops the softest leptons." },
  { id: "fatjet_pt", label: "Fat-jet pT", unit: "GeV", sig10: 290, sig25: 361, bg75: 411, bg90: 578, cut: { kind: "gt", lo: 240 }, why: "The notebook calls this the scary one: background reaches higher than signal, so raising the cut removes signal as fast as background. 240 GeV is deliberately low." },
  { id: "zll_mass", label: "Dilepton mass", unit: "GeV", sig10: 83.8, sig25: 88.3, bg75: 93.1, bg90: 97.7, cut: { kind: "window", lo: 80, hi: 100 }, why: "The signal's two leptons come from a Z, so their mass peaks at about 91 GeV. Keeping 80 to 100 GeV is the most physical cut on the list." },
  { id: "met", label: "Missing transverse energy", unit: "GeV", sig10: 12.2, sig25: 20.6, bg75: 45.6, bg90: 66.5, cut: { kind: "lt", hi: 55 }, why: "No neutrinos are expected in the signal, so the missing energy should be small; events with neutrinos, such as top-quark decays, leak more. The cut at 55 GeV sits between the background's 75th and 90th percentiles." },
  { id: "fatjet_d2", label: "Fat-jet D2 (substructure)", unit: "", sig10: 1, sig25: 1, bg75: 3, bg90: 4, cut: { kind: "lt", hi: 4 }, why: "D2 is a jet-substructure variable: small for a jet that came from a Z splitting into two quarks, larger for a jet from a single quark or gluon. The notebook printed it as whole numbers, so the quartiles are coarse; the cut at 4 is loose." },
  { id: "lep1_pt", label: "Leading lepton pT", unit: "GeV", sig10: 185, sig25: 234, bg75: 211, bg90: 298, why: "Signal and background overlap almost completely here, so no cut was applied." },
  { id: "zll_pt", label: "Dilepton pT", unit: "GeV", sig10: 282, sig25: 360, bg75: 268, bg90: 377, why: "Signal sits inside the background's range throughout, so no cut was applied." },
];

export const FIGS: Record<string, Fig> = {
  features: { src: img("features"), w: 1500, h: 1198, alt: "Sixteen histograms of eight kinematic variables, signal against combined background and against each background", caption: "The eight kinematic inputs, signal in red against the background in blue (top two rows, all backgrounds merged; bottom two rows, split into diboson, top and Z+jets). Everything overlaps; the dilepton mass and the fat-jet D2 are where signal and background part most.", source: SRC },
  squareCuts: { src: img("square-cuts"), w: 1389, h: 989, alt: "Reconstructed mass before and after square cuts, signal and background", caption: "Reconstructed mass before cuts (top left), after (top right), with both shapes normalised (bottom left) and stacked (bottom right). Normalised, the signal is a narrow peak at 1 TeV; in absolute numbers it is a barely visible sliver.", source: SRC },
  fitSquare: { src: img("fit-square-cuts"), w: 868, h: 545, alt: "Hypothesis test fit after square cuts: data, background-only fit, signal-plus-background fit and the small negative signal component", caption: "The square-cut fit. The red dashed line is the fitted signal component: a small dip at 1 TeV, because this fit was run on the background sample alone.", source: SRC },
  training: { src: img("training-curves"), w: 1189, h: 490, alt: "Loss and accuracy of the first network over 200 epochs for training and test sets", caption: "Training the first network: loss still falling and accuracy still creeping up at epoch 200 (about 0.88), with training and test curves on top of each other.", source: SRC },
  roc: { src: img("roc"), w: 536, h: 545, alt: "ROC curve of the first network with an area under the curve of 0.943", caption: "ROC curve of the first network on the held-out 30% of the balanced sample: area under the curve 0.943.", source: SRC },
  fitNn: { src: img("fit-nn"), w: 868, h: 545, alt: "Hypothesis fits after the neural-network selection, with a shoulder in the data near 1 TeV", caption: "The fit after the network's selection. The data show a shoulder near 1 TeV, but neither curve follows the points on either side of it.", source: SRC },
  sculpting: { src: img("mass-sculpting"), w: 877, h: 545, alt: "Background mass distribution after selection by a network trained without the mass and one trained with it", caption: "Background passing a network trained without the mass (blue) and one trained with it (red). The x range runs to 5×10⁷ MeV, so the interesting part is squeezed into the first two bars; the toy above redraws the idea at a readable scale.", source: SRC },
};
