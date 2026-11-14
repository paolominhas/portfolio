"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { CATEGORIES, type ProjectCategory } from "@/data/projects";
import CoverArt, { coverForSlug, hasCover } from "@/components/physics/research/CoverArt";

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

  return (
    <div>
      {/* Search + sort */}
      <div className="mb-7 flex flex-col gap-x-10 gap-y-4 sm:flex-row sm:items-end">
        <label className="relative flex-1">
          <span className="in-label mb-1 block">Search</span>
          <input
            ref={searchRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQ("")}
            placeholder="Projects, tools, topics…  ( / )"
            className="in-field pr-9"
          />
          {q ? (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute bottom-2.5 right-0 p-1 text-[var(--ink-2)] hover:text-[var(--ink)]">
              <X size={18} />
            </button>
          ) : (
            <Search size={18} aria-hidden className="absolute bottom-3.5 right-1 text-[var(--ink-2)]" />
          )}
        </label>
        <label className="flex items-center gap-3">
          <span className="in-label">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="in-chip bg-[var(--ground)] !text-[var(--ink)]">
            <option value="featured">Featured</option>
            <option value="az">A to Z</option>
          </select>
        </label>
      </div>

      {/* Categories */}
      <div role="group" aria-label="Filter by category" className="mb-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setCat("all")} aria-pressed={cat === "all"} className="in-chip">
          All <small>{countFor("all")}</small>
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id} title={c.blurb} className="in-chip">
            {c.label} <small>{countFor(c.id)}</small>
          </button>
        ))}
      </div>

      {/* Tools */}
      {toolOptions.length > 0 && (
        <div role="group" aria-label="Filter by tool" className="mb-10 flex flex-wrap items-center gap-2">
          <span className="in-label mr-1">Tools</span>
          {toolOptions.map((t) => (
            <button key={t} type="button" onClick={() => toggleTool(t)} aria-pressed={tools.includes(t)} className="in-chip !min-h-[1.9rem] !px-2.5 font-mono !text-[0.75rem]">
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Status line */}
      <div className="mb-3 flex min-h-[1.5rem] items-center justify-between">
        <p aria-live="polite" className="in-label">
          {filtering ? `${shown.length} of ${projects.length} projects` : `${projects.length} projects`}
        </p>
        {filtering && (
          <button type="button" onClick={reset} className="in-link text-sm">
            Clear filters
          </button>
        )}
      </div>

      {/* Rows: all stay in the DOM, filtering toggles `hidden`. Sorted order applied via CSS order. */}
      <div className="flex flex-col border-t border-[var(--line)]">
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
              className="in-row group grid grid-cols-1 items-start gap-x-8 gap-y-3 py-7 md:grid-cols-[11rem_minmax(0,1fr)_15rem] md:px-4 [&[hidden]]:hidden"
            >
              <span className="hidden md:block">
                {hasCover(project.slug) ? (
                  <span className="block aspect-[16/10] overflow-hidden rounded-[3px] border border-[var(--line)]">
                    <CoverArt kind={coverForSlug(project.slug)} className="h-full w-full" />
                  </span>
                ) : (
                  <span className="in-label block pt-2">{catLabel[project.category]}</span>
                )}
              </span>
              <span>
                <span className="in-label mb-1 block md:hidden">{catLabel[project.category]}</span>
                <h2 className="text-[length:var(--step-2)] font-semibold leading-tight transition-colors group-hover:text-[var(--signal)]">{project.title}</h2>
                <span className="mt-2 block max-w-[64ch] leading-relaxed text-[var(--ink-2)]">{project.description}</span>
              </span>
              <span className="md:pt-2 md:text-right">
                {hasCover(project.slug) && <span className="in-label hidden md:block">{catLabel[project.category]}</span>}
                <span className="in-label block">
                  {project.techStack.map((tech, i) => (
                    <span key={tech} className={tools.includes(tech) ? "text-[var(--signal)]" : undefined}>
                      {tech}
                      {i < project.techStack.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
                {isExternal && (
                  <span className="in-label mt-2 inline-flex items-center gap-1 text-[var(--ink)]">
                    Opens {hostOf(project.external!)} <ArrowUpRight size={12} />
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div className="border-b border-[var(--line)] py-12">
          <p className="mb-3 text-[length:var(--step-1)]">No projects match{q.trim() ? <> “{q.trim()}”</> : " those filters"}.</p>
          <button type="button" onClick={reset} className="in-link">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
