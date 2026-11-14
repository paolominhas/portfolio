/**
 * DATA FOR THE DUNE / GLoBES PAGE
 * ─────────────────────────────────────────────────────────────────
 * Every number on the page comes from one of three places, and this file says which:
 *   • "report"  – Report.pdf in the project repository
 *   • "repo"    – the repository's input / output files and code
 *   • "check"   – my own independent re-implementation (see VALIDATION), labelled wherever it is used
 */

export const REPO = "https://github.com/paolominhas/DUNE-GLoBES-Simulation-Internship-2025";
export const REPORT_PDF = `${REPO}/blob/main/Report.pdf`;
export const POSTER_PDF = `${REPO}/blob/main/Poster.pdf`;

export const NUMBERS = {
  baselineFD: 1284.9, // km, DUNE_GLoBES.glb
  baselineND: 0.574, // km, nd_globes/ND*.glb ("574 m" in the report)
  density: 2.848, // g/cm³, $densitytab
  ndFiles: 11, // nd_globes/ND1..ND11.glb (the report says 10)
  recoBins: 80,
  samplingPoints: 99,
  nuYears: 3.5,
  nubarYears: 3.5,
  power: 11.0, // ×10²⁰ POT/yr in Beam.inc
  windowLow: 0.5,
  windowHigh: 18.0,
  snuParams: 92,
  nuFit: {
    s2t12: 0.307,
    s2t13: 0.02195,
    s2t23: 0.561,
    d21: 7.49e-5,
    d31no: 2.534e-3,
    d31io: -2.51e-3,
  },
} as const;

export interface Fig {
  src: string;
  alt: string;
  caption: string;
  source: string;
  n?: number;
}

const own = (n: number, file: string, alt: string, caption: string): Fig => ({
  n,
  src: `/images/globes/${file}.png`,
  alt,
  caption,
  source: `My plot, Figure ${n} of the report`,
});

export const FIGS = {
  ordering: own(
    4,
    "fig04-ordering-dune-t2k",
    "A colour map of chi-squared against theta 23 and delta m squared 31 with the DUNE, T2K and combined best fits marked",
    "Mass-ordering sensitivity in the (θ₂₃, Δm²₃₁) plane for DUNE, T2K and the two combined. The axes are labelled “degrees” in the original; the quantities are sin²θ₂₃ and Δm²₃₁ (see the notes at the end)."
  ),
  events: own(
    5,
    "fig05-events-no-io",
    "Histogram of electron-neutrino appearance events against energy for normal and inverted ordering",
    "Electron-neutrino appearance events against energy for normal (blue) and inverted (red) ordering. 3.5 years of ν beam and 3.5 years of ν̄ beam."
  ),
  cpv: own(
    7,
    "fig07-cpv-chi2",
    "Chi-squared against delta CP over pi with two humps near plus and minus one half",
    "χ² against δCP, built by taking at each point the smaller of the χ² to δCP = 0 and to δCP = π, marginalised over θ₂₃."
  ),
  threeVsFour: own(
    8,
    "fig08-3nu-vs-3plus1",
    "Two nearly identical chi-squared curves, labelled 3 neutrino model and 3+1 using 0 for the 4th neutrino parameters",
    "The validation: χ² against δCP from the ordinary three-flavour code and from the four-flavour engine with every sterile parameter set to zero."
  ),
  fdSterile: own(
    9,
    "fig09-fd-sterile",
    "Colour map of chi-squared over sin squared theta 24 and delta m squared 41 for the far detector with a white dashed contour",
    "Far-detector-only χ² over (sin²θ₂₄, Δm²₄₁). The contour wanders left at small Δm²₄₁ and has a notch near 10⁻²·⁹ eV²."
  ),
  ndFd: own(
    11,
    "fig11-nd-fd-sterile",
    "A blue shaded region on log axes for sin squared theta 24 against delta m squared 41 labelled DUNE 90 percent CL",
    "Near + far detector 90% CL region, near-detector source treated as a single point. Compare the published DUNE curve, which I do not reproduce here for copyright reasons (it is Figure 10 of the report, from the DUNE TDR)."
  ),
  matter: own(
    12,
    "fig12-matter-vacuum",
    "Two panels of oscillation probability against energy comparing vacuum and matter",
    "νμ → νμ and νμ → νe probability against energy, in vacuum and in matter."
  ),
  probs: own(
    13,
    "fig13-probabilities",
    "Four panels of oscillation probability against energy",
    "Appearance and disappearance probabilities, vacuum (left) and matter (right)."
  ),
  t2k: own(
    14,
    "fig14-t2k",
    "Colour map of chi-squared confidence regions for theta 23 against delta m squared 23",
    "Further result: normal against inverted ordering at T2K."
  ),
  scint: own(
    15,
    "fig15-scint-50kt",
    "Colour map of chi-squared for theta 13 against delta CP",
    "Further result: a simulated 50 kt liquid-scintillator detector run for 6 years."
  ),
  lsnd: own(
    16,
    "fig16-lsnd",
    "Colour map of chi-squared confidence regions theta 13 against delta CP",
    "Further result: the effect of a 3+1 model on sensitivity at LSND."
  ),
} satisfies Record<string, Fig>;

