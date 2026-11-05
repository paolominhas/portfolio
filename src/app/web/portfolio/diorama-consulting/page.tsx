import type { Metadata } from "next";
import DraftScaffold, { type DraftSection } from "@/components/case-study/DraftScaffold";

export const metadata: Metadata = {
  title: "Diorama Consulting: a case study",
  robots: { index: false, follow: false },
};

// TODO(paolo): every factual claim below is a prompt, not a statement. The
// brief says WordPress -> Astro + Keystatic + Docker; check details against
// the real repo before writing them as fact.
const SECTIONS: DraftSection[] = [
  {
    id: "brief",
    eyebrow: "01 · The brief",
    title: "What the firm needed",
    purpose: "Set the scene: who Diorama is, what the old site did badly, what 'better' meant to them.",
    prompts: [
      "Who are Diorama and who reads their site (clients, candidates, partners)?",
      "What was wrong with the WordPress site: speed, upkeep, security, editing experience?",
      "What did they ask for, and what did you suggest instead?",
    ],
    interactive: {
      name: "Before / after slider",
      idea: "Drag a handle between a screenshot of the old site and the new one. Add a Lighthouse score pair under each side (measure both before you write numbers).",
    },
  },
  {
    id: "design",
    eyebrow: "02 · Design",
    title: "A design system, not a theme",
    purpose: "Show how the visual direction came from the subject rather than a template.",
    prompts: [
      "What was the visual idea, and where did it come from?",
      "Type, colour and spacing decisions, and one thing you tried and dropped",
      "How the system keeps new pages consistent without you",
    ],
    interactive: {
      name: "Live design tokens",
      idea: "Colour, type-scale and spacing swatches rendered from the site's real CSS variables. Toggle light/dark if the site has both.",
    },
  },
  {
    id: "migration",
    eyebrow: "03 · Migration",
    title: "Leaving WordPress without losing anything",
    purpose: "The unglamorous heart of a rebuild: content, URLs and search ranking.",
    prompts: [
      "How content moved across (export, script, by hand?)",
      "How you preserved URLs and handled redirects",
      "What broke and how you found out",
    ],
    interactive: {
      name: "Redirect map explorer",
      idea: "A searchable table of old URL to new URL with a status badge (301, kept, retired). Only publish it if you're happy for old paths to be public.",
    },
  },
  {
    id: "cms",
    eyebrow: "04 · Editing",
    title: "How the team updates the site",
    purpose: "Show that the site stays maintainable by non-developers.",
    prompts: [
      "Why Keystatic (or whichever CMS is really in use): Git-backed content, no database?",
      "What the editing workflow is, from change to live",
      "What the team can and can't change without you",
    ],
    interactive: {
      name: "Content-model viewer",
      idea: "Click a CMS collection (case study, person, post) to see its fields, and which page templates use it.",
    },
  },
  {
    id: "deploy",
    eyebrow: "05 · Deployment",
    title: "Containerised and boring, on purpose",
    purpose: "Explain how it's built and shipped, in plain English first.",
    prompts: [
      "Build and deploy pipeline in one paragraph",
      "Where it runs, how it's monitored, how a rollback works",
      "What you'd say to a non-technical client about why this matters",
    ],
    interactive: {
      name: "Request-path diagram",
      idea: "A visitor's request animating through the proxy, container and static files, with a short caption at each hop.",
    },
  },
  {
    id: "outcome",
    eyebrow: "06 · Outcome",
    title: "What changed",
    purpose: "Only measured results. If you haven't measured it, don't claim it.",
    prompts: [
      "Page speed and accessibility before vs after (with the tool and date)",
      "Anything the client told you in their own words (with permission)",
      "What you'd do differently",
    ],
  },
];

export default function DioramaCaseStudy() {
  return (
    <DraftScaffold
      eyebrow="Case study · Diorama Consulting"
      title="Diorama Consulting."
      tagline="TODO(paolo): one sentence on what you built and why it was a good fit for them."
      sections={SECTIONS}
    />
  );
}
