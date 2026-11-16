import type { Metadata } from "next";
import NextProject from "@/components/physics/research/NextProject";
import MiniCmsContent from "@/components/physics/mini-cms/MiniCmsContent";

export const metadata: Metadata = {
  title: "Telling Particles Apart: a Mini-CMS in Geant4 — Paolo Minhas",
  description:
    "An interactive write-up of a coursework project: a layered Geant4 detector that can tell electrons from muons but not pions from kaons, with a live track-curvature lab, a particle explorer and a Cherenkov-angle sweep that shows why.",
  alternates: { canonical: "https://physics.paolo.org.uk/research/mini-cms" },
  openGraph: {
    title: "Telling particles apart",
    description: "A home-built Geant4 detector, five attempts at telling pions from kaons, and what Cherenkov physics says about why they all scored 50%.",
    url: "https://physics.paolo.org.uk/research/mini-cms",
    type: "article",
  },
};

export default function MiniCmsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Telling particles apart: a mini-CMS in Geant4",
    url: "https://physics.paolo.org.uk/research/mini-cms",
    author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MiniCmsContent />
      <NextProject slug="mini-cms" />
    </>
  );
}
