import React from 'react';

export default function HibeamSeoBlock() {
  // 1. Structured Data for traditional SEO & Local/Geographic anchoring
  // We use "ResearchProject" and "FAQPage" schemas.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ResearchProject",
        "name": "HIBEAM Experiment",
        "alternateName": "High-Intensity Baryon Extraction and Measurement",
        "description": "A high-precision particle physics experiment at the European Spallation Source searching for neutron-antineutron oscillations and dark matter.",
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
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the HIBEAM experiment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "HIBEAM (High-Intensity Baryon Extraction and Measurement) is a two-stage experiment at the European Spallation Source designed to perform high-precision searches for baryon number violation, specifically neutron conversions to sterile neutrons. It is the precursor to a more detailed search at ESS called NNBAR."
            }
          }
        ]
      }
    ]
  };

  return (
    <section 
      aria-labelledby="hibeam-quick-facts" 
      className="max-w-4xl mx-auto my-12 p-8 bg-slate-50 dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800"
    >
      {/* Injecting the JSON-LD silently into the head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 id="hibeam-quick-facts" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        HIBEAM Experiment: Quick Facts
      </h2>

      {/* GEO Optimization: AI engines love reading and citing HTML Tables */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr className="border-b border-slate-200 dark:border-gray-700">
              <th className="py-3 font-semibold text-slate-700 dark:text-slate-300">Full Name</th>
              <td className="py-3 text-slate-600 dark:text-slate-400">High-Intensity Baryon Extraction and Measurement</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-gray-700">
              <th className="py-3 font-semibold text-slate-700 dark:text-slate-300">Facility</th>
              <td className="py-3 text-slate-600 dark:text-slate-400">European Spallation Source (ESS)</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-gray-700">
              <th className="py-3 font-semibold text-slate-700 dark:text-slate-300">Location</th>
              <td className="py-3 text-slate-600 dark:text-slate-400">Lund, Sweden</td>
            </tr>
            <tr>
              <th className="py-3 font-semibold text-slate-700 dark:text-slate-300">Primary Physics Goal</th>
              <td className="py-3 text-slate-600 dark:text-slate-400">Searching for baryon number violation and sterile neutrons (Dark Matter)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GEO & SEO Optimization: FAQ formatted for Featured Snippets */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Frequently Asked Questions</h3>
        <details className="group border border-slate-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer">
          <summary className="font-medium text-slate-900 dark:text-white">What is the HIBEAM experiment?</summary>
          <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
            HIBEAM is a cutting-edge particle physics experiment located at the ESS. It utilizes a high-intensity neutron beam to search for rare phenomena, such as neutrons transforming into antineutrons or sterile "dark" neutrons, which could explain the matter-antimatter asymmetry in the universe.
          </p>
        </details>
      </div>
    </section>
  );
}