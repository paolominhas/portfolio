import { articles } from '@/data/articles';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// 1. Update the interface: params is now a Promise
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 2. Make the component async
export default async function ArticlePage({ params }: PageProps) {
  // 3. AWAIT the params before trying to use the slug
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 4. Find the project
  const article = articles.find((p) => p.slug === slug);

  // If still not found after awaiting, then throw 404
  if (!article) {
    notFound(); 
  }

  return (
    <article className="min-h-screen pt-32 px-6 md:px-20 max-w-4xl mx-auto">
      <Link 
        href="/projects" 
        className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        { <ArrowLeft className="w-4 h-4 mr-2" /> } Back to Projects
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{article.title}</h1>
        <div className="flex gap-3">
            {article.techStack.map(t => (
                <span key={t} className="px-3 py-1 border border-white/10 rounded-full text-sm text-zinc-300">
                    {t}
                </span>
            ))}
        </div>
      </header>

      <div 
        className="prose prose-invert prose-lg max-w-none text-zinc-300"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </article>
  );
}