import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import BeamlineDiagram from "@/components/physics/hibeam/BeamlineDiagram";
import { FAQ, GLOSSARY, QUICK_FACTS, REVIEWED, REVIEWED_ISO, SOURCES, URL } from "@/data/hibeam";

/**
 * WHAT IS HIBEAM? A plain-English explainer, built to answer the basic questions
 * people actually search ("what is HIBEAM", "where is HIBEAM", "what does HIBEAM
 * stand for") in the first screen, then go deeper.
 *
 * SEO notes (see PHYSICS-AND-WEB-PLAN or the Search plan doc):
 *   - One H1 that is the query; H2s are the follow-up questions in plain words.
 *   - The answer comes first in each section (this is what gets quoted).
 *   - Server-rendered, no content hidden behind JS; the diagram is an extra.
 *   - Honest authorship: independent student explainer, sources linked, review date shown.
 *   - Structured data: Article + FAQPage (matches the visible FAQ) + BreadcrumbList.
 */

const TITLE = "What is HIBEAM? The neutron experiment at the ESS in Lund, explained";
const SHORT_TITLE = "What is HIBEAM? Neutron experiment at the ESS, Lund, explained";
const DESCRIPTION =
  "HIBEAM is a planned neutron experiment at the European Spallation Source in Lund, Sweden. What it stands for, where it is, what it searches for and how it relates to NNBAR.";

