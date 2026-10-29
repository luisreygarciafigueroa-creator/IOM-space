import {
  CANONICAL_LABELS,
  TRIADS,
  classify,
  type Phase,
  type Position,
  type Rel,
  type Role,
} from "./spec.ts";

export const REL_IN = 10;
export const REL_H = 32;
export const REL_OUT = 3;
export const LEX_IN = 48;
export const LEX_H = 24;
export const LEX_OUT = 3;
export const POL_IN = 5;
export const POL_H = 16;
export const POL_OUT = 6;
export const TRAIN_EPOCHS = 48;

export type MLP = {
  in: number;
  h: number;
  out: number;
  w1: number[];
  b1: number[];
  w2: number[];
  b2: number[];
};

type Momentum = { w1: number[]; b1: number[]; w2: number[]; b2: number[] };
type Grads = Momentum;

export type Sample = { x: number[]; y: number };

export type HistoryPoint = {
  epoch: number;
  loss: number;
  trainAcc: number;
  holdoutAcc: number;
};

export type Snapshot = {
  version: 1;
  seed: number;
  relation: MLP;
  lexicon: MLP;
  policy: MLP;
  history: HistoryPoint[];
  lexiconAcc: number;
  policyAcc: number;
  holdoutAcc: number;
  trainAcc: number;
  negativeControl: boolean;
  confusion: number[][];
  params: number;
  epochs: number;
};

export type TrainJob = {
  relation: MLP;
  lexicon: MLP;
  policy: MLP;
  relMom: Momentum;
  polMom: Momentum;
  trainRel: Sample[];
  testRel: Sample[];
  polSamples: Sample[];
  history: HistoryPoint[];
  rng: () => number;
};

const REL_INDEX: Record<Rel, number> = { none: 0, mirrorOf: 1, creates: 2 };

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function foldText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hashTrigram(gram: string, dim: number): number {
  let h = 2166136261;
  for (let i = 0; i < gram.length; i++) {
    h ^= gram.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % dim;
}

export function lexiconFeatures(text: string): number[] {
  const features = new Array<number>(LEX_IN).fill(0);
  const folded = foldText(text);
  if (!folded) return features;
  const padded = ` ${folded} `;
  let count = 0;
  for (let i = 0; i < padded.length - 2; i++) {
    features[hashTrigram(padded.slice(i, i + 3), LEX_IN)] += 1;
    count += 1;
  }
  if (count > 0) {
    for (let i = 0; i < LEX_IN; i++) features[i] /= count;
  }
  return features;
}

export function pairFeatures(source: Role, target: Role): number[] {
  return [
    source.phase === "adv" ? 1 : 0,
    source.phase === "ret" ? 1 : 0,
    source.position === 0 ? 1 : 0,
    source.position === 1 ? 1 : 0,
    source.position === 2 ? 1 : 0,
    target.phase === "adv" ? 1 : 0,
    target.phase === "ret" ? 1 : 0,
    target.position === 0 ? 1 : 0,
    target.position === 1 ? 1 : 0,
    target.position === 2 ? 1 : 0,
  ];
}

export function roleIndex(role: Role): number {
  return (role.phase === "adv" ? 0 : 3) + role.position;
}

export function roleFromIndex(index: number): Role {
  const phase: Phase = index < 3 ? "adv" : "ret";
  const position = (index % 3) as Position;
  return { phase, position };
}

function zeros(n: number): number[] {
  return new Array<number>(n).fill(0);
}

function initMLP(inn: number, h: number, out: number, rng: () => number): MLP {
  const s1 = Math.sqrt(2 / inn);
  const s2 = Math.sqrt(2 / h);
  return {
    in: inn,
    h,
    out,
    w1: Array.from({ length: h * inn }, () => (rng() * 2 - 1) * s1),
    b1: zeros(h),
    w2: Array.from({ length: out * h }, () => (rng() * 2 - 1) * s2),
    b2: zeros(out),
  };
}

function momentum(net: MLP): Momentum {
  return { w1: zeros(net.w1.length), b1: zeros(net.b1.length), w2: zeros(net.w2.length), b2: zeros(net.b2.length) };
}

function softmax(logits: number[]): number[] {
  let max = logits[0] ?? 0;
  for (const value of logits) if (value > max) max = value;
  const exps = logits.map((value) => Math.exp(value - max));
  const sum = exps.reduce((total, value) => total + value, 0);
  return exps.map((value) => value / sum);
}

export function forward(net: MLP, input: number[]): { hidden: number[]; probs: number[] } {
  const hidden = new Array<number>(net.h);
  for (let j = 0; j < net.h; j++) {
    let sum = net.b1[j] ?? 0;
    const base = j * net.in;
    for (let i = 0; i < net.in; i++) sum += (net.w1[base + i] ?? 0) * (input[i] ?? 0);
    hidden[j] = sum > 0 ? sum : 0;
  }
  const logits = new Array<number>(net.out);
  for (let k = 0; k < net.out; k++) {
    let sum = net.b2[k] ?? 0;
    const base = k * net.h;
    for (let j = 0; j < net.h; j++) sum += (net.w2[base + j] ?? 0) * (hidden[j] ?? 0);
    logits[k] = sum;
  }
  return { hidden, probs: softmax(logits) };
}

function emptyGrads(net: MLP): Grads {
  return momentum(net);
}

function accumulate(net: MLP, input: number[], y: number, grads: Grads): number {
  const { hidden, probs } = forward(net, input);
  const delta = probs.slice();
  delta[y] = (delta[y] ?? 0) - 1;
  const hiddenDelta = zeros(net.h);
  for (let k = 0; k < net.out; k++) {
    grads.b2[k] = (grads.b2[k] ?? 0) + (delta[k] ?? 0);
    const base = k * net.h;
    for (let j = 0; j < net.h; j++) {
      grads.w2[base + j] = (grads.w2[base + j] ?? 0) + (delta[k] ?? 0) * (hidden[j] ?? 0);
      hiddenDelta[j] = (hiddenDelta[j] ?? 0) + (net.w2[base + j] ?? 0) * (delta[k] ?? 0);
    }
  }
  for (let j = 0; j < net.h; j++) {
    if ((hidden[j] ?? 0) <= 0) continue;
    grads.b1[j] = (grads.b1[j] ?? 0) + (hiddenDelta[j] ?? 0);
    const base = j * net.in;
    for (let i = 0; i < net.in; i++) {
      grads.w1[base + i] = (grads.w1[base + i] ?? 0) + (hiddenDelta[j] ?? 0) * (input[i] ?? 0);
    }
  }
  return -Math.log(Math.max(probs[y] ?? 1e-12, 1e-12));
}

function applyGrads(net: MLP, grads: Grads, mom: Momentum, lr: number, batch: number): void {
  const decay = 1 - lr * 1e-4;
  const scale = (value: number) => value / batch;
  const step = (weights: number[], gradients: number[], velocity: number[]) => {
    for (let i = 0; i < weights.length; i++) {
      const v = 0.9 * (velocity[i] ?? 0) + scale(gradients[i] ?? 0);
      velocity[i] = v;
      weights[i] = (weights[i] ?? 0) * decay - lr * v;
      gradients[i] = 0;
    }
  };
  step(net.w1, grads.w1, mom.w1);
  step(net.b1, grads.b1, mom.b1);
  step(net.w2, grads.w2, mom.w2);
  step(net.b2, grads.b2, mom.b2);
}

function shuffle(rng: () => number, list: Sample[]): Sample[] {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const swap = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = swap;
  }
  return copy;
}

