"use client";

import { useEffect, useRef } from "react";

/**
 * MUSIC POST CONTENT
 *
 * Renders blog post HTML and then scans for <div class="vexflow-score">
 * elements to hydrate with VexFlow notation. This is a progressive
 * enhancement — the HTML loads immediately, then VexFlow renders
 * the staves after the component mounts.
 *
 * USAGE IN POST CONTENT:
 *
 * <div class="vexflow-score"
 *      data-clef="treble"
 *      data-time="4/4"
 *      data-notes="C5/q, D5, E5, F5">
 * </div>
 *
 * data-notes uses VexFlow EasyScore syntax:
 *   "C5/q"  = C5 quarter note
 *   "D5/h"  = D5 half note
 *   "E5/w"  = E5 whole note
 *   "F#5/8" = F#5 eighth note
 *
 * INSTALLING VEXFLOW:
 *   npm install vexflow
 *
 * VexFlow is loaded dynamically (next/dynamic wouldn't help here
 * since we need to manipulate DOM nodes after render). The dynamic
 * import ensures it's only downloaded when a post actually contains
 * notation.
 */

interface MusicPostContentProps {
  html: string;
}

export default function MusicPostContent({ html }: MusicPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all vexflow-score placeholder divs
    const scoreElements =
      contentRef.current.querySelectorAll(".vexflow-score");
    if (scoreElements.length === 0) return;

    // Dynamically import VexFlow only when needed
    import("vexflow").then((VexFlowModule) => {
      const VexFlow = VexFlowModule.default || VexFlowModule;
      const { Factory, EasyScore, System, Renderer, Stave, StaveNote, Voice, Formatter } = VexFlow;

      scoreElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const clef = htmlEl.dataset.clef || "treble";
        const time = htmlEl.dataset.time || "4/4";
        const notesStr = htmlEl.dataset.notes || "";

        if (!notesStr) return;

        // Clear any previous render
        htmlEl.innerHTML = "";

        try {
          // Use the Factory/EasyScore API for simplicity
          const vf = new Factory({
            renderer: { elementId: htmlEl, width: 720, height: 140 },
          });

          const score = vf.EasyScore();
          const system = vf.System();

          system
            .addStave({
              voices: [score.voice(score.notes(notesStr, { stem: "up" }))],
            })
            .addClef(clef)
            .addTimeSignature(time);

          vf.draw();
        } catch (err) {
          console.warn("VexFlow render error:", err);
          htmlEl.innerHTML = `<p class="text-zinc-500 text-sm italic">Notation could not be rendered</p>`;
        }
      });
    }).catch((err) => {
      console.warn("Failed to load VexFlow:", err);
    });
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="prose prose-invert prose-zinc max-w-none
        prose-headings:font-bold prose-headings:text-white
        prose-p:text-zinc-300 prose-p:leading-relaxed
        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
