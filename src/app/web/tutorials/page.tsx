"use client";

import Link from "next/link";
import { tutorials } from "@/data/web-data";
import HeroText from "@/components/web/HeroText";
import ScrollReveal from "@/components/web/ScrollReveal";

/**
 * WEB TUTORIALS INDEX
 */

export default function TutorialsIndex() {
  // Only written posts are listed in production; the unwritten placeholders
  // show under `next dev` so you can see where they would go.
  const published = tutorials.filter((t) => t.content || process.env.NODE_ENV !== "production");
  return (
    <div className="pt-40 pb-28 px-6 md:px-10 max-w-3xl mx-auto">
      <HeroText
        as="h1"
        text="Notes & writing."
        highlightWords={["writing."]}
        className="text-5xl md:text-7xl font-black tracking-tight text-navy mb-6"
      />
      <ScrollReveal on="load" delay={0.35}>
        <p className="text-lg text-navy/60 mb-16">
          Notes on how the sites get built. The first pieces are being written.
        </p>
      </ScrollReveal>

      <div className="border-t-2 border-navy/10">
        {published.map((tut, i) => (
          <ScrollReveal key={tut.slug} delay={i * 0.06} y={14}>
            <Link
              href={`/tutorials/${tut.slug}`}
              className="group flex flex-col md:flex-row md:items-baseline justify-between py-8 border-b-2 border-navy/10 hover:bg-lilac-light/40 transition-colors px-4 -mx-4 rounded-lg"
            >
              <div className="max-w-md">
                <h2 className="text-xl font-bold text-navy mb-1 group-hover:text-navy">
                  {tut.title}{" "}
                  <span className="inline-block text-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </h2>
                <p className="text-sm text-navy/60">{tut.description}</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3 shrink-0">
                <span className="font-mono text-[11px] uppercase tracking-wider text-navy/50 bg-paper border border-navy/10 px-2.5 py-1 rounded-full">
                  {tut.date}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-navy bg-yellow/25 border border-yellow/40 px-2.5 py-1 rounded-full">
                  {tut.difficulty}
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {published.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-navy/70 mb-2">Nothing here yet.</p>
          <p className="text-navy/50 mb-8">I am writing up the projects first.</p>
          <Link href="/portfolio" className="inline-block rounded-full border-2 border-navy px-6 py-2.5 text-sm font-bold text-navy hover:bg-yellow hover:border-yellow transition-colors">
            See the work
          </Link>
        </div>
      )}
    </div>
  );
}
