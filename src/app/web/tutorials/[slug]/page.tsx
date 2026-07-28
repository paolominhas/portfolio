import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tutorials } from "@/data/web-data";

export function generateStaticParams() {
  return tutorials.map((tut) => ({ slug: tut.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = tutorials.find((t) => t.slug === slug);
  return {
    title: tutorial?.title ?? "Not found",
    description: tutorial?.description,
  };
}

export default async function TutorialPost({ params }: PageProps) {
  const { slug } = await params;
  const tutorial = tutorials.find((t) => t.slug === slug);
  if (!tutorial) notFound();

  return (
    <article className="pt-40 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
      <Link
        href="/tutorials"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors mb-12"
      >
        <ArrowLeft size={14} /> Back to writing
      </Link>

      <header className="mb-16">
        <div className="flex gap-4 font-mono text-xs uppercase tracking-wider text-slate-400 mb-6">
          <span>{tutorial.date}</span>
          <span>{tutorial.difficulty}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
          {tutorial.title}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed">
          {tutorial.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {tutorial.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {tutorial.content ? (
        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-[var(--accent)]"
          dangerouslySetInnerHTML={{ __html: tutorial.content }}
        />
      ) : (
        <p className="text-slate-400 italic">
          This write-up hasn't been drafted yet — add the body to{" "}
          <code className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded">
            src/data/web-data.ts
          </code>
          .
        </p>
      )}
    </article>
  );
}
