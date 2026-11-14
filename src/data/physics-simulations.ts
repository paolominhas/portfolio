/** The simulations listed on the physics home page and on /simulations. */
export interface SimEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: "live" | "soon";
}

export const simulations: SimEntry[] = [
  {
    slug: "ising",
    title: "Ising Model",
    description: "2D ferromagnet with Glauber & Kawasaki dynamics. Watch phase transitions live.",
    tags: ["Statistical Mechanics", "Metropolis", "Phase Transition"],
    status: "live",
  },
  {
    slug: "game-of-life",
    title: "Game of Life",
    description: "Conway's cellular automaton. Gliders, oscillators, and emergent complexity.",
    tags: ["Cellular Automata", "Emergence", "Complexity"],
    status: "soon",
  },
  {
    slug: "sirs",
    title: "SIRS Epidemic Model",
    description: "Susceptible-Infected-Recovered-Susceptible dynamics with immunity and phase diagrams.",
    tags: ["Epidemiology", "Phase Diagram", "Monte Carlo"],
    status: "soon",
  },
  {
    slug: "cahn-hilliard",
    title: "Cahn-Hilliard Equation",
    description: "Spinodal decomposition and phase separation in binary mixtures.",
    tags: ["PDE", "Phase Separation", "Free Energy"],
    status: "soon",
  },
  {
    slug: "poisson",
    title: "Poisson Solver",
    description: "Electrostatics via Gauss-Seidel and SOR relaxation on 2D and 3D grids.",
    tags: ["Electrostatics", "PDE", "Relaxation Methods"],
    status: "soon",
  },
];
