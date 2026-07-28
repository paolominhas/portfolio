/**
 * ARRANGEMENTS
 *
 * Replaces the old music-posts.ts (which was framed as an analysis
 * blog — close readings of Schumann and Ravel). The music site now
 * centres on a portfolio of arrangements: pieces reworked for a
 * different ensemble, with the instrumentation, occasion, and a
 * programme note for each.
 *
 * The three entries below are illustrative placeholders (marked with
 * `placeholder: true`) — swap in your actual arrangements, premiere
 * details, and programme notes. The shape is deliberately close to
 * what a concert programme already lists, so writing a new entry
 * should feel like writing a programme note, not filling out a form.
 */

export interface Arrangement {
  slug: string;
  title: string;
  originalComposer: string;
  originalWork: string;
  arrangedFor: string; // e.g. "String Quartet", "Wind Quintet", "Chamber Orchestra"
  instrumentation: string[];
  year: number;
  durationMinutes: number;
  premiere?: {
    ensemble: string;
    date: string;
    venue?: string;
  };
  excerpt: string; // short blurb for the card grid
  programmeNote: string; // longer prose for the detail page (HTML)
  audioUrl?: string; // link to a recording, if there is one
  scoreUrl?: string; // link to a PDF/score excerpt, if shareable
  tags: string[];
  placeholder?: boolean;
}

export const arrangements: Arrangement[] = [
  {
    slug: "new-world-largo-wind-quintet",
    title: "Largo from the New World Symphony",
    originalComposer: "Antonín Dvořák",
    originalWork: "Symphony No. 9 in E minor, 2nd movement",
    arrangedFor: "Wind Quintet",
    instrumentation: ["Flute", "Oboe", "Clarinet", "Horn", "Bassoon"],
    year: 2026,
    durationMinutes: 9,
    premiere: {
      ensemble: "EUCO Chamber Players",
      date: "March 2026",
      venue: "Reid Concert Hall, Edinburgh",
    },
    excerpt:
      "The cor anglais melody redistributed across five wind voices, keeping the original's spaciousness on a much smaller stage.",
    programmeNote: `
      <p>The challenge in arranging the Largo for five players is almost entirely one of restraint: the original's famous melody belongs to a single cor anglais against a hushed string chorale, and a wind quintet has no natural equivalent for that stillness.</p>
      <p>This version passes the opening theme to the horn, with the surrounding chorale voiced across flute, oboe, and clarinet — close enough in register to keep the harmony from thinning out. The bassoon carries the bass line largely unchanged from the original's cellos and basses.</p>
    `,
    tags: ["Dvořák", "Wind Quintet", "Romantic"],
    placeholder: true,
  },
  {
    slug: "pachelbel-canon-string-trio",
    title: "Canon in D",
    originalComposer: "Johann Pachelbel",
    originalWork: "Canon and Gigue in D major",
    arrangedFor: "String Trio",
    instrumentation: ["Violin", "Viola", "Cello"],
    year: 2025,
    durationMinutes: 5,
    premiere: {
      ensemble: "EUCO Chamber Players",
      date: "December 2025",
      venue: "St Cecilia's Hall, Edinburgh",
    },
    excerpt:
      "The three original violin parts and continuo reduced to a single line each, for occasions when a full string section isn't on hand.",
    programmeNote: `
      <p>Written for the moments when a wedding or a small function calls for the Canon but not for eight players. The ground bass moves from continuo to cello, and the three canonic violin lines are thinned to one line per player — meaning some of the original's imitative texture is necessarily simplified.</p>
    `,
    tags: ["Pachelbel", "String Trio", "Baroque"],
    placeholder: true,
  },
  {
    slug: "holst-jupiter-theme-chamber-orchestra",
    title: "Theme from Jupiter",
    originalComposer: "Gustav Holst",
    originalWork: "The Planets, Op. 32 — IV. Jupiter",
    arrangedFor: "Chamber Orchestra",
    instrumentation: ["Strings", "Flute", "Oboe", "Clarinet", "Horn"],
    year: 2026,
    durationMinutes: 4,
    excerpt:
      "The central 'Thaxted' theme, scaled down from full orchestra to chamber forces for a shorter concert-opener slot.",
    programmeNote: `
      <p>A short arrangement of the famous central theme, scored for the reduced forces of a university chamber orchestra rather than Holst's full symphonic complement. Doubled woodwind lines are consolidated to single parts, and the brass writing is folded into the horn and upper strings.</p>
    `,
    tags: ["Holst", "Chamber Orchestra", "20th Century"],
    placeholder: true,
  },
];
