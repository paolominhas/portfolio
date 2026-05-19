"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// We can define the data directly in this file for simplicity, 
// or you can move this back to @/data/web-data later.
const portfolioProjects = [
  {
    title: "Diorama Consulting",
    url: "https://dioramaconsulting.co.uk",
    description: "A new streamlined and functional dockerised site currently in redevelopment.",
    tags: ["DOCKER", "KUBERNETES", "NEXT.JS"],
    // A clean, warm architectural image
    image: "https://dioramaconsulting.co.uk/wp-content/uploads/2025/07/DioramaConsultingNew.png" 
  },
  {
    title: "Edinburgh University Chamber Orchestra",
    url: "https://www.eu-co.co.uk",
    description: "A new website to boost ticket sales and impact of the University of Edinburgh's Chamber Orchestra.",
    tags: ["MUSIC", "ARCHIVE", "GOOGLE-DOCS-UPDATES"],
    // Elegant sheet music/instruments
    image: "https://www.eu-co.co.uk/images/Bruch.jpg"
  },
  {
    title: "Srishti Ragavi Reads",
    url: "https://example.com/srishti",
    description: "Join Srishti in exploring the world of literature, from well known classics to obsure gems.",
    tags: ["BLOG", "LITERATURE", "EDITORIAL"],
    // Cozy reading aesthetic
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "Pooh from the East",
    url: "https://example.com/pooh",
    description: "An adventurous bucket-list blog tracking \"side quests\", cooking, and daily life.",
    tags: ["COOKING", "LIFESTYLE", "PHOTOGRAPHY"],
    // Pastel/warm travel aesthetic
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop"
  }
];

export default function WebPortfolio() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-rose-200">

      <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-400 hover:text-stone-900 transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back Home
        </Link>
      
      {/* Header Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <motion.h1
          className="text-5xl md:text-7xl font-serif tracking-tight text-stone-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Selected <span className="italic text-stone-400">Websites</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-stone-500 max-w-2xl font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          A group of very different but all equally interesting websites that have been built right here
        </motion.p>
      </section>

      {/* 2x2 Image Grid */}
      <section className="px-6 md:px-12 pb-32 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {portfolioProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            >
              {/* Entire block acts as a link to the live site */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                {/* Image Container (Sharp edges, scale on hover) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200 mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  {/* Subtle hover overlay to indicate it's clickable */}
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/90 backdrop-blur-sm text-stone-900 px-6 py-3 uppercase tracking-widest text-xs font-semibold flex items-center gap-2">
                      Visit Site <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-3xl font-serif text-stone-800 group-hover:text-rose-500 transition-colors duration-300">
                      {project.title}
                    </h2>
                  </div>
                  
                  <p className="text-stone-500 font-light leading-relaxed max-w-md">
                    {project.description}
                  </p>

                  {/* Minimalist Tags */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}