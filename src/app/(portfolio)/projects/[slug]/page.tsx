import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// 1. Unify the interface: params is a Promise for both Page and Metadata
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// 2. Fix Metadata: Await the params, then find the project
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Find the project from your imported array
  const project = projects.find((p) => p.slug === slug);

  // Fallback if the URL slug is invalid
  if (!project) {
    return {
      title: 'Project Not Found'
    }
  }

  return {
    title: project.title,
    description: project.excerpt, // Ensure 'excerpt' exists in your projects data
    alternates: {
      canonical: `/projects/${project.slug}`, // Fixed path from /blog/ to /projects/
    },
    openGraph: {
      images: project.image ? [project.image] : [], // Ensure 'coverImage' exists
    },
  }
}

// 3. Make the component async
export default async function ProjectPage({ params }: PageProps) {
  // AWAIT the params before trying to use the slug
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Find the project
  const project = projects.find((p) => p.slug === slug);

  // If still not found after awaiting, throw 404
  if (!project) {
    notFound(); 
  }

  return (
    <article className="min-h-screen pt-32 px-6 md:px-20 max-w-4xl mx-auto">
      <Link 
        href="/projects" 
        className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        {/* 4. Fix: Removed curly braces around the component */}
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>
        <div className="flex gap-3">
            {project.techStack.map(t => (
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