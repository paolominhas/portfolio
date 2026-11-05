/**
 * WEB SUBDOMAIN DATA
 *
 * Single source of truth for web.paolo.org.uk. Previously this file
 * existed but wasn't actually imported anywhere — `web/page.tsx` and
 * `web/portfolio/page.tsx` each hardcoded their own copies of the
 * project list. Consolidated here so there's one place to edit.
 */

export interface Service {
  title: string;
  description: string;
  tags: string[];
}

export const services: Service[] = [
  {
    title: "Websites & web apps",
    description:
      "End-to-end builds on Next.js — from marketing sites to content-managed platforms with custom admin tooling.",
    tags: ["Next.js", "TypeScript", "Keystatic / headless CMS"],
  },
  {
    title: "Redesigns & migrations",
    description:
      "Moving a site off WordPress or Create React App without losing SEO, content, or your sanity.",
    tags: ["Astro", "App Router migration", "Content modelling"],
  },
  {
    title: "Deployment & ongoing support",
    description:
      "Docker, Caddy/nginx, CI/CD, and the less glamorous work of keeping a site fast, secure, and online.",
    tags: ["Docker", "GitHub Actions", "DigitalOcean"],
  },
];

export interface ProcessStep {
  title: string;
  description: string;
  /**
   * Short chip labels shown when a step is expanded — the concrete
   * tools/deliverables behind the one-line description. Optional so a
   * step can stay simple if it doesn't need the detail.
   */
  details?: string[];
}

export const process: ProcessStep[] = [
  {
    title: "Discover",
    description:
      "A short call to understand what the site actually needs to do — and, just as importantly, what it doesn't.",
    details: ["Goals & key metrics", "Competitor scan", "Keyword research"],
  },
  {
    title: "Design",
    description:
      "A distinct visual direction grounded in the subject, not a generic template with a new logo dropped in.",
    details: [
      "Photoshop & Illustrator hand-off",
      "Lightweight, scalable vector graphics",
      "Hand-drawn/illustrated sites, working with a designer",
    ],
  },
  {
    title: "Build",
    description:
      "Typed, componentised, and version-controlled from the first commit — built to be handed off or extended later.",
    details: [
      "Stripe checkout & ticketing",
      "Other payment providers on request",
      "Typed, componentised code",
    ],
  },
  {
    title: "Launch & support",
    description:
      "Deployed with CI/CD behind me, and available afterwards for the inevitable content tweak or feature request.",
    details: ["CI/CD deploy", "Carbon & performance monitoring", "Ongoing edits & feature requests"],
  },
];

/**
 * "How we work" — the four pillars behind every build, rewritten from a
 * single stream-of-consciousness paragraph into distinct, ordered ideas.
 * Rendered by <HowWeWorkShowcase />.
 */
export interface WorkPillar {
  icon: "target" | "wand" | "leaf" | "search";
  title: string;
  description: string;
  /** Example search terms — only used by the "target" pillar. */
  searchTerms?: string[];
}

export const workPillars: WorkPillar[] = [
  {
    icon: "target",
    title: "Start with the goal",
    description:
      "Before any design work happens, we find the number that actually matters — more people finding you for “concerts near me”, more tickets sold, more sign-ups. Everything on the site channels toward that number, and we set up the analytics to prove it's moving.",
    searchTerms: ["concerts near me", "charity shops in Glasgow", "translations of Homer"],
  },
  {
    icon: "wand",
    title: "Built to be managed",
    description:
      "The build itself moves quickly, and once it's live, running the site is just as easy. Swap a photo, add a concert date, update a price — through a simple editor, no code and no previous experience required.",
  },
  {
    icon: "leaf",
    title: "Efficient by design",
    description:
      "Every site is kept as lightweight as possible, which pays off twice: pages load fast, and they use less energy doing it. You can see this page's live score in the footer below — we're also happy to point you toward greener hosting. None of that comes at the cost of accessibility.",
  },
  {
    icon: "search",
    title: "Found however people search",
    description:
      "We optimise for Google the traditional way, and for the newer generation of AI answer engines — so whether someone types a query into a search bar or asks an AI assistant to find a concert near them, your site is what comes back.",
  },
];

export const techStack: string[] = [
  "TypeScript",
  "Next.js",
  "React",
  "Astro",
  "Tailwind CSS",
  "Docker",
  "Caddy / nginx",
  "GitHub Actions",
  "PostgreSQL",
  "Python",
];

