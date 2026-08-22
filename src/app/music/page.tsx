"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { arrangements } from "@/data/arrangements";
import ArrangementCard from "@/components/music/ArrangementCard";
import { CircledNumber, Struck } from "@/components/music/CircledNumber";

/**
 * MUSIC HOME / ARRANGEMENTS ARCHIVE
 * ─────────────────────────────────────────────────────────────────
 * `/arrangements` re-exports this file (see arrangements/page.tsx),
 * so this page IS the archive, not just a landing page pointing at it.
 *
 * Structure: a standard unpinned hero, then a pinned "record crate"
 * section, then a closing block. The crate section is the technical
 * core — see the comment above `wrapperRef` for the scroll geometry,
 * and ArrangementCard.tsx for the per-card flip logic.
 *
 * `prefers-reduced-motion` gets an entirely separate, static render
 * branch (a plain grid, no pin, no scroll transforms) rather than a
 * version of the same JSX with animations dialled down — simpler to
 * reason about and guarantees zero motion for anyone who's asked for
 * that.
 */

export default function MusicHome() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const total = arrangements.length;

  // Progress spans exactly the pinned duration: 0 the instant the
  // sticky stage locks to the top of the viewport, 1 the instant it
  // releases. (Same geometry as ProcessShowcase — see that file for
  // the full explanation of why "start start"/"end end" on a wrapper
  // taller than its sticky child produces this.)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // A plain integer mirror of the continuous scroll progress, used to
  // decide which cards are actually mounted. useMotionValueEvent lets
  // us read the MotionValue without subscribing the whole component
  // to every frame — we only setState when the *index* changes, not
  // on every pixel of scroll.
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const activeArrangement = arrangements[activeIndex];

  // Performance requirement: only the active card and its immediate
  // neighbours are ever mounted. The rest of the crate genuinely isn't
  // in the DOM, not just visually hidden — this is what keeps a much
  // larger archive from tanking frame rate, not just this 3-item demo.
  const visibleIndices = [activeIndex - 1, activeIndex, activeIndex + 1].filter(
    (i) => i >= 0 && i < total,
  );

  return (
    <div>
      {/* ================= HERO — standard, unpinned ================= */}
      <section className="relative overflow-hidden px-6 md:px-10 pt-40 pb-28 md:pt-48 md:pb-32">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[70vh] mesh-bleed pointer-events-none"
        />
        <div className="relative max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <CircledNumber n={total} size="md" />
            <span className="font-mono text-xs uppercase tracking-widest text-black/60">
              Arrangements in the crate, and counting
            </span>
          </div>

          <h1 className="font-display font-bold tracking-tight text-black leading-[0.95] text-5xl md:text-7xl lg:text-8xl mb-8">
            Scores you can <Struck>stream.</Struck>
            <br />
            Take the whole crate home.
          </h1>

          <p className="text-lg md:text-xl text-black/70 max-w-xl leading-relaxed mb-14">
            Chamber-ensemble arrangements, rescored for the players actually
            in the room — every one a real download: a score, sometimes a
            recording, never a stream you can't keep.
          </p>

          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-black/50">
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={14} />
            </motion.span>
            Scroll to start digging
          </div>
        </div>
      </section>

      {/* ================= THE RECORD CRATE ================= */}
      {reduceMotion ? (
        // Reduced-motion fallback: a plain, static, fully accessible grid.
        <section className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {arrangements.map((arr, i) => (
              <Link
                key={arr.slug}
                href={`/arrangements/${arr.slug}`}
                className="block border-4 border-black bg-cream p-6 shadow-brutal hover:bg-magenta hover:text-white transition-colors group"
              >
                <CircledNumber n={i + 1} active size="sm" />
                <h2 className="font-display text-2xl font-bold mt-4 mb-2 leading-tight">
                  {arr.title}
                </h2>
                <p className="text-sm text-black/60 group-hover:text-white/80">
                  {arr.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        // Tall driver: 100vh (the sticky stage itself) + 70vh per
        // arrangement of scroll runway to flip through it. Tune the
        // 70vh figure to make each flip feel faster/slower.
        <div
          ref={wrapperRef}
          className="relative"
          style={{ height: `${100 + total * 70}vh` }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row bg-lime">
            {/* LEFT — now-flipping info panel (static position, crossfading text) */}
            <div className="w-full md:w-[26%] shrink-0 flex md:flex-col justify-between px-6 md:px-10 pt-28 pb-6 md:py-16 z-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-black/50 mb-5">
                  Now flipping
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeArrangement.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-mono text-[11px] text-black/50 mb-2">
                      {activeArrangement.originalComposer}
                    </p>
                    <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-black">
                      {activeArrangement.title}
                    </h2>
                    <p className="hidden md:block text-sm text-black/60 mt-3 max-w-[22rem]">
                      {activeArrangement.excerpt}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="font-mono text-xs text-black/40">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </p>
            </div>

            {/* CENTER — the crate stage. `perspective` lives here, on the
                direct parent of each ArrangementCard's root element —
                see the note in ArrangementCard.tsx on why it can't live
                on the card itself. */}
            <div
              className="relative flex-1 h-full min-h-0"
              style={{ perspective: "1400px" }}
            >
              {visibleIndices.map((i) => (
                <ArrangementCard
                  key={arrangements[i].slug}
                  arrangement={arrangements[i]}
                  index={i}
                  total={total}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            {/* RIGHT — track-listing index, desktop only */}
            <div className="hidden md:flex flex-col justify-center gap-7 px-10 w-[18%] shrink-0">
              {arrangements.map((arr, i) => (
                <div key={arr.slug} className="flex items-center gap-3">
                  <CircledNumber n={i + 1} active={i === activeIndex} size="sm" />
                  <span
                    className={`text-[11px] font-mono uppercase tracking-wide transition-colors duration-300 ${
                      i === activeIndex ? "text-black" : "text-black/30"
                    }`}
                  >
                    {arr.arrangedFor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= CLOSING ================= */}
      <section className="px-6 md:px-10 py-24 md:py-32 text-center max-w-2xl mx-auto">
        <p className="text-black/60 mb-8 leading-relaxed">
          That&apos;s the whole crate — {total} arrangement
          {total === 1 ? "" : "s"} so far, each one a real download. New ones
          get added after every concert that needed one.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black bg-cream font-bold text-sm uppercase tracking-wide shadow-brutal-sm hover:bg-magenta hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
        >
          Why these exist →
        </Link>
      </section>
    </div>
  );
}
