"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function TutorialPost() {
  const params = useParams();
  const slug = params.slug;

  // In a real app, you would fetch the tutorial data using this slug.
  // We'll use placeholder text for the layout.

  return (
    <article className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-sky-200">
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-screen-md mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/tutorials" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-400 hover:text-stone-900 transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Archive
        </Link>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex gap-4 text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-400 mb-6">
            <span>Oct 12, 2023</span>
            <span>Beginner</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-stone-800 leading-tight mb-6">
            Next.js App Router: <br/>
            <span className="italic text-stone-500">The Foundation</span>
          </h1>
          <p className="text-xl text-stone-500 font-light leading-relaxed">
            Setting up a robust architecture from scratch, avoiding common pitfalls, and preparing for scale.
          </p>
        </motion.header>

        {/* Article Content (Prose) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="prose prose-stone prose-lg prose-headings:font-serif prose-a:text-sky-600 hover:prose-a:text-sky-500 max-w-none"
        >
          {/* Note: To style raw HTML/Markdown easily, install @tailwindcss/typography and use the 'prose' class as shown above */}
          <p>
            When starting a new Next.js project, the sheer number of configuration options can be overwhelming. In this guide, we will strip away the noise and focus on building a minimal, scalable foundation.
          </p>
          <h2>The Routing Paradigm</h2>
          <p>
            The transition from the Pages router to the App router represents a fundamental shift in how we think about component rendering...
          </p>
        </motion.div>

      </div>
    </article>
  );
}