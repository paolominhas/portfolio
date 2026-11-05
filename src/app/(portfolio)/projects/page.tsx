import type { Metadata } from "next";
import { visibleProjects } from "@/data/projects";
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
    <section className="pt-32 px-6 md:px-20 max-w-7xl mx-auto pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
        Projects
      </h1>
      <p className="text-zinc-400 max-w-2xl mb-10">
        Physics research, web development, quantitative finance and orchestra production. Search, or filter by category and tool.
        Physics and web projects open on their own sites; the badge on each card says where.
      </p>
      <ProjectsExplorer projects={projects} />
    </section>
  );
}
