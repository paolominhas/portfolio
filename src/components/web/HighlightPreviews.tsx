"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import type { WebProject } from "@/data/web-data";

/**
 * SITE PREVIEW
 * ─────────────────────────────────────────────────────────────────
 * Real screenshots of a live client site, inside a fake browser
 * chrome bar, cycled on click through `project.images`.
 *
 * This file previously held two bespoke, hand-built "mini
 * recreations" of each site with clickable tabs — genuinely
 * interactive, but simulated rather than real. Swapped out on
 * request for actual screenshots: what's shown is now the real
 * site, and the interactivity moved to *browsing between real
 * photos* — hover reveals the cue on desktop, a small "1/3" counter
 * stays visible for touch, click/tap advances, and the dots let you
 * jump straight to a specific shot.
 *
 * Generic on purpose (unlike the old EucoPreview/DioramaPreview
 * split): the two sites no longer need separately hand-built markup
 * now that each is just a photo + some chrome, so one component
 * driven by `project` covers both without duplicating this logic.
 *
 * Degrades gracefully via onError to a branded placeholder panel —
 * the page still looks intentional before real screenshot files
 * exist at /public/images/web/. Drop the files in; this component
 * needs no changes.
 */

interface SitePreviewProps {
  project: WebProject;
}

export default function SitePreview({ project }: SitePreviewProps) {
  const images =
    project.images && project.images.length > 0 ? project.images : [project.image];
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const multi = images.length > 1;

  const host = project.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  function advance() {
    if (multi) setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-navy/10 bg-white shadow-[0_20px_60px_rgba(16,21,133,0.12)]">
      {/* Fake browser chrome, coloured per-project */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ backgroundColor: project.chromeColor }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 flex-1 truncate rounded-full bg-white/10 px-3 py-1 text-center font-mono text-[10px] text-white/50">
          {host}
        </span>
      </div>

      {/* Screenshot, cycled on click/tap/Enter */}
      <div
        role={multi ? "button" : undefined}
        tabIndex={multi ? 0 : undefined}
        onClick={multi ? advance : undefined}
        onKeyDown={
          multi
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  advance();
                }
              }
            : undefined
        }
        aria-label={
          multi
            ? `${project.title} screenshot ${index + 1} of ${images.length}. Activate to see the next one.`
            : `${project.title} screenshot`
        }
        className={`group relative block aspect-[4/3] w-full overflow-hidden bg-navy-deep focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow/60 ${
          multi ? "cursor-pointer" : ""
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            {failed[index] ? (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center"
                style={{ backgroundColor: project.chromeColor }}
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  {host}
                </p>
                <p className="text-sm font-semibold text-white/70">{project.title}</p>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[index]}
                alt={`${project.title} — screenshot ${index + 1} of ${images.length}`}
                className="h-full w-full object-cover object-top"
                onError={() => setFailed((f) => ({ ...f, [index]: true }))}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {multi && (
          <>
            {/* Always-visible counter — the discoverable cue on touch,
                where there's no hover to reveal anything. */}
            <span className="absolute top-3 right-3 rounded-full bg-navy/60 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] text-white">
              {index + 1}/{images.length}
            </span>

            {/* Hover cue — the richer affordance on desktop */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all duration-300 group-hover:bg-navy/30 group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-navy shadow-lg">
                <RefreshCw size={13} /> Next view
              </span>
            </div>

            {/* Dot indicators — jump straight to a shot */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  aria-label={`Show screenshot ${i + 1} of ${images.length}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
