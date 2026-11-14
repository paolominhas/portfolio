"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SPECIMEN_SLOTS } from "@/data/specimens";

/**
 * SPECIMEN: a transparent cut-out image floating over a page.
 *
 * <SpecimenProvider available={...}> goes in each layout (the server works out
 * which files exist; see lib/specimens.ts). <Specimen slot="main-hero" /> then
 * renders the image if there is one and nothing at all if there is not, so the
 * slots can be wired up before any artwork exists.
 *
 * The image drifts a little against the pointer and the scroll position, which
 * is what makes a cut-out feel like an object in front of the page. `depth`
 * sets how far (0 = fixed). Reduced motion switches the drift off.
 *
 * With ?specimens=show in the URL an empty slot draws a dashed outline with its
 * id, to check placement before the artwork arrives.
 */

const Ctx = createContext<Record<string, string>>({});

export function SpecimenProvider({ available, children }: { available: Record<string, string>; children: React.ReactNode }) {
  return <Ctx.Provider value={available}>{children}</Ctx.Provider>;
}

export default function Specimen({ slot, className = "", depth = 1 }: { slot: string; className?: string; depth?: number }) {
  const src = useContext(Ctx)[slot];
  const meta = SPECIMEN_SLOTS.find((s) => s.id === slot);
  const ref = useRef<HTMLDivElement>(null);
  const [ghost, setGhost] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setGhost(new URLSearchParams(window.location.search).get("specimens") === "show");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src || depth === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let px = 0, py = 0, raf = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // scroll drift: how far the slot's centre is from the viewport centre
      const off = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty("--sx", `${(-px * 14 * depth).toFixed(1)}px`);
      el.style.setProperty("--sy", `${(-py * 10 * depth - off * 36 * depth).toFixed(1)}px`);
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      req();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", req, { passive: true });
    apply();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", req);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src, depth]);

  if (!src) {
    if (!ghost) return null;
    return (
      <div aria-hidden className={`in-specimen-ghost ${className}`} style={{ aspectRatio: meta?.shape === "landscape" ? "3 / 2" : meta?.shape === "square" ? "1" : "4 / 5" }}>
        <span>
          {slot}
          <br />
          {meta?.shape ?? ""}
        </span>
      </div>
    );
  }
  return (
    <div ref={ref} aria-hidden={meta?.alt ? undefined : true} className={`in-specimen ${className}`} style={{ opacity: loaded ? 1 : 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={meta?.alt ?? ""}
        decoding="async"
        ref={(img) => {
          if (img?.complete) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
