import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { webProjects } from "@/data/web-data";
import Specimen from "@/components/instrument/Specimen";
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
  // Every site is listed. A site whose write-up is still a draft links to the
  // live site instead (and says the write-up is on its way); under `next dev`
  // the draft page is linked so you can preview it.
  const projects = webProjects;

  return (
    <div className="mx-auto max-w-[90rem] px-5 pb-28 pt-32 md:px-8 md:pt-40">
      <div className="in-enter relative mb-16 md:mb-24">
        <Specimen slot="web-portfolio" className="absolute -top-6 right-0 hidden w-[min(30vw,26rem)] lg:block" />
        <h1 className="in-display text-[length:var(--step-5)] text-navy">Selected work.</h1>
        <p className="in-prose mt-6" style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
          Four sites I&apos;ve designed, built and deployed. Where a case study is written, the title opens it; otherwise it goes to the
          live site.
        </p>
      </div>

      <ol className="border-t-2 border-navy">
        {projects.map((project, i) => {
          const internal = Boolean(project.caseStudy) && !(project.caseStudyDraft && isProd);
          const pending = Boolean(project.caseStudy) && project.caseStudyDraft && isProd;
          const flip = i % 2 === 1;
          return (
            <li key={project.slug} className="group relative grid items-center gap-x-12 gap-y-6 border-b border-navy/20 py-10 md:py-14 lg:grid-cols-12">
              <div className={`relative aspect-[16/10] overflow-hidden rounded-[3px] border border-navy/20 bg-navy lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                <CardImage src={project.image} className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]" />
              </div>
              <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                <p className="in-label mb-3">{project.tags.join(", ")}</p>
                <h2 className="text-[length:var(--step-3)] font-extrabold leading-[1.05] text-navy">
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
                <p className="mt-4 max-w-[52ch] leading-relaxed text-navy/80">{project.description}</p>
                <p className="mt-2 max-w-[52ch] text-[0.92rem] text-navy/65">{project.outcome}</p>
                <p className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <span className="in-link inline-flex items-center gap-1.5 text-navy">
                    {internal ? "Read the case study" : "Visit the live site"} <ArrowUpRight size={16} />
                  </span>
                  {internal && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-1 text-[0.95rem] text-navy/75 underline underline-offset-4 hover:text-navy">
                      Visit the live site <ArrowUpRight size={13} />
                    </a>
                  )}
                  {pending && <span className="in-label">Case study coming soon</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
