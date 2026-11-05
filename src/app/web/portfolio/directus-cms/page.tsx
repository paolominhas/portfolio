import type { Metadata } from "next";
import DraftScaffold, { type DraftSection } from "@/components/case-study/DraftScaffold";

export const metadata: Metadata = {
  title: "Directus as the CMS for EUCO: an article",
  robots: { index: false, follow: false },
};

// Companion to the EUCO Tickets case study. Facts about how Directus is used
// in EUCO (collections, roles, the rebuild-on-publish hook) must come from
// the real repo; the prompts below only say where to look.
const SECTIONS: DraftSection[] = [
  {
    id: "why",
    eyebrow: "01 · Why a CMS",
    title: "Who edits the website, and how often?",
    purpose: "Start with people: a student committee that turns over every year.",
    prompts: [
      "Who needs to change content (committee, publicity, treasurer) and what changes most often?",
      "What was it like before: code changes, messages to you?",
      "What a good answer had to look like for volunteers with ten minutes spare",
    ],
  },
  {
    id: "choice",
    eyebrow: "02 · Choosing Directus",
    title: "Why Directus, and what else I looked at",
    purpose: "An honest comparison, written from your actual reasons.",
    prompts: [
      "Options you considered (e.g. Keystatic on the Diorama site, WordPress, Strapi, Sanity) and why not",
      "What tipped it: SQL database you own, self-hosting, roles and permissions, open source?",
      "The cost: what you have to run and maintain yourself",
    ],
    interactive: {
      name: "Decision matrix",
      idea: "A small table where the reader can weight criteria (self-hosting, editing UX, cost, Git workflow) and watch the scores re-rank the options.",
    },
  },
  {
    id: "model",
    eyebrow: "03 · Content model",
    title: "Collections, fields and relations",
    purpose: "Show how EUCO's content is structured.",
    prompts: [
      "The main collections (concerts, news, people, sponsors...) and how they relate",
      "A modelling decision you changed your mind on",
      "What lives in Directus versus what lives in Postgres for ticketing (see the case study decision on 'content vs facts')",
    ],
    interactive: {
      name: "Schema explorer",
      idea: "An entity-relationship diagram where clicking a collection opens its fields and an example record. Generate it from the real schema snapshot so it can't drift.",
    },
  },
  {
    id: "roles",
    eyebrow: "04 · Roles and safety",
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
    id: "publish",
    eyebrow: "05 · From edit to live",
    title: "What happens when someone hits Publish",
    purpose: "The story of the static site rebuild.",
    prompts: [
      "The path from Directus save to a rebuilt Astro site",
      "How long it takes, and what the editor sees while it happens",
      "What fails, how you'd know, and what you did about it",
    ],
    interactive: {
      name: "Publish pipeline animation",
      idea: "Step through Save, Webhook, Build, Deploy with a timeline and a realistic duration at each stage (use measured values).",
    },
  },
  {
    id: "lessons",
    eyebrow: "06 · Lessons",
    title: "What I'd tell the next developer",
    purpose: "Practical lessons, including what you'd avoid.",
    prompts: [
      "Three things that went well",
      "Three things that bit you (migrations, schema changes, upgrades?)",
      "How the handover to next year's committee works",
    ],
  },
];

export default function DirectusArticle() {
  return (
    <DraftScaffold
      eyebrow="Article · EUCO website"
      title="Directus as EUCO's CMS."
      tagline="TODO(paolo): one sentence on what this article will teach someone choosing a CMS for a small organisation."
      sections={SECTIONS}
    />
  );
}
