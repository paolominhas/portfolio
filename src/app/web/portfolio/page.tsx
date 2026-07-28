"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { webProjects } from "@/data/web-data";

export default function WebPortfolio() {
  return (
    <div className="pt-40 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      <motion.h1
        className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Selected work
      </motion.h1>
      <motion.p
        className="text-lg text-slate-500 max-w-xl mb-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        A handful of the sites I've designed, built, and deployed —
        each one live, each one still maintained.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {webProjects.map((project, i) => (
          <motion.a
            key={project.slug}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group block rounded-xl bg-white border border-slate-200 hover:border-[var(--accent-border)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 overflow-hidden"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </h2>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 group-hover:text-[var(--accent)] transition-colors shrink-0 mt-1"
                />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-2">
                {project.description}
              </p>
              <p className="text-xs text-slate-400 mb-4">{project.outcome}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
