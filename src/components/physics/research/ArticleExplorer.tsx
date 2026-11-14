"use client";

import { useMemo } from "react";
import type { PhysicsArticle } from "@/data/physics-articles";
import { coverForSlug } from "./CoverArt";
import { CARD_CSS, Chip, EmptyState, LeadCard, SearchBox, StoryCard, matches, useUrlFilters, type CardItem } from "./cards";

/**
 * The /articles index, in the same card style as /research: search, topic chips,
 * the newest article as the large lead card, the rest in a grid. A reading time
 * is worked out from the prose blocks (code and simulations are not counted).
 */

const fmt = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function minutes(a: PhysicsArticle) {
  const words = a.blocks.reduce((n, b) => {
    if (b.type === "paragraph") return n + b.html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    if (b.type === "heading") return n + b.text.split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

export default function ArticleExplorer({ articles }: { articles: PhysicsArticle[] }) {
  const { q, setQ, vals, set, reset } = useUrlFilters(["topic"] as const);
  const topic = vals.topic;

  const sorted = useMemo(() => [...articles].sort((a, b) => b.date.localeCompare(a.date)), [articles]);
  const rows = useMemo(
    () =>
      sorted.map((a, i) => ({
        a,
        hay: [a.title, a.excerpt, ...a.tags],
        item: {
          key: a.slug,
          href: `/articles/${a.slug}`,
          cover: coverForSlug(a.slug),
          kicker: (a.tags[0] ?? "Article").toUpperCase(),
          title: a.title,
          standfirst: a.excerpt,
          chips: a.tags,
          meta: [fmt(a.date), `${minutes(a)} min read`],
          delay: 0.1 + i * 0.06,
        } satisfies CardItem,
      })),
    [sorted]
  );

  const topics = useMemo(() => {
    const c = new Map<string, number>();
    articles.forEach((a) => new Set(a.tags).forEach((t) => c.set(t, (c.get(t) ?? 0) + 1)));
    return [...c.entries()].filter(([, n]) => n >= 2).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).map(([t]) => t);
  }, [articles]);

  const textOk = (r: (typeof rows)[number]) => matches(q, r.hay);
  const shown = rows.filter((r) => textOk(r) && (!topic || r.a.tags.includes(topic)));
  const keys = new Set(shown.map((r) => r.a.slug));
  const filtering = q.trim() !== "" || topic !== "";
  const lead = rows[0];
  const rest = rows.slice(1);

  return (
    <div>
      <style>{CARD_CSS}</style>
      <div className="max-w-2xl mb-5">
        <SearchBox q={q} setQ={setQ} label="Search articles" placeholder="Search articles and topics…  ( / )" />
      </div>
      {topics.length > 0 && (
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap items-center gap-2 mb-8">
          <Chip active={topic === ""} onClick={() => set("topic", "")} count={rows.filter(textOk).length}>All</Chip>
          {topics.map((t) => (
            <Chip key={t} active={topic === t} onClick={() => set("topic", topic === t ? "" : t)} count={rows.filter((r) => textOk(r) && r.a.tags.includes(t)).length}>
              {t}
            </Chip>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mb-6 min-h-[1.5rem]">
        <p aria-live="polite" className="text-sm text-white/40">
          {filtering ? `${shown.length} of ${rows.length} articles` : `${rows.length} ${rows.length === 1 ? "article" : "articles"}`}
        </p>
        {filtering && (
          <button type="button" onClick={reset} className="text-sm text-white/50 hover:text-white underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>

      {lead && <div className="mb-12"><LeadCard item={{ ...lead.item, hidden: !keys.has(lead.a.slug) }} badge="Latest" cta="Read the article" /></div>}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          {rest.map((r) => (
            <StoryCard key={r.a.slug} item={{ ...r.item, hidden: !keys.has(r.a.slug) }} cta="Read the article" />
          ))}
        </div>
      )}
      {rows.length === 0 && (
        <p className="text-white/50">
          No articles yet. Add one to <code className="font-mono text-white/70">src/data/physics-articles.ts</code>.
        </p>
      )}
      {rows.length > 0 && shown.length === 0 && <EmptyState q={q} onReset={reset} />}
    </div>
  );
}
