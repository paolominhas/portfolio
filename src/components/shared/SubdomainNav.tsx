"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

/**
 * SHARED SUBDOMAIN NAVBAR
 *
 * A reusable navbar for all three subdomain sites. It takes:
 *   - siteName: displayed as the logo text ("Physics", "Music", "Web")
 *   - siteHref: where the logo links to ("/" — which on the subdomain means the landing page)
 *   - navItems: the navigation links specific to that subdomain
 *   - accentColor: the hex colour for the active pill and CTA
 *   - homeHref: link back to the main paolo.org.uk site
 *
 * The structure mirrors the existing portfolio navbar (pill shape, mobile
 * dropdown, motion animations) but uses the passed accent colour instead
 * of the portfolio's white/emerald scheme.
 *
 * IMPORTANT: All `href` values in navItems are relative paths like "/simulations".
 * Because the middleware rewrites physics.paolo.org.uk/simulations → /physics/simulations
 * internally, but the browser URL stays as /simulations on the subdomain,
 * Link hrefs must be the subdomain-relative path, NOT the internal path.
 * The middleware handles the mapping.
 */

interface NavItem {
  name: string;
  path: string;
}

interface SubdomainNavProps {
  siteName: string;
  siteHref: string;
  navItems: NavItem[];
  accentColor: string;
  homeHref: string;
  /**
   * "dark" (default) keeps the original zinc/glass pill used by the
   * physics site. "light" is a bright variant — white/95 pill, soft
   * shadow instead of a glow border — used by the music and web
   * subdomains so they don't inherit the dark portfolio look.
   */
  theme?: "dark" | "light";
}

export default function SubdomainNav({
  siteName,
  siteHref,
  navItems,
  accentColor,
  homeHref,
  theme = "dark",
}: SubdomainNavProps) {
  const isLight = theme === "light";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  // The pathname from usePathname() is the INTERNAL rewritten path,
  // e.g. /physics/simulations. We need to strip the prefix to match
  // against navItem paths which are subdomain-relative.
  const prefix = `/${siteName.toLowerCase()}`;
  const relativePath = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length) || "/"
    : pathname;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 pt-6 px-4"
    >
      <div className="relative mx-auto max-w-fit md:max-w-none w-full md:w-auto flex flex-col items-center">
        {/* Main pill */}
        <div
          className={`w-full sm:max-w-sm md:w-auto md:max-w-none flex items-center justify-between p-1 rounded-full backdrop-blur-xl border transition-colors ${
            isLight
              ? "bg-white/90 border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              : "bg-zinc-900/50 border-white/10 shadow-2xl"
          }`}
        >
          {/* Site logo / name */}
          <Link
            href={siteHref}
            onClick={closeMenu}
            className={`px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              isLight
                ? "text-stone-800 hover:text-stone-950"
                : "text-zinc-100 hover:text-white"
            }`}
          >
            <span style={{ color: accentColor }} className="font-semibold">
              {siteName}
            </span>
            <span className={isLight ? "text-stone-300 ml-1.5" : "text-zinc-500 ml-1.5"}>·</span>
            <span className={isLight ? "text-stone-500 ml-1.5" : "text-zinc-400 ml-1.5"}>
              Paolo
            </span>
          </Link>

          <div
            className={`hidden md:block w-px h-4 mx-2 ${isLight ? "bg-stone-200" : "bg-white/10"}`}
          />

          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => {
              const isActive = relativePath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="subdomain-nav-pill"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ backgroundColor: `${accentColor}20` }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={
                      isActive
                        ? isLight
                          ? "text-stone-900"
                          : "text-white"
                        : isLight
                          ? "text-stone-500 hover:text-stone-800"
                          : "text-zinc-400 hover:text-zinc-200"
                    }
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Back to main site */}
            <a
              href={homeHref}
              className={`ml-2 px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                isLight
                  ? "text-stone-400 hover:text-stone-700"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              paolo.org.uk <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors mr-2 rounded-full ${
              isLight
                ? "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-full mt-3 w-full sm:max-w-sm backdrop-blur-2xl border rounded-2xl p-4 flex flex-col gap-2 md:hidden ${
                isLight
                  ? "bg-white/95 border-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                  : "bg-zinc-900/95 border-white/10 shadow-2xl"
              }`}
            >
              {navItems.map((item) => {
                const isActive = relativePath.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMenu}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? isLight
                          ? "bg-stone-100 text-stone-900"
                          : "bg-white/10 text-white"
                        : isLight
                          ? "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className={`w-full h-px my-1 ${isLight ? "bg-stone-200" : "bg-white/10"}`} />
              <a
                href={homeHref}
                onClick={closeMenu}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${
                  isLight
                    ? "text-stone-400 hover:text-stone-700"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                ← Back to paolo.org.uk
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
