"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { musicPosts } from "@/data/music-posts";

/**
 * MUSIC BLOG LANDING PAGE
 *
 * This is an editorial-style blog index. Posts are defined in
 * src/data/music-posts.ts as a data array (same pattern as
 * the existing projects.ts and articles.ts in the portfolio).
 *
 * Each post links to /posts/[slug] which is handled by a dynamic
 * route at src/app/music/posts/[slug]/page.tsx.
 */

export default function MusicHome() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-20 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-mono mb-4">
          Blog
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Music
      </motion.h1>

      <motion.p
        className="text-lg text-zinc-400 max-w-2xl mb-16 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Website currently in development.
        Notation rendered with VexFlow.
      </motion.p>

      {/* Blog post list — editorial style, newest first */}
      <div className="space-y-12">
        {musicPosts.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            className="group"
          >
            <Link href={`/posts/${post.slug}`} className="block">
              <time className="text-sm text-zinc-600 font-mono">
                {post.date}
              </time>
              <h2 className="text-2xl font-bold mt-1 mb-2 group-hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
            {i < musicPosts.length - 1 && (
              <div className="w-full h-px bg-white/5 mt-12" />
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
