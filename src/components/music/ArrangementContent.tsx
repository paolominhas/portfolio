"use client";

import { useEffect, useRef } from "react";

/**
 * ARRANGEMENT CONTENT
 *
 * Light-theme replacement for the old MusicPostContent (which was
 * styled for the dark blog design with prose-invert). Renders a
 * programme note and, if the HTML contains a `.vexflow-score`
 * placeholder div, hydrates it with VexFlow — same mechanism as
 * before, just re-themed for a bright background:
 *
 * <div class="vexflow-score" data-clef="treble" data-time="4/4"
 *      data-notes="C5/q, D5, E5, F5"></div>
 *
 * Keep incipits short (a bar or two) — this is meant to identify a
 * theme for programme-note purposes, not to reproduce a score.
 *
 * INSTALLING VEXFLOW: npm install vexflow
 */

interface ArrangementContentProps {
  html: string;
}

export default function ArrangementContent({ html }: ArrangementContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const scoreElements = contentRef.current.querySelectorAll(".vexflow-score");
    if (scoreElements.length === 0) return;

    import("vexflow")
      .then((VexFlowModule) => {
        const VexFlow = (VexFlowModule as any).default || VexFlowModule;
        const { Factory } = VexFlow;

        scoreElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const clef = htmlEl.dataset.clef || "treble";
          const time = htmlEl.dataset.time || "4/4";
          const notesStr = htmlEl.dataset.notes || "";
          if (!notesStr) return;

          htmlEl.innerHTML = "";

          try {
            const vf = new Factory({
              renderer: { elementId: htmlEl, width: 480, height: 130, background: "#ffffff" },
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
            htmlEl.innerHTML = `<p class="text-stone-400 text-sm italic">Notation could not be rendered</p>`;
          }
        });
      })
      .catch((err) => {
        console.warn("Failed to load VexFlow:", err);
      });
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="prose prose-stone max-w-none
        prose-headings:font-serif prose-headings:text-stone-900
        prose-p:text-stone-600 prose-p:leading-relaxed
        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
