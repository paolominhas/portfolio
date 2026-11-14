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
  const url = `https://physics.paolo.org.uk/articles/${slug}`;
  return {
    title: article?.title ?? "Not found",
    description: article?.excerpt,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: article?.title, description: article?.excerpt },
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
        <Tag className="in-display text-white mt-14 mb-4 text-[length:var(--step-2)]">
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
      <div className="mb-12">
        <Link
          href="/articles"
          className="in-label inline-flex items-center gap-2 transition-colors hover:text-[var(--ink)]"
        >
          <ArrowLeft size={14} /> Back to articles
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.date,
            author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
            url: `https://physics.paolo.org.uk/articles/${article.slug}`,
          }),
        }}
      />

      <time dateTime={article.date} className="in-label mb-3 block">{article.date}</time>
      <h1 className="in-display mb-6 text-[length:var(--step-4)] text-white md:text-[clamp(3rem,6vw,4.6rem)]">
        {article.title}
      </h1>
      <div className="flex flex-wrap gap-2 mb-12">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="in-label border border-[var(--line)] px-2 py-1 rounded-[3px]"
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
