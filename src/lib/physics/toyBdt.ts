/**
 * A very small gradient-boosted decision tree (the same family as XGBoost),
 * written from scratch so the report can let you turn the knobs live.
 *
 * It is a TOY: invented data, 7 variables, a few hundred events. It does not
 * reproduce the LHCb numbers. What it does reproduce is the behaviour the
 * notes describe: too many deep trees overtrain, and a variable that gives
 * the simulation away makes the Punzi plot spike near 1.
 *
 * Maths (as in XGBoost, binary logistic loss, second-order):
 *   gradient g = p - y,  hessian h = p(1-p)
 *   leaf weight  w = -G / (H + lambda)
 *   split gain   = G_L^2/(H_L+l) + G_R^2/(H_R+l) - G^2/(H+l)
 */

export const N_FEATURES = 7;
export const MAX_TREES = 200;

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  const u = Math.max(r(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

export interface Dataset {
  X: number[][]; // [event][feature]
  y: Uint8Array;
}

/**
 * Features 0-2 carry a weak real signal/background difference.
 * Features 3-5 are pure noise.
 * Feature 6 is noise, unless `leak` is on: then simulated signal sits far from
 * data in it. That is the "a cut was removed from the signal file" bug: the
 * classifier can tell simulation from data without learning any physics.
 */
export function makeToy(seed: number, n: number, leak: boolean): Dataset {
  const r = mulberry32(seed);
  const X: number[][] = [];
  const y = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const sig = i % 2 === 0;
    y[i] = sig ? 1 : 0;
    const row = new Array<number>(N_FEATURES);
    row[0] = gauss(r) + (sig ? 0.9 : 0);
    row[1] = gauss(r) + (sig ? 0.8 : 0);
    row[2] = gauss(r) + (sig ? 0.6 : 0);
    row[3] = gauss(r);
    row[4] = gauss(r);
    row[5] = gauss(r);
    row[6] = leak && sig ? 4 + 0.6 * gauss(r) : gauss(r);
    X.push(row);
  }
  return { X, y };
}

interface Node {
  feat: number;
  thr: number;
  left: Node | null;
  right: Node | null;
  w: number;
}

function buildTree(
  X: number[][],
  g: Float64Array,
  h: Float64Array,
  idx: number[],
  depth: number,
  maxDepth: number,
  minChild: number,
  lambda: number
): Node {
  let G = 0;
  let H = 0;
  for (const i of idx) {
    G += g[i];
    H += h[i];
  }
  const leaf: Node = { feat: -1, thr: 0, left: null, right: null, w: -G / (H + lambda) };
  if (depth >= maxDepth || idx.length < 4) return leaf;

  let bestGain = 1e-9;
  let bestF = -1;
  let bestT = 0;
  const parent = (G * G) / (H + lambda);
  for (let f = 0; f < N_FEATURES; f++) {
    const order = idx.slice().sort((a, b) => X[a][f] - X[b][f]);
    let GL = 0;
    let HL = 0;
    for (let k = 0; k < order.length - 1; k++) {
      const i = order[k];
      GL += g[i];
      HL += h[i];
      const v = X[i][f];
      const vn = X[order[k + 1]][f];
      if (vn === v) continue;
      const HR = H - HL;
      if (HL < minChild || HR < minChild) continue;
      const GR = G - GL;
      const gain = (GL * GL) / (HL + lambda) + (GR * GR) / (HR + lambda) - parent;
      if (gain > bestGain) {
        bestGain = gain;
        bestF = f;
        bestT = (v + vn) / 2;
      }
    }
  }
  if (bestF < 0) return leaf;
  const L: number[] = [];
  const R: number[] = [];
  for (const i of idx) (X[i][bestF] <= bestT ? L : R).push(i);
  return {
    feat: bestF,
    thr: bestT,
    left: buildTree(X, g, h, L, depth + 1, maxDepth, minChild, lambda),
    right: buildTree(X, g, h, R, depth + 1, maxDepth, minChild, lambda),
    w: 0,
  };
}

function predictTree(t: Node, x: number[]): number {
  let n = t;
  while (n.left && n.right) n = x[n.feat] <= n.thr ? n.left : n.right;
  return n.w;
}

/** Area under the ROC curve (probability a random signal outscores a random background). */
export function auc(scores: ArrayLike<number>, y: Uint8Array): number {
  const n = y.length;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => scores[a] - scores[b]);
  let rankSum = 0;
  let nPos = 0;
  let i = 0;
  while (i < n) {
    let j = i;
    while (j + 1 < n && scores[order[j + 1]] === scores[order[i]]) j++;
    const avgRank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) if (y[order[k]] === 1) {
      rankSum += avgRank;
      nPos++;
    }
    i = j + 1;
  }
  const nNeg = n - nPos;
  return (rankSum - (nPos * (nPos + 1)) / 2) / (nPos * nNeg);
}

