import Link from "next/link";
import { CircledNumber } from "@/components/music/CircledNumber";

/** Holding page for music.paolo.org.uk while there are no published arrangements. */
export default function MusicComingSoon() {
  return (
    <section className="relative overflow-hidden px-6 md:px-10 pt-40 pb-40 md:pt-48 min-h-[80vh]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[92vh] mesh-bleed pointer-events-none" />
      <div className="relative max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <CircledNumber n={1} size="md" />
          <span className="font-mono text-xs uppercase tracking-widest text-black/60">Music, in progress</span>
        </div>
        <h1 className="font-display font-bold tracking-tight text-black leading-[0.95] text-5xl md:text-7xl mb-8">
          Arrangements are on the way.
        </h1>
        <p className="text-lg md:text-xl text-black/70 max-w-xl leading-relaxed mb-12">
          I rescore pieces for the players actually in the room. The first ones will be published here, with a
          score and a programme note, once they are ready to be heard.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black bg-cream font-bold text-sm uppercase tracking-wide shadow-brutal-sm hover:bg-magenta hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
        >
          About the project →
        </Link>
      </div>
    </section>
  );
}
