import type { Metadata } from "next";
import DraftScaffold, { type DraftSection } from "@/components/case-study/DraftScaffold";

export const metadata: Metadata = {
  title: "Diorama Consulting: off WordPress, into Docker. A case study",
  robots: { index: false, follow: false },
};

// TODO(paolo): every claim below is a prompt, not a statement. The shape of the
// story: leave WordPress, keep the content and images, and join prebuilt web
// apps into one stack with Docker. Check each detail against the real repo
// and compose files before writing it as fact.
const SECTIONS: DraftSection[] = [
  {
    id: "brief",
    eyebrow: "01 · The brief",
    title: "What the firm needed",
    purpose: "Who Diorama are, what the old site did badly, and what better meant to them.",
    prompts: [
      "Who are Diorama, and who reads their site (clients, candidates, partners)?",
      "What was wrong with the WordPress site: speed, upkeep, security, the editing experience?",
      "What did they ask for, and what did you suggest instead?",
    ],
    interactive: {
      name: "Before / after slider",
      idea: "Drag a handle between a screenshot of the old site and the new one. Add a Lighthouse score pair under each side (measure both before you write numbers).",
    },
  },
  {
    id: "leaving",
    eyebrow: "02 · Leaving WordPress",
    title: "Moving the content and the images",
    purpose: "The unglamorous heart of the rebuild: nothing the firm cared about gets lost.",
    prompts: [
      "How pages and posts moved across (export, script, by hand?)",
      "What happened to the media library: how many images, what formats, what you did to optimise them",
      "How you kept URLs working and handled redirects, and what you checked afterwards",
      "What broke and how you found out",
    ],
    interactive: {
      name: "Image pipeline: before and after",
      idea: "Show one real image as it was in WordPress and as it is now, with file size and format under each, plus a total saved across the library (compute the number from the real files).",
    },
  },
  {
    id: "apps",
    eyebrow: "03 · Prebuilt apps",
    title: "Plugging ready-made web apps into one site",
    purpose: "The main idea: use proven tools instead of writing everything, and make them feel like one site.",
    prompts: [
      "Which prebuilt apps are in the stack (CMS, analytics, contact service, chatbot, admin dashboards?) and why each was chosen over building it",
      "How each is connected to the Astro site (proxy path, API call, embed)",
      "What you built yourself to glue them together",
    ],
    interactive: {
      name: "Stack map",
      idea: "A diagram with one box per app. Click a box to see what it does, what it talks to, and where its data lives.",
    },
  },
  {
    id: "docker",
    eyebrow: "04 · Dockerisation",
    title: "Everything in containers",
    purpose: "How the stack is packaged, wired and kept running.",
    prompts: [
      "The compose layout: services, networks, volumes, and what is exposed to the internet",
      "Reverse proxy, TLS and the domain cutover (including certificates issued ahead of time)",
      "Build and deploy: how a change gets from Git to live, and how you roll back",
      "Secrets and environment: how configuration is kept out of the images",
    ],
    interactive: {
      name: "Container topology",
      idea: "Click a container to see its image, port, volumes and health check. Animate a visitor's request through proxy, site and service. Use values from the real compose file.",
    },
  },
  {
    id: "operate",
    eyebrow: "05 · Running it",
    title: "Monitoring, backups and handover",
    purpose: "What keeps it healthy after launch.",
    prompts: [
      "How you know it is up, and what alerts you",
      "Backups, restores, and the last time you tested one",
      "What the client can do themselves and what they ask you for",
    ],
  },
  {
    id: "outcome",
    eyebrow: "06 · Outcome",
    title: "What changed",
    purpose: "Only measured results. If you have not measured it, do not claim it.",
    prompts: [
      "Page speed and accessibility before vs after (with the tool and date)",
      "Anything the client said in their own words (with permission)",
      "What you would do differently",
    ],
  },
];

export default function DioramaCaseStudy() {
  return (
    <DraftScaffold
      eyebrow="Case study · Diorama Consulting"
      title="Diorama Consulting."
      tagline="TODO(paolo): one sentence: a WordPress site rebuilt as Astro, joined to prebuilt web apps and run in Docker."
      sections={SECTIONS}
    />
  );
}
