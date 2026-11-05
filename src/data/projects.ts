/**
 * PORTFOLIO PROJECTS
 * ─────────────────────────────────────────────────────────────────
 * One card per project on paolo.org.uk/projects. Most projects now live on
 * the subdomain that suits them, and the card here just points there
 * (`external` set), the way MPhys always has:
 *
 *   physics.paolo.org.uk/research/**   MPhys, the two internships, the senior
 *                                      honours project (see src/data/research.ts)
 *   web.paolo.org.uk/portfolio/**      EUCO Tickets, Diorama, the Directus article
 *                                      (see src/data/web-data.ts)
 *
 * `projects/[slug]/page.tsx` does not build a detail page for `external`
 * entries; it redirects /projects/<slug> to the external URL, so any old link
 * keeps working. Only entries without `external` (the print-design and
 * concert-production write-ups below) render a page here.
 *
 * Categories (CATEGORIES below) drive the filter chips on /projects. A project
 * belongs to exactly one. Option pricing is 'quant', not 'physics': it is
 * quantitative finance, so it lives on this site, not under physics research.
 *
 * Flags
 *   draft   shown on the index and sitemap only under `next dev`, so a card can
 *           exist before the page behind it is written.
 *   hidden  never shown on the index or sitemap; kept purely so an old URL
 *           redirects (web-development, which was split into case studies).
 */

export type ProjectCategory = 'physics' | 'web' | 'quant' | 'music';

export const CATEGORIES: { id: ProjectCategory; label: string; blurb: string }[] = [
  { id: 'physics', label: 'Physics', blurb: 'Detectors, neutrinos, flavour physics and signal processing' },
  { id: 'web', label: 'Web & software', blurb: 'Sites, platforms and the infrastructure behind them' },
  { id: 'quant', label: 'Finance & quant', blurb: 'Pricing, simulation and numerical methods' },
  { id: 'music', label: 'Music & events', blurb: 'Design, production and fundraising for a student orchestra' },
];

export interface Project {
  id: string;
  category: ProjectCategory;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  content: string; // HTML — ignored for `external` entries
  image: string;
  excerpt: string;
  /** If set, the card links straight out to this URL and /projects/<slug> redirects there. */
  external?: string;
  draft?: boolean;
  hidden?: boolean;
}

const PHYSICS = 'https://physics.paolo.org.uk/research';
const WEB = 'https://web.paolo.org.uk/portfolio';