export interface ToyParams {
  leak: boolean;
  depth: number;
  lr: number;
  minChild?: number;
}

export interface ToyModel {
  aucTrain: number[]; // index k = after k trees (k=0 is chance)
  aucTest: number[];
  /** probabilities on the test set after k trees */
  testProb: (k: number) => Float64Array;
  yTest: Uint8Array;
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

const cache = new Map<string, ToyModel>();

export function trainToy(p: ToyParams): ToyModel {
  const key = `${p.leak}|${p.depth}|${p.lr}|${p.minChild ?? 1}`;
  const hit = cache.get(key);
  if (hit) return hit;

  // The training set is small and the test set is not, like a real split with plenty of held-out data.
  const train = makeToy(11, 700, p.leak);
  const test = makeToy(23, 2400, p.leak);
  const nTr = train.y.length;
  const nTe = test.y.length;
  const Ftr = new Float64Array(nTr);
  const Fte = new Float64Array(nTe);
  const aucTrain = [0.5];
  const aucTest = [0.5];
  const margins: Float32Array[] = [new Float32Array(nTe)];
  const g = new Float64Array(nTr);
  const h = new Float64Array(nTr);
  const all = Array.from({ length: nTr }, (_, i) => i);

  for (let k = 1; k <= MAX_TREES; k++) {
    for (let i = 0; i < nTr; i++) {
      const pr = sigmoid(Ftr[i]);
      g[i] = pr - train.y[i];
      h[i] = Math.max(pr * (1 - pr), 1e-6);
    }
    const tree = buildTree(train.X, g, h, all, 0, p.depth, p.minChild ?? 1, 1);
    for (let i = 0; i < nTr; i++) Ftr[i] += p.lr * predictTree(tree, train.X[i]);
    for (let i = 0; i < nTe; i++) Fte[i] += p.lr * predictTree(tree, test.X[i]);
    aucTrain.push(auc(Ftr, train.y));
    aucTest.push(auc(Fte, test.y));
    margins.push(Float32Array.from(Fte));
  }

  const model: ToyModel = {
    aucTrain,
    aucTest,
    yTest: test.y,
    testProb: (k) => {
      const m = margins[Math.max(0, Math.min(MAX_TREES, k))];
      const out = new Float64Array(m.length);
      for (let i = 0; i < m.length; i++) out[i] = sigmoid(m[i]);
      return out;
    },
  };
  if (cache.size > 12) cache.clear();
  cache.set(key, model);
  return model;
}

/**
 * Punzi figure of merit, exactly as in PlotStats.py:
 *   FoM = signal efficiency / (n_sigma / 2 + sqrt(B))
 * `bTotal` rescales the toy's background to a realistic count, because the FoM
 * depends on how many background events there are in absolute terms.
 */
export function punziCurve(
  prob: Float64Array,
  y: Uint8Array,
  nSigma: number,
  bTotal: number,
  steps = 100
) {
  let nS = 0;
  let nB = 0;
  for (let i = 0; i < y.length; i++) (y[i] === 1 ? nS++ : nB++);
  const cuts: number[] = [];
  const fom: number[] = [];
  const eff: number[] = [];
  const bkg: number[] = [];
  let best = -1;
  let bestCut = 0;
  for (let s = 0; s < steps; s++) {
    const c = s / steps;
    let ps = 0;
    let pb = 0;
    for (let i = 0; i < y.length; i++) if (prob[i] > c) (y[i] === 1 ? ps++ : pb++);
    const e = ps / nS;
    const b = (pb / nB) * bTotal;
    const f = e / (nSigma / 2 + Math.sqrt(b));
    cuts.push(c);
    fom.push(f);
    eff.push(e);
    bkg.push(b);
    if (f > best) {
      best = f;
      bestCut = c;
    }
  }
  return { cuts, fom, eff, bkg, bestCut, best };
}
