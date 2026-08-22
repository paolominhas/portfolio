import Link from "next/link";
import { CircledNumber } from "@/components/music/CircledNumber";

export const metadata = {
  title: "About",
  description: "About the arrangements on this site, and who they're for.",
};

export default function MusicAboutPage() {
  return (
    <section className="pt-40 pb-28 px-6 md:px-16 max-w-2xl mx-auto">
      <CircledNumber n={1} size="lg" />
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-black mt-6 mb-10">
        About
      </h1>
      <div className="space-y-6 text-black/70 leading-relaxed">
        <p>
          I play and help run concerts for the Edinburgh University Chamber
          Orchestra, and most of the arrangements here started as a practical
          problem: a piece that suits the room, the occasion, or the players
          available that week, but not in its original scoring.
        </p>
        <p>
          Each arrangement page lists the ensemble it was made for, when (and
          if) it&apos;s been performed, and a short programme note on the
          choices involved in rescoring it.
        </p>
        <p>
          Get in touch via{" "}
          <a
            href="https://paolo.org.uk/contact"
            className="text-black underline decoration-magenta decoration-2 underline-offset-2 hover:text-magenta transition-colors"
          >
            the main site
          </a>{" "}
          if you&apos;d like a piece arranged for a specific ensemble.
        </p>
      </div>

      <Link
        href="/arrangements"
        className="inline-flex items-center gap-2 mt-12 px-6 py-3 border-2 border-black bg-cream font-bold text-sm uppercase tracking-wide shadow-brutal-sm hover:bg-magenta hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
      >
        Browse the crate →
      </Link>
    </section>
  );
}
