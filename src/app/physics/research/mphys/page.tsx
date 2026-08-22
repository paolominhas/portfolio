import type { Metadata } from 'next';
import MphysContent from '@/components/physics/MphysContent';

export const metadata: Metadata = {
  title: 'MPhys Thesis — HIBEAM Prototype TPC',
  description:
    'High-Intensity Baryon Extraction and Measurement (HIBEAM) experiment searching for neutron conversions — MPhys dE/dx analysis of the prototype TPC detector.',
};

export default function MphysResearchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    "name": "HIBEAM",
    "alternateName": "High-Intensity Baryon Extraction and Measurement",
    "description": "A high-precision particle physics experiment located at the European Spallation Source (ESS)...",
    "url": "https://physics.paolo.org.uk/research/mphys",
    "location": {
      "@type": "Place",
      "name": "European Spallation Source (ESS)",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lund",
        "addressCountry": "Sweden"
      }
    },
    "sponsor": {
      "@type": "Organization",
      "name": "European Spallation Source"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MphysContent />
    </>
  );
}
