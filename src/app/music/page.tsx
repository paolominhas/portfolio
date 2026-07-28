"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { arrangements } from "@/data/arrangements";
import StaffLines from "@/components/music/StaffLines";

export default function MusicHome() {
  return (
    <section className="pt-40 pb-24 px-6 md:px-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-medium tracking-wide mb-6">
          Arrangements for chamber ensembles
        </span>
      </motion.div>

      <div className="relative mb-6">
        <StaffLines className="absolute -top-3 left-0 w-40 opacity-70" />
        <motion.h1
          className="relative text-5xl md:text-7xl font-serif tracking-tight text-stone-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          Arrangements
        </motion.h1>
      </div>

      <motion.p
        className="text-lg text-stone-500 max-w-2xl mb-20 leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        New versions of existing works, rescored for the ensembles I
        actually play and conduct for — usually because the original
        instrumentation isn't what's in the room that evening.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {arrangements.map((arr, i) => (
          <motion.div
            key={arr.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
          >
            <Link
              href={`/arrangements/${arr.slug}`}
              className="group block h-full p-8 rounded-2xl bg-white border border-stone-200 hover:border-[var(--accent-border)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">
                {arr.originalComposer} · {arr.arrangedFor}
              </p>
              <h2 className="text-2xl font-serif text-stone-900 mb-3 group-hover:text-[var(--accent)] transition-colors">
                {arr.title}
              </h2>
              <p className="text-stone-500 leading-relaxed mb-5">
                {arr.excerpt}
              </p>
              <div className="flex flex-wrap gap-2">
                {arr.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
