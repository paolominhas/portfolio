import type { ReactNode } from "react";

/**
 * DOWNLOAD LINK
 * ─────────────────────────────────────────────────────────────────
 * One "download slot" (score, recording, etc.) that renders in one
 * of two states:
 *
 *   - ACTIVE  (href is set):   a real <a>, styled as the usual
 *     magenta/black brutalist CTA, opens in a new tab if external.
 *   - INERT   (href is unset): visually the same size/weight — so
 *     the layout doesn't jump the day a real link is added — but a
 *     disabled <button>, not a dead <a href="#">. No hover colour
 *     swap, reduced opacity, "coming soon" label instead of an
 *     invitation to click.
 *
 * Used by both ArrangementCard's hover CTA and the arrangement
 * detail page's download block, so the two stay visually consistent
 * and only need updating in one place as real files get added.
 */

interface DownloadLinkProps {
  href?: string;
  label: string;
  icon: ReactNode;
  /** "full" = detail-page sized button. "compact" = card CTA row. */
  size?: "full" | "compact";
}

export default function DownloadLink({
  href,
  label,
  icon,
  size = "full",
}: DownloadLinkProps) {
  const isExternal = href?.startsWith("http");
  const base =
    size === "full"
      ? "inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide border-2 border-black shadow-brutal-sm transition-all duration-150"
      : "flex items-center justify-center gap-2 flex-1 py-3.5 text-xs font-bold uppercase tracking-wide border-t-4 border-black transition-colors duration-200";

  if (!href) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`${base} ${
          size === "full"
            ? "bg-black/5 text-black/35 cursor-not-allowed"
            : "bg-black/10 text-black/35 cursor-not-allowed"
        }`}
      >
        {icon}
        {label}
        {size === "full" && (
          <span className="text-[10px] font-mono normal-case tracking-normal opacity-70">
            (coming soon)
          </span>
        )}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`${base} ${
        size === "full"
          ? "bg-magenta text-white hover:bg-black hover:text-magenta hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          : "bg-magenta text-white hover:bg-black hover:text-magenta"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}
