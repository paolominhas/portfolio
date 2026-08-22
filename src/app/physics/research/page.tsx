"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { researchProjects } from "@/data/research";

/**
 * RESEARCH INDEX
 *
 * Same visual system as physics/page.tsx (abyss + bg-stars + ember/
 * kelp glow blobs + font-bodoni headlines) so this reads as the same
 * site, not a bolted-on section. Four cards, one per researchProjects
 * entry — mphys's card routes to its bespoke folder
 * (`/research/mphys`), the other three to the generic
 * `/research/[slug]` template. Both resolve to real content either
 * way; the `bespokeRoute` flag only matters for clarity here, since
 * `href` is the same shape (`/research/${slug}`) in both cases.
 */

export default function ResearchIndex() {
  return (
    <div className="relative bg-abyss bg-stars min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-0 w-[34rem] h-[34rem] rounded-full bg-kelp/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-ember/15 blur-[120px]"
      />

      <section className="relative pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-mono mb-6">
            Research
          </span>
        </motion.div>

        <motion.h1
          className="font-bodoni text-5xl md:text-8xl font-medium tracking-tight text-white mb-6 [text-shadow:0_4px_40px_rgba(255,107,61,0.15)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Research
        </motion.h1>

        <motion.p
          className="text-lg text-white/50 max-w-2xl mb-20 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Four projects spanning detector physics, flavour physics, and
          neutrino oscillations — an MPhys thesis, a summer placement, and
          two further research projects, all built on the same ROOT/Python
          analysis toolchain.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchProjects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            >
              <Link href={`/research/${project.slug}`} className="block h-full">
                <div className="group relative h-full p-8 rounded-2xl border bg-white/[0.04] border-white/10 hover:border-[var(--accent-border)] transition-all duration-300 overflow-hidden">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-ember/0 group-hover:bg-ember/10 blur-3xl transition-colors duration-500"
                  />
                  <div className="relative flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-bodoni text-2xl md:text-3xl font-medium mb-2 text-white group-hover:text-[var(--accent)] transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-white/50 mb-5 leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-xs text-white/35">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} /> {project.institution}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={12} /> {project.period}
                    </span>
                  </div>

                  <span className="relative text-sm text-[var(--accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
