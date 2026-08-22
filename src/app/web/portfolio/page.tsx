"use client";

import { ArrowUpRight } from "lucide-react";
import { webProjects } from "@/data/web-data";
import HeroText from "@/components/web/HeroText";
import ScrollReveal from "@/components/web/ScrollReveal";

/**
 * WEB PORTFOLIO
 *
 * The full case-study grid. Alternates card spans (odd cards span 2
 * columns on md+) so the grid reads as a bento layout rather than a
 * flat repeating grid — consistent with the home page's asymmetry.
 */

export default function WebPortfolio() {
  return (
    <div className="pt-40 pb-28 px-6 md:px-10 max-w-6xl mx-auto">
      <HeroText
        as="h1"
        text="Selected work."
        highlightWords={["work."]}
        className="text-5xl md:text-7xl font-black tracking-tight text-navy mb-6"
      />
      <ScrollReveal on="load" delay={0.35}>
        <p className="text-lg text-navy/60 max-w-xl mb-16">
          A handful of the sites I&apos;ve designed, built, and deployed —
          each one live, each one still maintained.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {webProjects.map((project, i) => (
          <ScrollReveal
            key={project.slug}
            delay={i * 0.08}
            scale={0.96}
            className={i % 3 === 0 ? "md:col-span-2" : ""}
          >
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-lilac-light/50 border-2 border-transparent hover:border-yellow transition-colors duration-300 overflow-hidden h-full"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-[1.04] group-hover:opacity-100 transition-all duration-700 ease-out"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View project <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="p-6 md:p-7">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-navy group-hover:text-navy transition-colors">
                    {project.title}
                  </h2>
                  <ArrowUpRight
                    size={16}
                    className="text-navy/30 group-hover:text-navy transition-colors shrink-0 mt-1"
                  />
                </div>
                <p className="text-sm text-navy/70 leading-relaxed mb-2">
                  {project.description}
                </p>
                <p className="text-xs text-navy/45 mb-4">{project.outcome}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono uppercase tracking-wide text-navy/60 bg-paper border border-navy/10 group-hover:bg-yellow/20 group-hover:border-yellow/40 px-2.5 py-1 rounded-full transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