export const metadata: Metadata = {
  title: { absolute: SHORT_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Physics — Paolo Minhas",
    images: [{ url: "https://physics.paolo.org.uk/hibeam/og", width: 1200, height: 630, alt: "What is HIBEAM?" }],
    publishedTime: REVIEWED_ISO,
    modifiedTime: REVIEWED_ISO,
    authors: ["Paolo Minhas"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["https://physics.paolo.org.uk/hibeam/og"] },
};

const H2 = "font-bodoni text-3xl md:text-4xl font-medium text-white mt-16 mb-5 scroll-mt-28";
const P = "text-lg leading-relaxed text-white/65";
const A = "text-[var(--accent)] hover:underline";

export default function HibeamPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${URL}#article`,
        headline: TITLE,
        description: DESCRIPTION,
        url: URL,
        inLanguage: "en-GB",
        datePublished: REVIEWED_ISO,
        dateModified: REVIEWED_ISO,
        author: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
        publisher: { "@type": "Person", name: "Paolo Minhas", url: "https://paolo.org.uk" },
        image: "https://physics.paolo.org.uk/hibeam/og",
        mainEntityOfPage: URL,
        about: {
          "@type": "Thing",
          name: "HIBEAM",
          alternateName: "High-Intensity Baryon Extraction and Measurement",
          description: "A proposed neutron-conversion experiment at the European Spallation Source in Lund, Sweden.",
        },
        mentions: [
          { "@type": "Organization", name: "European Spallation Source", url: "https://ess.eu" },
          { "@type": "Thing", name: "NNBAR" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Physics", item: "https://physics.paolo.org.uk" },
          { "@type": "ListItem", position: 2, name: "What is HIBEAM?", item: URL },
        ],
      },
    ],
  };

  return (
    <article className="relative min-h-screen overflow-x-clip bg-abyss bg-stars pb-32 text-white/70 selection:bg-ember/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative overflow-hidden border-b border-white/5 px-6 pb-16 pt-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-ember/15 blur-[130px]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <Link href="/research" className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white">
            <ArrowLeft size={14} /> Research
          </Link>
          <h1 className="mb-6 font-bodoni text-5xl font-medium leading-tight tracking-tight text-white md:text-7xl">What is HIBEAM?</h1>
          <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80">
            HIBEAM is a planned neutron experiment at the <strong className="font-medium text-white">European Spallation Source</strong> in Lund,
            Sweden. It will look for neutrons turning into <em>antineutrons</em> or into hypothetical <em>sterile neutrons</em>: processes the
            Standard Model of particle physics says should not happen.
          </p>
          <p className="mt-6 text-sm text-white/45">
            By Paolo Minhas · Facts last checked against the sources below on <time dateTime={REVIEWED_ISO}>{REVIEWED}</time>
          </p>
          <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55">
            An independent explainer written by a student who worked on a HIBEAM detector prototype (<Link href="/research/mphys" className={A}>my MPhys project</Link>).
            It is not an official page of the HIBEAM/NNBAR collaboration or the ESS. For official information see the{" "}
            <a href="https://www.particle-nuclear.lu.se/experimental-particle-and-nuclear-physics/hibeam-nnbar" className={A} target="_blank" rel="noopener noreferrer">collaboration page</a>{" "}
            and <a href="https://ess.eu" className={A} target="_blank" rel="noopener noreferrer">ess.eu</a>.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-6 pt-12">
        <nav aria-label="On this page" className="text-sm font-mono text-white/45">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              ["stands-for", "What it stands for"],
              ["where", "Where it is"],
              ["searches", "What it searches for"],
              ["how", "How it works"],
              ["nnbar", "HIBEAM vs NNBAR"],
              ["status", "When it will run"],
              ["faq", "FAQ"],
              ["sources", "Sources"],
            ].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="hover:text-white">{label}</a></li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="facts">
          <h2 id="facts" className={H2}>HIBEAM at a glance</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[420px] border-collapse text-left text-base">
              <tbody>
                {QUICK_FACTS.map((f) => (
                  <tr key={f.label} className="border-b border-white/10 last:border-0">
                    <th scope="row" className="w-40 align-top px-4 py-3 text-xs font-mono font-normal uppercase tracking-wider text-white/40">{f.label}</th>
                    <td className="px-4 py-3 text-white/75">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="stands-for">
          <h2 id="stands-for" className={H2}>What does HIBEAM stand for?</h2>
          <p className={P}>
            <strong className="text-white">High-Intensity Baryon Extraction and Measurement.</strong> A <em>baryon</em> is a particle made of
            three quarks; the neutron and the proton are the familiar ones. “Extraction” refers to the beam of neutrons drawn out of the ESS for
            the experiment, and “measurement” to looking for the rare events that would show a neutron changing into something else.
          </p>
        </section>

        <section aria-labelledby="where">
          <h2 id="where" className={H2}>Where is HIBEAM?</h2>
          <p className={P}>
            HIBEAM is proposed for the <strong className="text-white">European Spallation Source (ESS)</strong> in <strong className="text-white">Lund,
            Sweden</strong>. The ESS is a large neutron research facility built by a consortium of European countries, including the UK. It
            makes neutrons by firing protons from a linear accelerator at a rotating tungsten target, and uses them to study materials. Particle
            physics experiments like HIBEAM make use of the same neutron source.
          </p>
          <p className={P}>
            In the HIBEAM instrument paper the beamline sits at the E5 beam port in the east sector of the experimental hall, between the VESPA
            and SKADI instruments, and runs about 65 m from the neutron source in a 40 cm diameter vacuum pipe.
          </p>
        </section>

        <section aria-labelledby="searches">
          <h2 id="searches" className={H2}>What is HIBEAM searching for?</h2>
          <p className={P}>
            The Standard Model never changes the number of baryons. Yet the universe contains almost no antimatter, and explaining that needs
            some process that <em>does</em> change baryon number. HIBEAM looks for such processes using free neutrons:
          </p>
          <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-white/65 marker:text-[var(--accent)]">
            <li>
              <strong className="text-white">Neutron to antineutron.</strong> Neutrons fly through a magnetically shielded region and hit a thin
              carbon target surrounded by a detector. An antineutron would annihilate in the target and throw out several pions. The last
              dedicated search of this kind was at the ILL reactor in Grenoble roughly three decades ago, and the HIBEAM paper estimates about a
              tenfold improvement in sensitivity.
            </li>
            <li>
              <strong className="text-white">Neutron to sterile neutron.</strong> A sterile neutron would be a hidden, dark-sector cousin of the
              neutron. HIBEAM can look for it two ways: a neutron beam that mysteriously loses intensity (<em>disappearance</em>), or neutrons that
              vanish at a beam stop and then reappear behind it (<em>regeneration</em>).
            </li>
            <li>
              <strong className="text-white">Other searches.</strong> The instrument paper also describes looking for ultralight axion dark matter
              through the precession of neutron spins, and for a tiny electric charge on the neutron by watching for beam deflection.
            </li>
          </ul>
        </section>

        <section aria-labelledby="how">
          <h2 id="how" className={H2}>How does HIBEAM work?</h2>
          <p className={P}>
            Slow neutrons travel down a long evacuated pipe in which the magnetic field is controlled very carefully. If a neutron changes into
            something else on the way, there is a signature at the far end. Click through the stages below.
          </p>
          <BeamlineDiagram />
        </section>

        <section aria-labelledby="nnbar">
          <h2 id="nnbar" className={H2}>HIBEAM and NNBAR: what is the difference?</h2>
          <p className={P}>
            HIBEAM is the <strong className="text-white">first stage</strong> of a two-stage programme. It uses an existing, smaller ESS beam
            port. <strong className="text-white">NNBAR</strong> is the proposed second stage, using the ESS large beam port with a much bigger
            detector, aiming for a far higher sensitivity to neutron to antineutron conversion; the HIBEAM paper quotes up to three orders of
            magnitude better than previous searches for the full programme. A conceptual design report for NNBAR has been published. The
            collaboration is often written HIBEAM/NNBAR.
          </p>
        </section>

        <section aria-labelledby="detector">
          <h2 id="detector" className={H2}>What did I work on?</h2>
          <p className={P}>
            For my MPhys thesis I analysed a prototype <em>time projection chamber</em>, a gas detector that traces the paths of charged
            particles, to check how well it measures the energy particles lose as they pass through. It is one of the technologies being
            developed for tracking the particles from an annihilation. The write-up has the interactive detector and simulation:{" "}
            <Link href="/research/mphys" className={A}>MPhys thesis: the HIBEAM prototype TPC</Link>.
          </p>
        </section>

        <section aria-labelledby="status">
          <h2 id="status" className={H2}>When will HIBEAM run?</h2>
          <p className={P}>
            As of the papers listed below (2023 to 2025), HIBEAM is in design and engineering, and none of them gives a date for taking data.
            The ESS itself is being commissioned, with its user programme planned from 2027, and the HIBEAM paper notes the ESS is committed to
            2 MW on target by 2028 with the infrastructure for 5 MW. I will update this page when the collaboration or the ESS announce more.
            Check <a href="https://ess.eu" className={A} target="_blank" rel="noopener noreferrer">ess.eu</a> for the latest news.
          </p>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" className={H2}>HIBEAM: frequently asked questions</h2>
          <dl className="space-y-6">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <dt className="font-bodoni text-xl text-white mb-2">{f.q}</dt>
                <dd className="text-white/65 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="glossary">
          <h2 id="glossary" className={H2}>Glossary</h2>
          <dl className="space-y-4">
            {GLOSSARY.map((g) => (
              <div key={g.term}>
                <dt className="text-white font-medium">{g.term}</dt>
                <dd className="text-white/60 leading-relaxed">{g.def}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources" className={H2}>Sources and further reading</h2>
          <ul className="space-y-4">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${A} inline-flex items-start gap-1`}>
                  {s.label} <ArrowUpRight size={14} className="mt-1 shrink-0" />
                </a>
                <p className="text-sm text-white/45">{s.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-white/45">
            Spotted something wrong or out of date? <a className={A} href="https://paolo.org.uk/contact">Tell me</a> and I will correct it.
          </p>
        </section>
      </div>
    </article>
  );
}
