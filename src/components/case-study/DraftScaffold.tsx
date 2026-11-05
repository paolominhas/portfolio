import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import CaseStudyFrame from "./CaseStudyFrame";
import Section from "./Section";

/**
 * DRAFT SCAFFOLD: the skeleton used for case studies you are still writing.
 *
 * - In production it 404s, so a half-written page can't be reached by URL.
 * - Each section carries WRITING PROMPTS (what to say, in your voice) and an
 *   INTERACTIVE placeholder (what to build) so the structure is fixed and
 *   only the prose is yours.
 * - To publish: delete the `<DraftScaffold>` wrapper, swap prompts for prose,
 *   build or delete each placeholder, and remove `caseStudyDraft` in web-data.ts.
 */

export interface DraftSection {
  id: string;
  eyebrow: string;
  title: string;
  /** What this section is for, in one sentence. */
  purpose: string;
  /** Questions to answer in your own words. */
  prompts: string[];
  /** The interactive or dynamic element that belongs here. */
  interactive?: { name: string; idea: string };
}

export default function DraftScaffold({
  eyebrow,
  title,
  tagline,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  sections: DraftSection[];
  children?: ReactNode;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <CaseStudyFrame>
      <div className="mb-10 rounded-xl border-2 border-dashed border-yellow/60 bg-yellow/5 px-5 py-4 text-sm text-yellow">
        DRAFT SKELETON. Not visible in production. Replace prompts with prose and placeholders with real components.
      </div>
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-yellow mb-4">{eyebrow}</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">{title}</h1>
        <p className="text-xl text-white/80 max-w-3xl leading-relaxed">{tagline}</p>
      </header>
      {sections.map((s) => (
        <Section key={s.id} id={s.id} eyebrow={s.eyebrow} title={s.title} intro={s.purpose}>
          <div className="rounded-2xl border border-white/15 bg-navy-deep/50 p-6 mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-lilac mb-3">Write about</h3>
            <ul className="list-disc pl-5 space-y-2 text-white/75 text-sm leading-relaxed">
              {s.prompts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          {s.interactive && (
            <div className="rounded-2xl border-2 border-dashed border-white/30 p-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-yellow mb-2">Interactive: {s.interactive.name}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{s.interactive.idea}</p>
            </div>
          )}
        </Section>
      ))}
      {children}
    </CaseStudyFrame>
  );
}
