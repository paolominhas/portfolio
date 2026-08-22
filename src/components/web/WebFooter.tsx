import { Github, Mail, ArrowUpRight } from "lucide-react";
import CarbonBadge from "@/components/shared/CarbonBadge";

/**
 * WEB FOOTER
 *
 * Same information architecture as the shared <Footer /> (brand line,
 * explore links, connect, sibling subdomains, bottom bar) but skinned
 * for the navy/yellow/lilac editorial system — the shared component's
 * zinc/stone palette would fight this page's identity. physics/music
 * keep using the shared Footer unchanged.
 *
 * No "use client" here: nothing in this file needs interactivity, so
 * it stays a server component (CarbonBadge itself carries "use client"
 * for its embed script).
 */

const subdomains = [
  { key: "physics", name: "Physics", href: "https://physics.paolo.org.uk", description: "Research & simulations" },
  { key: "music", name: "Music", href: "https://music.paolo.org.uk", description: "Arrangements" },
  { key: "web", name: "Web", href: "https://web.paolo.org.uk", description: "Development & design" },
];

const exploreLinks = [
  { name: "Home", href: "https://paolo.org.uk" },
  { name: "About", href: "https://paolo.org.uk/about" },
  { name: "Projects", href: "https://paolo.org.uk/projects" },
  { name: "Contact", href: "https://paolo.org.uk/contact" },
];

export default function WebFooter() {
  return (
    <footer className="relative z-10 mt-32 bg-navy bg-grain border-t-4 border-yellow">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="text-2xl font-black tracking-tight text-white mb-3">
              Paolo Minhas
            </p>
            <p className="text-sm leading-relaxed max-w-xs text-white/50">
              Physicist and developer based in Edinburgh, UK — building
              simulations, arrangements, and websites across three small
              corners of the internet.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-yellow">
              Explore
            </p>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-yellow">
              Connect
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/paolominhas"
                  className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@paolo.org.uk"
                  className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail size={14} /> Email
                </a>
              </li>
            </ul>
          </div>

          {/* Elsewhere on this domain */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-yellow">
              Elsewhere
            </p>
            <div className="space-y-2">
              {subdomains.map((s) => {
                const isCurrent = s.key === "web";
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-300 ${
                      isCurrent
                        ? "bg-yellow/10 border-yellow/40"
                        : "bg-white/5 border-white/10 hover:border-lilac/50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCurrent ? "bg-yellow" : "bg-lilac"
                        }`}
                      />
                      <span className="text-sm font-medium text-white">
                        {s.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-yellow/40 text-yellow">
                          you are here
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="text-white/30 group-hover:text-lilac transition-colors"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Paolo Minhas. Built with Next.js.
          </p>
          <CarbonBadge theme="dark" />
        </div>
      </div>
    </footer>
  );
}
