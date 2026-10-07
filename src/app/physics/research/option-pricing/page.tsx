import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OptionPricingContent from "@/components/physics/option-pricing/OptionPricingContent";
import { getResearchProject, isPublished } from "@/data/research";

/**
 * OPTION PRICING LAB — bespoke route (like research/mphys).
 *
 * Lives in its own folder because it carries interactive content (a pricing
 * playground with live charts and a Monte Carlo engine running in the
 * browser) that does not fit the text-only `research/[slug]` template. The
 * static folder wins over the dynamic segment, and the data entry sets
 * `bespokeRoute: true` so the template skips this slug.
 *
 * Draft handling: while the entry in src/data/research.ts has `draft: true`
 * this page 404s in production builds (it still renders under `next dev`).
 * The [slug] template gets that for free because drafts never reach
 * generateStaticParams; a bespoke folder has to check for itself.
 */

const SLUG = "option-pricing";

export function generateMetadata(): Metadata {
  const project = getResearchProject(SLUG);
  return {
    title: project?.title ?? "Option Pricing Lab",
    description: project?.summary,
  };
}

export default function OptionPricingPage() {
  const project = getResearchProject(SLUG);
  if (!project || !isPublished(project)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    programmingLanguage: ["Python", "TypeScript"],
    author: { "@type": "Person", name: "Paolo Minhas" },
    url: `https://physics.paolo.org.uk/research/${SLUG}`,
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OptionPricingContent repoUrl={project.repoUrl} />
    </>
  );
}
