// app/projects/hibeam/page.tsx
import type { Metadata } from 'next';
import HibeamClientContent from './HibeamClientContent';

// 1. Standard Metadata (Works perfectly because this is a Server Component)
export const metadata: Metadata = {
  title: 'HIBEAM Experiment | My Portfolio',
  description: 'High-Intensity Baryon Extraction and Measurement (HIBEAM) experiment searching for neutron conversions.',
};

export default function HibeamProjectPage() {
  // 2. Define the exact JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    "name": "HIBEAM",
    "alternateName": "High-Intensity Baryon Extraction and Measurement",
    "description": "A high-precision particle physics experiment located at the European Spallation Source (ESS)...",
    "url": "https://paolo.org.uk/projects/hibeam",
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
      {/* 3. Inject JSON-LD silently into the head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 4. Render the heavy 3D Client Component */}
      <HibeamClientContent />
    </>
  );
}