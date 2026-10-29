import {
  policyFeatures,
  predictRelation,
  predictRole,
  probeWord,
  type MLP,
  type Snapshot,
} from "./learn.ts";
import {
  CHAIN,
  PERSPECTIVE,
  PHASE_META,
  classify,
  formatRole,
  sameRole,
  type Position,
  type Rel,
  type Role,
} from "./spec.ts";

export type ProcessStep = {
  id: string;
  name: string;
};

export type ScoreParts = {
  mirror: number;
  creates: number;
  chain: number;
  order: number;
  lexicon: number;
  policy: number;
};

export type AssignedStep = ProcessStep & {
  role: Role;
  perspective: string;
  phaseLabel: string;
  flow: string;
  mark: string;
};

export type RelationHit = {
  source: string;
  target: string;
  rel: Rel;
  confidence: number;
  agrees: boolean;
};

export type OptResult = {
  assignments: AssignedStep[];
  before: Role[];
  after: Role[];
  beforeScore: number;
  score: number;
  parts: ScoreParts;
  fixedPoint: boolean;
  lights: boolean[];
  changes: string[];
  suggestions: string[];
  relations: RelationHit[];
  passes: number;
  modelAgreement: number;
};

const ROLES: Role[] = [
  { phase: "adv", position: 0 },
  { phase: "adv", position: 1 },
  { phase: "adv", position: 2 },
  { phase: "ret", position: 0 },
  { phase: "ret", position: 1 },
  { phase: "ret", position: 2 },
];

function patternFor(count: number): Role[] {
  const reading: Role[] = [
    { phase: "adv", position: 0 },
    { phase: "adv", position: 1 },
    { phase: "adv", position: 2 },
    { phase: "ret", position: 0 },
    { phase: "ret", position: 1 },
    { phase: "ret", position: 2 },
  ];
  const subsets: Record<number, Role[]> = {
    1: [{ phase: "adv", position: 1 }],
    2: [
      { phase: "adv", position: 0 },
      { phase: "ret", position: 2 },
    ],
    3: [
      { phase: "adv", position: 0 },
      { phase: "adv", position: 1 },
      { phase: "adv", position: 2 },
    ],
    4: [
      { phase: "adv", position: 0 },
      { phase: "adv", position: 1 },
      { phase: "ret", position: 1 },
      { phase: "ret", position: 2 },
    ],
    5: [
      { phase: "adv", position: 0 },
      { phase: "adv", position: 1 },
      { phase: "adv", position: 2 },
      { phase: "ret", position: 1 },
      { phase: "ret", position: 2 },
    ],
  };
  if (count <= 5) return subsets[count]!.map((role) => ({ ...role }));
  return Array.from({ length: count }, (_, index) => ({ ...reading[index % 6]! }));
}

function counts(roles: Role[]): { adv: number[]; ret: number[] } {
  const adv = [0, 0, 0];
  const ret = [0, 0, 0];
  for (const role of roles) {
    const bucket = role.phase === "adv" ? adv : ret;
    bucket[role.position] = (bucket[role.position] ?? 0) + 1;
  }
  return { adv, ret };
}

export function mirrorScore(roles: Role[]): number {
  if (roles.length === 0) return 0;
  const { adv, ret } = counts(roles);
  let covered = 0;
  for (const position of [0, 1, 2] as const) {
    covered += Math.min(adv[position] ?? 0, ret[2 - position] ?? 0) * 2;
  }
  return Math.min(1, covered / roles.length);
}

export function createsScore(roles: Role[]): number {
  if (roles.length === 0) return 0;
  let hit = 0;
  for (let i = 0; i < roles.length; i++) {
    const source = roles[i]!;
    const participates = roles.some(
      (target, j) => i !== j && classify(source, target) === "creates",
    );
    if (participates) hit += 1;
  }
  return hit / roles.length;
}

