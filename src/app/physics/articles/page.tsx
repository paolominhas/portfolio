import type { Metadata } from "next";
import Specimen from "@/components/instrument/Specimen";
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
      <section className="relative pt-32 pb-24 px-5 md:px-8 max-w-[90rem] mx-auto">
        <Specimen slot="physics-articles" className="absolute right-8 top-24 hidden w-[min(28vw,24rem)] lg:block" />
        <h1 className="in-display mb-6 text-[length:var(--step-5)] text-white">Articles</h1>
        <p className="in-prose mb-10">
          Simulations computed in Python and embedded here as recordings, each one exported from a 2D grid simulation
          via the pipeline described in <code className="font-mono text-white/60">scripts/simulations/</code>.
        </p>
        <ArticleExplorer articles={physicsArticles} />
      </section>
    </div>
  );
}
