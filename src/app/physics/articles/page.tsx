"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { physicsArticles } from "@/data/physics-articles";

export default function PhysicsArticlesIndex() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-mono mb-4">
          Write-ups
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Articles
      </motion.h1>

      <motion.p
        className="text-lg text-zinc-400 max-w-2xl mb-16 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Simulations computed in Python and embedded here as recordings —
        each one exported from a 2D grid simulation via the pipeline
        described in <code className="font-mono text-zinc-500">scripts/simulations/</code>.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {physicsArticles.map((article, i) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          >
            <Link
              href={`/articles/${article.slug}`}
              className="group block p-8 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-[var(--accent-border)] transition-all duration-300"
            >
              <time className="text-xs text-zinc-600 font-mono">
                {article.date}
              </time>
              <h2 className="text-2xl font-bold mt-2 mb-2 group-hover:text-[var(--accent)] transition-colors">
                {article.title}
              </h2>
              <p className="text-zinc-400 mb-4">{article.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-sm text-[var(--accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Read article <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {physicsArticles.length === 0 && (
        <p className="text-zinc-500">
          No articles yet — add one to{" "}
          <code className="font-mono text-zinc-400">src/data/physics-articles.ts</code>.
        </p>
      )}
    </section>
  );
}
