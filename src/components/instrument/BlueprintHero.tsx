"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Specimen from "./Specimen";

/**
 * BLUEPRINT HERO: the web site's opening section.
 *
 * The page is drawn as its own working drawing. The headline carries live
 * dimension lines (its real rendered width and height in pixels, re-measured
 * whenever the layout changes), the pointer drags a pair of construction lines
 * with its coordinates, and the title block in the corner reports the size of
 * the "sheet" (the viewport) as you resize it. The facts in the title block
 * are the ones that were in the old code-window card.
 *
 * The measurements are decoration for assistive tech (aria-hidden); the
 * heading, text and links are ordinary markup.
 */

export default function BlueprintHero() {
  const section = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState<{ w: number; h: number } | null>(null);
  const [sheet, setSheet] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = h1.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setDim({ w: Math.round(r.width), h: Math.round(r.height) });
      setSheet({ w: window.innerWidth, h: window.innerHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const s = section.current, c = cross.current;
    if (!s || !c || e.pointerType !== "mouse") return;
    const r = s.getBoundingClientRect();
    const x = Math.round(e.clientX - r.left), y = Math.round(e.clientY - r.top);
    c.style.opacity = "1";
    c.style.setProperty("--x", `${x}px`);
    c.style.setProperty("--y", `${y}px`);
    const label = c.querySelector<HTMLElement>("[data-xy]");
    if (label) label.textContent = `x ${x}  y ${y}`;
  };
  const onLeave = () => {
    if (cross.current) cross.current.style.opacity = "0";
  };

  const rows: [string, string][] = [
    ["Drawn by", "Paolo Minhas"],
    ["Stack", "Next.js, TypeScript, Docker"],
    ["Based in", "Edinburgh, UK"],
    ["Also", "physicist, musician"],
    ["Sheet", sheet ? `${sheet.w} × ${sheet.h} px` : "measuring"],
  ];

  return (
    <section
      ref={section}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative overflow-hidden bg-navy px-5 pb-20 pt-32 text-white md:px-8 md:pb-28 md:pt-40"
      style={{
        backgroundImage:
          "linear-gradient(rgb(255 255 255 / .09) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .09) 1px, transparent 1px), linear-gradient(rgb(255 255 255 / .045) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .045) 1px, transparent 1px)",
        backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        backgroundPosition: "-1px -1px",
      }}
    >
      {/* construction lines that follow the pointer */}
      <div ref={cross} aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200">
        <span className="absolute inset-y-0 w-px bg-lilac/60" style={{ left: "var(--x)" }} />
        <span className="absolute inset-x-0 h-px bg-lilac/60" style={{ top: "var(--y)" }} />
        <span data-xy className="absolute whitespace-pre bg-navy px-1.5 py-0.5 font-mono text-[0.68rem] text-lilac" style={{ left: "calc(var(--x) + 10px)", top: "calc(var(--y) + 10px)" }} />
      </div>

      <div className="in-dark relative mx-auto max-w-[90rem]">
        <Specimen slot="web-hero" className="absolute -top-8 right-0 hidden w-[min(19vw,16rem)] lg:block" />
        <div className="in-enter relative">
          <p className="mb-7 flex items-center gap-2.5 font-mono text-[0.78rem] text-white/80">
            <span aria-hidden className="h-2 w-2 rounded-full bg-yellow" style={{ animation: "in-lamp 2.4s ease-in-out infinite" }} />
            Available for new projects
          </p>

          <div className="relative inline-block max-w-full pb-9 pr-10 md:pr-14">
            <h1 ref={h1} className="in-display max-w-[14ch] text-[clamp(2.7rem,7.4vw,6.6rem)]">
              Websites built like software, not like templates.
            </h1>
            {/* width dimension */}
            <div aria-hidden className="absolute bottom-0 left-0 right-10 flex items-center gap-3 text-yellow md:right-14">
              <span className="h-3 w-px bg-current" />
              <span className="h-px flex-1 bg-current" />
              <span className="font-mono text-[0.7rem] tabular-nums">{dim ? `${dim.w} px` : "width"}</span>
              <span className="h-px flex-1 bg-current" />
              <span className="h-3 w-px bg-current" />
            </div>
            {/* height dimension */}
            <div aria-hidden className="absolute bottom-9 right-0 top-0 flex w-6 flex-col items-center gap-3 text-yellow md:w-8">
              <span className="h-px w-3 bg-current" />
              <span className="w-px flex-1 bg-current" />
              <span className="font-mono text-[0.7rem] tabular-nums [writing-mode:vertical-rl]">{dim ? `${dim.h} px` : "height"}</span>
              <span className="w-px flex-1 bg-current" />
              <span className="h-px w-3 bg-current" />
            </div>
          </div>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="max-w-[54ch] text-[length:var(--step-1)] leading-[1.45] text-white/85">
                I design and build full-stack web projects, from marketing sites to content-managed platforms, with the same rigour I&apos;d bring
                to a research codebase: typed, version-controlled, and built to be maintained.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href="/portfolio"
                  className="flex h-12 items-center rounded-[3px] bg-yellow px-6 text-[1.02rem] font-semibold text-navy transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  View selected work
                </Link>
                <a
                  href="https://paolo.org.uk/contact"
                  className="text-[1.02rem] font-medium underline decoration-yellow decoration-2 underline-offset-[6px] transition-[text-underline-offset] hover:underline-offset-[9px]"
                >
                  Get in touch
                </a>
              </div>
            </div>

            {/* title block */}
            <dl className="border border-white/45 bg-navy font-mono text-[0.76rem] lg:col-span-5 lg:col-start-8">
              {rows.map(([k, v], i) => (
                <div key={k} className={`grid grid-cols-[6.5rem_1fr] ${i ? "border-t border-white/25" : ""}`}>
                  <dt className="border-r border-white/25 px-3 py-2.5 text-white/65">{k}</dt>
                  <dd className="m-0 px-3 py-2.5 tabular-nums text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
