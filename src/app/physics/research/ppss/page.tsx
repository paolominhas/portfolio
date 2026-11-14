import NextProject from "@/components/physics/research/NextProject";
import type { Metadata } from "next";
import PpssContent from "@/components/physics/ppss/PpssContent";

export const metadata: Metadata = {
  title: "Hunting for a Forbidden Decay at LHCb — Paolo Minhas",
  description:
    "An interactive report on a summer at IFJ PAN: a boosted-decision-tree selection, Punzi optimisation, mass fit and CLs limit for the lepton-flavour-violating decay Λc⁺ → p e⁻ μ⁺, with live toys and the real plots.",
  alternates: { canonical: "https://physics.paolo.org.uk/research/ppss" },
  openGraph: {
    title: "Hunting for a Forbidden Decay at LHCb",
    description: "Machine learning, a figure of merit and a limit: a student search for Λc⁺ → p e⁻ μ⁺, explained interactively.",
    url: "https://physics.paolo.org.uk/research/ppss",
    type: "article",
  },
};

export default function PpssPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Hunting for a Forbidden Decay at LHCb",
    url: "https://physics.paolo.org.uk/research/ppss",
    author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PpssContent />
      <NextProject slug="ppss" />
    </>
  );
}
