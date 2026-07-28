"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { tutorials } from "@/data/web-data";

export default function TutorialsIndex() {
  return (
    <div className="pt-40 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
      <motion.h1
        className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Writing
      </motion.h1>
      <motion.p
        className="text-lg text-slate-500 mb-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        Notes and guides from first install to production deployment.
      </motion.p>

      <div className="border-t border-slate-200">
        {tutorials.map((tut, i) => (
          <motion.div
            key={tut.slug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link
              href={`/tutorials/${tut.slug}`}
              className="group flex flex-col md:flex-row md:items-baseline justify-between py-8 border-b border-slate-200 hover:bg-white transition-colors px-4 -mx-4 rounded-lg"
            >
              <div className="max-w-md">
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-[var(--accent)] transition-colors mb-1">
                  {tut.title}
                </h2>
                <p className="text-sm text-slate-500">{tut.description}</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-4 font-mono text-xs uppercase tracking-wider text-slate-400">
                <span>{tut.date}</span>
                <span>{tut.difficulty}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
