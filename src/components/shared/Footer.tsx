"use client";

import { ArrowUpRight, Github, Mail } from "lucide-react";
import CarbonBadge from "./CarbonBadge";

/**
 * SITE FOOTER
 *
 * Shared by the main portfolio and physics. music and web each have
 * their own bespoke footer now (MusicFooter, WebFooter) since their
 * redesigns moved to palettes this component's zinc/stone theming
 * doesn't suit — but they're still listed in `subdomains` below so
 * physics' "Elsewhere" links point at them with the right accent dot.
 *
 *   (portfolio)/layout.tsx  → <Footer theme="dark" site="portfolio" />
 *   physics/layout.tsx      → <Footer theme="dark"  site="physics" accent="#FF6B3D" />
 *
 * Structure: brand + one-line pitch, a sitemap back to the main
 * portfolio, a directory of the three subdomains (current one
 * marked), a connect column, then a bottom bar with copyright and
 * the Website Carbon badge (see CarbonBadge.tsx).
 */

type Theme = "dark" | "light";
type Site = "portfolio" | "physics" | "music" | "web";

interface FooterProps {
  theme?: Theme;
  site?: Site;
  accent?: string;
}

const subdomains: { key: Site; name: string; href: string; description: string; accent: string }[] = [
  {
    key: "physics",
    name: "Physics",
    href: "https://physics.paolo.org.uk",
    description: "Simulations & articles",
    accent: "#FF6B3D",
  },
  {
    key: "music",
    name: "Music",
    href: "https://music.paolo.org.uk",
    description: "Arrangements",
    accent: "#FF007F",
  },
  {
    key: "web",
    name: "Web",
    href: "https://web.paolo.org.uk",
    description: "Development & design",
    accent: "#FFDD44",
  },
];

const exploreLinks = [
  { name: "About", href: "https://paolo.org.uk/about" },
  { name: "Projects", href: "https://paolo.org.uk/projects" },
  { name: "Articles", href: "https://paolo.org.uk/articles" },
  { name: "Contact", href: "https://paolo.org.uk/contact" },
];

export default function Footer({
  theme = "dark",
  site = "portfolio",
  accent,
}: FooterProps) {
  const isDark = theme === "dark";

  const styles = {
    border: isDark ? "border-white/5" : "border-stone-200",
    borderStrong: isDark ? "border-white/10" : "border-stone-300",
    heading: isDark ? "text-zinc-100" : "text-stone-900",
    body: isDark ? "text-zinc-500" : "text-stone-500",
    bodyStrong: isDark ? "text-zinc-400" : "text-stone-600",
    faint: isDark ? "text-zinc-600" : "text-stone-400",
    hover: isDark ? "hover:text-zinc-200" : "hover:text-stone-900",
    card: isDark
      ? "bg-zinc-900/30 border-white/5 hover:border-white/15"
      : "bg-stone-50 border-stone-200 hover:border-stone-300",
    tag: isDark
      ? "bg-white/5 text-zinc-500 border-white/10"
      : "bg-stone-100 text-stone-500 border-stone-200",
  };

  return (
    <footer className={`relative z-10 mt-32 border-t ${styles.border}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className={`text-lg font-semibold mb-3 ${styles.heading}`}>
              Paolo Minhas
            </p>
            <p className={`text-sm leading-relaxed max-w-xs ${styles.body}`}>
              Physicist and developer based in Edinburgh, UK — building
              simulations, arrangements, and websites across three small
              corners of the internet.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <p
              className={`text-xs font-semibold uppercase tracking-widest mb-4 ${styles.faint}`}
            >
              Explore
            </p>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm ${styles.bodyStrong} ${styles.hover} transition-colors`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <p
              className={`text-xs font-semibold uppercase tracking-widest mb-4 ${styles.faint}`}
            >
              Connect
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/paolominhas"
                  className={`inline-flex items-center gap-1.5 text-sm ${styles.bodyStrong} ${styles.hover} transition-colors`}
                >
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@paolo.org.uk"
                  className={`inline-flex items-center gap-1.5 text-sm ${styles.bodyStrong} ${styles.hover} transition-colors`}
                >
                  <Mail size={14} /> Email
                </a>
              </li>
            </ul>
          </div>

          {/* Elsewhere on this domain */}
          <div className="md:col-span-3">
            <p
              className={`text-xs font-semibold uppercase tracking-widest mb-4 ${styles.faint}`}
            >
              Elsewhere
            </p>
            <div className="space-y-2">
              {subdomains.map((s) => {
                const isCurrent = s.key === site;
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-300 ${styles.card}`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: s.accent }}
                      />
                      <span className={`text-sm font-medium ${styles.heading}`}>
                        {s.name}
                      </span>
                      {isCurrent && (
                        <span
                          className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${styles.tag}`}
                        >
                          you are here
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className={`${styles.faint} group-hover:${isDark ? "text-zinc-300" : "text-stone-600"} transition-colors`}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t ${styles.border}`}
        >
          <p className={`text-sm ${styles.faint}`}>
            © {new Date().getFullYear()} Paolo Minhas. Built with Next.js.
          </p>
          <CarbonBadge theme={theme} />
        </div>
      </div>
    </footer>
  );
}
