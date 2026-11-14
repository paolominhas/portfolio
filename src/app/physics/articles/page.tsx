import type { Metadata } from "next";
import { physicsArticles } from "@/data/physics-articles";
import ArticleExplorer from "@/components/physics/research/ArticleExplorer";

/**
 * ARTICLES INDEX. Same card system as /research (see components/physics/research/cards.tsx):
 * the newest article is the large lead card. A server component so the metadata
 * export works; all cards are in the server HTML.
 */

export const metadata: Metadata = {
  title: "Articles",
  description: "Worked examples of simulations computed in Python and replayed in the browser: cellular automata, phase separation, spin models and more.",
  alternates: { canonical: "https://physics.paolo.org.uk/articles" },
};

export default function PhysicsArticlesIndex() {
  return (
    <div className="relative bg-abyss bg-stars min-h-screen overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-0 w-[34rem] h-[34rem] rounded-full bg-kelp/15 blur-[130px]" />
      <section className="relative pt-32 pb-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-mono mb-6">
          Write-ups
        </span>
        <h1 className="font-bodoni text-5xl md:text-7xl font-medium tracking-tight text-white mb-5 [text-shadow:0_4px_40px_rgba(255,107,61,0.15)]">
          Articles
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mb-10 leading-relaxed">
          Simulations computed in Python and embedded here as recordings, each one exported from a 2D grid simulation
          via the pipeline described in <code className="font-mono text-white/60">scripts/simulations/</code>.
        </p>
        <ArticleExplorer articles={physicsArticles} />
      </section>
    </div>
  );
}
