import { Github, Mail, ArrowUpRight } from "lucide-react";
import CarbonBadge from "@/components/shared/CarbonBadge";

/**
 * MUSIC FOOTER
 *
 * Same information architecture as the shared <Footer /> and /web's
 * <WebFooter /> (brand line, explore links, connect, sibling
 * subdomains, bottom bar), skinned as a solid black bookend to the
 * lime/magenta hero — the loud top, quiet-but-still-loud bottom
 * rhythm brutalist editorial layouts tend to use. No "use client":
 * nothing here needs interactivity.
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

export default function MusicFooter() {
  return (
    <footer className="relative z-10 mt-32 bg-black border-t-4 border-lime">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="font-display text-2xl font-bold tracking-tight text-lime mb-3">
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
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-magenta">
              Explore
            </p>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-lime transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-magenta">
              Connect
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/paolominhas"
                  className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-lime transition-colors"
                >
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@paolo.org.uk"
                  className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-lime transition-colors"
                >
                  <Mail size={14} /> Email
                </a>
              </li>
            </ul>
          </div>

          {/* Elsewhere on this domain */}
          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-magenta">
              Elsewhere
            </p>
            <div className="space-y-2">
              {subdomains.map((s) => {
                const isCurrent = s.key === "music";
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-none border transition-all duration-300 ${
                      isCurrent
                        ? "bg-lime/10 border-lime/50"
                        : "bg-white/5 border-white/10 hover:border-magenta/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCurrent ? "bg-lime" : "bg-magenta"
                        }`}
                      />
                      <span className="text-sm font-medium text-white">
                        {s.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-lime/50 text-lime">
                          you are here
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="text-white/30 group-hover:text-magenta transition-colors"
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
