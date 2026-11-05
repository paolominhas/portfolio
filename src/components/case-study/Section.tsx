"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Standard case-study section: eyebrow, title, intro, then the interactive body. */
export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="scroll-mt-28 py-14 md:py-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <p className="text-xs font-mono uppercase tracking-widest text-yellow mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 max-w-3xl">{title}</h2>
      {intro && <p className="text-white/70 max-w-3xl mb-10 leading-relaxed">{intro}</p>}
      {children}
    </motion.section>
  );
}
