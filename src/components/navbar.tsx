'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * PORTFOLIO NAV
 * ─────────────────────────────────────────────────────────────────
 * Home, About, Projects, Physics, Web, Contact. Contact is still
 * visually emphasised (solid white pill) since it's the primary
 * conversion point, but it's now a single entry in `navItems` rather
 * than a second, separately-maintained "Let's Talk" button — the old
 * version rendered Contact twice (once as a plain link — cut from a
 * previous nav — and once as the CTA), which this collapses into one.
 *
 * Physics and Web are `external` — they route to their own
 * subdomains rather than internal Next.js routes, so they render as
 * plain <a> tags instead of <Link>, matching the convention already
 * used by SubdomainNav's "back to main site" link. Added so the
 * physics and web subdomains — the most substantial content on the
 * whole site — are reachable from the main nav, not just via a
 * single homepage CTA.
 */

interface NavItem {
  name: string;
  path: string;
  exact?: boolean;
  cta?: boolean;
  external?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', exact: true },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Physics', path: 'https://physics.paolo.org.uk', external: true },
  { name: 'Web', path: 'https://web.paolo.org.uk', external: true },
  { name: 'Contact', path: '/contact', cta: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const isItemActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 pt-6 px-4"
    >
      {/* Container to keep everything centered and constrained */}
      <div className="relative mx-auto max-w-fit md:max-w-none w-full md:w-auto flex flex-col items-center">
        
        {/* The Main "Pill" */}
        <div className="
          w-full sm:max-w-sm md:w-auto md:max-w-none
          flex items-center justify-between p-1 rounded-full
          bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-2xl
        ">
          {/* Logo / Name — links home, distinct from the "Home" nav item's active state */}
          <Link 
            href="/" 
            onClick={closeMenu}
            className="px-6 py-2 text-sm font-medium text-zinc-100 hover:text-white transition-colors whitespace-nowrap"
          >
            Paolo Minhas
          </Link>

          {/* Desktop Divider */}
          <div className="hidden md:block w-px h-4 bg-white/10 mx-2" />

          {/* === DESKTOP LINKS === */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => {
              const isActive = isItemActive(item);

              if (item.cta) {
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="ml-2 px-5 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                );
              }

              if (item.external) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {item.name}
                  </a>
                );
              }

              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.span 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* === MOBILE TOGGLE BUTTON === */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors mr-2 rounded-full hover:bg-white/10"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* === MOBILE DROPDOWN MENU === */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-3 w-full sm:max-w-sm bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 md:hidden"
            >
              {navItems.filter((item) => !item.cta).map((item) => {
                if (item.external) {
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={closeMenu}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-colors"
                    >
                      {item.name}
                    </a>
                  );
                }

                const isActive = isItemActive(item);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMenu}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="w-full h-px bg-white/10 my-1" />
              
              <Link 
                href="/contact"
                onClick={closeMenu}
                className="w-full px-4 py-3 mt-1 bg-white text-black text-center rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                Contact
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
}