export function chainScore(roles: Role[]): number {
  if (roles.length === 0) return 0;
  const positions = new Set(roles.map((role) => role.position));
  const phases = new Set(roles.map((role) => role.phase));
  const flags = [
    1,
    positions.size >= 2 ? 1 : 0,
    positions.has(1) ? 1 : 0,
    phases.size === 2 ? 1 : 0,
    roles.length >= 3 ? 1 : 0,
  ];
  return flags.reduce((total, flag) => total + flag, 0) / flags.length;
}

export function orderScore(roles: Role[]): number {
  if (roles.length < 2) return 1;
  let penalty = 0;
  for (let i = 1; i < roles.length; i++) {
    const prev = roles[i - 1]!;
    const next = roles[i]!;
    if (prev.phase === "ret" && next.phase === "adv") penalty += 1;
    else if (prev.phase === next.phase && next.position < prev.position) penalty += 0.5;
  }
  return Math.max(0, 1 - penalty / (roles.length - 1));
}

function lexiconFit(lexicon: MLP | null, name: string, role: Role): number {
  if (!lexicon || !name.trim()) return 0.5;
  const probe = probeWord(lexicon, name);
  if (probe.confidence < 0.62) return 0.5;
  if (role.position === probe.position) return 0.55 + 0.45 * probe.confidence;
  if (role.position === 2 - probe.position) return 0.45 + 0.3 * probe.confidence;
  return Math.max(0, 0.45 - 0.4 * probe.confidence);
}

function policyFit(policy: MLP | null, lexicon: MLP | null, name: string, index: number, total: number, role: Role): number {
  if (!policy || !lexicon) return 1 / 6;
  const features = policyFeatures(lexicon, name, index, total);
  const predicted = predictRole(policy, features);
  const slot = (role.phase === "adv" ? 0 : 3) + role.position;
  return predicted.probs[slot] ?? 0;
}

export function scoreParts(
  steps: ProcessStep[],
  roles: Role[],
  models: Pick<Snapshot, "lexicon" | "policy"> | null,
): ScoreParts {
  const lexicon = models
    ? steps.reduce((total, step, index) => total + lexiconFit(models.lexicon, step.name, roles[index]!), 0) /
      Math.max(steps.length, 1)
    : 0.5;
  const policy = models
    ? steps.reduce(
        (total, step, index) =>
          total + policyFit(models.policy, models.lexicon, step.name, index, steps.length, roles[index]!),
        0,
      ) / Math.max(steps.length, 1)
    : 1 / 6;
  return {
    mirror: mirrorScore(roles),
    creates: createsScore(roles),
    chain: chainScore(roles),
    order: orderScore(roles),
    lexicon,
    policy,
  };
}

export function combine(parts: ScoreParts, withModel: boolean): number {
  if (!withModel) {
    return parts.mirror * 0.42 + parts.creates * 0.32 + parts.chain * 0.16 + parts.order * 0.1;
  }
  return (
    parts.mirror * 0.34 +
    parts.creates * 0.26 +
    parts.chain * 0.14 +
    parts.order * 0.08 +
    parts.lexicon * 0.1 +
    parts.policy * 0.08
  );
}

function objective(steps: ProcessStep[], roles: Role[], models: Pick<Snapshot, "lexicon" | "policy"> | null): number {
  return combine(scoreParts(steps, roles, models), Boolean(models));
}

function descent(
  steps: ProcessStep[],
  seed: Role[],
  models: Pick<Snapshot, "lexicon" | "policy"> | null,
): { roles: Role[]; score: number; passes: number } {
  const roles = seed.map((role) => ({ ...role }));
  let best = objective(steps, roles, models);
  let passes = 0;
  let improved = true;
  while (improved && passes < 24) {
    improved = false;
    passes += 1;
    for (let i = 0; i < roles.length; i++) {
      for (const candidate of ROLES) {
        const previous = roles[i]!;
        if (sameRole(previous, candidate)) continue;
        roles[i] = { ...candidate };
        const next = objective(steps, roles, models);
        if (next > best + 1e-6) {
          best = next;
          improved = true;
        } else roles[i] = previous;
      }
    }
    for (let i = 0; i < roles.length; i++) {
      for (let j = i + 1; j < roles.length; j++) {
        const left = roles[i]!;
        const right = roles[j]!;
        roles[i] = right;
        roles[j] = left;
        const next = objective(steps, roles, models);
        if (next > best + 1e-6) {
          best = next;
          improved = true;
        } else {
          roles[i] = left;
          roles[j] = right;
        }
      }
    }
  }
  return { roles, score: best, passes };
}

