"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * SCROLL REVEAL
 *
 * A fade-up spring-in wrapper, used across /tutor for section headers
 * and cards. A local copy rather than importing /web's version — each
 * subdomain owns its own small building blocks (see the equivalent in
 * src/components/web/ScrollReveal.tsx) so they can drift independently
 * without cross-subdomain coupling.
 */

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  on?: "scroll" | "load";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 20,
  on = "scroll",
}: ScrollRevealProps) {
  const initial = { opacity: 0, y };
  const target = { opacity: 1, y: 0 };

  const shared = {
    initial,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
      delay,
    },
    className,
  };

  if (on === "load") {
    return (
      <motion.div {...shared} animate={target}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      {...shared}
      whileInView={target}
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}
