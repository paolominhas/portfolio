import type { Metadata } from "next";
import GlobesContent from "@/components/physics/globes/GlobesContent";

export const metadata: Metadata = {
  title: "Looking for a Fourth Neutrino at DUNE — Paolo Minhas",
  description:
    "An interactive report on a summer with GLoBES: DUNE's sensitivity to CP violation, the mass ordering and a sterile neutrino, with a live oscillation engine, the project's real flux and event files, and the checks made afterwards.",
  alternates: { canonical: "https://physics.paolo.org.uk/research/globes" },
  openGraph: {
    title: "Looking for a Fourth Neutrino at DUNE",
    description: "What DUNE's near and far detectors could tell us about a sterile neutrino, simulated with GLoBES and explained interactively.",
    url: "https://physics.paolo.org.uk/research/globes",
    type: "article",
  },
};

export default function GlobesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Looking for a Fourth Neutrino at DUNE",
    url: "https://physics.paolo.org.uk/research/globes",
    author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GlobesContent />
    </>
  );
}
