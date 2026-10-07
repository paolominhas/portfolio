/**
 * RESEARCH PROJECTS
 * ─────────────────────────────────────────────────────────────────
 * The projects behind physics.paolo.org.uk/research. Metadata
 * for all of them lives here (used by the /research index grid), but
 * only the non-bespoke ones route through the generic `research/[slug]/page.tsx`
 * template — `mphys` has its own bespoke route tree
 * (`research/mphys/**`) because it carries real interactive content
 * (a 3D globe, a detector-geometry explorer, a live collision
 * canvas) that doesn't fit a text-only template, and `option-pricing`
 * likewise (`research/option-pricing/`: an in-browser pricing playground).
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
   * True for entries with their own route folder (mphys, option-pricing) — the
   * [slug] template skips them. The index card links to /research/<slug> either way.
   */
  bespokeRoute?: boolean;
  /**
   * Draft entries are hidden from the index and 404 in production, but still
   * render under `next dev` so you can preview them. Flip to false (or delete
   * the line) to publish.
   */
  draft?: boolean;
  /** Optional link to the source repo; the bespoke page shows a "View the code" link only when set. */
  repoUrl?: string;
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
    title: "Charmed Λ Baryon Decays (LHCb)",
    subtitle:
      "Boosted-decision-tree signal/background separation for charmed lambda baryon decay channels.",
    role: "PPSS summer internship",
    institution: "Institute of Nuclear Physics, Polish Academy of Sciences (IFJ PAN), Kraków",
    period: "Summer 2026",
    summary:
      "Working with Prof. Dr hab. Mariusz Witek's group on the LHCb collaboration, building an XGBoost-based classifier to separate genuine charmed Λ baryon decay signal from combinatorial background.",
    tags: ["LHCb", "Flavour Physics", "Machine Learning"],
    techStack: ["ROOT", "Python", "XGBoost"],
    content: `
      <p>The PPSS (Programme for Polish Summer Studentships) placed this project inside the LHCb collaboration's charm-physics effort, under Prof. Dr hab. Mariusz Witek at IFJ PAN in Kraków — one of LHCb's home institutes and a major contributor to the experiment's tracking and physics-analysis software.</p>
      <p>Charmed Λ baryon decays are a useful probe of both the strong-interaction dynamics that bind quarks into baryons and, in some channels, of CP violation in the charm sector — but the genuine signal sits under a large combinatorial background from unrelated tracks that happen to reconstruct into a similar invariant mass. Separating the two by hand-tuned cuts alone leaves signal on the table; a multivariate classifier does better.</p>
      <p>The core of the project was building and validating a Boosted Decision Tree (via XGBoost) trained on kinematic and vertex-quality variables from ROOT ntuples, to assign each candidate decay a signal-likeness score rather than a hard pass/fail cut — the standard approach for squeezing more usable signal out of LHCb data without inflating the background.</p>
    `,
  },
  {
    slug: "globes",
    title: "GLoBES Simulations of DUNE Detectors",
    subtitle:
      "Oscillation-sensitivity studies for DUNE detector configurations using the GLoBES simulator.",
    role: "Research project",
    institution: "University of Edinburgh",
    period: "2025",
    summary:
      "Using the General Long Baseline Experiment Simulator (GLoBES) to model neutrino oscillation sensitivity for different DUNE detector configurations — how far-detector design choices affect what the experiment can actually measure.",
    tags: ["Neutrino Physics", "DUNE", "Simulation"],
    techStack: ["GLoBES", "C", "Python"],
    content: `
      <p>DUNE (the Deep Underground Neutrino Experiment) measures neutrino oscillations by comparing a near detector close to the beam source with a far detector 1,300 km away in South Dakota. What the experiment can ultimately say about oscillation parameters — mass splittings, mixing angles, CP violation in the lepton sector — depends heavily on detector configuration choices made long before any data is taken.</p>
      <p>GLoBES (the General Long Baseline Experiment Simulator) is the standard tool the neutrino community uses to answer "what would we actually be able to measure" questions like this ahead of time: it takes a beam spectrum, detector response, and systematic-error model, and propagates them through to statistical sensitivity on the oscillation parameters.</p>
      <p>This project used GLoBES to compare sensitivity outcomes across candidate DUNE far-detector configurations, quantifying the trade-offs between design choices in terms of what they'd cost or gain in oscillation-measurement precision.</p>
    `,
  },
  {
    slug: "dune-nd",
    title: "Data Analysis of the DUNE Near Detector",
    subtitle:
      "ROOT-based analysis of near-detector data from the DUNE experiment.",
    role: "Dissertation project", // NOTE: confirm exact degree-level attribution (BSc/MSc) with Paolo before publishing
    institution: "University of Edinburgh",
    period: "2025–2026",
    summary:
      "Analysis of near-detector data from DUNE using ROOT — characterising near-detector event samples as a cross-check against the physics assumptions that far-detector oscillation measurements depend on.",
    tags: ["Neutrino Physics", "DUNE", "Data Analysis"],
    techStack: ["ROOT (C++)", "Python"],
    content: `
      <p>The near detector in a long-baseline experiment like DUNE sits close enough to the beam source that it sees a huge, largely un-oscillated neutrino flux — its job isn't to see oscillations directly, but to pin down the un-oscillated flux, cross sections, and detector response precisely enough that the far-detector's oscillated sample can be interpreted with confidence.</p>
      <p>This project worked directly with near-detector event data in ROOT, building the reconstruction and characterisation pipeline needed to turn raw event samples into the kind of well-understood inputs a full oscillation analysis depends on.</p>
      <p><em>Fuller write-up in progress — this page currently covers the scope and toolchain; results and figures to follow.</em></p>
    `,
  },
  {
    slug: "option-pricing",
    title: "Option Pricing Lab: Black–Scholes, Monte Carlo and Greeks",
    subtitle:
      "Pricing European options three ways in Python, with an interactive playground that shows how each method responds when the conditions change.",
    role: "Independent learning project",
    institution: "Self-directed",
    period: "2026",
    summary:
      "A small Python library that prices European options by the Black–Scholes closed form and by Monte Carlo, then estimates the Greeks by bump-and-reprice, with an interactive in-browser playground and tests that check each method against the others.",
    tags: ["Monte Carlo", "Quantitative Finance", "Python"],
    techStack: ["Python", "NumPy", "SciPy", "TypeScript", "Recharts"],
    content: "", // rendered by the bespoke page, not this template
    bespokeRoute: true,
    // TODO(paolo): set repoUrl once the GitHub repo exists, then set draft to false to publish.
    repoUrl: "https://github.com/paolominhas/option-pricer",
    draft: false,
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