export interface WebProject {
  slug: string;
  title: string;
  description: string;
  outcome: string;
  url: string;
  image: string;
  /**
   * A couple of real screenshots of the live site, cycled on click by
   * <SitePreview />. Falls back to just `[image]` if omitted. Drop
   * files into /public/images/web/ — until they exist the component
   * shows a branded placeholder instead of a broken image.
   */
  images?: string[];
  /** Fake-browser-chrome bar colour for <SitePreview />, matching the site's own palette. */
  chromeColor: string;
  tags: string[];
  /**
   * Path of an on-site case study (e.g. "/portfolio/euco-tickets"). When set,
   * the card links to it and the live site becomes a secondary link.
   */
  caseStudy?: string;
  /** Draft case studies are hidden from the grid in production. */
  caseStudyDraft?: boolean;
  /** Marks example/placeholder entries so they're easy to find and swap for real case studies. */
  placeholder?: boolean;
  content: string;
}

export const webProjects: WebProject[] = [
  {
    slug: "euco-website",
    title: "EUCO Website: a CMS for a Student Orchestra",
    description:
      "The Edinburgh University Chamber Orchestra's main website, rebuilt on Astro and run by a changing committee of volunteers through a Directus CMS with roles, drafts and a publish button that rebuilds the site.",
    outcome: "Built for a committee that changes every year. Write-up in progress: mostly about the Directus CMS.",
    url: "https://www.eu-co.co.uk",
    image: "/images/web/euco.jpg",
    images: ["/images/web/euco-1.jpg", "/images/web/euco-2.jpg", "/images/web/euco-3.jpg"],
    chromeColor: "#4A1420",
    tags: ["Astro", "Directus", "PostgreSQL", "Docker"],
    caseStudy: "/portfolio/euco-website",
    caseStudyDraft: true,
    content: "",
  },
  {
    slug: "diorama-consulting",
    title: "Diorama Consulting: Off WordPress, Into Docker",
    description:
      "An AI advisory firm's site, moved off WordPress onto Astro and joined to prebuilt web apps (CMS, analytics, contact service, chatbot) as Docker containers behind one domain, with the old site's images and content migrated across.",
    outcome: "Extensive dockerisation, a clean migration, and a site the client can edit. Write-up in progress.",
    url: "https://dioramaconsulting.co.uk",
    image: "/images/web/diorama.jpg",
    images: ["/images/web/diorama-1.jpg", "/images/web/diorama-2.jpg", "/images/web/diorama-3.jpg"],
    chromeColor: "#0F172A",
    tags: ["Astro", "Docker", "Keystatic CMS", "PostHog"],
    caseStudy: "/portfolio/diorama-consulting",
    caseStudyDraft: true,
    content: "",
  },
  {
    slug: "euco-tickets",
    title: "EUCO Tickets (tickets.eu-co.co.uk)",
    description:
      "A standalone ticketing site for EUCO concerts, separate from the orchestra's main website: Stripe payments, HMAC-signed QR tickets and an offline-capable door app, with an interactive write-up where you can try to forge a ticket.",
    outcome: "Live Stripe ticket sales and QR check-in at the door. Read the case study.",
    url: "https://tickets.eu-co.co.uk",
    image: "/images/web/euco-tickets.jpg",
    chromeColor: "#101585",
    tags: ["FastAPI", "PostgreSQL", "Stripe", "Astro", "Docker"],
    caseStudy: "/portfolio/euco-tickets",
    content: "",
  },
  {
    slug: "euco-education",
    title: "EUCO Education Hub (edu.eu-co.co.uk)",
    description:
      "The orchestra's education site: a concert archive and programme-notes reader. This write-up sets out how I want to enrich it with open music APIs and larger datasets while keeping the site itself lightweight.",
    outcome: "A proposal and design rather than a finished build. Write-up in progress.",
    url: "https://edu.eu-co.co.uk",
    image: "/images/web/euco-education.jpg",
    chromeColor: "#1E3A5F",
    tags: ["Next.js", "Open APIs", "Static generation", "pdf.js"],
    caseStudy: "/portfolio/euco-education",
    caseStudyDraft: true,
    content: "",
  },
];

export interface Tutorial {
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  date: string;
  tags: string[];
  content: string;
}

export const tutorials: Tutorial[] = [
  {
    slug: "nextjs-setup",
    title: "Next.js App Router: The Foundation",
    description: "Setting up a robust architecture from scratch.",
    difficulty: "beginner",
    date: "Oct 12, 2023",
    tags: ["Node.js", "npm", "Next.js"],
    content: "",
  },
  {
    slug: "framer-motion",
    title: "Fluid Interface Animation",
    description: "Mastering Framer Motion for editorial layouts.",
    difficulty: "intermediate",
    date: "Nov 04, 2023",
    tags: ["Framer Motion", "Animation"],
    content: "",
  },
  {
    slug: "cms-integration",
    title: "Headless CMS Integration",
    description: "Connecting a headless CMS to a static frontend.",
    difficulty: "advanced",
    date: "Jan 18, 2024",
    tags: ["CMS", "Astro", "Content modelling"],
    content: "",
  },
];

