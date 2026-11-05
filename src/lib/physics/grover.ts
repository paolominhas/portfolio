/**
 * Grover's algorithm on a plain array of real amplitudes.
 * No quantum library needed: with one marked item every amplitude stays real,
 * so the whole algorithm is "flip one sign, then reflect about the mean".
 * This is the same maths the Qiskit circuits in the grover repo implement,
 * and the numbers agree with them (see the repo's pytest suite).
 */

export const MAX_QUBITS = 6;

/** Rotation angle: sin(theta) = sqrt(M/N). */
export function theta(n: number, marked = 1): number {
  return Math.asin(Math.sqrt(marked / 2 ** n));
}

/** P(success) after k iterations: sin^2((2k+1) theta). */
export function successProbability(n: number, k: number, marked = 1): number {
  return Math.sin((2 * k + 1) * theta(n, marked)) ** 2;
}

/** Iteration count that maximises the success probability. */
export function optimalIterations(n: number, marked = 1): number {
  return Math.max(0, Math.round(Math.PI / (4 * theta(n, marked)) - 0.5));
}

export interface Stage {
  amps: number[];
  label: string;
}

/**
 * Every half-step: start, then (oracle, diffuser) for each iteration.
 * stage index 2k is "after k full iterations", 2k+1 is "k iterations plus an oracle call".
 */
export function stages(n: number, markedIndex: number, iterations: number): Stage[] {
  const N = 2 ** n;
  let a = new Array<number>(N).fill(1 / Math.sqrt(N));
  const out: Stage[] = [{ amps: a.slice(), label: "Equal superposition: every item has the same amplitude" }];
  for (let k = 1; k <= iterations; k++) {
    a = a.slice();
    a[markedIndex] = -a[markedIndex];
    out.push({ amps: a.slice(), label: `Iteration ${k}, oracle: the marked item's sign is flipped` });
    const mean = a.reduce((s, x) => s + x, 0) / N;
    a = a.map((x) => 2 * mean - x);
    out.push({ amps: a.slice(), label: `Iteration ${k}, diffuser: every amplitude is reflected about the mean` });
  }
  return out;
}

export function meanOf(a: number[]): number {
  return a.reduce((s, x) => s + x, 0) / a.length;
}

export function bits(i: number, n: number): string {
  return i.toString(2).padStart(n, "0");
}
