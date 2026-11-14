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
      <p className="in-label mb-3 !text-yellow">{eyebrow}</p>
      <h2 className="text-[length:var(--step-3)] md:text-[length:var(--step-4)] font-extrabold leading-[1.02] text-white mb-5 max-w-3xl">{title}</h2>
      {intro && <p className="text-white/80 max-w-[62ch] mb-10 leading-relaxed text-[1.0625rem]">{intro}</p>}
      {children}
    </motion.section>
  );
}