export function accuracy(net: MLP, samples: Sample[]): number {
  if (samples.length === 0) return 0;
  let hit = 0;
  for (const sample of samples) {
    const { probs } = forward(net, sample.x);
    if (argmax(probs) === sample.y) hit += 1;
  }
  return hit / samples.length;
}

export function argmax(values: number[]): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) if ((values[i] ?? 0) > (values[best] ?? 0)) best = i;
  return best;
}

function trainEpoch(net: MLP, samples: Sample[], mom: Momentum, rng: () => number, lr: number): number {
  const order = shuffle(rng, samples);
  const batchSize = 32;
  let loss = 0;
  for (let start = 0; start < order.length; start += batchSize) {
    const batch = order.slice(start, start + batchSize);
    const grads = emptyGrads(net);
    for (const sample of batch) loss += accumulate(net, sample.x, sample.y, grads);
    applyGrads(net, grads, mom, lr, batch.length);
  }
  return loss / order.length;
}

export function relationSamples(): { train: Sample[]; test: Sample[] } {
  const train: Sample[] = [];
  const test: Sample[] = [];
  TRIADS.forEach((_, index) => {
    const triad = index + 1;
    const nodes: Role[] = [];
    for (const phase of ["adv", "ret"] as const) {
      for (const position of [0, 1, 2] as const) nodes.push({ phase, position });
    }
    for (const source of nodes) {
      for (const target of nodes) {
        if (source.phase === target.phase && source.position === target.position) continue;
        const sample = {
          x: pairFeatures(source, target),
          y: REL_INDEX[classify(source, target)],
        };
        if (triad >= 12) test.push(sample);
        else train.push(sample);
      }
    }
  });
  return { train, test };
}

