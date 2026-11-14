"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITES, sitePath, type RailItem, type Skin } from "./sites";

/**
 * THE RAIL: one navigation bar for main, physics and web.
 *
 * Conventional where it matters (name on the left links to this site's home,
 * links in the middle, primary action on the right, a menu button on phones)
 * and specific in three details:
 *
 *   - a needle on the bottom edge sits under the current page and slides to
 *     whatever link the pointer or keyboard focus is on;
 *   - the bottom edge itself fills from left to right as the page scrolls;
 *   - a three-position site switch (Paolo / Physics / Web) is in the same
 *     place on every site, each position marked with that site's colour.
 *
 * Colours come from the skin tokens in globals.css. No entrance animation:
 * navigation should be there immediately.
 */

interface RailProps {
  skin: Skin;
  /** Shown after the name on subdomains, e.g. "Physics". */
  siteLabel?: string;
  items: RailItem[];
  cta?: { name: string; href: string };
}

export default function Rail({ skin, siteLabel, items, cta }: RailProps) {
  const pathname = usePathname();
  const here = sitePath(pathname, skin);
  const isActive = (p: string) => (p === "/" ? here === "/" : here === p || here.startsWith(p + "/"));

  const [open, setOpen] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  /* needle: move under an element, or back to the active link, or hide */
  const moveNeedle = useCallback((el: HTMLElement | null) => {
    const n = needleRef.current, box = linksRef.current;
    if (!n || !box) return;
    const target = el ?? box.querySelector<HTMLElement>('[aria-current="page"]');
    if (!target) {
      n.style.opacity = "0";
      return;
    }
    const a = target.getBoundingClientRect(), b = box.getBoundingClientRect();
    n.style.opacity = "1";
    n.style.width = `${a.width - 24}px`;
    n.style.transform = `translateX(${a.left - b.left + 12}px)`;
  }, []);

  useEffect(() => {
    moveNeedle(null);
    const onResize = () => moveNeedle(null);
    window.addEventListener("resize", onResize);
    // fonts change link widths once they load
    document.fonts?.ready.then(() => moveNeedle(null)).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [pathname, moveNeedle]);

  /* scroll progress on the bottom edge */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  /* phone menu: close on navigation and Escape, lock the page behind it */
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const switcher = (large = false) => (
    <nav aria-label="Paolo's sites" className={`flex items-stretch rounded-[3px] border border-[var(--line)] ${large ? "w-full" : ""}`}>
      {SITES.map((s) => {
        const current = s.key === skin;
        return (
          <a
            key={s.key}
            href={s.href}
            aria-current={current ? "true" : undefined}
            title={s.blurb}
            className={`group/sw relative flex items-center justify-center gap-2 font-mono transition-colors ${large ? "flex-1 h-12 text-sm" : "h-8 px-3 text-[0.7rem]"} ${
              current ? "bg-[var(--ink)] text-[var(--ground)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
            }`}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full transition-transform group-hover/sw:scale-150" style={{ background: s.color }} />
            {s.name}
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
    <header
      className="fixed inset-x-0 top-0 z-50 text-[var(--ink)]"
      style={{ background: "color-mix(in srgb, var(--ground) 88%, transparent)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-6 px-5 md:px-8">
        <Link href="/" className="flex shrink-0 items-baseline gap-2 text-[0.95rem] font-semibold tracking-tight">
          <span aria-hidden className="relative top-[-1px] h-2 w-2 self-center rounded-full bg-[var(--signal)]" />
          <span>Paolo Minhas</span>
          {siteLabel && (
            <>
              <span aria-hidden className="text-[var(--ink-2)]">/</span>
              <span className="text-[var(--signal)]">{siteLabel}</span>
            </>
          )}
        </Link>

        <div ref={linksRef} className="relative hidden h-full flex-1 items-center md:flex" onMouseLeave={() => moveNeedle(null)}>
          {items.map((it) => {
            const active = isActive(it.path);
            return (
              <Link
                key={it.path}
                href={it.path}
                aria-current={active ? "page" : undefined}
                onMouseEnter={(e) => moveNeedle(e.currentTarget)}
                onFocus={(e) => moveNeedle(e.currentTarget)}
                onBlur={() => moveNeedle(null)}
                className={`flex h-full items-center px-3 text-sm transition-colors ${active ? "text-[var(--ink)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"}`}
              >
                {it.name}
              </Link>
            );
          })}
          <span
            ref={needleRef}
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-[3px] bg-[var(--signal)] opacity-0 transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none"
          />
        </div>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          {switcher()}
          {cta && (
            <a href={cta.href} className="flex h-8 items-center rounded-[3px] bg-[var(--signal)] px-3.5 text-sm font-semibold text-[var(--signal-ink)] transition-transform hover:-translate-y-px active:translate-y-0">
              {cta.name}
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="rail-menu"
          className="ml-auto flex h-11 items-center gap-2.5 px-1 font-mono text-xs md:hidden"
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden className="relative block h-3 w-5">
            <span className={`absolute left-0 h-[2px] w-5 bg-current transition-transform duration-200 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-[2px] w-5 bg-current transition-transform duration-200 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
          </span>
        </button>
      </div>

      {/* bottom edge: hairline + scroll progress */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[var(--line)]" />
      <span ref={progressRef} aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--signal)]" style={{ transform: "scaleX(0)" }} />

    </header>

      {/* phone menu: outside the header, because the header's backdrop-filter would otherwise clip a fixed child */}
      <div id="rail-menu" hidden={!open} className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto bg-[var(--ground)] text-[var(--ink)] px-5 pb-10 pt-4 md:hidden">
        <nav aria-label="Pages" className="border-t border-[var(--line)]">
          {items.map((it) => {
            const active = isActive(it.path);
            return (
              <Link
                key={it.path}
                href={it.path}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-[3.5rem] items-center justify-between border-b border-[var(--line)] text-[1.6rem] font-semibold tracking-tight"
              >
                {it.name}
                {active && <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--signal)]" />}
              </Link>
            );
          })}
        </nav>
        {cta && (
          <a href={cta.href} className="mt-6 flex h-12 items-center justify-center rounded-[3px] bg-[var(--signal)] font-semibold text-[var(--signal-ink)]">
            {cta.name}
          </a>
        )}
        <p className="in-label mb-2 mt-8">Switch site</p>
        {switcher(true)}
      </div>
    </>
  );
}
