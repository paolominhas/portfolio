'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react'; // Install: npm install lucide-react

export default function HomePage() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20">
      
      {/* Container limits width for readability */}
      <div className="max-w-4xl space-y-8">
        
        {/* Animated Greeting */}
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
              Hello :)
            </span>
        </motion.div>

        {/* Main Headline - Massive Typography */}
        <motion.h1 
          className="text-5xl md:text-8xl font-bold tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Making cool <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
            MEGS.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Thanks for looking at my website! It's just a project to try out some new coding, and for me to be able to put up a few summaries of undergraduate research I have done.
        </motion.p>

        {/* Call to Actions */}
        <motion.div 
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/projects/hibeam" className="group relative px-8 py-3 rounded-lg bg-white text-black font-semibold overflow-hidden">
             <div className="absolute inset-0 w-full h-full bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
             <span className="relative flex items-center gap-2">
                View MPhys Project <ArrowRight size={18} />
             </span>
          </Link>
          
          <Link href="/about" className="px-8 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors">
             Read About Me
          </Link>
        </motion.div>

      </div>
    </section>
  );
}