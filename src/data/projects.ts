/**
 * PORTFOLIO PROJECTS
 * ─────────────────────────────────────────────────────────────────
 * The four physics research projects that used to live here
 * (hibeam/ppss/globes/dune-nd) have moved to
 * physics.paolo.org.uk/research/** — see src/data/research.ts. That's
 * their real home now: richer physics-specific detail pages, in the
 * physics subdomain's actual design system, without duplicating
 * content in two places.
 *
 * MPhys stays represented here as a single card (`external` set), so
 * it's still visible from the main portfolio project list — it just
 * routes straight out to the physics site instead of rendering a
 * portfolio-hosted detail page. `projects/[slug]/page.tsx` skips
 * `external` entries in `generateStaticParams`, since there's no
 * internal detail page to build for them.
 *
 * The other three entries are real non-physics project write-ups —
 * web development, print/graphic design, and event production —
 * replacing the old physics stubs so /projects actually represents
 * the breadth of what gets built here.
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  content: string; // HTML — ignored for `external` entries
  image: string;
  excerpt: string;
  /** If set, the card links straight out to this URL instead of /projects/[slug]. */
  external?: string;
}

export const projects: Project[] = [
  {
    id: 'mphys',
    title: 'MPhys Thesis — HIBEAM Prototype TPC',
    slug: 'mphys',
    description:
      "dE/dx analysis of the prototype Time Projection Chamber for the HIBEAM experiment at ESS (Lund, SE) — Geant4 simulation benchmarked against beam-test data from IFJ PAN, Kraków.",
    techStack: ['Geant4', 'ROOT (C++)', 'Python', 'React Three Fiber'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "The full write-up — including an interactive 3D detector explorer and a live collision simulation — now lives on the physics site.",
    content: '',
    external: 'https://physics.paolo.org.uk/research/mphys',
  },
  {
    id: 'web-development',
    title: 'Web Development & Digital Infrastructure',
    slug: 'web-development',
    description:
      'Freelance full-stack work for Diorama Consulting and the Edinburgh University Chamber Orchestra — Astro 5, Tailwind v4, Directus/FastAPI/PostgreSQL, containerised and deployed on DigitalOcean.',
    techStack: ['Astro', 'Next.js', 'Tailwind CSS', 'Directus', 'FastAPI', 'Docker', 'GitHub Actions'],
    image: '/images/root-project-thumbnail.jpg',
    excerpt:
      "End-to-end builds: a headless CMS backend, containerised deployment pipeline, and a from-scratch redesign of EUCO's public site.",
    content: `
      <p>Alongside physics research, I do freelance full-stack web development — most substantially for Diorama Consulting (an AI technology advisory firm) and for the Edinburgh University Chamber Orchestra's own public-facing site.</p>
      <h2>The stack</h2>
      <p>Both projects share a similar architecture: an Astro 5 frontend for fast, mostly-static pages, Tailwind CSS v4 for styling, and a Directus CMS backed by FastAPI and PostgreSQL for structured content that non-technical committee members can edit without touching code. Everything is containerised with Docker, served behind nginx and Cloudflare, and deployed to a DigitalOcean droplet via GitHub Actions CI/CD.</p>
      <h2>What that looked like in practice</h2>
      <p>For EUCO specifically: a full Directus CMS integration (schema design, bulk data import), image and SVG asset optimisation, a glassmorphism header with animated dropdown navigation, and a sponsor parallax banner — plus a three-hourly static-rebuild cron so committee-edited content goes live without a manual redeploy.</p>
      <p>For Diorama: DevOps work migrating the domain from WordPress to a Dockerised Astro + Caddy stack, a hero carousel and admin suite, a Keystatic CMS overhaul, PostHog analytics, and a FastAPI + SQLite + Resend contact-form backend.</p>
    `,
  },
  {
    id: 'concert-design',
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