function lexiconSamples(): Sample[] {
  return CANONICAL_LABELS.map((entry) => ({
    x: lexiconFeatures(entry.label),
    y: entry.position,
  }));
}

function sequenceSamples(
  lexicon: MLP,
  nodes: { label: string; role: Role }[],
): Sample[] {
  const n = nodes.length;
  return nodes.map((node, index) => {
    const { probs } = forward(lexicon, lexiconFeatures(node.label));
    const t = n <= 1 ? 0.5 : index / (n - 1);
    return {
      x: [probs[0] ?? 0, probs[1] ?? 0, probs[2] ?? 0, t, 1 - t],
      y: roleIndex(node.role),
    };
  });
}

function fullSequenceSamples(lexicon: MLP): Sample[] {
  const samples: Sample[] = [];
  for (const triad of TRIADS) {
    const full = triadNodes(triad);
    samples.push(...sequenceSamples(lexicon, full));
  }
  return samples;
}

function policySamples(lexicon: MLP): Sample[] {
  const samples: Sample[] = [];
  for (const triad of TRIADS) {
    const full = triadNodes(triad);
    samples.push(...sequenceSamples(lexicon, full));
    samples.push(...sequenceSamples(lexicon, full.slice(0, 3)));
    samples.push(...sequenceSamples(lexicon, full.slice(3)));
    samples.push(
      ...sequenceSamples(lexicon, [
        { label: triad.adv[0], role: { phase: "adv", position: 0 } },
        { label: triad.ret[2], role: { phase: "ret", position: 2 } },
      ]),
    );
  }
  return samples;
}

function triadNodes(triad: (typeof TRIADS)[number]): { label: string; role: Role }[] {
  return [
    { label: triad.adv[0], role: { phase: "adv", position: 0 } },
    { label: triad.adv[1], role: { phase: "adv", position: 1 } },
    { label: triad.adv[2], role: { phase: "adv", position: 2 } },
    { label: triad.ret[0], role: { phase: "ret", position: 0 } },
    { label: triad.ret[1], role: { phase: "ret", position: 1 } },
    { label: triad.ret[2], role: { phase: "ret", position: 2 } },
  ];
}

export function createJob(seed = 20261028): TrainJob {
  const rng = mulberry32(seed);
  const relation = initMLP(REL_IN, REL_H, REL_OUT, rng);
  const lexicon = initMLP(LEX_IN, LEX_H, LEX_OUT, rng);
  const policy = initMLP(POL_IN, POL_H, POL_OUT, rng);
  const lexMom = momentum(lexicon);
  const lexData = lexiconSamples();
  for (let epoch = 0; epoch < 80; epoch++) {
    const lr = 0.28 * (1 - epoch / 80) + 0.04;
    trainEpoch(lexicon, lexData, lexMom, rng, lr);
  }
  const { train, test } = relationSamples();
  return {
    relation,
    lexicon,
    policy,
    relMom: momentum(relation),
    polMom: momentum(policy),
    trainRel: train,
    testRel: test,
    polSamples: policySamples(lexicon),
    history: [],
    rng,
  };
}

export function stepJob(job: TrainJob, epoch: number): void {
  const fade = 1 - epoch / TRAIN_EPOCHS;
  const relLoss = trainEpoch(job.relation, job.trainRel, job.relMom, job.rng, 0.22 * fade + 0.03);
  trainEpoch(job.policy, job.polSamples, job.polMom, job.rng, 0.18 * fade + 0.03);
  job.history.push({
    epoch: epoch + 1,
    loss: relLoss,
    trainAcc: accuracy(job.relation, job.trainRel),
    holdoutAcc: accuracy(job.relation, job.testRel),
  });
}

export function countParams(net: MLP): number {
  return net.w1.length + net.b1.length + net.w2.length + net.b2.length;
}

function confusionOf(net: MLP, samples: Sample[]): number[][] {
  const matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const sample of samples) {
    const pred = argmax(forward(net, sample.x).probs);
    const row = matrix[sample.y];
    if (row) row[pred] = (row[pred] ?? 0) + 1;
  }
  return matrix;
}

function negativeControl(net: MLP, samples: Sample[]): boolean {
  const mirror = samples.find((sample) => sample.y === REL_INDEX.mirrorOf);
  if (!mirror) return false;
  const prediction = argmax(forward(net, mirror.x).probs);
  return prediction === REL_INDEX.mirrorOf && prediction !== REL_INDEX.none;
}

