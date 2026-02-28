import React from 'react';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

// 1. DYNAMIC FIGURE COMPONENT (Links to your interactive page)
const InteractiveMagneticFigure = () => (
  <div className="my-16 relative group rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/50 p-8 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
    {/* Animated background glow */}
    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-white mb-2">Interactive: The Detectors</h3>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Visualise the detectors in this project!
        </p>
        <Link 
          href="hibeam/interactive" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full transition-transform hover:scale-105"
        >
          Run the Simulation &rarr;
        </Link>
      </div>
      
      {/* Decorative Graphic representing a magnetic field */}
      <div className="w-full md:w-1/3 aspect-square rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-full h-[1px] bg-cyan-500/50 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
        <div className="absolute w-[1px] h-full bg-cyan-500/50 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
        <div className="w-16 h-16 rounded-full border-4 border-cyan-400/80 border-dashed animate-spin-slow"></div>
      </div>
    </div>
  </div>
);

// 2. THE MAIN ARTICLE COMPONENT
export default function HIBEAMarticle() {
  return (
    <article className="min-h-screen bg-transparent text-slate-300 selection:bg-cyan-500/30 font-sans pb-32">
      
      {/* MAG-STYLE HERO HEADER */}
      <header className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        {/* Background ambient gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/30 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-2 mb-6">
            {/* Hardcoded Tags */}
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 rounded-full">
              Particle Physics
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 rounded-full">
              C++ Simulation
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 rounded-full">
              European Spallation Source
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Vanishing Neutrons
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed font-light">
            Why neutrons becoming antimatter is fascinating, and how we can see it for ourselves.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-500">
            <span>By <strong className="text-slate-300">Paolo Minhas</strong></span>
            <span>&bull;</span>
            <span>February 2026</span>
            <span>&bull;</span>
            <span>10 min read</span>
          </div>
        </div>
      </header>

      {/* MAGAZINE BODY (Single wide column, easy reading) */}
      <div className="max-w-3xl mx-auto px-6 pt-16 text-lg md:text-xl leading-relaxed space-y-8 text-slate-300">
        
        <p className="text-2xl text-slate-200 font-light leading-relaxed">
          Why do we exist? When we look out round the universe we can see stars and galaxies in every direction. Why is this all here? this can be explained via a phenomenon known as CP violation 
        </p>

        <p>
          To explain this, we need a mechanism that violates Baryon number—a rule in particle physics that says matter and antimatter must balance. While most searches focus on protons decaying, there is a more exotic alternative: what if a neutron could spontaneously turn into an antineutron (<InlineMath math="n \rightarrow \bar{n}" />)?
        </p>

        <h2 className="text-3xl font-bold text-white mt-16 mb-6">The Magnetic Dampening</h2>

        <p>
          If this <InlineMath math="\Delta B = 2" /> transition happens, it is incredibly rare. Theoretical models suggest a free neutron would need over <InlineMath math="10^8" /> seconds to flip. But here is the catch: we don&apos;t live in a vacuum. We live on Earth, surrounded by a magnetic field.
        </p>

        <p>
          Because neutrons and antineutrons have opposite magnetic moments, an external magnetic field forces their energy levels to split. This Zeeman splitting (<InlineMath math="\Delta E" />) completely disrupts the delicate quantum superposition required for the particle to oscillate.
        </p>

        {/* MATH FIGURE CALLOUT */}
        <div className="my-12 p-8 bg-slate-900 rounded-2xl border-l-4 border-cyan-500 shadow-xl">
          <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">The Mathematical Collapse</p>
          <div className="text-white text-center text-xl md:text-2xl py-4 overflow-x-auto">
            <BlockMath math={String.raw`P_{n \rightarrow \bar{n}}(t) = \left( \frac{2 \delta m}{\Delta E} \right)^2 \sin^2\left( \frac{\Delta E}{2 \hbar} t \right)`} />
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">
            Because the interaction mass (<InlineMath math="\delta m" />) is infinitesimally small, any environmental energy split (<InlineMath math="\Delta E" />) crushes the probability amplitude to near zero.
          </p>
        </div>

        <p>
          Our Monte Carlo simulations using Geant4 confirm this mathematically. If a beam of cold neutrons flies down a 50-meter tube, even a localised magnetic "hot spot" of 10 nanotesla is enough to quench the signal entirely. 
        </p>

        <InteractiveMagneticFigure />

        <p>
          This is exactly why experiments like HIBEAM at the European Spallation Source require multi-layer Mu-metal shielding. We aren&apos;t just fighting background noise; we are fighting the environment&apos;s tendency to force the universe to "choose" a state. By creating the most magnetically pristine vacuum on Earth, we might just catch matter looking in the mirror.
        </p>

      </div>
    </article>
  );
}