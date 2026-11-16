import type { Metadata } from "next";
import NextProject from "@/components/physics/research/NextProject";
import ExoticSearchContent from "@/components/physics/exotic-search/ExoticSearchContent";

export const metadata: Metadata = {
  title: "Hunting a 1 TeV Particle: Cuts vs a Neural Network — Paolo Minhas",
  description:
    "An interactive write-up of a coursework search for a heavy Higgs-like resonance: how thin the signal is, square cuts against a PyTorch classifier, what a quoted 5.6σ or 14.6σ really measures, and a toy that builds a fake peak out of pure background.",
  alternates: { canonical: "https://physics.paolo.org.uk/research/exotic-search" },
  openGraph: {
    title: "Hunting a 1 TeV particle",
    description: "Square cuts against a neural network in a search for a heavy resonance, and why a big sigma is not the same as a discovery.",
    url: "https://physics.paolo.org.uk/research/exotic-search",
    type: "article",
  },
};

export default function ExoticSearchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Hunting a 1 TeV particle: cuts versus a neural network",
    url: "https://physics.paolo.org.uk/research/exotic-search",
    author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ExoticSearchContent />
      <NextProject slug="exotic-search" />
    </>
  );
}
