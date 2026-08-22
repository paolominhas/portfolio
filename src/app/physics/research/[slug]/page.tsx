import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin, Calendar, Wrench } from "lucide-react";
import { researchProjects, getResearchProject } from "@/data/research";

/**
 * GENERIC RESEARCH DETAIL PAGE
 *
 * Renders any research project EXCEPT mphys, which has its own
 * bespoke route tree at research/mphys/** (real interactive 3D/KaTeX
 * content that doesn't fit this text-only template). Next's App
 * Router resolves the static `mphys/` folder ahead of this dynamic
 * segment for that one path, but we still exclude it from
 * generateStaticParams here so this template never tries to render
 * a duplicate, content-free version of that page.
 */

export function generateStaticParams() {
  return researchProjects
    .filter((p) => !p.bespokeRoute)
    .map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getResearchProject(slug);
  return {
    title: project?.title ?? "Not found",
    description: project?.summary,
  };
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getResearchProject(slug);
  if (!project || project.bespokeRoute) notFound();

  return (
    <div className="relative bg-abyss bg-stars min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 w-[32rem] h-[32rem] rounded-full bg-ember/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-24 w-[28rem] h-[28rem] rounded-full bg-kelp/15 blur-[120px]"
      />

      <article className="relative pt-32 pb-28 px-6 md:px-20 max-w-3xl mx-auto">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Research
        </Link>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-bodoni text-4xl md:text-6xl font-medium tracking-tight text-white mb-4 [text-shadow:0_4px_40px_rgba(255,107,61,0.15)]">
          {project.title}
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mb-10 leading-relaxed">
          {project.subtitle}
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12 py-6 border-y border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <MapPin size={15} className="text-[var(--accent)]" />
            {project.institution}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Calendar size={15} className="text-[var(--accent)]" />
            {project.period} — {project.role}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded"
            >
              <Wrench size={11} /> {tech}
            </span>
          ))}
        </div>

        <div
          className="prose prose-invert max-w-none
            prose-headings:font-bodoni prose-headings:text-white prose-headings:font-medium
            prose-p:text-white/60 prose-p:leading-relaxed
            prose-em:text-white/40
            prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      </article>
    </div>
  );
}
