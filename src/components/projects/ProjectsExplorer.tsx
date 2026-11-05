"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { CATEGORIES, type ProjectCategory } from "@/data/projects";

/**
 * PROJECTS EXPLORER
 *
 * Search + category chips + tool chips + sort for /projects.
 *
 * - Every card is in the server-rendered HTML (filtering only hides/shows),
 *   so crawlers and no-JS readers see all projects.
 * - State lives in the URL (?q=&cat=&tool=&sort=) so a filtered view can be
 *   linked, e.g. /projects?cat=physics. It is read once on mount and written
 *   with history.replaceState (no re-render, no scroll jump).
 * - Search matches title, description, excerpt, tools and category name; all
 *   words must match (so "python xgboost" narrows, not widens).
 * - "/" focuses the search box; Esc clears it.
 */

export interface ExplorerProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  techStack: string[];
  category: ProjectCategory;
  external?: string;
}

type Sort = "featured" | "az";

const hostOf = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

export default function ProjectsExplorer({ projects }: { projects: ExplorerProject[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ProjectCategory | "all">("all");
  const [tools, setTools] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("featured");
  const [ready, setReady] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Read the URL once.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setQ(sp.get("q") ?? "");
    const c = sp.get("cat");
    if (c && CATEGORIES.some((x) => x.id === c)) setCat(c as ProjectCategory);
    const t = sp.getAll("tool");
    if (t.length) setTools(t);
    if (sp.get("sort") === "az") setSort("az");
    setReady(true);
  }, []);

  // Write it back (after the initial read, so we don't wipe incoming params).
  useEffect(() => {
    if (!ready) return;
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (cat !== "all") sp.set("cat", cat);
    tools.forEach((t) => sp.append("tool", t));
    if (sort !== "featured") sp.set("sort", sort);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, cat, tools, sort, ready]);

  // "/" to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const catLabel = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<ProjectCategory, string>, []);

  const matchesText = useCallback(
    (p: ExplorerProject) => {
      const words = norm(q).split(/\s+/).filter(Boolean);
      if (!words.length) return true;
      const hay = norm([p.title, p.description, p.excerpt, catLabel[p.category], ...p.techStack].join(" "));
      return words.every((w) => hay.includes(w));
    },
    [q, catLabel]
  );

  // Tools worth offering as chips: used by 2+ projects (so each chip can actually narrow something).
  const toolOptions = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => new Set(p.techStack).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [projects]);

  // Counts shown on category chips respect search + tools (but not the category itself).
  const baseFiltered = useMemo(
    () => projects.filter((p) => matchesText(p) && tools.every((t) => p.techStack.includes(t))),
    [projects, matchesText, tools]
  );
  const countFor = (id: ProjectCategory | "all") => (id === "all" ? baseFiltered.length : baseFiltered.filter((p) => p.category === id).length);

  const shown = useMemo(() => {
    const list = baseFiltered.filter((p) => cat === "all" || p.category === cat);
    return sort === "az" ? [...list].sort((a, b) => a.title.localeCompare(b.title)) : list;
  }, [baseFiltered, cat, sort]);

  const shownIds = new Set(shown.map((p) => p.id));
  const filtering = q.trim() !== "" || cat !== "all" || tools.length > 0;
  const reset = () => {
    setQ("");
    setCat("all");
    setTools([]);
  };
  const toggleTool = (t: string) => setTools((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const chip = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
      active ? "border-white bg-white text-black" : "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white"
    }`;

  return (
    <div>
      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <label className="relative flex-1">
          <span className="sr-only">Search projects</span>
          <Search size={16} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            ref={searchRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQ("")}
            placeholder="Search projects, tools, topics…  ( / )"
            className="w-full rounded-xl bg-zinc-900/70 border border-white/10 focus:border-white/40 outline-none pl-11 pr-10 py-3 text-white placeholder:text-zinc-500"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white">
              <X size={16} />
            </button>
          )}
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-xl bg-zinc-900/70 border border-white/10 focus:border-white/40 outline-none px-3 py-3 text-white"
          >
            <option value="featured">Featured</option>
            <option value="az">A to Z</option>
          </select>
        </label>
      </div>

      {/* Categories */}
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 mb-4">
        <button type="button" onClick={() => setCat("all")} aria-pressed={cat === "all"} className={chip(cat === "all")}>
          All <span className="text-xs opacity-60">{countFor("all")}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id} title={c.blurb} className={chip(cat === c.id)}>
            {c.label} <span className="text-xs opacity-60">{countFor(c.id)}</span>
          </button>
        ))}
      </div>

      {/* Tools */}
      {toolOptions.length > 0 && (
        <div role="group" aria-label="Filter by tool" className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs uppercase tracking-widest text-zinc-500 mr-1">Tools</span>
          {toolOptions.map((t) => {
            const on = tools.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTool(t)}
                aria-pressed={on}
                className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors ${on ? "bg-white text-black" : "bg-zinc-800/60 text-zinc-400 hover:text-white"}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      {/* Status line */}
      <div className="flex items-center justify-between mb-6 min-h-[1.5rem]">
        <p aria-live="polite" className="text-sm text-zinc-500">
          {filtering ? `${shown.length} of ${projects.length} projects` : `${projects.length} projects`}
        </p>
        {filtering && (
          <button type="button" onClick={reset} className="text-sm text-zinc-400 hover:text-white underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>

      {/* Cards: all stay in the DOM, filtering toggles `hidden`. Sorted order applied via CSS order. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => {
          const isExternal = Boolean(project.external);
          const href = isExternal ? project.external! : `/projects/${project.slug}`;
          const order = sort === "az" ? shown.findIndex((p) => p.id === project.id) : undefined;
          return (
            <Link
              key={project.id}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              hidden={!shownIds.has(project.id)}
              style={order !== undefined && order >= 0 ? { order } : undefined}
              className="group relative block bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 [&[hidden]]:hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-4 gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 border border-white/15 rounded-full px-2.5 py-1">
                    {catLabel[project.category]}
                  </span>
                  {isExternal && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {hostOf(project.external!)} <ArrowUpRight size={12} />
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{project.title}</h2>
                <p className="text-zinc-400 line-clamp-2 mb-5">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`text-xs font-mono px-2 py-1 rounded ${tools.includes(tech) ? "bg-white text-black" : "text-zinc-400 bg-zinc-800/50"}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
          <p className="text-zinc-300 mb-2">No projects match{q.trim() ? <> “{q.trim()}”</> : " those filters"}.</p>
          <button type="button" onClick={reset} className="text-sm text-zinc-400 hover:text-white underline underline-offset-4">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
