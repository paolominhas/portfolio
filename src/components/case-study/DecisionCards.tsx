"use client";

import { motion } from "framer-motion";
import { caseStudy } from "@/data/euco-ticketing-case-study";

export default function DecisionCards() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {caseStudy.decisions.items.map((d, i) => (
        <motion.article
          key={d.title}
          className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 hover:border-white/25 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 120, damping: 18, delay: (i % 2) * 0.08 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3">{d.title}</h3>
          <p className="text-sm text-zinc-300 leading-relaxed mb-3"><span className="text-emerald-400 font-mono text-xs uppercase tracking-widest mr-2">Why</span>{d.why}</p>
          <p className="text-sm text-zinc-400 leading-relaxed"><span className="text-amber-400 font-mono text-xs uppercase tracking-widest mr-2">Cost</span>{d.cost}</p>
        </motion.article>
      ))}
    </div>
  );
}
