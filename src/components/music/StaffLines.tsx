/**
 * STAFF LINES
 *
 * The music site's signature element: a plain five-line staff,
 * used decoratively as a section divider and behind the hero
 * heading. Purely geometric — no notes, no reproduction of any
 * actual score — just the one visual motif that ties every page
 * back to sheet music without leaning on a stock treble-clef icon.
 */

interface StaffLinesProps {
  className?: string;
  lineClassName?: string;
}

export default function StaffLines({
  className = "",
  lineClassName = "bg-stone-200",
}: StaffLinesProps) {
  return (
    <div className={`flex flex-col gap-[5px] ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`h-px w-full ${lineClassName}`} />
      ))}
    </div>
  );
}
