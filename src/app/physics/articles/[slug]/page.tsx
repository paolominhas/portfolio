import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { physicsArticles, type ArticleBlock } from "@/data/physics-articles";
import SimulationPlayer from "@/components/simulations/SimulationPlayer";
import CodePanel from "@/components/simulations/CodePanel";

export function generateStaticParams() {
  return physicsArticles.map((article) => ({ slug: article.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = physicsArticles.find((a) => a.slug === slug);
  return {
    title: article?.title ?? "Not found",
    description: article?.excerpt,
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <div
          className="prose prose-invert prose-zinc max-w-none prose-p:text-zinc-300 prose-p:leading-relaxed prose-code:text-[var(--accent)] prose-code:before:content-none prose-code:after:content-none mb-6"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case "heading": {
      const Tag = block.level === 3 ? "h3" : "h2";
      return (
        <Tag className="text-white font-bold mt-12 mb-4 text-2xl">
          {block.text}
        </Tag>
      );
    }
    case "simulation":
      return (
        <SimulationPlayer
          simulationId={block.simulationId}
          caption={block.caption}
        />
      );
    case "code":
      return (
        <CodePanel
          code={block.code}
          language={block.language}
          caption={block.caption}
        />
      );
    default:
      return null;
  }
}

export default async function PhysicsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = physicsArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <article className="pt-32 pb-20 px-6 md:px-20 max-w-3xl mx-auto">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-zinc-500 hover:text-zinc-300 transition-colors mb-12"
      >
        <ArrowLeft size={14} /> Back to articles
      </Link>

      <time className="text-sm text-zinc-600 font-mono">{article.date}</time>
      <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-4 text-white">
        {article.title}
      </h1>
      <div className="flex flex-wrap gap-2 mb-12">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {article.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </article>
  );
}
