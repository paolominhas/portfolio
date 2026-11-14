import type { Metadata } from "next";
import { SPECIMEN_SLOTS } from "@/data/specimens";
import { availableSpecimens } from "@/lib/specimens";

/**
 * SPECIMEN CHECKLIST (paolo.org.uk/specimens, not indexed, not linked).
 * Lists every cut-out image slot, whether a file is present, and a link that
 * opens the page with the slot outlined.
 */

export const metadata: Metadata = { title: "Image slots", robots: { index: false, follow: false } };

const HOST = { main: "https://paolo.org.uk", physics: "https://physics.paolo.org.uk", web: "https://web.paolo.org.uk" } as const;

export default function SpecimensPage() {
  const have = availableSpecimens();
  const filled = SPECIMEN_SLOTS.filter((s) => have[s.id]).length;
  return (
    <div className="mx-auto max-w-[90rem] px-5 pb-28 pt-28 md:px-8 md:pt-36">
      <h1 className="in-display text-[length:var(--step-4)]">Image slots</h1>
      <p className="in-prose mt-5">
        {filled} of {SPECIMEN_SLOTS.length} filled. Put a transparent .webp, .png or .avif named after the slot in{" "}
        <code className="font-mono text-[0.85em] text-[var(--ink)]">public/images/specimens/</code> and rebuild. A .jpg cannot be transparent, so it will not be picked up.
      </p>
      <ul className="mt-10 border-t border-[var(--line)]">
        {SPECIMEN_SLOTS.map((s) => {
          const url = s.page === "every page" ? `${HOST[s.site]}/?specimens=show` : `${HOST[s.site]}${s.page}?specimens=show`;
          return (
            <li key={s.id} className="grid gap-x-8 gap-y-1 border-b border-[var(--line)] py-5 md:grid-cols-[14rem_minmax(0,1fr)_9rem]">
              <span>
                <span className="block font-mono text-[0.85rem]">{s.id}</span>
                <span className="in-label">
                  {s.site}, {s.shape}
                </span>
              </span>
              <span>
                <span className="block">{s.where}</span>
                <span className="mt-1 block text-[var(--ink-2)]">Idea: {s.idea}</span>
                <a href={url} className="in-link mt-2 inline-block text-sm">
                  Show where it sits
                </a>
              </span>
              <span className={`in-label md:text-right ${have[s.id] ? "!text-[var(--signal-2)]" : ""}`}>{have[s.id] ? "File present" : "Empty"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