export type FigId = keyof typeof FIGS;

/** The numbers in the “How far can you trust this page” section. */
export const VALIDATION = {
  eventsRelErr: 0.0007, // FD νe appearance, my engine vs events_out3*.dat, both δCP values
  probMaxAbs: 2.9e-4, // vacuum P(νe→νμ) at L = 1300 km, δCP = 180°, vs probabitity_out3_cp0.dat (worst point, 0.115 GeV)
  probMedianAbs: 8e-7,
  chi3v31MaxAbs: 0.33, // |χ²(3+1, all sterile = 0) − χ²(3ν)|, 201 points of chi_out3/4.dat
  chi3v31MaxRel: 0.005,
  ndRatio: 0.132, // my ND normalisation relative to the far detector (see caveats)
};

export const SETUP: [string, string, string][] = [
  ["Far detector", "1284.9 km · 2.848 g/cm³", "DUNE_GLoBES.glb"],
  ["Near detector", "0.574 km (11 input files, 10 distinct positions)", "nd_globes/ND1–11.glb"],
  ["Beam", "3.5 yr neutrino mode + 3.5 yr antineutrino mode, 11.0 × 10²⁰ POT/yr", "flux/Beam.inc"],
  ["Energy binning", "80 reconstructed bins (0.125 GeV up to 8 GeV, then wider, to 110 GeV); 99 true-energy sampling points", "DUNE_GLoBES.glb"],
  ["Analysis window", "0.5–18 GeV per rule", "DUNE_GLoBES.glb"],
  ["Rules", "νe appearance and νμ disappearance, in both horn modes, with backgrounds", "DUNE_GLoBES.glb"],
  ["Statistics", "χ² with systematic pulls (GLoBES chiMultiExp), then χ² differences", "NDsterile.c"],
  ["Oscillation engine", "SNU library (J. Kopp): 4 flavours, 92 parameters, NSI switched off", "snu.c"],
  ["Known parameters", "NuFit 6.0 central values", "NDsterile.c"],
];

