import type { Metadata } from "next";
import DraftScaffold, { type DraftSection } from "@/components/case-study/DraftScaffold";

export const metadata: Metadata = {
  title: "EUCO Education Hub: open APIs, lightweight site. A proposal",
  robots: { index: false, follow: false },
};

// This page is a PROPOSAL, so write it in the future tense and label every
// plan as a plan. Nothing here is built yet. API names below are candidates to
// evaluate, not decisions: read each one's terms, rate limits, licence and
// attribution rules before depending on it.
// Check first: which stack edu.eu-co.co.uk runs on today (the notes say a
// Next.js site fed by Google Sheets CSV, with a programme-notes reader), and
// confirm that is the site you mean.
const SECTIONS: DraftSection[] = [
  {
    id: "today",
    eyebrow: "01 · Today",
    title: "What the education site is now",
    purpose: "Describe the current site honestly, so the plan has a starting point.",
    prompts: [
      "What edu.eu-co.co.uk offers visitors today (concert archive, programme notes reader...)",
      "Where its data comes from now and who keeps it up to date",
      "What it does well, and the small size and speed you want to keep",
    ],
    interactive: {
      name: "Current page-weight meter",
      idea: "Show the real size of a typical page today (HTML, JS, images) as a bar. It becomes the budget the proposal has to respect.",
    },
  },
  {
    id: "limits",
    eyebrow: "02 · The limits",
    title: "Where hand-kept data runs out",
    purpose: "The problem the proposal solves.",
    prompts: [
      "What visitors ask that the site cannot answer (who was the composer, when, what else did they write, what to listen to next?)",
      "How much manual upkeep each concert costs a volunteer",
      "What would be worth having if it cost nothing to maintain",
    ],
  },
  {
    id: "idea",
    eyebrow: "03 · The idea",
    title: "Let open data do the heavy lifting",
    purpose: "The core proposal: enrich each concert page from public APIs, instead of writing it by hand.",
    prompts: [
      "The kinds of enrichment you want (composer biographies, work details, dates, related recordings, scores in the public domain)",
      "The candidate sources for each (for example Wikidata, Wikipedia, MusicBrainz, Open Opus, the Internet Archive, IMSLP) and what each is good and bad at",
      "For each source: its licence, rate limits and attribution rules (check them, do not assume)",
    ],
    interactive: {
      name: "API explorer (static)",
      idea: "Pick a composer from a concert and see what each source returns, as pre-saved real responses (so the page makes no live calls). Show which fields would appear on the page.",
    },
  },
  {
    id: "light",
    eyebrow: "04 · Staying light",
    title: "Big data in, small website out",
    purpose: "The key design constraint: bring in a lot of data without shipping a heavy site.",
    prompts: [
      "Fetch and process data at build time, not in the visitor's browser",
      "Cache raw API responses in files, so a build never depends on an API being up",
      "Ship plain HTML with almost no JavaScript; a small static search index instead of a server",
      "What 'lightweight' means in numbers: a page-weight and Lighthouse budget",
    ],
    interactive: {
      name: "Data-flow diagram",
      idea: "Animate: public APIs, then a build script, then cached JSON, then static pages. Click a stage to see what it does and what could fail.",
    },
  },
  {
    id: "architecture",
    eyebrow: "05 · Proposed design",
    title: "How it would be built",
    purpose: "The concrete plan, in plain language.",
    prompts: [
      "Where the ingestion script lives and when it runs (on a schedule? when a concert is added?)",
      "How the existing Google Sheets data and the API data are merged, and which wins on a conflict",
      "How a volunteer corrects something the API got wrong (an override file?)",
      "How the site is hosted and rebuilt",
    ],
  },
  {
    id: "risks",
    eyebrow: "06 · Risks",
    title: "What could go wrong",
    purpose: "Credibility comes from naming the risks yourself.",
    prompts: [
      "An API changes, disappears or rate-limits you",
      "Wrong or disputed data appearing under the orchestra's name",
      "Licences and attribution (and keeping a visible credits line)",
      "Over-engineering: how you will know when to stop",
    ],
    interactive: {
      name: "Risk table",
      idea: "A sortable table: risk, likelihood, impact, and what you will do. Keep it short and honest.",
    },
  },
  {
    id: "roadmap",
    eyebrow: "07 · Roadmap",
    title: "A first version in small steps",
    purpose: "A realistic plan someone could follow.",
    prompts: [
      "Step 1: one concert, one source, by hand, to prove the page works",
      "Step 2: automate the build step for that source",
      "Step 3: add a second source, and the override file",
      "How you will measure success (page weight, build time, volunteer hours saved)",
    ],
    interactive: {
      name: "Roadmap timeline",
      idea: "A simple horizontal timeline of the steps with a done / next / later state for each.",
    },
  },
];

export default function EucoEducationProposal() {
  return (
    <DraftScaffold
      eyebrow="Proposal · edu.eu-co.co.uk"
      title="The EUCO education hub."
      tagline="TODO(paolo): one sentence: how to make a small education site much richer using open data, without making it heavy."
      sections={SECTIONS}
    />
  );
}
