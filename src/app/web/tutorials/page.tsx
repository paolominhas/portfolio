"use client";

import Link from "next/link";
import { tutorials } from "@/data/web-data";
import HeroText from "@/components/web/HeroText";
import ScrollReveal from "@/components/web/ScrollReveal";

/**
 * WEB TUTORIALS INDEX
 */

export default function TutorialsIndex() {
  return (
    <div className="pt-40 pb-28 px-6 md:px-10 max-w-3xl mx-auto">
      <HeroText
        as="h1"
        text="Writing."
        highlightWords={["writing."]}
        className="text-5xl md:text-7xl font-black tracking-tight text-navy mb-6"
      />
      <ScrollReveal on="load" delay={0.35}>
        <p className="text-lg text-navy/60 mb-16">
          Notes and guides from first install to production deployment.
        </p>
      </ScrollReveal>

      <div className="border-t-2 border-navy/10">
        {tutorials.map((tut, i) => (
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
    </div>
  );
}
