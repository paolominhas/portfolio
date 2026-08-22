import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tutorials } from "@/data/web-data";
import ScrollReveal from "@/components/web/ScrollReveal";

/**
 * WEB TUTORIAL DETAIL
 *
 * Stays a server component (generateStaticParams / generateMetadata /
 * async params require it) — the only client-side piece is the header
 * reveal, imported here as <ScrollReveal on="load">, which is fine to
 * drop into a Server Component as long as it's not itself marked
 * "use client" at this file's top.
 */

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
    <article className="pt-40 pb-28 px-6 md:px-10 max-w-3xl mx-auto">
      <Link
        href="/tutorials"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy/50 hover:text-navy transition-colors mb-12"
      >
        <ArrowLeft size={14} /> Back to writing
      </Link>

      <ScrollReveal on="load">
        <header className="mb-16">
          <div className="flex gap-3 mb-6">
            <span className="font-mono text-[11px] uppercase tracking-wider text-navy/50 bg-paper border border-navy/10 px-2.5 py-1 rounded-full">
              {tutorial.date}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-navy bg-yellow/25 border border-yellow/40 px-2.5 py-1 rounded-full">
              {tutorial.difficulty}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-navy leading-tight mb-6">
            {tutorial.title}
          </h1>
          <p className="text-xl text-navy/60 leading-relaxed">
            {tutorial.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {tutorial.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono uppercase tracking-wide text-navy/60 bg-lilac-light border border-navy/10 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
      </ScrollReveal>

      {tutorial.content ? (
        <div
          className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-navy prose-p:text-navy/75 prose-a:text-navy prose-a:underline prose-a:decoration-yellow prose-a:decoration-2 prose-strong:text-navy prose-code:text-navy prose-code:bg-lilac-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: tutorial.content }}
        />
      ) : (
        <p className="text-navy/40 italic">
          This write-up hasn&apos;t been drafted yet — add the body to{" "}
          <code className="font-mono text-sm bg-lilac-light text-navy px-1.5 py-0.5 rounded">
            src/data/web-data.ts
          </code>
          .
        </p>
      )}
    </article>
  );
}
