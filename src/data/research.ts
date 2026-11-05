/**
 * RESEARCH PROJECTS
 * ─────────────────────────────────────────────────────────────────
 * The projects behind physics.paolo.org.uk/research. Metadata
 * for all of them lives here (used by the /research index grid), but
 * only the non-bespoke ones route through the generic `research/[slug]/page.tsx`
 * template — `mphys` has its own bespoke route tree
 * (`research/mphys/**`) because it carries real interactive content
 * (a 3D globe, a detector-geometry explorer, a live collision
 * canvas) that doesn't fit a text-only template. (The option pricer used to be
 * here too; it is quantitative finance, so it now lives on the main site at
 * /projects/option-pricing, and the old physics URL redirects.)
 * Static routes take priority over the `[slug]` dynamic segment in the
 * App Router, so `/research/mphys` resolves to the bespoke folder without
 * any special-casing needed at the routing level — `[slug]/page.tsx`
 * just excludes `bespokeRoute` entries from `generateStaticParams` so it
 * doesn't also try to render a (worse, non-interactive) version of them.
 *
 * `content` is HTML (same convention as `arrangements.ts`'s
 * `programmeNote` and the old `projects.ts`) — short paragraphs, no
 * need for a full block model the way `physics-articles.ts` uses,
 * since none of these three embed a live simulation inline.
 */

export interface ResearchProject {
  slug: string;
  title: string;
  subtitle: string;
  role: string;
  institution: string;
  period: string;
  summary: string; // one/two sentences, for the index card
  tags: string[];
  techStack: string[];
  content: string; // HTML, for the detail page
  /**
   * True for entries with their own route folder (mphys) — the
   * [slug] template skips them. The index card links to /research/<slug> either way.
   */
  bespokeRoute?: boolean;
  /**
   * Draft entries are hidden from the index and 404 in production, but still
   * render under `next dev` so you can preview them. Flip to false (or delete
   * the line) to publish.
   */
  draft?: boolean;
  /** Optional link to the source repo; both the bespoke and generic pages show a "View the code" link when set. */
  repoUrl?: string;
  /** Optional extra links (report, poster, slides) shown under the write-up on the generic page. */
  resources?: { label: string; href: string }[];
}

