export type Phase = "adv" | "ret";
export type Position = 0 | 1 | 2;
export type Rel = "none" | "mirrorOf" | "creates";

export type Role = {
  phase: Phase;
  position: Position;
};

export const TRIADS: { adv: [string, string, string]; ret: [string, string, string] }[] = [
  { adv: ["orientación", "cuántico", "dirección"], ret: ["dirección", "cuántico", "orientación"] },
  { adv: ["hardware", "virtual", "software"], ret: ["software", "virtual", "hardware"] },
  { adv: ["universo", "espacio", "vacío"], ret: ["vacío", "espacio", "universo"] },
  { adv: ["singularidad", "tiempo", "infinito"], ret: ["infinito", "tiempo", "singularidad"] },
  { adv: ["cuerpo", "consciente", "mundo"], ret: ["mundo", "consciente", "cuerpo"] },
  { adv: ["carácter", "subconsciente", "personalidad"], ret: ["personalidad", "subconsciente", "carácter"] },
  { adv: ["memoria", "inconsciente", "imaginación"], ret: ["imaginación", "inconsciente", "memoria"] },
  { adv: ["receptor", "supraconsciente", "emisor"], ret: ["emisor", "supraconsciente", "receptor"] },
  { adv: ["lógica", "inteligencia", "libertad"], ret: ["libertad", "inteligencia", "lógica"] },
  { adv: ["muerte", "artificial", "vida"], ret: ["vida", "artificial", "muerte"] },
  { adv: ["descendente", "mente", "ascendente"], ret: ["ascendente", "mente", "descendente"] },
  { adv: ["oscuridad", "consciencia", "luz"], ret: ["luz", "consciencia", "oscuridad"] },
  { adv: ["animal", "humano", "IA"], ret: ["IA", "humano", "animal"] },
];

export const POSITIONS: Position[] = [0, 1, 2];

export const PERSPECTIVE: Record<Position, { id: string; label: string }> = {
  0: { id: "Ind", label: "Individualidad" },
  1: { id: "D", label: "Dualidad" },
  2: { id: "Tot", label: "Totalidad" },
};

export const PHASE_META: Record<Phase, { label: string; flow: string; arrow: string }> = {
  adv: { label: "Avance", flow: "Evolución", arrow: "→" },
  ret: { label: "Retroceso", flow: "Involución", arrow: "←" },
};

export const CHAIN = [
  "vacío",
  "distinción",
  "relación",
  "integración",
  "transformación",
  "unidad",
] as const;

export const REL_LABEL: Record<Rel, string> = {
  none: "ninguna",
  mirrorOf: "mirrorOf",
  creates: "creates",
};

export function mirrorPosition(position: Position): Position {
  return (2 - position) as Position;
}

export function classify(source: Role, target: Role): Rel {
  if (source.phase === target.phase) return "none";
  if (target.position === mirrorPosition(source.position)) return "mirrorOf";
  const sourceLateral = source.position !== 1;
  const targetLateral = target.position !== 1;
  if ((sourceLateral && target.position === 1) || (source.position === 1 && targetLateral)) {
    return "creates";
  }
  return "none";
}

export function roleKey(role: Role): string {
  return `${role.phase}:${role.position}`;
}

export function sameRole(a: Role, b: Role): boolean {
  return a.phase === b.phase && a.position === b.position;
}

export function formatRole(role: Role): string {
  const phase = PHASE_META[role.phase];
  const perspective = PERSPECTIVE[role.position];
  const mark = role.position === 1 ? "0" : phase.arrow;
  return `${phase.label} ${mark} ${perspective.label}`;
}

export const CANONICAL_LABELS: { label: string; position: Position }[] = TRIADS.flatMap((triad) =>
  POSITIONS.map((position) => ({ label: triad.adv[position], position })),
);