export const CODE: { id: string; title: string; file: string; code: string; plain: string }[] = [
  {
    id: "init",
    title: "Load every detector",
    file: "NDsterile.c",
    code: `glbInit(argv[0]);
for (int i = 1; i < 12; i++) {
  char glb_filename[128];
  sprintf(glb_filename, "nd_globes/ND%d.glb", i);
  glbInitExperiment(glb_filename, &glb_experiment_list[0], &glb_num_of_exps);
}
glbInitExperiment("DUNE_GLoBES.glb", &glb_experiment_list[0], &glb_num_of_exps);`,
    plain:
      "GLoBES can hold several experiments at once and adds their χ² together. The near detector is not one point: it is a row of input files, one per slice of the decay pipe, so the neutrino source is a smeared line. The far detector is loaded last, as experiment number 11.",
  },
  {
    id: "engine",
    title: "Swap in the four-flavour engine",
    file: "NDsterile.c",
    code: `int n_flavors = 4;
int rotation_order[][2] = {{3,4}, {2,4}, {1,4}, {2,3}, {1,3}, {1,2}};
int phase_order[]       = {-1, 2, 1, -1, 0, -1};
snu_init_probability_engine(n_flavors, rotation_order, phase_order);
glbRegisterProbabilityEngine(92,
    &snu_probability_matrix,
    &snu_set_oscillation_parameters,
    &snu_get_oscillation_parameters, NULL);`,
    plain:
      "This is the heart of the project. GLoBES normally knows three flavours. The SNU library supplies a 4×4 mixing matrix built from six rotations, in the order given, with the phases attached as listed (−1 means no phase). Registering it makes GLoBES ask SNU for every oscillation probability, with 92 parameters, almost all of them zero here.",
  },
  {
    id: "values",
    title: "True world and test world",
    file: "NDsterile.c",
    code: `double param_values[12] = {   // normal ordering values
  asin(sqrt(0.307)),    // θ12
  asin(sqrt(0.02195)),  // θ13
  asin(sqrt(0.561)),    // θ23
  177/180*M_PI,         // δCP
  7.49e-5,              // Δm²21
  2.534e-3,             // Δm²31
  0.0, 0.0, 0.0, 0.0,   // Δm²41, θ14, θ24, θ34
  0.0, 0.0              // sterile phases
};`,
    plain:
      "The “true” world has the standard NuFit values and no sterile neutrino. Every grid point then sets a different test world, with a sterile neutrino switched on, and asks how far the predicted data move. In this particular file the line for δCP, 177/180*M_PI, is evaluated in integer arithmetic, so 177/180 is 0 and δCP is exactly 0. That is harmless for the sterile scan (δCP barely matters for νμ disappearance) but worth knowing.",
  },
  {
    id: "scan",
    title: "Scan the sterile parameters",
    file: "NDsterile.c",
    code: `for (double en24 = -5.0; en24 <= -0.1; en24 += 0.1) {
  double sin2_th24 = pow(10, en24);
  this_theta24 = asin(sqrt(sin2_th24));
  glbSetOscParams(test_values, this_theta24, 8);       // test θ24
  for (double enstdm = -4.0; enstdm <= 2.0; enstdm += 0.1) {
    this_stdm = pow(10, enstdm);
    glbSetOscParams(test_values, this_stdm, 6);        // test Δm²41
    chi_now = glbChiNP(test_values, NULL, GLB_ALL);    // vs the no-sterile truth
    fprintf(outfile3, "%g %g %g\\n", sin2_th24, this_stdm, chi_now);
  }
}`,
    plain:
      "A double loop over a logarithmic grid: sin²θ₂₄ from 10⁻⁵ to 10⁻⁰·¹ and Δm²₄₁ from 10⁻⁴ to 10² eV². At each point GLoBES computes the χ² between the no-sterile prediction and the sterile one, including the systematic nuisance parameters. The 90% and 99% regions are where this χ² exceeds the 2-degree-of-freedom thresholds 4.61 and 9.21.",
  },
  {
    id: "glb",
    title: "One rule in the detector file",
    file: "DUNE_GLoBES.glb",
    code: `$densitytab = {2.848}
...
@channel = #flux_FHC: +: m: e: #CC: #app_nue_sig
@post_smearing_efficiencies = copy(%post_app_FHC_nue_sig)`,
    plain:
      "A channel says: take the neutrino-mode flux (+ for neutrino), start with a muon neutrino, end with an electron neutrino, use the charged-current cross-section, then apply the smearing matrix and the efficiency that belong to this signal. Each rule is a handful of such channels, signal plus every background, and each channel has its own systematic error.",
  },
];

