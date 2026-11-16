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
  /** What kind of piece of work this is; drives the type chips and the kicker on the cards. */
  kind?: "Thesis" | "Internship" | "Summer project" | "Senior honours" | "Coursework" | "Personal";
  /** Optional path to a real image (e.g. "/images/mphys/tpc.jpg") to use as the card cover instead of the generated artwork. */
  image?: string;
  /** Show as the large lead card at the top of /research (use on one entry). */
  spotlight?: boolean;
  /** Up to three short bullet points for the lead card. */
  highlights?: string[];
  /** Optional link to the source repo; both the bespoke and generic pages show a "View the code" link when set. */
  repoUrl?: string;
  /** Optional extra links (report, poster, slides) shown under the write-up on the generic page. */
  resources?: { label: string; href: string }[];
}

export const researchProjects: ResearchProject[] = [
  {
    slug: "mphys",
    kind: "Thesis",
    spotlight: true,
    highlights: [
      "Geant4 simulation benchmarked against IFJ PAN beam-test data",
      "Interactive 3D detector-geometry explorer",
      "Live collision visualisation",
    ],
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
    slug: "grover",
    kind: "Personal",
    title: "Grover's Algorithm on IBM Quantum",
    subtitle:
      "Quantum search built by hand in Qiskit, checked against the theory, and run ideally, in a noisy simulation and on real hardware.",
    role: "Personal project",
    institution: "Independent",
    period: "2026",
    summary:
      "Grover's search algorithm in Qiskit with an interactive stepper (oracle, diffuser, the success-probability curve) and an honest look at what noise does to it on today's IBM devices.",
    tags: ["Quantum Computing", "Qiskit", "Algorithms"],
    techStack: ["Python", "Qiskit", "Qiskit Aer", "Qiskit IBM Runtime", "GitHub Actions"],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
  },
  {
    slug: "ppss",
    kind: "Internship",
    title: "Searching for Lepton-Flavour Violation in Charmed Baryon Decays",
    subtitle:
      "A machine-learning event selection and a CLs limit for the forbidden decay Λc⁺ → p e⁻ μ⁺, using LHCb data.",
    role: "Summer internship",
    institution: "Institute of Nuclear Physics, Polish Academy of Sciences (IFJ PAN), Kraków",
    period: "Summer 2025",
    summary:
      "Working with Prof. Mariusz Witek's LHCb group, I built an XGBoost event selection to dig a lepton-flavour-violating charmed-baryon decay out of an overwhelming combinatorial background, then worked through a preliminary statistical limit on its rate. The page is an interactive report with live toys, real figures and my day-by-day notes.",
    tags: ["LHCb", "Flavour Physics", "Machine Learning"],
    techStack: ["Python", "XGBoost", "ROOT / RooFit", "zfit", "uproot"],
    repoUrl: "https://github.com/paolominhas/PPSS-IFJ-PAN-Summer-Internship-2025",
    resources: [
      { label: "Final presentation (PDF)", href: "https://github.com/paolominhas/PPSS-IFJ-PAN-Summer-Internship-2025/blob/main/FinalProjectPresentation.pdf" },
      { label: "Project notes (PDF)", href: "https://github.com/paolominhas/PPSS-IFJ-PAN-Summer-Internship-2025/blob/main/ProjectNotes.pdf" },
    ],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
  },
  {
    slug: "globes",
    kind: "Summer project",
    title: "Sterile-Neutrino Sensitivity at DUNE with GLoBES",
    subtitle:
      "An interactive look at DUNE's sensitivity to CP violation, the mass ordering and a fourth neutrino, with the near detector.",
    role: "Summer project (Career Development Summer Scholarship)",
    institution: "School of Physics and Astronomy, University of Edinburgh",
    period: "June–July 2025",
    summary:
      "Simulating DUNE's near and far detectors in GLoBES to see how sensitive the experiment is to CP violation, the neutrino mass ordering, and a hypothetical fourth (sterile) neutrino, and why the near detector matters so much for the last of these. The page runs the oscillation physics live and shows the checks made on the work afterwards.",
    tags: ["Neutrino Physics", "DUNE", "Simulation"],
    techStack: ["GLoBES", "C", "SNU library", "Python", "Mathematica"],
    repoUrl: "https://github.com/paolominhas/DUNE-GLoBES-Simulation-Internship-2025",
    resources: [
      { label: "Project report (PDF)", href: "https://github.com/paolominhas/DUNE-GLoBES-Simulation-Internship-2025/blob/main/Report.pdf" },
      { label: "Poster (PDF)", href: "https://github.com/paolominhas/DUNE-GLoBES-Simulation-Internship-2025/blob/main/Poster.pdf" },
    ],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
  },
  {
    slug: "dune-nd",
    kind: "Senior honours",
    title: "DUNE Near Detector: Constraining CP-Violation Uncertainties",
    subtitle:
      "Using simulated near-detector events to find where reconstructed neutrino energy can and can't be trusted.",
    role: "Senior Honours Project",
    institution: "School of Physics and Astronomy, University of Edinburgh",
    period: "2025",
    summary:
      "A ten-week analysis of simulated DUNE near-detector events, comparing reconstructed with true neutrino energy for each interaction type to find where measurement uncertainties bite hardest, and how to avoid them. The page lets you switch the causes of a mis-reconstruction on one at a time, build the final states the analysis cuts on, and browse every result plot.",
    tags: ["Neutrino Physics", "DUNE", "Data Analysis"],
    techStack: ["ROOT (C++)", "CAFAna", "GENIE simulation"],
    repoUrl: "https://github.com/paolominhas/CPV-DUNE-ND",
    resources: [
      { label: "Senior Honours report (PDF)", href: "https://github.com/paolominhas/CPV-DUNE-ND/blob/main/SeniorHonoursReport.pdf" },
    ],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
  },
  {
    slug: "mini-cms",
    kind: "Coursework",
    title: "Building a Mini-CMS in Geant4 and Teaching It to Identify Particles",
    subtitle:
      "A layered detector simulated from scratch, five attempts at telling pions from kaons, and what Cherenkov physics says about why they all landed at 50%.",
    role: "Coursework project (DAML, Project 3)",
    institution: "School of Physics and Astronomy, University of Edinburgh",
    period: "2025–26",
    summary:
      "I added calorimeters, a muon chamber and a RICH to a Geant4 tracker, rebuilt momentum from track curvature, and tried to identify electrons, muons, pions and kaons. Electrons and muons worked; pions and kaons did not, five ways. The page lets you fire particles through the detector, bend a track, and sweep the Cherenkov angle to see why.",
    tags: ["Detector Physics", "Machine Learning", "Simulation"],
    techStack: ["Geant4 (C++)", "Python", "pandas", "scikit-learn"],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
  },
  {
    slug: "exotic-search",
    kind: "Coursework",
    title: "Hunting a 1 TeV Resonance: Square Cuts or a Neural Network?",
    subtitle:
      "Pulling a heavy Higgs-like signal out of 6.8 million background events, and what a fit significance does and does not tell you.",
    role: "Coursework project (DAML, Project 4)",
    institution: "School of Physics and Astronomy, University of Edinburgh",
    period: "2025–26",
    summary:
      "A search for a 1 TeV resonance in simulated collider events: kinematic cuts chosen by eye, a small PyTorch network, and a hypothesis test on the reconstructed mass. The page shows how thin the signal is, lets you build a fake peak out of pure background (mass sculpting), and checks what the quoted 5.6σ and 14.6σ really mean.",
    tags: ["Particle Physics", "Machine Learning", "Data Analysis"],
    techStack: ["Python", "PyTorch", "pandas", "SciPy"],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
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