export const projects: Project[] = [
  {
    id: 'euco-ticketing',
    category: 'web',
    title: 'EUCO Tickets (tickets.eu-co.co.uk): Stripe, Signed QR Tickets & an Offline Door App',
    slug: 'euco-ticketing',
    description:
      "A standalone ticketing site for EUCO concerts, separate from the orchestra's main website: Stripe payments, HMAC-signed QR tickets and an offline-capable door app, with an interactive write-up where you can try to forge a ticket.",
    techStack: ['FastAPI', 'PostgreSQL', 'Stripe', 'Astro', 'Directus'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "The orchestra's box office was entirely manual: cash, a paper list, no way to sell ahead of the night. This replaced it end to end.",
    content: '',
    external: `${WEB}/euco-tickets`,
  },
  {
    id: 'mphys',
    category: 'physics',
    title: 'MPhys Thesis — HIBEAM Prototype TPC',
    slug: 'mphys',
    description:
      "dE/dx analysis of the prototype Time Projection Chamber for the HIBEAM experiment at ESS (Lund, SE) — Geant4 simulation benchmarked against beam-test data from IFJ PAN, Kraków.",
    techStack: ['Geant4', 'ROOT (C++)', 'Python', 'React Three Fiber'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "The full write-up — including an interactive 3D detector explorer and a live collision simulation — now lives on the physics site.",
    content: '',
    external: `${PHYSICS}/mphys`,
  },
  {
    id: 'grover',
    category: 'physics',
    title: "Grover's Algorithm on IBM Quantum",
    slug: 'grover',
    description:
      "Quantum search built by hand in Qiskit and tested against the closed-form theory, with an interactive stepper and results from an ideal run, a noisy simulation and (once run) real IBM hardware.",
    techStack: ['Python', 'Qiskit', 'Qiskit IBM Runtime', 'GitHub Actions'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "A quadratic speed-up in theory; what happens to it when real gates are noisy.",
    content: '',
    external: `${PHYSICS}/grover`,
  },
  {
    id: 'ppss',
    category: 'physics',
    title: 'Lepton-Flavour Violation in Charmed Baryon Decays (LHCb)',
    slug: 'ppss',
    description:
      "An XGBoost event selection and a CLs limit for the forbidden decay Λc⁺ → p e⁻ μ⁺, from a summer internship in the LHCb group at IFJ PAN, Kraków.",
    techStack: ['Python', 'XGBoost', 'ROOT / RooFit', 'zfit'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "Digging a decay that the Standard Model forbids out of an overwhelming background, and then saying how rare it must be.",
    content: '',
    external: `${PHYSICS}/ppss`,
  },
  {
    id: 'globes',
    category: 'physics',
    title: 'Sterile-Neutrino Sensitivity at DUNE (GLoBES)',
    slug: 'globes',
    description:
      "Recreating DUNE's published oscillation sensitivities in GLoBES, then adding a sterile neutrino and a smeared near detector to see why the near detector matters.",
    techStack: ['GLoBES', 'C', 'SNU library', 'Python'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "A summer project on what the DUNE experiment will be able to tell us about a hypothetical fourth neutrino, before any data exists.",
    content: '',
    external: `${PHYSICS}/globes`,
  },
  {
    id: 'dune-nd',
    category: 'physics',
    title: 'DUNE Near Detector: CP-Violation Uncertainties',
    slug: 'dune-nd',
    description:
      "Senior Honours project on simulated DUNE near-detector events: where reconstructed neutrino energy can and can't be trusted, and how to avoid the worst of it.",
    techStack: ['ROOT (C++)', 'CAFAna', 'GENIE'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "Why choosing events by their final state beats choosing them by interaction type, and what escaping neutrons do to an energy spectrum.",
    content: '',
    external: `${PHYSICS}/dune-nd`,
  },
  {
    id: 'diorama-consulting',
    category: 'web',
    title: 'Diorama Consulting: Off WordPress, Into Docker',
    slug: 'diorama-consulting',
    description:
      "An AI advisory firm's site moved off WordPress onto Astro and joined to prebuilt web apps (CMS, analytics, contact service, chatbot) as Docker containers behind one domain, with the old images and content migrated.",
    techStack: ['Astro', 'Docker', 'Keystatic', 'PostHog'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "Moving a live business site off WordPress without losing its content, images or search ranking, and running the rest as containers.",
    content: '',
    external: `${WEB}/diorama-consulting`,
    draft: true, // TODO(paolo): remove once the page is written
  },
  {
    id: 'euco-website',
    category: 'web',
    title: 'EUCO Website: a Directus CMS for a Student Orchestra',
    slug: 'euco-website',
    description:
      "The orchestra's main website on Astro, run by a changing committee through a Directus CMS with roles, drafts and a publish button that rebuilds the site.",
    techStack: ['Astro', 'Directus', 'PostgreSQL', 'Docker'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "Designing a CMS for people who change every year, and the failure modes that taught me what to automate.",
    content: '',
    external: `${WEB}/euco-website`,
    draft: true, // TODO(paolo): remove once the page is written
  },
  {
    id: 'euco-education',
    category: 'web',
    title: 'EUCO Education Hub (edu.eu-co.co.uk): Open APIs, Lightweight Site',
    slug: 'euco-education',
    description:
      "The orchestra's education site and my plan to enrich it with open music APIs and larger datasets while keeping the site itself lightweight.",
    techStack: ['Next.js', 'Open APIs', 'Static generation', 'pdf.js'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "How to use big public datasets without shipping a big website: ingest at build time, ship static pages.",
    content: '',
    external: `${WEB}/euco-education`,
    draft: true, // TODO(paolo): remove once the page is written
  },
  {
    id: 'option-pricing',
    category: 'quant',
    title: 'Option Pricing Lab: Black–Scholes, Monte Carlo and Greeks',
    slug: 'option-pricing',
    description:
      'Pricing European options three ways in Python, with an in-browser playground that shows how each method responds when the market changes.',
    techStack: ['Python', 'NumPy / SciPy', 'TypeScript', 'Recharts'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      'Closed form, Monte Carlo and bump-and-reprice Greeks, each checked against the others.',
    content: '', // rendered by the bespoke page at (portfolio)/projects/option-pricing
  },
  {
    id: 'audio-sample-cleaner',
    category: 'physics',
    title: 'Audio Sample Cleaner: Denoising in Frequency Space',
    slug: 'audio-sample-cleaner',
    description:
      'Record sound on an Arduino, transform it with a Fourier transform, keep only the spectral peaks, and listen to the difference.',
    techStack: ['Python', 'NumPy / SciPy', 'Arduino', 'Raspberry Pi'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt: 'A note is a few sharp spikes in frequency space; noise is the grass between them.',
    content: '',
    external: `${PHYSICS}/audio-sample-cleaner`,
    draft: true, // TODO(paolo): remove together with `draft` in research.ts once written
  },
  {
    id: 'hibeam',
    category: 'physics',
    title: 'What is HIBEAM?',
    slug: 'hibeam',
    description: 'Moved to physics.paolo.org.uk/hibeam.',
    techStack: [],
    image: '/images/root-project-thumbnail.jpg',
    excerpt: 'Moved to physics.paolo.org.uk/hibeam.',
    content: '',
    external: 'https://physics.paolo.org.uk/hibeam',
    hidden: true, // kept so any old /projects/hibeam link still lands on the explainer
  },
  {
    id: 'web-development',
    category: 'web',
    title: 'Web Development & Digital Infrastructure',
    slug: 'web-development',
    description: 'Moved to web.paolo.org.uk.',
    techStack: [],
    image: '/images/root-project-thumbnail.jpg',
    excerpt: 'Moved to web.paolo.org.uk.',
    content: '',
    external: WEB,
    hidden: true, // kept so /projects/web-development still redirects
  },
  {
    id: 'concert-design',
    category: 'music',
    title: 'Concert Programme & Ticket Design',
    slug: 'concert-design',
    description:
      'Print and graphic design for EUCO concerts — programmes, tickets, and promotional materials for a full concert season.',
    techStack: ['Graphic Design', 'Print Production', 'Typography'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "Programme notes, ticket layouts, and promotional design for a student chamber orchestra's concert season.",
    content: `
      <p>Every EUCO concert needs a programme audiences can actually follow and tickets that look like they belong to a professional-feeling event, not a hastily-assembled student one. This covers the full print-design side of concert production: programme layout and typesetting (including editing and formatting programme notes), ticket design, and promotional materials used across the season.</p>
      <p>The goal throughout was consistency — a visual identity that carried across posters, tickets, and programmes for a given concert, so the whole evening felt designed rather than assembled from whatever was on hand.</p>
    `,
  },
  {
    id: 'concert-production',
    category: 'music',
    title: 'Concert Production & Fundraising Leadership',
    slug: 'concert-production',
    description:
      'Technical and events leadership for EUCO — organising concerts end-to-end, fundraising, and multicam concert-video production.',
    techStack: ['Event Production', 'Team Leadership', 'Final Cut Pro', 'Multicam Editing'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      'Running concerts from planning through to the edited multicam video release, plus fundraising to keep the orchestra funded.',
    content: `
      <p>Beyond the orchestra's digital infrastructure, I've held a technical and events leadership role within EUCO — organising concerts end-to-end (venue logistics, scheduling, on-the-night technical setup) and leading fundraising efforts to keep a student-run orchestra financially sustainable.</p>
      <h2>Multicam video production</h2>
      <p>Concerts are filmed on a 5-angle multicam setup and edited in Final Cut Pro into a released concert video — sync, cutting between angles, colour, and export, working within the storage and RAM constraints of doing that edit on a laptop rather than a dedicated editing workstation.</p>
      <p>I also produced a full committee handover document covering both the non-technical side of the role (event planning, fundraising relationships) and the technical infrastructure a successor would need to maintain (Docker, nginx, GitHub Actions, Directus workflows).</p>
    `,
  },
];

/** Projects to show on the index and in the sitemap (drafts only under `next dev`, hidden never). */
export function visibleProjects(): Project[] {
  return projects.filter(
    (p) => !p.hidden && (!p.draft || process.env.NODE_ENV !== 'production')
  );
}
