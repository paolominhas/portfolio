import Link from "next/link";
import { ArrowLeft, Music, Clock, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { arrangements } from "@/data/arrangements";
import ArrangementContent from "@/components/music/ArrangementContent";
import StaffLines from "@/components/music/StaffLines";

export function generateStaticParams() {
  return arrangements.map((arr) => ({ slug: arr.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const arrangement = arrangements.find((a) => a.slug === slug);
  return {
    title: arrangement?.title ?? "Not found",
    description: arrangement?.excerpt,
  };
}

export default async function ArrangementPage({ params }: PageProps) {
  const { slug } = await params;
  const arrangement = arrangements.find((a) => a.slug === slug);
  if (!arrangement) notFound();

  return (
    <article className="pt-40 pb-24 px-6 md:px-16 max-w-3xl mx-auto">
      <Link
        href="/arrangements"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors mb-12"
      >
        <ArrowLeft size={14} /> Back to arrangements
      </Link>

      <StaffLines className="w-32 mb-6 opacity-70" />

      <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">
        {arrangement.originalComposer} — {arrangement.originalWork}
      </p>
      <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 mb-6">
        {arrangement.title}
      </h1>

      {/* Fact strip */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 py-6 border-y border-stone-200">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <Music size={15} className="text-[var(--accent)]" />
          {arrangement.arrangedFor}
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <Clock size={15} className="text-[var(--accent)]" />
          {arrangement.durationMinutes} min
        </div>
        {arrangement.premiere && (
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Calendar size={15} className="text-[var(--accent)]" />
            {arrangement.premiere.ensemble}, {arrangement.premiere.date}
            {arrangement.premiere.venue ? ` — ${arrangement.premiere.venue}` : ""}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {arrangement.instrumentation.map((inst) => (
          <span
            key={inst}
            className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full"
          >
            {inst}
          </span>
        ))}
      </div>

      <ArrangementContent html={arrangement.programmeNote} />

      {(arrangement.audioUrl || arrangement.scoreUrl) && (
        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-wrap gap-4">
          {arrangement.audioUrl && (
            <a
              href={arrangement.audioUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-colors"
            >
              Listen to a recording
            </a>
          )}
          {arrangement.scoreUrl && (
            <a
              href={arrangement.scoreUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-400 transition-colors"
            >
              View score excerpt
            </a>
          )}
        </div>
      )}
    </article>
  );
}