export const CAVEATS: { title: string; body: string }[] = [
  {
    title: "The raw sterile χ² grids in the repository are not safe to plot",
    body: "Both saved scans contain negative χ² values, which a χ² difference cannot have: 1,276 of the 6,050 points in the far-detector file (down to −0.17) and 725 of 3,000 in the near-detector file (down to −1.8). The far-detector file also holds values up to 2×10¹⁴, which is not credible for a detector recording of order a thousand events per bin. (Large near-detector values can be real, because its statistics are enormous: my own near-detector χ² reaches about 10⁷.) These look like minimiser failures. The report’s sterile figures (9 and 11) are drawn from contours of runs like these, so for this page I did not plot the raw grids as results; the sensitivity map below is my own labelled re-derivation.",
  },
  {
    title: "How many near-detector files, and how big",
    body: "The report says ten near-detector files. The code loops over eleven (ND1 to ND11), and 0.574 km appears twice, as ND1 and ND11. Each file carries the full exposure and its own independent systematic pulls, so eleven files is not the same as one detector smeared over eleven positions.",
  },
  {
    title: "Detector mass",
    body: "The report calls the near detector 20 kt. The detector files use a mass factor of 0.067 in the final version and 0.05 in the earlier run that produced the saved event files, both annotated as 40 kt. With that mass at 574 m the raw event count is of order 10¹¹, so statistical errors are negligible, and the systematic errors in the detector files are normalisation errors on each channel. The near-detector reach is therefore set largely by the assumed number of events, which makes the exposure an assumption worth stating.",
  },
  {
    title: "The inverted-ordering event file",
    body: "inv_events_out3_cp_0.dat is byte-for-byte the normal-ordering file. My independent calculation gives the inverted-ordering signal about 0.46 times the normal-ordering one at this δCP, which is consistent with the red curve in the report’s Figure 5 (that curve is not the file).",
  },
  {
    title: "How the CP-violation curve is built",
    body: "The δCP χ² is obtained by running GLoBES with the truth fixed at δCP = 0 (and again at π) and scanning the test value, then taking the smaller of the two at each δCP. That treats χ²(true a, test b) as equal to χ²(true b, test a), which is a good approximation but not an identity. The curve is also jagged between δCP/π ≈ 0.45 and 0.65 (70.5 at 0.45, 55.9 at 0.5, 59.1 at 0.55, then 77.8 at 0.6), which looks like a minimiser that did not converge at every point.",
  },
  {
    title: "σ against χ²",
    body: "The report’s Figure 7 has χ² on the vertical axis and the TDR’s Figure 6 has σ = √Δχ². The simulated peak is χ² ≈ 65 to 78, which is σ ≈ 8 to 9, above the roughly 5σ peak in the TDR for its staged 7-year exposure. Exposure, systematics and what is marginalised all differ, and I have not pinned down which accounts for the gap, so I would not call the two curves “very similar” in height, only in shape.",
  },
  {
    title: "Labels and wording in the report",
    body: "Figures 4 and 15 label their axes “degrees” where the quantities are sin²θ and Δm². Figure 9’s axis reads Δm²₁₄. The statistics section says “Bayesian” for what is a frequentist χ² difference. Figure numbers in the body text are shifted relative to the captions, and Appendix D, which the near-detector caption points to for the smeared source, is empty.",
  },
  {
    title: "What I could not reproduce",
    body: "The absolute near-detector event totals in ND_events.dat. My independent calculation agrees with it in shape but needs a normalisation of 0.132 relative to the far detector, and that factor is not constant across energy (0.111 to 0.134). In my χ² the near-detector χ² grows in proportion to the number of events (multiplying the factor by 10 multiplies it by about 9.8), so the reach in sin²θ₂₄ scales as the inverse square root of the normalisation. Across the 0.111 to 0.134 spread that is only about 0.04 in log₁₀, but the absolute scale itself is uncertain, so my near-detector reach is approximate. It reaches the 10⁻⁵ edge of the grid for Δm²₄₁ above about 3 eV², roughly an order of magnitude beyond the report’s Figure 11. That would be a factor of about 100 in near-detector events; I could not tell whether the report’s run used a smaller exposure or other settings.",
  },
];

export const GLOSSARY: [string, string][] = [
  ["Baseline (L)", "The distance from where the neutrinos are made to where they are detected."],
  ["CP violation", "A difference between how neutrinos and antineutrinos oscillate. It is controlled by one phase, δCP."],
  ["χ² (chi-squared)", "A number that grows as a prediction moves away from the data, weighted by how uncertain each bin is."],
  ["Δm² (mass splitting)", "The difference between the squares of two neutrino masses. It sets how fast an oscillation happens."],
  ["FHC / RHC", "Forward and reverse horn current: the two beam modes, mostly neutrinos and mostly antineutrinos."],
  ["GLoBES", "The General Long Baseline Experiment Simulator, a C library that predicts the events an experiment will see."],
  ["Mass ordering", "Whether the third neutrino mass state is heavier (normal) or lighter (inverted) than the other two."],
  ["Matter effect", "Electron neutrinos feel the electrons in rock, which changes the oscillation, with opposite sign for antineutrinos."],
  ["Pull", "A nuisance parameter that lets a systematic uncertainty (such as the flux) shift within its error, at a χ² cost."],
  ["Smearing matrix", "The table that turns a true neutrino energy into the reconstructed energy a detector would report."],
  ["Sterile neutrino", "A hypothetical fourth neutrino with no weak interaction, visible only through oscillations."],
  ["TDR", "Technical Design Report: the DUNE collaboration’s published predictions."],
];
