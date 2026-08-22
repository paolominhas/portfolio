import Link from "next/link";
import { ArrowLeft, Music, Clock, Calendar, Download, Music2 } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { arrangements } from "@/data/arrangements";
import ArrangementContent from "@/components/music/ArrangementContent";
import { CircledNumber } from "@/components/music/CircledNumber";
import DownloadLink from "@/components/music/DownloadLink";

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

  const index = arrangements.findIndex((a) => a.slug === slug);

  return (
    <article className="pt-40 pb-28 px-6 md:px-16 max-w-3xl mx-auto">
      <Link
        href="/arrangements"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-black/50 hover:text-black transition-colors mb-12"
      >
        <ArrowLeft size={14} /> Back to the crate
      </Link>

      <CircledNumber n={index + 1} active size="lg" />

      <p className="font-mono text-xs uppercase tracking-widest text-black/50 mt-6 mb-3">
        {arrangement.originalComposer} — {arrangement.originalWork}
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-black mb-6">
        {arrangement.title}
      </h1>

      {/* Fact strip */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 py-6 border-y-2 border-black/10">
        <div className="flex items-center gap-2 text-sm text-black/70">
          <Music size={15} className="text-magenta" />
          {arrangement.arrangedFor}
        </div>
        <div className="flex items-center gap-2 text-sm text-black/70">
          <Clock size={15} className="text-magenta" />
          {arrangement.durationMinutes} min
        </div>
        {arrangement.premiere && (
          <div className="flex items-center gap-2 text-sm text-black/70">
            <Calendar size={15} className="text-magenta" />
            {arrangement.premiere.ensemble}, {arrangement.premiere.date}
            {arrangement.premiere.venue ? ` — ${arrangement.premiere.venue}` : ""}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {arrangement.instrumentation.map((inst) => (
          <span
            key={inst}
            className="text-xs font-mono uppercase tracking-wide text-black/60 bg-black/5 border border-black/10 px-3 py-1.5"
          >
            {inst}
          </span>
        ))}
      </div>

      <ArrangementContent html={arrangement.programmeNote} />

      {/* Downloads — always shown, per-slot active/inert. A slot with
          no URL yet renders visibly disabled rather than being hidden
          entirely, so "downloads exist for every arrangement" reads
          as a promise about the archive, not just the ones filled in
          so far. */}
      <div className="mt-12 pt-8 border-t-2 border-black/10">
        <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-4">
          Downloads
        </p>
        <div className="flex flex-wrap gap-4">
          <DownloadLink
            href={arrangement.scoreUrl}
            label="Download score"
            icon={<Download size={15} />}
          />
          <DownloadLink
            href={arrangement.audioUrl}
            label="Listen to a recording"
            icon={<Music2 size={15} />}
          />
        </div>
      </div>
    </article>
  );
}
