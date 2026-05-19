"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * SITE FOOTER
 *
 * Added to the main paolo.org.uk portfolio. Contains links to the
 * three subdomain sites, plus basic contact/social links.
 *
 * This component is imported in the root layout.tsx and placed
 * below the {children} in <main>.
 */

const subdomains = [
  {
    name: "Physics",
    href: "https://physics.paolo.org.uk",
    description: "Simulations & research",
    accent: "#e84834",
  },
  {
    name: "Music",
    href: "https://music.paolo.org.uk",
    description: "Blog about music",
    accent: "#d4a24e",
  },
  {
    name: "Web",
    href: "https://web.paolo.org.uk",
    description: "Development & design",
    accent: "#22b8a0",
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        {/* Subdomain links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {subdomains.map((site) => (
            <a
              key={site.name}
              href={site.href}
              className="group block p-6 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-lg font-semibold"
                  style={{ color: site.accent }}
                >
                  {site.name}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                />
              </div>
              <p className="text-sm text-zinc-500">{site.description}</p>
              <p className="text-xs text-zinc-700 font-mono mt-2">
                {site.name.toLowerCase()}.paolo.org.uk
              </p>
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Paolo Minhas
          </p>
          <div className="flex gap-6 text-sm text-zinc-600">
            <a
              href="https://github.com/paolominhas"
              className="hover:text-zinc-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="/contact"
              className="hover:text-zinc-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
