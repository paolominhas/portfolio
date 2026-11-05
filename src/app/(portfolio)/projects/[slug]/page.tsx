import { projects } from '@/data/projects';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

// Drafts 404 in production (a redirect to an unpublished page would just dead-end).
// `hidden` entries still resolve so old links like /projects/web-development keep working.
const available = projects.filter((p) => !p.draft || process.env.NODE_ENV !== 'production');

export async function generateStaticParams() {
  // Every project gets a slug. Internal ones render below; `external` ones
  // (physics and web projects that now live on their own subdomain) redirect
  // to that page, so /projects/mphys, /projects/euco-ticketing and so on
  // keep working for anyone who bookmarked or linked them.
  return available.map((project) => ({ slug: project.slug }));
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = available.find((p) => p.slug === slug);

  if (!project || project.external) {
    return { title: 'Project Not Found', robots: { index: false } };
  }

  return {
    title: project.title,
    description: project.excerpt,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = available.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }
  if (project.external) {
    permanentRedirect(project.external);
  }

  return (
    <article className="min-h-screen pt-32 px-6 md:px-20 max-w-4xl mx-auto">
      <Link
        href="/projects"
        className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>
        <div className="flex gap-3">
          {project.techStack.map((t) => (
            <span key={t} className="px-3 py-1 border border-white/10 rounded-full text-sm text-zinc-300">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div
        className="prose prose-invert prose-lg max-w-none text-zinc-300"
        dangerouslySetInnerHTML={{ __html: project.content }}
      />
    </article>
  );
}
