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
    title: 'EUCO Tickets — Stripe, Signed QR Tickets & an Offline Door App',
    slug: 'euco-ticketing',
    description:
      "Ticketing for a student orchestra: Stripe payments, HMAC-signed QR tickets and an offline-capable door app, with an interactive write-up where you can try to forge a ticket.",
    techStack: ['FastAPI', 'PostgreSQL', 'Stripe', 'Astro', 'Directus'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "The orchestra's box office was entirely manual — cash, a paper list, no way to sell ahead of the night. This replaced it end to end.",
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
    title: 'Diorama Consulting — WordPress to Astro, Dockerised',
    slug: 'diorama-consulting',
    description:
      "A containerised Astro rebuild for an AI advisory firm: migrated off WordPress, with a headless CMS, analytics and a custom admin.",
    techStack: ['Astro', 'Docker', 'Caddy', 'Keystatic'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "Moving a live business site off WordPress without losing its search ranking or its editors.",
    content: '',
    external: `${WEB}/diorama-consulting`,
    draft: true, // TODO(paolo): remove once the page is written
  },
  {
    id: 'directus-cms',
    category: 'web',
    title: 'Giving a Student Society Its Own CMS (Directus)',
    slug: 'directus-cms',
    description:
      "How a Directus CMS runs the EUCO website: a few dozen collections, roles per committee post, custom dashboards, and a publish button that rebuilds the site.",
    techStack: ['Directus', 'PostgreSQL', 'Vue extensions', 'GitHub Actions'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "Designing a CMS for people who change every year, and the failure modes that taught me what to automate.",
    content: '',
    external: `${WEB}/directus-cms`,
    draft: true, // TODO(paolo): remove once the article is written
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
