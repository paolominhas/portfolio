import { Mail, ArrowUpRight } from "lucide-react";
import CarbonBadge from "@/components/shared/CarbonBadge";

/**
 * TUTOR FOOTER
 *
 * Same information architecture as WebFooter/MusicFooter (brand line,
 * explore links, connect, sibling subdomains, bottom bar), skinned
 * for the warm teal/cream/amber palette — the dark navy/black
 * treatments those use would fight this page's whole "approachable,
 * not brutalist" point. No GitHub link here (irrelevant to a parent
 * looking for a tutor); email only.
 */

const subdomains = [
  { key: "physics", name: "Physics", href: "https://physics.paolo.org.uk", description: "Research & simulations" },
  { key: "music", name: "Music", href: "https://music.paolo.org.uk", description: "Arrangements" },
  { key: "web", name: "Web", href: "https://web.paolo.org.uk", description: "Development & design" },
  { key: "tutor", name: "Tutor", href: "https://tutor.paolo.org.uk", description: "Maths & physics tuition" },
];

const exploreLinks = [
  { name: "Home", href: "https://paolo.org.uk" },
  { name: "About", href: "https://paolo.org.uk/about" },
  { name: "Contact", href: "https://paolo.org.uk/contact" },
];

export default function TutorFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t-4 border-[var(--tutor-amber)] bg-[var(--tutor-ink)]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <p className="mb-3 text-2xl font-black tracking-tight text-[var(--tutor-paper)]">
              Paolo Minhas
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--tutor-paper)]/60">
              Maths &amp; Physics tuition — GCSE, A Level, Advanced Higher
              and 11+ — taught by a physics researcher based in Edinburgh,
              UK.
            </p>
          </div>

          {/* Explore + Connect */}
          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--tutor-amber)]">
              Explore
            </p>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--tutor-paper)]/60 transition-colors hover:text-[var(--tutor-paper)]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@paolo.org.uk"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--tutor-paper)]/60 transition-colors hover:text-[var(--tutor-paper)]"
                >
                  <Mail size={14} /> Email
                </a>
              </li>
            </ul>
          </div>

          {/* Elsewhere on this domain */}
          <div className="md:col-span-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--tutor-amber)]">
              Elsewhere
            </p>
            <div className="space-y-2">
              {subdomains.map((s) => {
                const isCurrent = s.key === "tutor";
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    className={`group flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all duration-300 ${
                      isCurrent
                        ? "border-[var(--tutor-amber)]/50 bg-[var(--tutor-amber)]/10"
                        : "border-white/10 bg-white/5 hover:border-[var(--tutor-amber)]/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isCurrent ? "bg-[var(--tutor-amber)]" : "bg-[var(--tutor-paper)]/40"
                        }`}
                      />
                      <span className="text-sm font-medium text-[var(--tutor-paper)]">
                        {s.name}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full border border-[var(--tutor-amber)]/50 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--tutor-amber)]">
                          you are here
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="text-[var(--tutor-paper)]/30 transition-colors group-hover:text-[var(--tutor-amber)]"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-[var(--tutor-paper)]/40">
            © {new Date().getFullYear()} Paolo Minhas. Built with Next.js.
          </p>
          <CarbonBadge theme="dark" />
        </div>
      </div>
    </footer>
  );
}
