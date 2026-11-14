"use client";

import { useMemo } from "react";
import type { ResearchProject } from "@/data/research";
import { coverForSlug } from "./CoverArt";
import { CARD_CSS, Chip, EmptyState, LeadCard, SearchBox, StoryCard, matches, useUrlFilters, type CardItem } from "./cards";

/**
 * The /research index: a search box, type and topic chips, one large spotlight
 * card (the project flagged `spotlight` in data/research.ts, currently the
 * MPhys thesis) and a grid of picture-first cards for the rest.
 */

type Row = { p: ResearchProject; item: CardItem; hay: string[] };

export default function ResearchExplorer({ projects }: { projects: ResearchProject[] }) {
  const { q, setQ, vals, set, reset } = useUrlFilters(["type", "topic"] as const);
  const type = vals.type, topic = vals.topic;

  const rows: Row[] = useMemo(
    () =>
      projects.map((p, i) => ({
        p,
        hay: [p.title, p.subtitle, p.summary, p.kind ?? "", p.role, p.institution, p.period, ...p.tags, ...p.techStack],
        item: {
          key: p.slug,
          href: `/research/${p.slug}`,
          cover: coverForSlug(p.slug),
          image: p.image,
          kicker: [p.kind ?? "Research", p.tags[0]].filter(Boolean).join("  ·  ").toUpperCase(),
          title: p.title,
          standfirst: p.spotlight ? p.subtitle : p.summary,
          chips: p.spotlight ? p.techStack : p.tags.slice(0, 3),
          meta: [p.period, p.institution.split(",")[0]],
          highlights: p.highlights,
          delay: 0.1 + i * 0.06,
        },
      })),
    [projects]
  );

  const leadSlug = (projects.find((p) => p.spotlight) ?? projects[0])?.slug;

  const topicOptions = useMemo(() => {
    const c = new Map<string, number>();
    projects.forEach((p) => new Set(p.tags).forEach((t) => c.set(t, (c.get(t) ?? 0) + 1)));
    return [...c.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [projects]);
  const kinds = useMemo(() => [...new Set(projects.map((p) => p.kind).filter(Boolean))] as string[], [projects]);

  const textOk = (r: Row) => matches(q, r.hay);
  const topicOk = (r: Row) => !topic || r.p.tags.includes(topic);
  const typeOk = (r: Row) => !type || r.p.kind === type;
  const shown = rows.filter((r) => textOk(r) && topicOk(r) && typeOk(r));
  const shownKeys = new Set(shown.map((r) => r.p.slug));
  const filtering = q.trim() !== "" || type !== "" || topic !== "";

  const countKind = (k: string) => rows.filter((r) => textOk(r) && topicOk(r) && r.p.kind === k).length;
  const countAll = rows.filter((r) => textOk(r) && topicOk(r)).length;
  const countTopic = (t: string) => rows.filter((r) => textOk(r) && typeOk(r) && r.p.tags.includes(t)).length;

  const lead = rows.find((r) => r.p.slug === leadSlug);
  const rest = rows.filter((r) => r.p.slug !== leadSlug);

  return (
    <div>
      <style>{CARD_CSS}</style>

      <div className="max-w-2xl mb-5">
        <SearchBox q={q} setQ={setQ} label="Search research" placeholder="Search projects, detectors, tools…  ( / )" />
      </div>

      <div role="group" aria-label="Filter by type" className="flex flex-wrap items-center gap-2 mb-3">
        <Chip active={type === ""} onClick={() => set("type", "")} count={countAll}>All</Chip>
        {kinds.map((k) => (
          <Chip key={k} active={type === k} onClick={() => set("type", type === k ? "" : k)} count={countKind(k)}>{k}</Chip>
        ))}
      </div>
      {topicOptions.length > 0 && (
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs tracking-widest text-white/35 mr-1">TOPIC</span>
          {topicOptions.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => set("topic", topic === t ? "" : t)}
              className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors ${topic === t ? "bg-[var(--accent)] text-black" : "bg-white/5 text-white/50 hover:text-white"}`}
            >
              {t} <span className="opacity-60">{countTopic(t)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 min-h-[1.5rem]">
        <p aria-live="polite" className="text-sm text-white/40">
          {filtering ? `${shown.length} of ${rows.length} projects` : `${rows.length} projects`}
        </p>
        {filtering && (
          <button type="button" onClick={reset} className="text-sm text-white/50 hover:text-white underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>

      {lead && <div className="mb-12"><LeadCard item={{ ...lead.item, hidden: !shownKeys.has(lead.p.slug) }} /></div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
        {rest.map((r) => (
          <StoryCard key={r.p.slug} item={{ ...r.item, hidden: !shownKeys.has(r.p.slug) }} cta="Read the research" />
        ))}
      </div>

      {shown.length === 0 && <EmptyState q={q} onReset={reset} />}
    </div>
  );
}
