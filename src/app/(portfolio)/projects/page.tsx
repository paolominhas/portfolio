import type { Metadata } from "next";
import { visibleProjects } from "@/data/projects";
import Specimen from "@/components/instrument/Specimen";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";

/**
 * PROJECTS INDEX (server component).
 *
 * Builds the list on the server (drafts and hidden entries removed), emits
 * metadata + an ItemList for search engines, and hands the cards to the
 * client-side explorer for search, category and tool filtering. All cards
 * are in the initial HTML.
 */

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Physics research, web development, quantitative finance and orchestra production: projects by Paolo Minhas, searchable by category and tool.",
  alternates: { canonical: "https://paolo.org.uk/projects" },
};

export default function ProjectsPage() {
  const projects = visibleProjects().map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    excerpt: p.excerpt,
    techStack: p.techStack,
    category: p.category,
    external: p.external,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects: Paolo Minhas",
    url: "https://paolo.org.uk/projects",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: p.external ?? `https://paolo.org.uk/projects/${p.slug}`,
      })),
    },
  };

  return (
    <section className="mx-auto max-w-[90rem] px-5 pb-28 pt-28 md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="in-enter relative mb-12">
        <Specimen slot="main-projects" className="absolute -top-4 right-0 hidden w-[min(30vw,26rem)] lg:block" />
        <h1 className="in-display text-[length:var(--step-5)]">Projects</h1>
        <p className="in-prose mt-6">
          Physics research, web development, quantitative finance and orchestra production. Search, or filter by category and tool.
          Physics and web projects open on their own sites; each row says where.
        </p>
      </div>
      <ProjectsExplorer projects={projects} />
    </section>
  );
}
