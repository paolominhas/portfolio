import type { Metadata } from 'next';
import MphysContent from '@/components/physics/MphysContent';

export const metadata: Metadata = {
  title: 'MPhys Thesis — HIBEAM Prototype TPC',
  description:
    'MPhys dE/dx analysis of the prototype time projection chamber for HIBEAM (High-Intensity Baryon Extraction and Measurement), the neutron-conversion experiment planned at the European Spallation Source.',
  alternates: { canonical: 'https://physics.paolo.org.uk/research/mphys' },
};

export default function MphysResearchPage() {
  // This page is Paolo's thesis write-up, so it is an Article *about* HIBEAM,
  // not the HIBEAM project itself (the old markup described it as the project,
  // with the ESS as sponsor, which is not accurate for a personal site). The
  // explainer at /hibeam is the page that answers "what is HIBEAM".
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "MPhys Thesis: HIBEAM Prototype TPC",
    "url": "https://physics.paolo.org.uk/research/mphys",
    "author": { "@type": "Person", "name": "Paolo Minhas", "url": "https://paolo.org.uk" },
    "about": {
      "@type": "Thing",
      "name": "HIBEAM",
      "alternateName": "High-Intensity Baryon Extraction and Measurement",
      "url": "https://physics.paolo.org.uk/hibeam"
    },
    "mentions": { "@type": "Organization", "name": "European Spallation Source", "url": "https://ess.eu" }
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
