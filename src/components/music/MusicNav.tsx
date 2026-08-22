"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

/**
 * MUSIC NAV
 *
 * Bespoke nav for music.paolo.org.uk — matches the pattern set by
 * WebNav (its own component rather than reusing shared/SubdomainNav,
 * scoped to src/components/music so physics/web are untouched), but
 * built for the acid-brutalist palette: thick black rules instead of
 * soft shadows, hard-edged hover states, no blur/glass.
 */

interface NavItem {
  name: string;
  path: string;
}

interface MusicNavProps {
  navItems: NavItem[];
  homeHref: string;
}

export default function MusicNav({ navItems, homeHref }: MusicNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  // usePathname() returns the internal rewritten path (/music/about);
  // strip the /music prefix to match against subdomain-relative navItems.
  const relativePath = pathname.startsWith("/music")
    ? pathname.slice("/music".length) || "/"
    : pathname;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-lime border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/"
            onClick={closeMenu}
            className="font-display font-bold text-lg md:text-xl tracking-tight text-black"
          >
            Music
            <span className="text-black/40 mx-1.5 font-sans">·</span>
            <span className="text-black/60 font-sans text-sm font-medium">
              Paolo
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = relativePath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-4 py-2 text-sm font-bold uppercase tracking-wide"
                >
                  <span className="text-black">{item.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="music-nav-underline"
                      className="absolute left-4 right-4 -bottom-0.5 h-1 bg-magenta"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <a
              href={homeHref}
              className="ml-4 inline-flex items-center gap-1 text-sm font-medium text-black/50 hover:text-black transition-colors"
            >
              paolo.org.uk <ArrowUpRight size={12} />
            </a>
          </nav>

          <div className="hidden md:block">
            <a
              href="https://paolo.org.uk/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2 border-2 border-black bg-cream text-black text-xs font-bold uppercase tracking-wide shadow-brutal-sm hover:bg-magenta hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
            >
              Get in touch
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-black"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile full-bleed takeover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-lime flex flex-col justify-center px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item, i) => {
                const isActive = relativePath.startsWith(item.path);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 22,
                      delay: 0.05 + i * 0.06,
                    }}
                  >
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className={`block font-display text-5xl font-bold tracking-tight py-2 ${
                        isActive ? "text-magenta" : "text-black"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <motion.a
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              href={homeHref}
              className="mt-12 inline-flex items-center gap-1.5 text-sm font-bold text-black/60"
            >
              ← Back to paolo.org.uk
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
