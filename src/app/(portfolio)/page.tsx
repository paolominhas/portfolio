'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react'; // Install: npm install lucide-react

/**
 * PORTFOLIO HOME
 *
 * Rewritten to lead with proof of work rather than framing the site as
 * a work-in-progress hobby project. Hero keeps the existing staggered
 * fade-up pattern (unchanged mechanically), just with copy that states
 * what's actually been built instead of hedging it. Added an "Explore"
 * section below the fold so the physics and web subdomains — the
 * strongest, most polished content on the whole site — are reachable
 * from the homepage itself, not just via a single CTA or the About
 * page's GitHub links.
 */

const exploreLinks = [
  {
    name: 'Physics',
    description:
      'MPhys research, live particle-physics simulations, and the HIBEAM detector work.',
    href: 'https://physics.paolo.org.uk',
  },
  {
    name: 'Web Development',
    description:
      'Freelance full-stack work — case studies, stack, and how projects run end to end.',
    href: 'https://web.paolo.org.uk',
  },
  {
    name: 'Music',
    description: 'Arrangements, programme notes, and concert production work with EUCO.',
    href: 'https://music.paolo.org.uk',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20">
        {/* Container limits width for readability */}
        <div className="max-w-4xl space-y-8">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="
              inline-block px-3 py-1 rounded-full 
              bg-emerald-500/10 border border-emerald-500/20 
              text-emerald-400 text-xs font-mono mb-4
            ">
              MPhys Physics · Full-Stack Engineer
            </span>
          </motion.div>

          {/* Main Headline - Massive Typography */}
          <motion.h1 
            className="text-5xl md:text-8xl font-bold tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            I build the systems <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
              behind real products.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            I build production systems — payment infrastructure, deployment
            pipelines, and detector simulations. Currently finishing a
            Physics Master&apos;s at Edinburgh while shipping full-stack
            work for a chamber orchestra and an AI advisory firm.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/projects"
              className="group relative px-8 py-3 rounded-lg bg-white text-black font-semibold overflow-hidden"
            >
               <div className="absolute inset-0 w-full h-full bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
               <span className="relative flex items-center gap-2">
                  View My Work <ArrowRight size={18} />
               </span>
            </Link>
            
            <Link
              href="https://physics.paolo.org.uk/research/mphys"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              Physics Research
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= EXPLORE ================= */}
      <section className="px-6 md:px-20 pb-24 md:pb-32">
        <div className="max-w-4xl">
          <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-8">
            Explore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exploreLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group p-6 bg-zinc-900/50 border border-white/5 rounded-xl hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{link.name}</h3>
                  <ArrowUpRight
                    size={16}
                    className="text-zinc-500 group-hover:text-white transition-colors"
                  />
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {link.description}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
