import type { Metadata } from "next";
import DraftScaffold, { type DraftSection } from "@/components/case-study/DraftScaffold";

export const metadata: Metadata = {
  title: "EUCO website and its Directus CMS: a case study",
  robots: { index: false, follow: false },
};

// The orchestra's MAIN website (www.eu-co.co.uk), with most of the page about
// the Directus CMS behind it. Ticketing lives on its own site
// (tickets.eu-co.co.uk) and has its own case study, so link to that, don't
// retell it here. Facts must come from the repo; the prompts only say where to look.
const SECTIONS: DraftSection[] = [
  {
    id: "site",
    eyebrow: "01 · The site",
    title: "What the main website is",
    purpose: "A short orientation: what the site does, who uses it, and how it differs from the ticket site.",
    prompts: [
      "What visitors do on www.eu-co.co.uk (concerts, news, about, sponsors), and who the audience is",
      "Why it is an Astro site and what that buys you (speed, hosting cost, search)",
      "One sentence on the separate ticket site, linking to its case study",
    ],
    interactive: {
      name: "Site map with live links",
      idea: "A small diagram of the main site's pages, with each page showing which Directus collection feeds it. Click a page to see the fields.",
    },
  },
  {
    id: "why",
    eyebrow: "02 · Why a CMS",
    title: "Who edits the website, and how often?",
    purpose: "Start with people: a student committee that turns over every year.",
    prompts: [
      "Who needs to change content (committee, publicity, treasurer) and what changes most often?",
      "What it was like before: code changes, messages to you?",
      "What a good answer had to look like for volunteers with ten minutes spare",
    ],
  },
  {
    id: "choice",
    eyebrow: "03 · Choosing Directus",
    title: "Why Directus, and what else I looked at",
    purpose: "An honest comparison, written from your actual reasons.",
    prompts: [
      "Options you considered (for example Keystatic on the Diorama site, WordPress, Strapi, Sanity) and why not",
      "What tipped it: a SQL database you own, self-hosting, roles and permissions, open source?",
      "The cost: what you have to run and maintain yourself",
    ],
    interactive: {
      name: "Decision matrix",
      idea: "A small table where the reader weights criteria (self-hosting, editing experience, cost, Git workflow) and watches the options re-rank.",
    },
  },
  {
    id: "model",
    eyebrow: "04 · Content model",
    title: "Collections, fields and relations",
    purpose: "Show how EUCO's content is structured.",
    prompts: [
      "The main collections (concerts, news, people, sponsors, pages...) and how they relate",
      "A modelling decision you changed your mind on",
      "What lives in Directus versus what lives in the ticket system's own database",
    ],
    interactive: {
      name: "Schema explorer",
      idea: "An entity-relationship diagram where clicking a collection opens its fields and an example record. Generate it from the real schema snapshot so it cannot drift.",
    },
  },
  {
    id: "roles",
    eyebrow: "05 · Roles and safety",
    title: "Letting people edit without letting them break things",
    purpose: "Permissions, drafts and review.",
    prompts: [
      "Which roles exist and what each can do",
      "Draft vs published, and who approves",
      "What happens when someone makes a mistake: revisions, rollbacks",
    ],
    interactive: {
      name: "Role switcher",
      idea: "Pick a role (Admin, Editor, Publicity) and see which collections turn editable, read-only or hidden.",
    },
  },
  {
    id: "extensions",
    eyebrow: "06 · Making Directus fit",
    title: "Dashboards, extensions and automations",
    purpose: "The custom work around the CMS that made it usable for non-developers.",
    prompts: [
      "Custom dashboards or panels you built, and the problem each solved",
      "Automations (flows, webhooks) and what they replaced",
      "Something you wanted to build and decided not to",
    ],
    interactive: {
      name: "Dashboard tour",
      idea: "Annotated screenshots of the real Directus panels with numbered hotspots. Redact anything personal first.",
    },
  },
  {
    id: "publish",
    eyebrow: "07 · From edit to live",
    title: "What happens when someone hits Publish",
    purpose: "The story of the static site rebuild.",
    prompts: [
      "The path from a Directus save to a rebuilt Astro site",
      "How long it takes, and what the editor sees while it happens",
      "What fails, how you would know, and what you did about it",
    ],
    interactive: {
      name: "Publish pipeline animation",
      idea: "Step through Save, Webhook, Build, Deploy with a timeline and a realistic duration at each stage (use measured values).",
    },
  },
  {
    id: "lessons",
    eyebrow: "08 · Lessons",
    title: "What I would tell the next developer",
    purpose: "Practical lessons, including what you would avoid.",
    prompts: [
      "Three things that went well",
      "Three things that bit you (migrations, schema changes, upgrades?)",
      "How the handover to next year's committee works",
    ],
  },
];

export default function EucoWebsiteCaseStudy() {
  return (
    <DraftScaffold
      eyebrow="Case study · www.eu-co.co.uk"
      title="The EUCO website."
      tagline="TODO(paolo): one sentence on what this teaches someone running a website for a volunteer organisation, with Directus at the centre."
      sections={SECTIONS}
    />
  );
}
