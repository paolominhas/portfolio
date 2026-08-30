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
}

export const process: ProcessStep[] = [
  {
    title: "Discover",
    description:
      "A short call to understand what the site actually needs to do — and, just as importantly, what it doesn't.",
  },
  {
    title: "Design",
    description:
      "A distinct visual direction grounded in the subject, not a generic template with a new logo dropped in.",
  },
  {
    title: "Build",
    description:
      "Typed, componentised, and version-controlled from the first commit — built to be handed off or extended later.",
  },
  {
    title: "Launch & support",
    description:
      "Deployed with CI/CD behind me, and available afterwards for the inevitable content tweak or feature request.",
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
  tags: string[];
  /** Marks example/placeholder entries so they're easy to find and swap for real case studies. */
  placeholder?: boolean;
  content: string;
}

export const webProjects: WebProject[] = [
  {
    slug: "diorama-consulting",
    title: "Diorama Consulting",
    description:
      "A streamlined, dockerised rebuild for an AI advisory firm — migrated from WordPress to Astro with a headless CMS.",
    outcome: "Custom design system, CMS-managed case studies, containerised deploy.",
    url: "https://dioramaconsulting.co.uk",
    image: "/images/web/diorama.jpg",
    tags: ["Astro", "Docker", "Keystatic CMS"],
    content: "",
  },
  {
    slug: "euco",
    title: "Edinburgh University Chamber Orchestra",
    description:
      "Full website rebuild from Create React App to Next.js 15, plus a Stripe ticketing platform with QR check-in and a companion React Native scanning app, replacing a fully manual box office.",
    outcome: "Rebuilt information architecture, live Stripe ticket sales with QR check-in, editorial concert pages.",
    url: "https://www.eu-co.co.uk",
    image: "/images/web/euco.jpg",
    tags: ["Next.js", "Stripe", "React Native", "Docker"],
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
