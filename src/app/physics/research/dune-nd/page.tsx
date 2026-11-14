import type { Metadata } from "next";
import DuneNdContent from "@/components/physics/dune-nd/DuneNdContent";

export const metadata: Metadata = {
  title: "Can We Trust the Neutrino Energy? DUNE Near Detector — Paolo Minhas",
  description:
    "An interactive report on a Senior Honours project: simulated DUNE near-detector events, where reconstructed neutrino energy goes wrong, and why that matters for measuring CP violation. Build final states, switch mis-reconstruction effects on one by one, and browse every plot.",
  alternates: { canonical: "https://physics.paolo.org.uk/research/dune-nd" },
  openGraph: {
    title: "Can we trust the neutrino energy?",
    description: "Where a reconstructed neutrino energy goes wrong at the DUNE near detector, and why it matters for CP violation.",
    url: "https://physics.paolo.org.uk/research/dune-nd",
    type: "article",
  },
};

export default function DuneNdPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Can we trust the neutrino energy? DUNE near-detector simulation",
    url: "https://physics.paolo.org.uk/research/dune-nd",
    author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DuneNdContent />
    </>
  );
}
