"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Placeholder data (replace with your actual data source)
const tutorials = [
  { slug: "nextjs-setup", title: "Next.js App Router: The Foundation", description: "Setting up a robust architecture from scratch.", difficulty: "beginner", date: "Oct 12, 2023" },
  { slug: "framer-motion", title: "Fluid Interface Animation", description: "Mastering Framer Motion for editorial layouts.", difficulty: "intermediate", date: "Nov 04, 2023" },
  { slug: "cms-integration", title: "Headless CMS Integration", description: "Connecting Sanity to a static frontend.", difficulty: "advanced", date: "Jan 18, 2024" },
];

export default function TutorialsIndex() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-sky-200">
      
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-screen-md mx-auto">
        
        {/* Universal Back Button Pattern */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-400 hover:text-stone-900 transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.h1
          className="text-5xl md:text-7xl font-serif tracking-tight text-stone-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          The <span className="italic text-stone-400">Archive</span>
        </motion.h1>
        <motion.p
          className="text-lg text-stone-500 font-light mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          Detailed guides from first install to production deployment.
        </motion.p>

        {/* Minimalist List Layout */}
        <div className="border-t border-stone-200">
          {tutorials.map((tut, i) => (
            <motion.div
              key={tut.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/tutorials/${tut.slug}`}
                className="group flex flex-col md:flex-row md:items-baseline justify-between py-8 border-b border-stone-200 hover:bg-stone-100 transition-colors px-4 -mx-4"
              >
                <div className="max-w-md">
                  <h2 className="text-2xl font-serif text-stone-800 group-hover:text-sky-600 transition-colors duration-300 mb-2">
                    {tut.title}
                  </h2>
                  <p className="text-stone-500 font-light">
                    {tut.description}
                  </p>
                </div>

                {/* Metadata Column */}
                <div className="mt-4 md:mt-0 flex gap-6 text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-400">
                  <span>{tut.date}</span>
                  <span>{tut.difficulty}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}