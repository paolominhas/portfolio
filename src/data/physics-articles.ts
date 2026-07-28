/**
 * PHYSICS ARTICLES
 *
 * Block-based content model, so an article can mix prose, headings,
 * an embedded simulation, and the Python source that produced it —
 * this is the "architecture" for turning a matplotlib 2D-grid
 * simulation into web content, as opposed to the separate
 * /physics/simulations/* pages (which are live re-implementations of
 * the physics in JavaScript). Articles instead show a *recording* of
 * a Python-computed run, via SimulationPlayer.
 *
 * A plain array of typed blocks (rather than an HTML string, as the
 * music arrangements use) because a simulation embed and a code
 * panel are React components, not markup — there's no clean way to
 * drop those into a dangerouslySetInnerHTML string the way a VexFlow
 * placeholder div can be.
 */

export type ArticleBlock =
  | { type: "paragraph"; html: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "simulation"; simulationId: string; caption?: string }
  | { type: "code"; code: string; language?: string; caption?: string };

export interface PhysicsArticle {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  blocks: ArticleBlock[];
}

const GAME_OF_LIFE_CODE = `def step(grid: np.ndarray) -> np.ndarray:
    """One Game of Life update, with wraparound (toroidal) boundaries."""
    neighbor_count = sum(
        np.roll(np.roll(grid, dy, axis=0), dx, axis=1)
        for dy in (-1, 0, 1)
        for dx in (-1, 0, 1)
        if (dy, dx) != (0, 0)
    )
    born = (neighbor_count == 3) & (grid == 0)
    survives = grid.astype(bool) & ((neighbor_count == 2) | (neighbor_count == 3))
    return (born | survives).astype(np.uint8)


recorder = SimulationRecorder(width=60, height=60, value_range=(0, 1))
grid = build_initial_grid()  # Gosper glider gun + one glider
recorder.capture(grid)

for _ in range(89):
    grid = step(grid)
    recorder.capture(grid)

recorder.save(
    output_dir="public/simulations",
    id="game-of-life-gliders",
    title="Conway's Game of Life — Glider Gun",
    fps=12,
    colormap="binary",
    parameters={"width": 60, "height": 60, "rule": "B3/S23"},
)`;

export const physicsArticles: PhysicsArticle[] = [
  {
    slug: "game-of-life-gliders",
    title: "Gliders, Guns, and Still Lifes",
    date: "2026-07-20",
    excerpt:
      "A worked example of the simulation-export pipeline: a Gosper glider gun computed in NumPy, exported as frames, and played back live below.",
    tags: ["Cellular Automata", "NumPy", "Worked Example"],
    blocks: [
      {
        type: "paragraph",
        html: "Conway's Game of Life needs no physical justification to be worth including here — it's the simplest possible test case for the export pipeline this site now uses to get a 2D grid simulation from a Python script into an article. The rule is three lines: a dead cell with exactly three live neighbours becomes alive, a live cell with two or three live neighbours survives, and every other cell dies or stays dead.",
      },
      {
        type: "heading",
        text: "A glider gun",
        level: 2,
      },
      {
        type: "paragraph",
        html: "The grid below was computed offline in NumPy — no JavaScript re-implementation of the rule exists on this page. What you're watching is a recording: a Gosper glider gun in the top-left corner, which periodically emits gliders that travel diagonally across the (wraparound) grid, alongside a single glider seeded independently.",
      },
      {
        type: "simulation",
        simulationId: "game-of-life-gliders",
        caption:
          "90 frames, 60×60 grid, toroidal boundaries. Drag the scrubber or hit play.",
      },
      {
        type: "paragraph",
        html: "Producing this only takes NumPy — matplotlib was never involved in the export, only in how the simulation might normally be viewed locally with <code>imshow</code>. The <code>SimulationRecorder</code> helper quantises each frame to a single byte per cell and writes out a small JSON manifest plus a frames file, which is what <code>SimulationPlayer</code> below fetches and draws to a canvas.",
      },
      {
        type: "code",
        language: "python",
        caption: "export excerpt (see scripts/simulations/examples/game_of_life.py)",
        code: GAME_OF_LIFE_CODE,
      },
      {
        type: "paragraph",
        html: "The same pipeline works for any 2D grid simulation with a numeric state — an Ising spin lattice, a SIRS epidemic grid, a Cahn-Hilliard concentration field, or a Poisson solver's potential — just swap the <code>step</code> function, pick a suitable <code>value_range</code> and colormap (<code>coolwarm</code> for signed data, <code>viridis</code> for a continuous field, <code>binary</code> for 0/1 grids like this one), and export.",
      },
    ],
  },
];
