"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * PHYSICS INDEX / LANDING
 *
 * The dark half of the two-reference brief: near-black abyss
 * background, a sparse star-field grain, soft ember/kelp glow blobs,
 * and an oversized Bodoni Moda headline — the "deep, dark oceanic/
 * space blues... classic elegant high-contrast serif... soft glowing
 * ethereal lighting" mood from the reference, built from CSS
 * gradients/blur rather than illustration (see the note in my reply
 * on why I didn't try to clone the reference's specific artwork).
 *
 * `/simulations` re-exports this file (see simulations/page.tsx) —
 * unchanged architecture from before this redesign.
 */

interface SimEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: "live" | "soon";
}

const simulations: SimEntry[] = [
  {
    slug: "ising",
    title: "Ising Model",
    description:
      "2D ferromagnet with Glauber & Kawasaki dynamics. Watch phase transitions live.",
    tags: ["Statistical Mechanics", "Metropolis", "Phase Transition"],
    status: "live",
  },
  {
    slug: "game-of-life",
    title: "Game of Life",
    description:
      "Conway's cellular automaton. Gliders, oscillators, and emergent complexity.",
    tags: ["Cellular Automata", "Emergence", "Complexity"],
    status: "soon",
  },
  {
    slug: "sirs",
    title: "SIRS Epidemic Model",
    description:
      "Susceptible-Infected-Recovered-Susceptible dynamics with immunity and phase diagrams.",
    tags: ["Epidemiology", "Phase Diagram", "Monte Carlo"],
    status: "soon",
  },
  {
    slug: "cahn-hilliard",
    title: "Cahn-Hilliard Equation",
    description:
      "Spinodal decomposition and phase separation in binary mixtures.",
    tags: ["PDE", "Phase Separation", "Free Energy"],
    status: "soon",
  },
  {
    slug: "poisson",
    title: "Poisson Solver",
    description:
      "Electrostatics via Gauss-Seidel and SOR relaxation on 2D and 3D grids.",
    tags: ["Electrostatics", "PDE", "Relaxation Methods"],
    status: "soon",
  },
];

export default function PhysicsHome() {
  return (
    <div className="relative bg-abyss bg-stars min-h-screen overflow-hidden">
      {/* Ethereal glow — warm ember upper-right, cool kelp lower-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 w-[36rem] h-[36rem] rounded-full bg-ember/20 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-24 w-[30rem] h-[30rem] rounded-full bg-kelp/15 blur-[120px]"
      />

      <section className="relative pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-mono mb-6">
            Simulations & Demonstrations
          </span>
        </motion.div>

        <motion.h1
          className="font-bodoni text-5xl md:text-8xl font-medium tracking-tight text-white mb-6 [text-shadow:0_4px_40px_rgba(255,107,61,0.15)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Physics
        </motion.h1>

        <motion.p
          className="text-lg text-white/50 max-w-2xl mb-20 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Interactive simulations from the Modelling & Visualisation in
          Physics course at Edinburgh. Each one runs live in the browser —
          the original Python source is shown alongside the TypeScript port.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulations.map((sim, i) => {
            const isLive = sim.status === "live";
            const card = (
              <div
                className={`group relative h-full p-8 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isLive
                    ? "bg-white/[0.04] border-white/10 hover:border-[var(--accent-border)]"
                    : "bg-white/[0.02] border-white/5 cursor-default"
                }`}
              >
                {isLive && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-ember/0 group-hover:bg-ember/10 blur-3xl transition-colors duration-500"
                  />
                )}
                <div className="relative flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {sim.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {!isLive && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1 rounded-full shrink-0">
                      Soon
                    </span>
                  )}
                </div>
                <h2
                  className={`font-bodoni text-2xl md:text-3xl font-medium mb-2 transition-colors ${
                    isLive ? "text-white group-hover:text-[var(--accent)]" : "text-white/60"
                  }`}
                >
                  {sim.title}
                </h2>
                <p className={`mb-4 ${isLive ? "text-white/50" : "text-white/30"}`}>
                  {sim.description}
                </p>
                {isLive && (
                  <span className="relative text-sm text-[var(--accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Launch simulation <ArrowRight size={14} />
                  </span>
                )}
              </div>
            );

            return (
              <motion.div
                key={sim.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              >
                {isLive ? (
                  <Link href={`/simulations/${sim.slug}`} className="block h-full">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 inline-flex items-center gap-2 text-sm text-white/30"
        >
          Ising is the first full Python → TypeScript translation — the rest
          are ported on the same pattern as they're needed.
          <ArrowUpRight size={14} className="opacity-50" />
        </motion.p>
      </section>
    </div>
  );
}