function heuristic(steps: ProcessStep[], models: Pick<Snapshot, "lexicon" | "policy"> | null): Role[] {
  const pattern = patternFor(steps.length);
  if (!models) return pattern;
  return steps.map((step, index) => {
    const base = pattern[index] ?? pattern[pattern.length - 1]!;
    const probe = probeWord(models.lexicon, step.name);
    if (probe.confidence < 0.62) return { ...base };
    return { phase: base.phase, position: probe.position };
  });
}

function randomRoles(count: number, rng: () => number): Role[] {
  return Array.from({ length: count }, () => ({ ...ROLES[Math.floor(rng() * ROLES.length)]! }));
}

function chainLights(roles: Role[], parts: ScoreParts): boolean[] {
  const positions = new Set(roles.map((role) => role.position));
  const phases = new Set(roles.map((role) => role.phase));
  return [
    true,
    roles.length >= 1,
    positions.size >= 2,
    positions.has(1),
    phases.size === 2,
    parts.mirror >= 0.8 && parts.creates >= 0.8,
  ];
}

function suggestions(steps: ProcessStep[], roles: Role[], parts: ScoreParts, models: Snapshot | null): string[] {
  const notes: string[] = [];
  const { adv, ret } = counts(roles);
  for (const position of [0, 1, 2] as const) {
    const forward = adv[position] ?? 0;
    const back = ret[2 - position] ?? 0;
    if (forward > back) {
      const partner = steps.find((_, index) => roles[index]?.phase === "adv" && roles[index]?.position === position);
      notes.push(
        `Falta el espejo en retroceso de «${partner?.name || "un paso"}» (${PERSPECTIVE[position].label} → ${PERSPECTIVE[(2 - position) as Position].label}).`,
      );
    } else if (back > forward) {
      const partner = steps.find((_, index) => roles[index]?.phase === "ret" && roles[index]?.position === (2 - position));
      notes.push(
        `Falta el polo de avance que refleja «${partner?.name || "un paso"}».`,
      );
    }
  }
  if (!roles.some((role) => role.position === 1)) {
    notes.push("No hay dualidad: el proceso distingue polos pero no los integra.");
  }
  if (new Set(roles.map((role) => role.phase)).size < 2) {
    notes.push("Todo queda en una sola fase. Sin retroceso no hay transformación trazable.");
  }
  if (parts.creates < 0.999 && roles.some((role) => role.position === 1)) {
    notes.push("Algún paso no participa en creates: lateral y centro deben poder generarse entre fases.");
  }
  if (models) {
    for (let i = 0; i < steps.length; i++) {
      const probe = probeWord(models.lexicon, steps[i]!.name);
      const role = roles[i]!;
      if (probe.confidence >= 0.72 && role.position !== probe.position && role.position !== 2 - probe.position) {
        notes.push(
          `«${steps[i]!.name}» se parece al polo ${probe.perspective.toLowerCase()}, no a ${PERSPECTIVE[role.position].label.toLowerCase()}.`,
        );
      }
    }
  }
  if (notes.length === 0) {
    notes.push("La unidad cierra: espejos, creación y ambas fases están presentes.");
  }
  return notes.slice(0, 5);
}

function modelAgreement(roles: Role[], relation: MLP | null): number {
  if (!relation || roles.length < 2) return 0;
  let seen = 0;
  let agree = 0;
  for (let i = 0; i < roles.length; i++) {
    for (let j = 0; j < roles.length; j++) {
      if (i === j) continue;
      seen += 1;
      if (predictRelation(relation, roles[i]!, roles[j]!).rel === classify(roles[i]!, roles[j]!)) agree += 1;
    }
  }
  return seen ? agree / seen : 0;
}

