/**
 * MUSIC BLOG POSTS DATA
 *
 * Same pattern as your existing projects.ts and articles.ts.
 * Each post has a slug (URL), metadata, and content (HTML string).
 *
 * For notation, posts can include a special marker like
 * <div id="vexflow-example-1" data-notes="C5/q, D5, E5, F5"></div>
 * which the VexFlow component picks up and renders. See the
 * MusicNotation component in src/components/music/MusicNotation.tsx.
 *
 * Alternatively, for longer scores you can embed <MusicNotation>
 * components directly if the content is rendered as JSX (see the
 * dynamic route page for how this works).
 */

export interface MusicPost {
  slug: string;
  title: string;
  date: string; // ISO or display string
  excerpt: string;
  tags: string[];
  content: string; // HTML content
}

export const musicPosts: MusicPost[] = [
  {
    slug: "schumann-rhenish-analysis",
    title: "The Rhenish Symphony: Structure and Spirit",
    date: "2026-05-10",
    excerpt:
      "An analysis of Schumann's Third Symphony and its architectural ambition — how the Cologne Cathedral inspired a five-movement structure.",
    tags: ["Schumann", "Symphonic Analysis", "Romanticism"],
    content: `
      <h2>Five Movements, One Cathedral</h2>
      <p>The Rhenish is unusual among symphonies for having five movements rather than four...</p>
      <!-- VexFlow notation will be rendered by the MusicNotation component -->
      <!-- Add notation blocks like this in your content: -->
      <div class="vexflow-score" data-clef="treble" data-time="3/4" data-notes="Eb4/h., Eb4/q, G4, Bb4, Eb5/h., D5/q, C5, Bb4"></div>
      <p>The opening theme is broad and aspirational, outlining an Eb major triad...</p>
    `,
  },
  {
    slug: "ravel-daphnis-orchestration",
    title: "Orchestration Lessons from Daphnis et Chloé",
    date: "2026-04-22",
    excerpt:
      "How Ravel builds shimmering textures from simple materials — a close look at the Sunrise passage.",
    tags: ["Ravel", "Orchestration", "Impressionism"],
    content: `
      <h2>The Sunrise</h2>
      <p>The dawn passage in Daphnis et Chloé Suite No. 2 is a masterclass in additive orchestration...</p>
    `,
  },
];
