import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import OptionPricingContent from "@/components/physics/option-pricing/OptionPricingContent";

/**
 * OPTION PRICING LAB: bespoke route on the main site.
 *
 * Moved here from physics.paolo.org.uk/research/option-pricing because it is
 * quantitative finance, not physics. The static folder wins over
 * projects/[slug]; the card lives in src/data/projects.ts (category 'quant').
 * The old physics URL redirects here (see physics/research/option-pricing).
 *
 * The page keeps the physics look, which relied on things the physics layout
 * provided: the Bodoni font and the --accent variables. This wrapper supplies
 * both so nothing in the content components had to change.
 */

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

const TITLE = "Option Pricing Lab: Black–Scholes, Monte Carlo and Greeks";
const DESCRIPTION =
  "A small Python library that prices European options by the Black–Scholes closed form and by Monte Carlo, then estimates the Greeks by bump-and-reprice, with an interactive in-browser playground.";
const REPO_URL = "https://github.com/paolominhas/option-pricer";
const URL = "https://paolo.org.uk/projects/option-pricing";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "article" },
};

export default function OptionPricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: TITLE,
    description: DESCRIPTION,
    programmingLanguage: ["Python", "TypeScript"],
    author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
    url: URL,
    codeRepository: REPO_URL,
  };

  return (
    <div
      className={bodoni.variable}
      style={
        {
          "--accent": "#FF6B3D",
          "--accent-muted": "rgba(255, 107, 61, 0.15)",
          "--accent-border": "rgba(255, 107, 61, 0.25)",
        } as React.CSSProperties
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OptionPricingContent repoUrl={REPO_URL} />
    </div>
  );
}
