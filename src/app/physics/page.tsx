"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const simulations = [
  {
    slug: "ising",
    title: "Ising Model",
    description:
      "2D ferromagnet with Glauber & Kawasaki dynamics. Watch phase transitions live.",
    tags: ["Statistical Mechanics", "Metropolis", "Phase Transition"],
  },
  {
    slug: "game-of-life",
    title: "Game of Life",
    description:
      "Conway's cellular automaton. Gliders, oscillators, and emergent complexity.",
    tags: ["Cellular Automata", "Emergence", "Complexity"],
  },
  {
    slug: "sirs",
    title: "SIRS Epidemic Model",
    description:
      "Susceptible-Infected-Recovered-Susceptible dynamics with immunity and phase diagrams.",
    tags: ["Epidemiology", "Phase Diagram", "Monte Carlo"],
  },
  {
    slug: "cahn-hilliard",
    title: "Cahn-Hilliard Equation",
    description:
      "Spinodal decomposition and phase separation in binary mixtures.",
    tags: ["PDE", "Phase Separation", "Free Energy"],
  },
  {
    slug: "poisson",
    title: "Poisson Solver",
    description:
      "Electrostatics via Gauss-Seidel and SOR relaxation on 2D and 3D grids.",
    tags: ["Electrostatics", "PDE", "Relaxation Methods"],
  },
];

export default function PhysicsHome() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-mono mb-4">
          Simulations & Demonstrations
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Physics
      </motion.h1>

      <motion.p
        className="text-lg text-zinc-400 max-w-2xl mb-16 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Interactive simulations from the Modelling & Visualisation in Physics
        course at Edinburgh. Each one runs live in the browser — the original
        Python source is shown alongside the JavaScript port.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {simulations.map((sim, i) => (
          <motion.div
            key={sim.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          >
            <Link
              href={`/simulations/${sim.slug}`}
              className="group block p-8 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-[var(--accent-border)] transition-all duration-300"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {sim.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                {sim.title}
              </h2>
              <p className="text-zinc-400 mb-4">{sim.description}</p>
              <span className="text-sm text-[var(--accent)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Launch simulation <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
