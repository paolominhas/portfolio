"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

/**
 * WEB NAV
 *
 * Bespoke navigation for web.paolo.org.uk — deliberately not the
 * pill-shaped SubdomainNav used by physics/music, which reads too
 * soft for the "modern editorial meets brutalist-chic" brief here.
 * Full-width navy bar, a hard 2px yellow rule instead of a soft
 * shadow, and a full-bleed navy takeover for the mobile menu.
 *
 * Scoped to src/app/web — physics/music keep using SubdomainNav
 * unchanged.
 */

interface NavItem {
  name: string;
  path: string;
}

interface WebNavProps {
  navItems: NavItem[];
  homeHref: string;
}

export default function WebNav({ navItems, homeHref }: WebNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // usePathname() returns the internal rewritten path (/web/portfolio);
  // strip the /web prefix to match against subdomain-relative navItems.
  const relativePath = pathname.startsWith("/web")
    ? pathname.slice("/web".length) || "/"
    : pathname;

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 border-b-2 border-yellow transition-colors duration-300 ${
          scrolled ? "bg-navy/95 backdrop-blur-md" : "bg-navy"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/"
            onClick={closeMenu}
            className="font-bold text-lg tracking-tight text-white"
          >
            <span className="text-yellow">Web</span>
            <span className="text-white/30 mx-1.5">·</span>
            <span className="text-white/70 font-medium">Paolo</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = relativePath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-4 py-2 text-sm font-medium"
                >
                  <span
                    className={
                      isActive
                        ? "text-yellow"
                        : "text-white/60 hover:text-white transition-colors"
                    }
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="web-nav-underline"
                      className="absolute left-4 right-4 -bottom-0.5 h-0.5 bg-yellow"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <a
              href={homeHref}
              className="ml-4 inline-flex items-center gap-1 text-sm font-medium text-white/40 hover:text-lilac transition-colors"
            >
              paolo.org.uk <ArrowUpRight size={12} />
            </a>
          </nav>

          <div className="hidden md:block">
            <MagneticButton
              href="https://paolo.org.uk/contact"
              variant="secondary-light"
              icon={false}
              className="!px-5 !py-2 !text-xs"
            >
              Let&apos;s talk
            </MagneticButton>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-white"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile full-bleed takeover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-navy flex flex-col justify-center px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item, i) => {
                const isActive = relativePath.startsWith(item.path);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 22,
                      delay: 0.08 + i * 0.07,
                    }}
                  >
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className={`block text-5xl font-black tracking-tight py-2 ${
                        isActive ? "text-yellow" : "text-white"
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
              transition={{ delay: 0.3, duration: 0.4 }}
              href={homeHref}
              className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-lilac"
            >
              ← Back to paolo.org.uk
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
