import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shared frame for every case study on web.paolo.org.uk/portfolio/*.
 * A navy takeover (like the home page's navy sections) so the dark demo
 * components sit comfortably, with the usual way back to the work grid.
 */
export default function CaseStudyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-navy bg-grain text-white min-h-screen overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute -top-32 right-0 w-[34rem] h-[34rem] rounded-full bg-lilac/15 blur-[130px]" />
      <article className="relative pt-32 px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-yellow transition-colors mb-10">
          <ArrowLeft size={14} /> All work
        </Link>
        {children}
      </article>
    </div>
  );
}
