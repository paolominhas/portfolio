/**
 * HIBEAM EXPLAINER: all the words for physics.paolo.org.uk/hibeam.
 *
 * Why a data file: the visible FAQ, the FAQPage structured data and the quick
 * facts must say the same thing, and one source guarantees that. Edit here.
 *
 * Accuracy rules for this page
 *   - Every factual claim comes from the sources listed below or from the
 *     author's own MPhys work. No numbers that are not in a source.
 *   - This is an independent student explainer, not an official page of the
 *     HIBEAM/NNBAR collaboration or the ESS. The page says so near the top.
 *   - REVIEWED is the date the facts were last checked against the sources.
 *     Update it (and the status paragraph) whenever you re-check.
 */

export const REVIEWED = "5 November 2026";
export const REVIEWED_ISO = "2026-11-05";
export const URL = "https://physics.paolo.org.uk/hibeam";

export interface Source {
  label: string;
  href: string;
  note: string;
}

export const SOURCES: Source[] = [
  {
    label: "The HIBEAM Instrument at the European Spallation Source",
    href: "https://arxiv.org/abs/2311.08326",
    note: "arXiv:2311.08326. The instrument paper: what HIBEAM stands for, the beamline, the searches.",
  },
  {
    label: "The HIBEAM Experiment (A. Burgman, for the HIBEAM/NNBAR Collaboration)",
    href: "https://arxiv.org/abs/2412.15933",
    note: "arXiv:2412.15933, December 2024. The two-stage programme and its relation to NNBAR.",
  },
  {
    label: "Searches for baryon number violation in the HIBEAM-NNBAR experiment at the ESS",
    href: "https://arxiv.org/abs/2309.02526",
    note: "arXiv:2309.02526. The physics case for the combined programme.",
  },
  {
    label: "HIBEAM/NNBAR at Lund University",
    href: "https://www.particle-nuclear.lu.se/experimental-particle-and-nuclear-physics/hibeam-nnbar",
    note: "The collaboration's group page in Lund.",
  },
  {
    label: "European Spallation Source",
    href: "https://ess.eu",
    note: "The facility's own site, for current construction and commissioning status.",
  },
];

export interface Fact {
  label: string;
  value: string;
}

export const QUICK_FACTS: Fact[] = [
  { label: "Stands for", value: "High-Intensity Baryon Extraction and Measurement" },
  { label: "Where", value: "European Spallation Source (ESS), Lund, Sweden" },
  { label: "What it searches for", value: "Neutrons turning into antineutrons or into hypothetical “sterile” neutrons" },
  { label: "Why", value: "Such conversions would violate baryon number, which any explanation of the matter–antimatter imbalance needs" },
  { label: "Beamline", value: "About 65 m from the neutron source, with a magnetically controlled section of about 50 m" },
  { label: "Relation to NNBAR", value: "HIBEAM is the first stage; NNBAR is the proposed, larger second stage" },
  { label: "Run by", value: "The HIBEAM/NNBAR collaboration (an international group of physicists)" },
  { label: "Status", value: "In design and engineering in the papers cited below; see the status section for what is and isn’t known" },
];

export interface Faq {
  q: string;
  a: string;
}

/** Short, answer-first. Reused verbatim in the page and in the FAQPage JSON-LD. */
export const FAQ: Faq[] = [
  {
    q: "What is HIBEAM?",
    a: "HIBEAM is a planned neutron experiment at the European Spallation Source in Lund, Sweden. It will send a beam of neutrons down a magnetically shielded beamline to look for neutrons changing into other particles, such as antineutrons or hypothetical “sterile” neutrons, which the Standard Model of particle physics says should not happen.",
  },
  {
    q: "What does HIBEAM stand for?",
    a: "High-Intensity Baryon Extraction and Measurement. A baryon is a particle made of three quarks, such as a neutron or a proton, and the experiment looks for processes that change the number of baryons.",
  },
  {
    q: "Where is HIBEAM?",
    a: "HIBEAM is proposed for the European Spallation Source (ESS) in Lund, Sweden. In the instrument paper the beamline sits at the E5 beam port in the east sector of the experimental hall, between the VESPA and SKADI instruments.",
  },
  {
    q: "What is HIBEAM searching for?",
    a: "Neutron conversions. The main searches are a neutron turning into an antineutron and a neutron turning into a hypothetical sterile neutron, which could belong to a dark sector. Either would be new physics, and conversion to an antineutron would break baryon number conservation.",
  },
  {
    q: "Is HIBEAM the same as NNBAR?",
    a: "No. HIBEAM is the first stage and NNBAR is the proposed second stage. HIBEAM uses an existing ESS beam port; NNBAR would use the ESS large beam port and be much larger, aiming for a far higher sensitivity to neutron–antineutron conversion. The two are often written together as HIBEAM/NNBAR.",
  },
  {
    q: "Is HIBEAM running yet?",
    a: "The papers cited on this page, from 2023 to 2025, describe HIBEAM as being in design and engineering, and give no start date for data-taking. The ESS itself was still being commissioned, with its user programme planned from 2027. Check the ESS and the collaboration for the latest.",
  },
];

export interface GlossaryTerm {
  term: string;
  def: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Baryon number", def: "A count of three-quark particles (neutrons, protons) minus their antiparticles. The Standard Model never changes it; HIBEAM looks for something that does." },
  { term: "Antineutron", def: "The antimatter partner of the neutron. When it meets ordinary matter it annihilates into several pions, which is how HIBEAM would spot one." },
  { term: "Sterile neutron", def: "A hypothetical neutron-like particle that does not feel the usual forces, possibly part of a dark sector. A neutron could in principle convert into one and back again." },
  { term: "Spallation", def: "Knocking neutrons out of a heavy nucleus with a high-energy proton beam. The ESS does this with a tungsten target." },
  { term: "Moderator", def: "Material that slows the freshly made neutrons down to the slow “cold” speeds the experiments use." },
  { term: "Time projection chamber (TPC)", def: "A gas-filled detector that records the tracks of charged particles in three dimensions. A TPC is one of the technologies being developed for tracking particles from an annihilation." },
  { term: "Sensitivity", def: "How small an effect an experiment could detect. HIBEAM’s goal is a sensitivity to neutron–antineutron conversion about ten times better than the last dedicated search, at the ILL reactor in Grenoble." },
];
