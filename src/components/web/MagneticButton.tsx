"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * MAGNETIC BUTTON
 *
 * A CTA/link that pulls toward the cursor within its own bounds, then
 * springs back on mouse-leave — the "buttery" micro-interaction pi.dev
 * built its reputation on. Pointer tracking uses raw motion values;
 * the pull itself is a spring so it always feels physical rather than
 * snapping to the cursor 1:1.
 *
 * Renders as:
 *   - a Next <Link>   when `href` is an internal path ("/portfolio")
 *   - a plain <a>      when `href` is external (starts with "http")
 *   - a <button>       when no `href` is given (pass `onClick` instead)
 *
 * Three variants, chosen by which background it sits on:
 *   - "primary"          bright yellow fill — works on navy OR paper
 *   - "secondary-dark"   navy outline, for paper/lilac sections
 *   - "secondary-light"  white outline, for navy sections
 */

type Variant = "primary" | "secondary-dark" | "secondary-light";

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Show a trailing arrow icon. Defaults to true. */
  icon?: boolean;
  /** Use the "external" arrow (↗) instead of the default (→). */
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-yellow text-navy hover:bg-navy hover:text-yellow border-2 border-yellow hover:border-navy",
  "secondary-dark":
    "bg-transparent text-navy border-2 border-navy hover:bg-navy hover:text-yellow",
  "secondary-light":
    "bg-transparent text-white border-2 border-white/40 hover:border-yellow hover:text-yellow",
};

export default function MagneticButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  icon = true,
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 15, mass: 0.4 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // Pull strength: proportion of the offset, capped by element size.
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Icon = external ? ArrowUpRight : ArrowRight;

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm tracking-tight transition-colors duration-300 cursor-pointer ${variantClasses[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon && (
        <Icon
          size={16}
          strokeWidth={2.5}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </motion.div>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="inline-block"
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className="inline-block">
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" className="inline-block">
      {inner}
    </button>
  );
}