export function finalize(job: TrainJob, seed: number): Snapshot {
  const fullPolicy = fullSequenceSamples(job.lexicon);
  return {
    version: 1,
    seed,
    relation: job.relation,
    lexicon: job.lexicon,
    policy: job.policy,
    history: job.history,
    lexiconAcc: accuracy(job.lexicon, lexiconSamples()),
    policyAcc: accuracy(job.policy, fullPolicy),
    holdoutAcc: accuracy(job.relation, job.testRel),
    trainAcc: accuracy(job.relation, job.trainRel),
    negativeControl: negativeControl(job.relation, job.testRel),
    confusion: confusionOf(job.relation, job.testRel),
    params: countParams(job.relation) + countParams(job.lexicon) + countParams(job.policy),
    epochs: job.history.length,
  };
}

export function trainToCompletion(seed = 20261028): Snapshot {
  const job = createJob(seed);
  for (let epoch = 0; epoch < TRAIN_EPOCHS; epoch++) stepJob(job, epoch);
  return finalize(job, seed);
}

export function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== "object") return false;
  const snap = value as Snapshot;
  return (
    snap.version === 1 &&
    validNet(snap.relation, REL_IN, REL_H, REL_OUT) &&
    validNet(snap.lexicon, LEX_IN, LEX_H, LEX_OUT) &&
    validNet(snap.policy, POL_IN, POL_H, POL_OUT)
  );
}

function validNet(net: MLP | undefined, inn: number, h: number, out: number): net is MLP {
  return Boolean(
    net &&
      net.w1?.length === h * inn &&
      net.b1?.length === h &&
      net.w2?.length === out * h &&
      net.b2?.length === out,
  );
}

export type Probe = {
  position: Position;
  confidence: number;
  perspective: string;
  probs: number[];
};

const PERSPECTIVES = ["Individualidad", "Dualidad", "Totalidad"] as const;

function trigramWeights(text: string): Map<string, number> {
  const padded = ` ${foldText(text)} `;
  const weights = new Map<string, number>();
  for (let i = 0; i < padded.length - 2; i++) {
    const gram = padded.slice(i, i + 3);
    weights.set(gram, (weights.get(gram) ?? 0) + 1);
  }
  return weights;
}

function cosineMap(left: Map<string, number>, right: Map<string, number>): number {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (const value of left.values()) leftNorm += value * value;
  for (const value of right.values()) rightNorm += value * value;
  const [small, large] = left.size < right.size ? [left, right] : [right, left];
  for (const [gram, value] of small) {
    const other = large.get(gram);
    if (other) dot += value * other;
  }
  if (leftNorm === 0 || rightNorm === 0) return 0;
  return dot / Math.sqrt(leftNorm * rightNorm);
}

let canonicalGrams: Map<string, number>[] | null = null;

function nearestCanonical(word: string): number {
  if (!canonicalGrams) canonicalGrams = CANONICAL_LABELS.map((entry) => trigramWeights(entry.label));
  const features = trigramWeights(word);
  let best = 0;
  for (const known of canonicalGrams) {
    const similarity = cosineMap(features, known);
    if (similarity > best) best = similarity;
  }
  return best;
}

export function lexiconDistribution(lexicon: MLP, word: string): { probs: number[]; similarity: number } {
  const { probs } = forward(lexicon, lexiconFeatures(word));
  const similarity = nearestCanonical(word);
  const keep = similarity >= 0.78 ? 1 : Math.max(0, (similarity - 0.4) / 0.38);
  return {
    probs: probs.map((value) => keep * value + (1 - keep) / 3),
    similarity,
  };
}
export function probeWord(lexicon: MLP, word: string): Probe {
  const { probs } = lexiconDistribution(lexicon, word);
  const position = argmax(probs) as Position;
  return {
    position,
    confidence: probs[position] ?? 0,
    perspective: PERSPECTIVES[position] ?? "Dualidad",
    probs,
  };
}

export function policyFeatures(lexicon: MLP, name: string, index: number, total: number): number[] {
  const { probs } = lexiconDistribution(lexicon, name);
  const t = total <= 1 ? 0.5 : index / (total - 1);
  return [probs[0] ?? 0, probs[1] ?? 0, probs[2] ?? 0, t, 1 - t];
}

export function predictRole(policy: MLP, features: number[]): { role: Role; confidence: number; probs: number[] } {
  const { probs } = forward(policy, features);
  const index = argmax(probs);
  return { role: roleFromIndex(index), confidence: probs[index] ?? 0, probs };
}

export function predictRelation(
  relation: MLP,
  source: Role,
  target: Role,
): { rel: Rel; confidence: number } {
  const { probs } = forward(relation, pairFeatures(source, target));
  const index = argmax(probs);
  const rel: Rel = index === 1 ? "mirrorOf" : index === 2 ? "creates" : "none";
  return { rel, confidence: probs[index] ?? 0 };
}