function relationsOf(steps: ProcessStep[], roles: Role[], relation: MLP | null): RelationHit[] {
  const hits: RelationHit[] = [];
  for (let i = 0; i < roles.length; i++) {
    for (let j = 0; j < roles.length; j++) {
      if (i === j) continue;
      const formal = classify(roles[i]!, roles[j]!);
      if (formal === "none") continue;
      if (!relation) {
        hits.push({
          source: steps[i]!.name,
          target: steps[j]!.name,
          rel: formal,
          confidence: 1,
          agrees: true,
        });
        continue;
      }
      const predicted = predictRelation(relation, roles[i]!, roles[j]!);
      hits.push({
        source: steps[i]!.name,
        target: steps[j]!.name,
        rel: predicted.rel,
        confidence: predicted.confidence,
        agrees: predicted.rel === formal,
      });
    }
  }
  return hits
    .sort((a, b) => b.confidence - a.confidence || a.rel.localeCompare(b.rel))
    .slice(0, 8);
}

function decorate(steps: ProcessStep[], roles: Role[]): AssignedStep[] {
  return steps.map((step, index) => {
    const role = roles[index]!;
    const phase = PHASE_META[role.phase];
    return {
      ...step,
      role,
      perspective: PERSPECTIVE[role.position].label,
      phaseLabel: phase.label,
      flow: phase.flow,
      mark: role.position === 1 ? "0" : phase.arrow,
    };
  });
}

export function optimizeProcess(steps: ProcessStep[], models: Snapshot | null, seed = 7): OptResult {
  const usable = steps.map((step) => ({ ...step, name: step.name.trim() || "sin nombre" }));
  const modelPick = models ? { lexicon: models.lexicon, policy: models.policy } : null;
  const before = heuristic(usable, modelPick);
  const beforeScore = objective(usable, before, modelPick);
  let rng = mulberry32(seed + usable.length * 17);
  let best = descent(usable, before, modelPick);
  for (let restart = 0; restart < 10; restart++) {
    const attempt = descent(usable, randomRoles(usable.length, rng), modelPick);
    if (attempt.score > best.score + 1e-6) best = attempt;
  }
  const polished = descent(usable, best.roles, modelPick);
  const fixedPoint = polished.score <= best.score + 1e-6 && polished.roles.every((role, index) => sameRole(role, best.roles[index]!));
  const after = polished.roles;
  const parts = scoreParts(usable, after, modelPick);
  const changes = usable
    .map((step, index) =>
      sameRole(before[index]!, after[index]!)
        ? ""
        : `${step.name}: ${formatRole(before[index]!)} → ${formatRole(after[index]!)}`,
    )
    .filter(Boolean);
  return {
    assignments: decorate(usable, after),
    before,
    after,
    beforeScore,
    score: combine(parts, Boolean(models)),
    parts,
    fixedPoint,
    lights: chainLights(after, parts),
    changes,
    suggestions: suggestions(usable, after, parts, models),
    relations: relationsOf(usable, after, models?.relation ?? null),
    passes: best.passes + polished.passes,
    modelAgreement: modelAgreement(after, models?.relation ?? null),
  };
}

