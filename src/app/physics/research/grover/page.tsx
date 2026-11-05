import type { Metadata } from "next";
import GroverContent from "@/components/physics/grover/GroverContent";

export const metadata: Metadata = {
  title: "Grover's Algorithm on IBM Quantum — Paolo Minhas",
  description:
    "Grover's search algorithm built in Qiskit, checked against the theory, then run ideally, in a noisy simulation and on real IBM hardware. An interactive explainer of why it gives a quadratic, not exponential, speed-up.",
  alternates: { canonical: "https://physics.paolo.org.uk/research/grover" },
  openGraph: {
    title: "Grover's Algorithm on IBM Quantum",
    description: "Quantum search in Qiskit: the maths, an interactive playground, and what noise does to it.",
    url: "https://physics.paolo.org.uk/research/grover",
    type: "article",
  },
};

export default function GroverPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Grover's Algorithm on IBM Quantum",
    url: "https://physics.paolo.org.uk/research/grover",
    author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GroverContent />
    </>
  );
}
