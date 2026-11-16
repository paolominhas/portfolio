"use client";

import { useRef } from "react";
import Link from "next/link";
import Specimen from "./Specimen";
import CarbonBadge from "@/components/shared/CarbonBadge";
import { MAIN_PAGES, SIDE_SITES, SITES, type RailItem, type Skin } from "./sites";

/**
 * THE BACKPLATE: one footer for main, physics and web.
 *
 * Same links the old footers carried (this site's pages, the main site's pages,
 * the other sites with "you are here", GitHub and email, the Website Carbon
 * badge), plus a back-to-top control. The large name at the top is set in the
 * variable width axis of Instrument Sans: letters widen as the pointer passes
 * over them. It is decoration, so it is hidden from assistive tech and the
 * plain name is in the text below.
 */

const NAME = "Paolo Minhas";

function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ref.current?.querySelectorAll<HTMLElement>("span[data-l]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const k = Math.max(0, 1 - d / 260);
      el.style.fontVariationSettings = `"wdth" ${(75 + 25 * k * k).toFixed(1)}, "wght" ${(520 + 180 * k).toFixed(0)}`;
      el.style.color = k > 0.55 ? "var(--signal)" : "";
    });
  };
  const onLeave = () =>
    ref.current?.querySelectorAll<HTMLElement>("span[data-l]").forEach((el) => {
      el.style.fontVariationSettings = "";
      el.style.color = "";
    });
  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="select-none whitespace-nowrap font-sans leading-[0.82] tracking-[-0.04em] text-[var(--ink)]"
      style={{ fontSize: "clamp(3.2rem, 15.5vw, 15rem)", fontVariationSettings: '"wdth" 75, "wght" 520' }}
    >
      {NAME.split("").map((ch, i) => (
        <span key={i} data-l className="inline-block transition-[font-variation-settings,color] duration-300 ease-out" style={{ fontVariationSettings: '"wdth" 75, "wght" 520' }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </div>
  );
}

const colHead = "in-label mb-4 block";
const linkCls = "block py-1 text-[0.95rem] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]";

export default function Backplate({ skin, items, siteLabel }: { skin: Skin; items: RailItem[]; siteLabel?: string }) {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-[var(--line)] bg-[var(--ground-deep)] text-[var(--ink)]">
      <div className="relative mx-auto max-w-[90rem] px-5 pt-14 md:px-8 md:pt-20">
        <Specimen slot={`${skin}-footer`} className="absolute right-8 top-8 hidden w-[min(16vw,14rem)] md:block" depth={0.6} />
        <Wordmark />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[var(--line)] pt-10 md:grid-cols-12">
          <p className="col-span-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-[var(--ink-2)] md:col-span-4">
            Paolo Minhas. Physicist and developer: detector simulations, websites, arrangements and tutoring, each on its own site.
          </p>

          {items.length > 0 && (
            <nav aria-label={`${siteLabel ?? "This site"} pages`} className="md:col-span-2">
              <span className={colHead}>{siteLabel ?? "This site"}</span>
              {items.map((it) => (
                <Link key={it.path} href={it.path} className={linkCls}>
                  {it.name}
                </Link>
              ))}
            </nav>
          )}

          {skin !== "main" && (
            <nav aria-label="Main site pages" className="md:col-span-2">
              <span className={colHead}>paolo.org.uk</span>
              {MAIN_PAGES.map((l) => (
                <a key={l.name} href={l.href} className={linkCls}>
                  {l.name}
                </a>
              ))}
            </nav>
          )}

          <nav aria-label="All sites" className={skin === "main" ? "md:col-span-4" : "md:col-span-2"}>
            <span className={colHead}>Sites</span>
            {[...SITES.map((s) => ({ ...s, current: s.key === skin })), ...SIDE_SITES.map((s) => ({ ...s, current: false }))].map((s) => (
              <a key={s.name} href={s.href} className={`${linkCls} group flex items-center gap-2.5`}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-150" style={{ background: s.color }} />
                {s.name}
                {s.current && <span className="font-mono text-[0.65rem] text-[var(--signal)]">you are here</span>}
              </a>
            ))}
          </nav>

          <div className="md:col-span-2">
            <span className={colHead}>Contact</span>
            <a href="mailto:info@paolo.org.uk" className={linkCls}>
              info@paolo.org.uk
            </a>
            <a href="https://github.com/paolominhas" className={linkCls}>
              GitHub
            </a>
            <a href="https://paolo.org.uk/contact" className={linkCls}>
              Contact form
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-[var(--line)] py-6 md:flex-row md:items-center">
          <p className="in-label">© {new Date().getFullYear()} Paolo Minhas. Built with Next.js.</p>
          <div className="flex items-center gap-6">
            <CarbonBadge theme="dark" />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
              className="flex h-10 items-center gap-2 rounded-[3px] border border-[var(--line)] px-3.5 text-sm text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              Back to top
              <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 11V1M1.5 5.5 6 1l4.5 4.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