export function missingPoles(steps: ProcessStep[], roles: Role[]): ProcessStep[] {
  const { adv, ret } = counts(roles);
  const extra: ProcessStep[] = [];
  let serial = 0;
  for (const position of [0, 1, 2] as const) {
    const forward = adv[position] ?? 0;
    const reflected = (2 - position) as Position;
    const back = ret[reflected] ?? 0;
    if (forward > back) {
      const partner = steps.find((_, index) => roles[index]?.phase === "adv" && roles[index]?.position === position);
      for (let n = 0; n < forward - back && steps.length + extra.length < 12; n++) {
        serial += 1;
        extra.push({
          id: `polo-${position}-${serial}`,
          name: `Espejo · ${partner?.name || PERSPECTIVE[position].label}`,
        });
      }
    }
    if (back > forward) {
      const partner = steps.find((_, index) => roles[index]?.phase === "ret" && roles[index]?.position === reflected);
      for (let n = 0; n < back - forward && steps.length + extra.length < 12; n++) {
        serial += 1;
        extra.push({
          id: `polo-adv-${position}-${serial}`,
          name: `Origen · ${partner?.name || PERSPECTIVE[reflected].label}`,
        });
      }
    }
  }
  if (!roles.some((role) => role.position === 1) && steps.length + extra.length < 12) {
    extra.push({ id: `polo-centro-${serial + 1}`, name: "Integración" });
  }
  return extra;
}

export function protocolText(result: OptResult): string {
  const lines = [
    "Unidad informativa",
    `Coherencia ${(result.score * 100).toFixed(1)} · punto fijo ${result.fixedPoint ? "sí" : "no"}`,
    "",
    ...CHAIN.map((name, index) => `${result.lights[index] ? "●" : "○"} ${name}`),
    "",
    "Avance · evolución",
  ];
  for (const position of [0, 1, 2] as const) {
    const group = result.assignments.filter((step) => step.role.phase === "adv" && step.role.position === position);
    const mark = position === 1 ? "0" : "→";
    lines.push(`  ${mark} ${PERSPECTIVE[position].label}: ${group.map((step) => step.name).join(", ") || "—"}`);
  }
  lines.push("", "Retroceso · involución");
  for (const position of [0, 1, 2] as const) {
    const group = result.assignments.filter((step) => step.role.phase === "ret" && step.role.position === position);
    const mark = position === 1 ? "0" : "←";
    lines.push(`  ${mark} ${PERSPECTIVE[position].label}: ${group.map((step) => step.name).join(", ") || "—"}`);
  }
  if (result.relations.length) {
    lines.push("", "Relaciones");
    for (const hit of result.relations) {
      lines.push(`  ${hit.source} → ${hit.target} · ${hit.rel} · ${(hit.confidence * 100).toFixed(0)}%`);
    }
  }
  lines.push("", "Lectura");
  for (const note of result.suggestions) lines.push(`  ${note}`);
  return lines.join("\n");
}

export function orderByUnit(steps: ProcessStep[], roles: Role[]): ProcessStep[] {
  return steps
    .map((step, index) => ({ step, role: roles[index]! }))
    .sort((a, b) => {
      const phaseDelta = (a.role.phase === "adv" ? 0 : 1) - (b.role.phase === "adv" ? 0 : 1);
      if (phaseDelta !== 0) return phaseDelta;
      return a.role.position - b.role.position;
    })
    .map((entry) => entry.step);
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PRESETS: { id: string; name: string; steps: string[] }[] = [
  {
    id: "vacio",
    name: "Desde el vacío",
    steps: ["Vacío", "Distinción", "Relación", "Integración", "Transformación"],
  },
  {
    id: "sistema",
    name: "Construir un sistema",
    steps: ["Hardware", "Capa virtual", "Software", "Prueba", "Despliegue"],
  },
  {
    id: "servicio",
    name: "Ciclo de un servicio",
    steps: ["Recepción", "Diagnóstico", "Respuesta", "Cierre", "Aprendizaje"],
  },
  {
    id: "decision",
    name: "Decisión",
    steps: ["Oscuridad del problema", "Consciencia", "Claridad", "Acción", "Revisión"],
  },
  {
    id: "tramite",
    name: "Trámite",
    steps: ["Solicitud", "Revisión", "Resolución", "Notificación", "Archivo"],
  },
  {
    id: "canon",
    name: "Tríada canónica",
    steps: ["orientación", "cuántico", "dirección", "dirección", "cuántico", "orientación"],
  },
];

export function stepsFromNames(names: string[], prefix: string): ProcessStep[] {
  return names.map((name, index) => ({ id: `${prefix}-${index + 1}`, name }));
}
