import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { webProjects } from "@/data/web-data";
import HeroText from "@/components/web/HeroText";
import ScrollReveal from "@/components/web/ScrollReveal";
import CardImage from "@/components/web/CardImage";

/**
 * WEB PORTFOLIO
 *
 * The full case-study grid. Alternates card spans (odd cards span 2
 * columns on md+) so the grid reads as a bento layout.
 *
 * Cards with a `caseStudy` path link to the on-site write-up (stretched
 * link over the whole card); the live site stays available as a separate
 * link so there are never nested anchors. Draft case studies are hidden
 * in production, so a half-written page can't be reached from the grid.
 */

export const metadata: Metadata = {
  title: "Selected work",
  description: "Sites I've designed, built and deployed, with case studies where there is a story worth telling.",
};

export default function WebPortfolio() {
  const isProd = process.env.NODE_ENV === "production";
  const projects = webProjects.filter((p) => !(p.caseStudyDraft && isProd));

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
          A handful of the sites I&apos;ve designed, built, and deployed. Where there is a story worth telling,
          the card opens a case study.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {projects.map((project, i) => {
          const internal = Boolean(project.caseStudy);
          return (
            <ScrollReveal key={project.slug} delay={i * 0.08} scale={0.96} className={i % 3 === 0 ? "md:col-span-2" : ""}>
              <div className="group relative rounded-2xl bg-lilac-light/50 border-2 border-transparent hover:border-yellow focus-within:border-yellow transition-colors duration-300 overflow-hidden h-full">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy">
                  <CardImage src={project.image} className="w-full h-full object-cover opacity-90 group-hover:scale-[1.04] group-hover:opacity-100 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {internal ? "Read case study" : "View project"} <ArrowUpRight size={14} />
                  </div>
                </div>
                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between mb-2 gap-3">
                    <h2 className="text-xl font-bold text-navy">
                      {internal ? (
                        <Link href={project.caseStudy!} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                          {project.title}
                        </Link>
                      ) : (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                          {project.title}
                        </a>
                      )}
                    </h2>
                    <ArrowUpRight size={16} className="text-navy/30 group-hover:text-navy transition-colors shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-navy/70 leading-relaxed mb-2">{project.description}</p>
                  <p className="text-xs text-navy/45 mb-4">{project.outcome}</p>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-mono uppercase tracking-wide text-navy/60 bg-paper border border-navy/10 group-hover:bg-yellow/20 group-hover:border-yellow/40 px-2.5 py-1 rounded-full transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {internal && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 inline-flex items-center gap-1 mt-4 text-xs font-mono uppercase tracking-wider text-navy/60 hover:text-navy underline underline-offset-4"
                    >
                      Visit live site <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
