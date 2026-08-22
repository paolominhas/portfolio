/**
 * ISING MODEL — physics engine
 * ─────────────────────────────────────────────────────────────────
 * A TypeScript port of the 2D Ising model dynamics, for a live,
 * client-side canvas rather than pre-rendered matplotlib frames.
 *
 * PROVENANCE — please read before trusting this against your own
 * results:
 *
 *   `sweepGlauber`, `totalEnergy`, `magnetisation` are a direct port
 *   of `glauber_sweep`, `total_energy`, and `ising_mag` from your
 *   `2016/2016.py` (the antiferromagnet-in-a-field exam script) —
 *   same Metropolis-Glauber acceptance rule, same ΔE formula, same
 *   periodic boundary conditions. I flipped the default sign
 *   convention (J > 0 = ferromagnetic here, matching the "2D
 *   ferromagnet" your existing /physics index card already promises)
 *   — your source used J = -1.0 by default for the antiferromagnet
 *   case, which this engine still supports, just via `J < 0` rather
 *   than being the default.
 *
 *   `sweepKawasaki` is NOT ported from your code — `kawasaki_sweep`
 *   is only ever *imported* across your files (`from src.checkpoints
 *   import ..., kawasaki_sweep, ...`); the module it's actually
 *   defined in wasn't in the zip. What's here is the standard
 *   unrestricted spin-exchange algorithm (pick any two random sites,
 *   swap if they differ, Metropolis-accept on the energy change) that
 *   this course's checkpoints conventionally use, with the
 *   nearest-neighbour correction term derived below rather than
 *   copied from anywhere. If your checkpoints.py does it differently
 *   (e.g. restricting the second site to a neighbour of the first),
 *   send it over and I'll match it exactly instead.
 *
 * ADAPTATION NOTES (Python idiom → JS idiom, not physics changes):
 *   - A flat Int8Array (row-major, index = i*N+j) replaces the 2D
 *     numpy array — typed arrays are dramatically faster than nested
 *     JS arrays for this kind of tight per-cell loop, and it's the
 *     closest JS equivalent to numpy's contiguous memory layout.
 *   - Sweeps mutate the grid in place and return void, same as the
 *     Python (which also mutates and returns the same array) — kept
 *     so the calling animation loop doesn't allocate a new grid 60
 *     times a second.
 */

export type Dynamics = "glauber" | "kawasaki";

/** Random initial grid: spins are ±1 with a 50/50 split by default. */
export function createGrid(N: number, upFraction = 0.5): Int8Array {
  const grid = new Int8Array(N * N);
  for (let k = 0; k < N * N; k++) {
    grid[k] = Math.random() < upFraction ? 1 : -1;
  }
  return grid;
}

/** Periodic (wraparound) neighbour-sum at (i, j), the four nearest neighbours. */
function neighbourSum(grid: Int8Array, N: number, i: number, j: number): number {
  const up = grid[((i - 1 + N) % N) * N + j];
  const down = grid[((i + 1) % N) * N + j];
  const left = grid[i * N + ((j - 1 + N) % N)];
  const right = grid[i * N + ((j + 1) % N)];
  return up + down + left + right;
}

/**
 * One Glauber sweep: N² single-spin-flip attempts, Metropolis
 * acceptance. Direct port of `glauber_sweep(grid, beta, J=-1.0, h=0)`
 * from 2016.py, with J's default sign flipped (see file header).
 * beta = 1/kT. Mutates `grid` in place.
 */
export function sweepGlauber(
  grid: Int8Array,
  N: number,
  beta: number,
  J: number,
  h: number,
): void {
  for (let n = 0; n < N * N; n++) {
    const i = Math.floor(Math.random() * N);
    const j = Math.floor(Math.random() * N);
    const nn = neighbourSum(grid, N, i, j);
    const s = grid[i * N + j];
    const dE = 2.0 * (J * s * nn + h * s);
    if (dE <= 0 || Math.random() < Math.exp(-dE * beta)) {
      grid[i * N + j] = -s;
    }
  }
}

/** Whether (i1,j1) and (i2,j2) are nearest neighbours under periodic
 * (wraparound) boundary conditions. */
function areAdjacent(
  i1: number,
  j1: number,
  i2: number,
  j2: number,
  N: number,
): boolean {
  const dv = (i1 - i2 + N) % N; // periodic vertical distance, 0..N-1
  const dh = (j1 - j2 + N) % N; // periodic horizontal distance, 0..N-1
  const verticalNeighbour = (dv === 1 || dv === N - 1) && dh === 0;
  const horizontalNeighbour = (dh === 1 || dh === N - 1) && dv === 0;
  return verticalNeighbour || horizontalNeighbour;
}

/**
 * One Kawasaki sweep: N² random-pair spin-exchange attempts,
 * Metropolis acceptance, magnetisation-conserving. NOT ported from
 * your source — see the provenance note at the top of this file.
 *
 * Derivation: swapping unlike spins s_i, s_j is equivalent to
 * flipping both simultaneously. Working through
 * ΔE = E_new − E_old with the shared bond term (present only when i
 * and j are nearest neighbours) kept explicit gives the clean form
 * below — no correction needed unless the two random sites happen to
 * be adjacent, in which case a fixed +4J term appears (independent of
 * the neighbour sums), which is why the isAdjacent check exists.
 */
export function sweepKawasaki(
  grid: Int8Array,
  N: number,
  beta: number,
  J: number,
): void {
  for (let n = 0; n < N * N; n++) {
    const i1 = Math.floor(Math.random() * N);
    const j1 = Math.floor(Math.random() * N);
    const i2 = Math.floor(Math.random() * N);
    const j2 = Math.floor(Math.random() * N);

    const idx1 = i1 * N + j1;
    const idx2 = i2 * N + j2;
    const s1 = grid[idx1];
    const s2 = grid[idx2];
    if (s1 === s2) continue; // swapping identical spins changes nothing

    const nn1 = neighbourSum(grid, N, i1, j1);
    const nn2 = neighbourSum(grid, N, i2, j2);

    let dE = J * (s2 - s1) * (nn2 - nn1);
    if (areAdjacent(i1, j1, i2, j2, N)) dE += 4 * J;

    if (dE <= 0 || Math.random() < Math.exp(-dE * beta)) {
      grid[idx1] = s2;
      grid[idx2] = s1;
    }
  }
}

/** Runs whichever dynamics is selected — a thin dispatch so the
 * animation loop doesn't need to branch. */
export function sweep(
  grid: Int8Array,
  N: number,
  dynamics: Dynamics,
  beta: number,
  J: number,
  h: number,
): void {
  if (dynamics === "glauber") sweepGlauber(grid, N, beta, J, h);
  else sweepKawasaki(grid, N, beta, J);
}

/**
 * Total energy, E = -J·Σ(unique nearest-neighbour pairs) - h·Σs_i.
 * Direct port of `total_energy` from 2016.py — counts only the
 * down/right neighbour of each site to avoid double-counting bonds,
 * same as the source.
 */
export function totalEnergy(grid: Int8Array, N: number, J: number, h: number): number {
  let E = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const s = grid[i * N + j];
      const down = grid[((i + 1) % N) * N + j];
      const right = grid[i * N + ((j + 1) % N)];
      E -= J * s * (down + right) + h * s;
    }
  }
  return E;
}

/** Total magnetisation, Σs_i. Direct port of `ising_mag` from 2016.py. */
export function magnetisation(grid: Int8Array, N: number): number {
  let M = 0;
  for (let k = 0; k < N * N; k++) M += grid[k];
  return M;
}
