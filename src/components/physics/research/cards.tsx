"use client";

/**
 * SHARED PIECES for the research, articles and projects indexes: a lead
 * ("spotlight") card, a story card, the search box and chips, and the URL-synced
 * filter state. Modelled on a newsletter front page: one big lead story with a
 * picture, then a grid of picture-first cards, each with a kicker, a headline,
 * a standfirst and a byline.
 *
 * Every card stays in the server HTML (filtering only toggles `hidden`), so
 * crawlers and no-JS readers see all of them, the way ProjectsExplorer does.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import CoverArt, { type CoverKind } from "./CoverArt";

export interface CardItem {
  key: string;
  href: string;
  cover: CoverKind;
  /** Optional real image (a photo, say); used instead of the generated cover when set. */
  image?: string;
  kicker: string;
  title: string;
  standfirst: string;
  /** Small mono chips under the text (tags or tech). */
  chips?: string[];
  /** Pieces of the byline after the author, e.g. ["Summer 2025", "IFJ PAN, Kraków"]. */
  meta: string[];
  highlights?: string[];
  hidden?: boolean;
  /** Seconds before the entrance animation starts. */
  delay?: number;
}

export const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Every word typed must appear somewhere in the haystack. */
export const matches = (q: string, hay: string[]) => {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const h = norm(hay.join(" "));
  return words.every((w) => h.includes(w));
};

/** q plus a few single-valued keys, kept in sync with the address bar. */
export function useUrlFilters<K extends string>(keys: readonly K[]) {
  const [q, setQ] = useState("");
  const [vals, setVals] = useState<Record<K, string>>(() => Object.fromEntries(keys.map((k) => [k, ""])) as Record<K, string>);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setQ(sp.get("q") ?? "");
    setVals(Object.fromEntries(keys.map((k) => [k, sp.get(k) ?? ""])) as Record<K, string>);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    keys.forEach((k) => vals[k] && sp.set(k, vals[k]));
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, vals, ready]);

  const set = useCallback((k: K, v: string) => setVals((cur) => ({ ...cur, [k]: v })), []);
  const reset = useCallback(() => {
    setQ("");
    setVals(Object.fromEntries(keys.map((k) => [k, ""])) as Record<K, string>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { q, setQ, vals, set, reset };
}

export function SearchBox({ q, setQ, label, placeholder }: { q: string; setQ: (s: string) => void; label: string; placeholder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Search size={16} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
      <input
        ref={ref}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setQ("")}
        placeholder={placeholder}
        className="w-full rounded-full bg-white/[0.05] border border-white/10 focus:border-[var(--accent-border)] outline-none pl-11 pr-10 py-3 text-white placeholder:text-white/35 transition-colors"
      />
      {q && (
        <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white">
          <X size={16} />
        </button>
      )}
    </label>
  );
}

export function Chip({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: React.ReactNode; count?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active ? "border-[var(--accent)] bg-[var(--accent)] text-black" : "border-white/15 text-white/65 hover:border-white/40 hover:text-white"
      }`}
    >
      {children}
      {count !== undefined && <span className="text-xs opacity-60">{count}</span>}
    </button>
  );
}

export function Byline({ parts }: { parts: string[] }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-white/45 min-w-0">
      <span aria-hidden className="grid place-items-center w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-ember to-kelp text-[10px] font-semibold text-black">
        PM
      </span>
      <span className="text-white/70 whitespace-nowrap shrink-0">Paolo Minhas</span>
      <span className="truncate min-w-0">
        <span aria-hidden className="mr-2 text-white/25">·</span>
        {parts.join("  ·  ")}
      </span>
    </div>
  );
}

export const CARD_CSS = `
@keyframes rx-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.rx-in{animation:none!important}}
`;

function Cover({ item, loop, className }: { item: CardItem; loop?: boolean; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (item.image) return <img src={item.image} alt="" loading="lazy" className={`${className} object-cover`} />;
  return <CoverArt kind={item.cover} seed={item.key} loop={loop} className={className} />;
}

/** The big lead card. */
export function LeadCard({ item, badge = "Spotlight", cta = "Read the research" }: { item: CardItem; badge?: string; cta?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg) scale(1.01)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <Link
      href={item.href}
      hidden={item.hidden}
      className="rx-in group relative block rounded-3xl border border-white/10 bg-white/[0.03] hover:border-[var(--accent-border)] transition-colors p-4 md:p-6 [&[hidden]]:hidden [animation:rx-in_.6s_ease-out_both]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="min-w-0 md:col-span-7" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div ref={ref} className="relative overflow-hidden rounded-2xl border border-white/10 aspect-[16/10] transition-transform duration-200 ease-out will-change-transform">
            <Cover item={item} loop className="absolute inset-0 w-full h-full" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur px-3 py-1 text-[11px] font-mono text-[var(--accent)] border border-[var(--accent-border)]">
              <Sparkles size={12} aria-hidden /> {badge}
            </span>
          </div>
        </div>
        <div className="min-w-0 md:col-span-5 md:pr-4">
          <p className="font-mono text-xs tracking-wider text-[var(--accent)] mb-3">{item.kicker}</p>
          <h2 className="font-bodoni text-3xl md:text-[2.6rem] leading-[1.08] font-medium text-white mb-4 group-hover:text-[var(--accent)] transition-colors">{item.title}</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-5">{item.standfirst}</p>
          {item.highlights && item.highlights.length > 0 && (
            <ul className="mb-5 space-y-1.5">
              {item.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-white/70">
                  <span aria-hidden className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mb-5">
            <Byline parts={item.meta} />
          </div>
          {item.chips && (
            <div className="flex flex-wrap gap-2 mb-6">
              {item.chips.map((c) => (
                <span key={c} className="text-xs font-mono text-white/45 bg-white/5 px-2 py-1 rounded">
                  {c}
                </span>
              ))}
            </div>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] text-black font-medium px-5 py-2.5 text-sm group-hover:gap-3 transition-all">
            {cta} <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** A picture-first card. */
export function StoryCard({ item, cta = "Read more" }: { item: CardItem; cta?: string }) {
  return (
    <Link
      href={item.href}
      hidden={item.hidden}
      style={{ animationDelay: `${item.delay ?? 0}s` }}
      className="rx-in group block [&[hidden]]:hidden [animation:rx-in_.55s_ease-out_both]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-[var(--accent-border)] transition-colors aspect-[16/10] mb-4">
        <div className="absolute inset-0 motion-safe:group-hover:scale-[1.035] transition-transform duration-500 ease-out">
          <Cover item={item} className="w-full h-full" />
        </div>
      </div>
      <p className="font-mono text-[11px] tracking-wider text-[var(--accent)] mb-2">{item.kicker}</p>
      <h2 className="font-bodoni text-2xl leading-snug font-medium text-white mb-2 group-hover:text-[var(--accent)] transition-colors">{item.title}</h2>
      <p className="text-white/55 leading-relaxed line-clamp-3 mb-4">{item.standfirst}</p>
      <div className="flex items-center justify-between gap-3">
        <Byline parts={item.meta} />
        <span aria-label={cta} className="shrink-0 text-[var(--accent)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export function EmptyState({ q, onReset }: { q: string; onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
      <p className="text-white/70 mb-2">No results{q.trim() ? <> for “{q.trim()}”</> : " for those filters"}.</p>
      <button type="button" onClick={onReset} className="text-sm text-white/50 hover:text-white underline underline-offset-4">
        Clear filters
      </button>
    </div>
  );
}