export const researchProjects: ResearchProject[] = [
  {
    slug: "mphys",
    title: "MPhys Thesis — HIBEAM Prototype TPC",
    subtitle:
      "dE/dx analysis of a prototype Time Projection Chamber for the HIBEAM experiment at the ESS.",
    role: "MPhys research project",
    institution: "University of Edinburgh, with beam-test data from IFJ PAN, Kraków",
    period: "2025–2026",
    summary:
      "Geant4 simulation and dE/dx analysis of the prototype TPC detector for HIBEAM, benchmarked against real beam-test data — including an interactive 3D detector-geometry explorer and a live collision visualisation.",
    tags: ["Particle Physics", "Detector Physics", "HIBEAM"],
    techStack: ["Geant4", "ROOT (C++)", "Python", "uproot", "React Three Fiber"],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
  },
  {
    slug: "ppss",
    title: "Searching for Lepton-Flavour Violation in Charmed Baryon Decays",
    subtitle:
      "A machine-learning event selection and a CLs limit for the forbidden decay Λc⁺ → p e⁻ μ⁺, using LHCb data.",
    role: "Summer internship",
    institution: "Institute of Nuclear Physics, Polish Academy of Sciences (IFJ PAN), Kraków",
    period: "Summer 2025",
    summary:
      "Working with Prof. Mariusz Witek's LHCb group, I built an XGBoost event selection to dig a lepton-flavour-violating charmed-baryon decay out of an overwhelming combinatorial background, then set a statistical limit on its rate.",
    tags: ["LHCb", "Flavour Physics", "Machine Learning"],
    techStack: ["Python", "XGBoost", "ROOT / RooFit", "zfit", "uproot"],
    repoUrl: "https://github.com/paolominhas/PPSS-IFJ-PAN-Summer-Internship-2025",
    resources: [
      { label: "Final presentation (PDF)", href: "https://github.com/paolominhas/PPSS-IFJ-PAN-Summer-Internship-2025/blob/main/FinalProjectPresentation.pdf" },
      { label: "Project notes (PDF)", href: "https://github.com/paolominhas/PPSS-IFJ-PAN-Summer-Internship-2025/blob/main/ProjectNotes.pdf" },
    ],
    content: `
      <p>Why is there more matter than antimatter? One ingredient is CP violation; another, more speculative one, is that the three charged-lepton flavours might not be strictly separate. In the Standard Model, a decay that turns a muon into an electron (without a neutrino to carry the flavour away) is suppressed to branching fractions around 10<sup>−54</sup>. In models that explain the tiny neutrino masses with heavy right-handed neutrinos, some of these decays could be big enough to see. The charmed baryon decay Λ<sub>c</sub><sup>+</sup> → p e<sup>−</sup> μ<sup>+</sup> is one such channel: forbidden in the Standard Model, so any signal at all would be new physics.</p>
      <p>This project, done with Timur Knyazev under Prof. Dr hab. Mariusz Witek at IFJ PAN, was the event-selection and limit-setting chain for a search in LHCb data. It is a student exercise on a collaboration dataset, so treat it as preliminary: the collaboration's own analysis is separate.</p>
      <h2>The problem: a needle in a very large haystack</h2>
      <p>The data came pre-selected as ROOT ntuples with 675 variables per candidate. A simulated signal sample had 1,727 events; the background was real data, 214,977 candidates, almost all of them unrelated tracks that happen to reconstruct near the Λ<sub>c</sub> mass. Simple cuts on one variable at a time throw away signal; a classifier can use many weak hints together.</p>
      <h2>The method</h2>
      <ul>
        <li><strong>Choose the variables.</strong> A first model ranked 36 candidate variables and kept the 18 most useful (vertex quality, flight distance, impact parameter, transverse momenta, particle-ID, isolation). The shortlist then trained a second, more tightly tuned model.</li>
        <li><strong>Train a boosted decision tree</strong> (XGBoost: 100 trees, depth 3, learning rate 0.1) to give each candidate a signal-likeness score from 0 to 1, using Monte Carlo as signal and the high-mass sideband of real data as background.</li>
        <li><strong>Pick the cut with Punzi's figure of merit</strong>, which chooses the score threshold that gives the best sensitivity without needing to know the signal yield in advance. The optimum came out at a BDT score of about 0.25.</li>
        <li><strong>Fit the invariant mass</strong> with a signal shape taken from simulation (a Crystal Ball plus a Gaussian) in RooFit and zfit.</li>
        <li><strong>Normalise to a known decay.</strong> The rate is measured relative to the well-measured Λ<sub>c</sub><sup>+</sup> → p φ(→ μ<sup>+</sup>μ<sup>−</sup>) reference channel, which cancels most detector effects.</li>
        <li><strong>Set a limit with the CLs method.</strong> With no significant excess, the result is a 90% confidence-level upper limit on the branching fraction rather than a discovery.</li>
      </ul>
      <h2>What I took from it</h2>
      <p>The unglamorous parts were the lesson: a model that overtrains looks brilliant until you test it on events it hasn't seen, and careful tuning mattered a great deal. The repository has the training scripts, the results plots, my notes and the final presentation. The data files are too large to host.</p>
    `,
  },
  {
    slug: "globes",
    title: "Sterile-Neutrino Sensitivity at DUNE with GLoBES",
    subtitle:
      "Recreating DUNE's published oscillation sensitivities, then adding a sterile neutrino and a smeared near detector.",
    role: "Summer project (Career Development Summer Scholarship)",
    institution: "School of Physics and Astronomy, University of Edinburgh",
    period: "June–July 2025",
    summary:
      "Simulating DUNE's near and far detectors in GLoBES to see how sensitive the experiment is to CP violation, the neutrino mass ordering, and a hypothetical fourth (sterile) neutrino, and why the near detector matters so much for the last of these.",
    tags: ["Neutrino Physics", "DUNE", "Simulation"],
    techStack: ["GLoBES", "C", "SNU library", "Python", "Mathematica"],
    repoUrl: "https://github.com/paolominhas/DUNE-GLoBES-Simulation-Internship-2025",
    resources: [
      { label: "Project report (PDF)", href: "https://github.com/paolominhas/DUNE-GLoBES-Simulation-Internship-2025/blob/main/Report.pdf" },
      { label: "Poster (PDF)", href: "https://github.com/paolominhas/DUNE-GLoBES-Simulation-Internship-2025/blob/main/Poster.pdf" },
    ],
    content: `
      <p>DUNE fires a neutrino beam from Fermilab to a detector 1,300 km away in South Dakota and looks for the beam's flavours changing on the way. Before data arrives (the experiment is expected to come online around 2027), physicists use simulators to ask what the experiment <em>could</em> tell us. GLoBES, the General Long Baseline Experiment Simulator, is the standard tool: give it a beam, a detector and a systematic-error model, and it returns a χ² for any pair of competing hypotheses.</p>
      <h2>Step 1: reproduce the published numbers</h2>
      <p>I first checked that my simulation agreed with DUNE's technical design report: the neutrino mass ordering (normal against inverted) and sensitivity to the CP-violating phase δ<sub>CP</sub>. The δ<sub>CP</sub> curve matched well apart from a dip around δ<sub>CP</sub>/π = 0.5; near maximal CP violation (δ<sub>CP</sub> around ±π/2) the sensitivity reaches the 5σ level particle physics uses for discovery.</p>
      <h2>Step 2: add a sterile neutrino</h2>
      <p>A sterile neutrino is a hypothetical fourth neutrino that doesn't feel the weak force, so it can only show itself through oscillations. I extended the simulation to a 3+1 model with the SNU library, then proved the extension didn't break anything: with the sterile parameters set to zero it must reproduce the ordinary three-neutrino result, and the two χ² surfaces came out identical.</p>
      <p>At the far detector the sensitivity to the sterile mass splitting Δm²<sub>41</sub> and mixing angle θ<sub>24</sub> has a conspicuous dip where Δm²<sub>41</sub> approaches the ordinary atmospheric splitting: the sterile effect then looks like a small change to the standard parameters and the two can't be told apart.</p>
      <h2>Step 3: the near detector</h2>
      <p>The near detector, only 574 m from the source, sees the beam before the ordinary oscillation has developed, but a Δm² near 1 eV² oscillates over exactly that distance. I added it as a new detector with ten GLoBES files spread along the decay pipe, so the neutrino source is a smeared line rather than a point. Adding it lifted the sensitivity to the sterile parameters substantially, and reproduced the shape of the design-report curve, including the dip. The remaining differences probably come from systematics and from simplifications, notably treating the source as a point in the final combined plot.</p>
      <p>This was a learning project: it was my first time using C, Makefiles and GLoBES (segmentation faults included), and the repository's README is partly a template I was practising with. The report and poster have the real description.</p>
    `,
  },
  {
    slug: "dune-nd",
    title: "DUNE Near Detector: Constraining CP-Violation Uncertainties",
    subtitle:
      "Using simulated near-detector events to find where reconstructed neutrino energy can and can't be trusted.",
    role: "Senior Honours Project",
    institution: "School of Physics and Astronomy, University of Edinburgh",
    period: "2025",
    summary:
      "A ten-week analysis of simulated DUNE near-detector events, comparing reconstructed with true neutrino energy for different interaction types to find where measurement uncertainties bite hardest, and how to avoid them.",
    tags: ["Neutrino Physics", "DUNE", "Data Analysis"],
    techStack: ["ROOT (C++)", "CAFAna", "GENIE simulation"],
    repoUrl: "https://github.com/paolominhas/CPV-DUNE-ND",
    resources: [
      { label: "Senior Honours report (PDF)", href: "https://github.com/paolominhas/CPV-DUNE-ND/blob/main/SeniorHonoursReport.pdf" },
    ],
    content: `
      <p>DUNE wants to know whether neutrinos and antineutrinos oscillate differently (CP violation), one of the clues to why the universe is made of matter. The measurement compares what a far detector sees with what the beam was <em>before</em> it oscillated, and that prediction is only as good as the near detector's grasp of the beam, the cross-sections and its own energy reconstruction. This project asked where that reconstruction goes wrong.</p>
      <h2>What I did</h2>
      <ul>
        <li>Analysed GENIE-simulated events for the liquid-argon (ND-LAr) and high-pressure gas (ND-GAr) near detectors, in both neutrino-rich (FHC) and antineutrino-rich (RHC) beams, using the DUNE analysis framework CAFAna and ROOT macros.</li>
        <li>Plotted the beam's energy spectra and separated events by interaction type: quasi-elastic, resonant, deep-inelastic and meson-exchange (MEC).</li>
        <li>Compared three ways of reconstructing the neutrino energy (the simulation's reconstruction, an energy-conservation sum, and the quasi-elastic formula) against the true energy, interaction by interaction.</li>
      </ul>
      <h2>What I found</h2>
      <p>The liquid-argon detector shows large spurious peaks at low reconstructed energy, traced to neutrons that escape without being counted, so the gas detector's low-energy performance is needed alongside it. Selecting events by their <em>final state</em> (for example charged-current with no pions, CC0π) rather than by interaction label gave much better reconstruction, because the final state already includes effects such as two-particle-two-hole interactions and final-state interactions that the label hides. The report notes that the gas detector has since been removed from the baseline design for funding reasons, which makes smarter analysis, not just better hardware, more important.</p>
      <p>The macros are in the repository; the full argument, with every figure, is in the report.</p>
    `,
  },
  {
    slug: "audio-sample-cleaner",
    title: "Audio Sample Cleaner: Denoising in Frequency Space",
    subtitle:
      "A microphone, an Arduino, a Raspberry Pi and a Fourier transform: keeping only the notes that matter.",
    role: "Data handling project, later extended",
    institution: "University of Edinburgh",
    period: "2024",
    summary:
      "Record sound on an Arduino, move it to a Raspberry Pi, transform to frequency space, keep only the spectral peaks, transform back, and listen to the difference.",
    tags: ["Signal Processing", "Fourier Analysis", "Python"],
    techStack: ["Python", "NumPy / SciPy", "Arduino", "Raspberry Pi"],
    repoUrl: "https://github.com/paolominhas/audio-sample-cleaner",
    // TODO(paolo): write the piece (see PHYSICS-AND-WEB-PLAN.md, Block 4), then delete this line to publish.
    draft: true,
    content: `
      <p>TODO(paolo): one paragraph on why a note is a few sharp spikes in frequency space and noise is the grass between them.</p>
    `,
  },
];

export function isPublished(project: ResearchProject): boolean {
  return !project.draft || process.env.NODE_ENV !== "production";
}

export function visibleResearchProjects(): ResearchProject[] {
  return researchProjects.filter(isPublished);
}

export function getResearchProject(slug: string) {
  return researchProjects.find((p) => p.slug === slug);
}
