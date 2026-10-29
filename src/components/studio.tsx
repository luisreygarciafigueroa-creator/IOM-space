import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Check, Copy, Plus, RotateCcw, Trash2 } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  TRAIN_EPOCHS,
  createJob,
  finalize,
  isSnapshot,
  probeWord,
  stepJob,
  type HistoryPoint,
  type Snapshot,
} from "@/lib/iom/learn";
import {
  PRESETS,
  missingPoles,
  optimizeProcess,
  orderByUnit,
  protocolText,
  stepsFromNames,
  type OptResult,
  type ProcessStep,
} from "@/lib/iom/optimize";
import { CHAIN, PERSPECTIVE, PHASE_META, TRIADS, type Position } from "@/lib/iom/spec";

const MODEL_KEY = "unidad-modelo-v1";
const PROCESS_KEY = "unidad-proceso-v1";
const SEED = 20261028;

type Tab = "proceso" | "modelo" | "atlas";

const TABS: { id: Tab; label: string }[] = [
  { id: "proceso", label: "Proceso" },
  { id: "modelo", label: "Modelo" },
  { id: "atlas", label: "Tríadas" },
];

function stampOf(steps: ProcessStep[]): string {
  return steps
    .filter((step) => step.name.trim())
    .map((step) => `${step.id}:${step.name.trim()}`)
    .join("|");
}

function namedSteps(steps: ProcessStep[]): ProcessStep[] {
  return steps.filter((step) => step.name.trim());
}

export function Studio() {
  const [tab, setTab] = useState<Tab>("proceso");
  const [steps, setSteps] = useState<ProcessStep[]>(() => stepsFromNames(PRESETS[0]!.steps, "vacio"));
  const [presetId, setPresetId] = useState(PRESETS[0]!.id);
  const [hydrated, setHydrated] = useState(false);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState(0);
  const [result, setResult] = useState<OptResult | null>(null);
  const [resultStamp, setResultStamp] = useState("");
  const [copied, setCopied] = useState(false);
  const [probe, setProbe] = useState("consciencia");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROCESS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { presetId?: string; steps?: ProcessStep[] };
        if (Array.isArray(saved.steps) && saved.steps.length > 0 && saved.steps.every((step) => step?.id && typeof step.name === "string")) {
          setSteps(saved.steps);
          setPresetId(saved.presetId || "custom");
        }
      }
    } catch {
      /* ignore broken local drafts */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PROCESS_KEY, JSON.stringify({ presetId, steps }));
  }, [hydrated, presetId, steps]);

  useEffect(() => {
    let alive = true;
    if (runId === 0) {
      try {
        const raw = localStorage.getItem(MODEL_KEY);
        if (raw && isSnapshot(JSON.parse(raw))) {
          const saved = JSON.parse(raw) as Snapshot;
          setSnap(saved);
          setHistory(saved.history);
          return;
        }
      } catch {
        /* retrain */
      }
    }
    setRunning(true);
    if (runId > 0) setHistory([]);
    const frame = requestAnimationFrame(() => {
      if (!alive) return;
      const job = createJob(SEED + runId);
      let epoch = 0;
      const tick = () => {
        if (!alive) return;
        const chunk = 2;
        for (let i = 0; i < chunk && epoch < TRAIN_EPOCHS; i++) {
          stepJob(job, epoch);
          epoch += 1;
        }
        setHistory(job.history.slice());
        if (epoch < TRAIN_EPOCHS) {
          requestAnimationFrame(tick);
          return;
        }
        const done = finalize(job, SEED + runId);
        localStorage.setItem(MODEL_KEY, JSON.stringify(done));
        if (!alive) return;
        setSnap(done);
        setRunning(false);
      };
      tick();
    });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, [runId]);

  const usable = namedSteps(steps);
  const stale = Boolean(result && resultStamp !== stampOf(steps));
  const latest = history[history.length - 1];
  const holdout = snap?.holdoutAcc ?? latest?.holdoutAcc ?? 0;

  function applyPreset(id: string) {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setSteps(stepsFromNames(preset.steps, id));
    setResult(null);
  }

  function updateStep(id: string, name: string) {
    setPresetId("custom");
    setSteps((current) => current.map((step) => (step.id === id ? { ...step, name } : step)));
  }

  function moveStep(index: number, direction: -1 | 1) {
    setPresetId("custom");
    setSteps((current) => {
      const next = current.slice();
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      const swap = next[index]!;
      next[index] = next[target]!;
      next[target] = swap;
      return next;
    });
  }

  function optimize() {
    if (usable.length === 0) return;
    const outcome = optimizeProcess(usable, snap, SEED);
    setResult(outcome);
    setResultStamp(stampOf(steps));
    setCopied(false);
  }

  function completePoles() {
    if (!result) return;
    const extra = missingPoles(usable, result.after);
    if (extra.length === 0) return;
    const next = [...steps, ...extra];
    setSteps(next);
    setPresetId("custom");
    const outcome = optimizeProcess(namedSteps(next), snap, SEED);
    setResult(outcome);
    setResultStamp(stampOf(next));
  }

  function applyOrder() {
    if (!result) return;
    const blanks = steps.filter((step) => !step.name.trim());
    const ordered = [...orderByUnit(usable, result.after), ...blanks];
    setSteps(ordered);
    setPresetId("custom");
    const outcome = optimizeProcess(namedSteps(ordered), snap, SEED);
    setResult(outcome);
    setResultStamp(stampOf(ordered));
  }

  async function copyProtocol() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(protocolText(result));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const reading = snap ? probeWord(snap.lexicon, probe) : null;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 md:py-10">
      <header className="max-w-2xl">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Motor IOM · spec 1.9.0</p>
        <h1 className="mt-2 text-4xl text-fg md:text-5xl">Unidad</h1>
        <p className="mt-3 text-base text-muted">
          Tres redes aprenden el marco: la relación entre polos, el vocabulario de las tríadas y dónde
          colocar cada paso. Con eso, un proceso se reescribe hasta poder sostenerse solo.
        </p>
      </header>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-line" role="tablist" aria-label="Secciones">
        {TABS.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={
                "min-h-11 shrink-0 border-b-2 px-3 text-sm " +
                (selected ? "border-primary text-fg" : "border-transparent text-muted")
              }
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "proceso" ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
          <section>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={
                    "min-h-11 rounded-full border px-3 text-sm " +
                    (presetId === preset.id ? "border-primary bg-raised text-fg" : "border-line text-muted")
                  }
                  onClick={() => applyPreset(preset.id)}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <ol className="mt-4 space-y-2">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center gap-2">
                  <span className="w-6 shrink-0 text-right text-sm text-muted tabular-nums">{index + 1}</span>
                  <input
                    value={step.name}
                    aria-label={`Paso ${index + 1}`}
                    onChange={(event) => updateStep(step.id, event.target.value)}
                    className="min-h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 text-base text-fg"
                  />
                  <button type="button" className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg" aria-label="Subir paso" onClick={() => moveStep(index, -1)}>
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </button>
                  <button type="button" className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg" aria-label="Bajar paso" onClick={() => moveStep(index, 1)}>
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg disabled:opacity-40"
                    aria-label="Quitar paso"
                    disabled={steps.length <= 1}
                    onClick={() => {
                      setPresetId("custom");
                      setSteps((current) => current.filter((item) => item.id !== step.id));
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-4 text-sm text-fg"
                onClick={() => {
                  setPresetId("custom");
                  setSteps((current) => [...current, { id: `paso-${Date.now()}`, name: "" }]);
                }}
              >
                <Plus className="size-4" aria-hidden="true" />
                Paso
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary disabled:opacity-40"
                disabled={usable.length === 0}
                onClick={optimize}
              >
                {snap ? "Optimizar con el modelo" : "Optimizar estructura"}
              </button>
            </div>
            <p className="mt-3 text-sm text-muted" aria-live="polite">
              {running
                ? `Entrenando emulación · época ${latest?.epoch ?? 0} de ${TRAIN_EPOCHS}`
                : snap
                  ? `Modelo listo · retención ${(holdout * 100).toFixed(0)}% en tríadas no vistas`
                  : "Sin modelo todavía. La optimización usa solo las reglas formales."}
            </p>
          </section>

          <section className="rounded-lg border border-line bg-surface p-4" aria-live="polite">
            {!result ? (
              <div>
                <h2 className="text-2xl text-fg">Todavía no hay lectura</h2>
                <p className="mt-2 text-sm text-muted">
                  El optimizador asigna cada paso a una fase y una perspectiva, cierra espejos y exige que
                  lateral y centro puedan crear al otro. Si ya no mejora, está en punto fijo.
                </p>
              </div>
            ) : (
              <ResultView
                result={result}
                stale={stale}
                hasModel={Boolean(snap)}
                copied={copied}
                onComplete={completePoles}
                onOrder={applyOrder}
                onCopy={() => void copyProtocol()}
                polesLeft={missingPoles(usable, result.after).length > 0}
              />
            )}
          </section>
        </div>
      ) : null}

      {tab === "modelo" ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl text-fg">Emulación</h2>
                <p className="mt-1 text-sm text-muted">
                  La red de relaciones no ve el índice de tríada. T12 y T13 quedan fuera del entreno: si
                  acierta, la regla vive en la fase y la posición.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-line px-3 text-sm text-fg disabled:opacity-40"
                disabled={running}
                onClick={() => setRunId((value) => value + 1)}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reentrenar
              </button>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-raised">
              <div
                className="h-full bg-primary"
                style={{ width: `${running ? ((latest?.epoch ?? 0) / TRAIN_EPOCHS) * 100 : 100}%` }}
              />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Retención" value={pct(holdout)} />
              <Stat label="Léxico" value={snap ? pct(snap.lexiconAcc) : "—"} />
              <Stat label="Política" value={snap ? pct(snap.policyAcc) : "—"} />
              <Stat label="Parámetros" value={snap ? String(snap.params) : "—"} />
            </dl>
            <div className="mt-4 h-48 w-full">
              {mounted && history.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-line)" vertical={false} />
                    <XAxis dataKey="epoch" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 1]} tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<ChartTip />} />
                    <Line type="monotone" dataKey="trainAcc" name="Entreno" stroke="var(--color-primary)" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="holdoutAcc" name="Retenidas" stroke="var(--color-fg)" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted">La curva aparece en cuanto corre la primera época.</p>
              )}
            </div>
            <p className="mt-2 text-sm text-muted">
              Control negativo: {snap ? (snap.negativeControl ? "una arista mirrorOf alterada sigue siendo reconocida como espejo." : "el control no distinguió la corrupción.") : "pendiente de entreno."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-line bg-surface p-4">
              <h2 className="text-2xl text-fg">Matriz retenida</h2>
              <p className="mt-1 text-sm text-muted">Filas reales, columnas que predice el modelo.</p>
              <Confusion matrix={snap?.confusion} />
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <h2 className="text-2xl text-fg">Probar una palabra</h2>
              <p className="mt-1 text-sm text-muted">
                Si no se parece al vocabulario canónico, la confianza baja y no arrastra el proceso.
              </p>
              <input
                value={probe}
                aria-label="Palabra a clasificar"
                onChange={(event) => setProbe(event.target.value)}
                className="mt-3 min-h-11 w-full rounded-md border border-line bg-bg px-3 text-base text-fg"
              />
              <p className="mt-3 text-sm text-fg">
                {reading
                  ? `${reading.perspective} · confianza ${pct(reading.confidence)}`
                  : "El léxico todavía no está entrenado."}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {tab === "atlas" ? (
        <section className="mt-6">
          <p className="max-w-2xl text-sm text-muted">
            Cada tríada es un modo de composición. Avance lee → 0 →. Retroceso invierte los laterales: ← 0 ←.
            El centro no se mueve.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {TRIADS.map((triad, index) => (
              <article key={triad.adv.join("-")} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl text-fg tabular-nums">T{String(index + 1).padStart(2, "0")}</h2>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm text-fg"
                    onClick={() => {
                      const names = [...triad.adv, ...triad.ret];
                      setSteps(stepsFromNames(names, `t${index + 1}`));
                      setPresetId(`triad-${index + 1}`);
                      setResult(null);
                      setTab("proceso");
                    }}
                  >
                    Usar como proceso
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {([0, 1, 2] as const).map((position) => (
                    <Pole key={position} phase="adv" position={position} label={triad.adv[position]} />
                  ))}
                  {([0, 1, 2] as const).map((position) => (
                    <Pole key={`r${position}`} phase="ret" position={position} label={triad.ret[position]} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function ResultView({
  result,
  stale,
  hasModel,
  copied,
  polesLeft,
  onComplete,
  onOrder,
  onCopy,
}: {
  result: OptResult;
  stale: boolean;
  hasModel: boolean;
  copied: boolean;
  polesLeft: boolean;
  onComplete: () => void;
  onOrder: () => void;
  onCopy: () => void;
}) {
  return (
    <div>
      <p className="text-xs tracking-widest text-muted uppercase">Coherencia</p>
      <p className="mt-1 font-display text-5xl text-fg tabular-nums">{(result.score * 100).toFixed(1)}</p>
      <p className="mt-1 text-sm text-muted tabular-nums">
        desde {(result.beforeScore * 100).toFixed(1)} · punto fijo {result.fixedPoint ? "sí" : "no"}
        {hasModel ? ` · acuerdo del modelo ${pct(result.modelAgreement)}` : ""}
      </p>
      {stale ? <p className="mt-2 text-sm text-primary">El proceso cambió. Vuelve a optimizar.</p> : null}
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
        {CHAIN.map((name, index) => (
          <span key={name} className="inline-flex items-center gap-2 text-sm text-muted">
            <span
              className={"size-2 rounded-full " + (result.lights[index] ? "bg-primary" : "bg-line")}
              aria-hidden="true"
            />
            <span className={result.lights[index] ? "text-fg" : undefined}>{name}</span>
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <Meter label="Espejo" value={result.parts.mirror} />
        <Meter label="Creación" value={result.parts.creates} />
        <Meter label="Cadena" value={result.parts.chain} />
        <Meter label="Orden" value={result.parts.order} />
      </div>
      <PhaseBoard result={result} />
      {result.changes.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg text-fg">Qué movió</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {result.changes.slice(0, 6).map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">La lectura inicial ya estaba en un máximo local.</p>
      )}
      {result.relations.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg text-fg">Relaciones</h3>
          <ul className="mt-2 space-y-2">
            {result.relations.map((hit) => (
              <li key={`${hit.source}-${hit.target}-${hit.rel}`} className="text-sm">
                <span className="text-fg">
                  {hit.source} → {hit.target}
                </span>
                <span className="text-muted">
                  {" "}
                  · {hit.rel} · {pct(hit.confidence)}
                  {hit.agrees ? "" : " · no coincide con la regla"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4">
        <h3 className="text-lg text-fg">Lectura</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {result.suggestions.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm text-fg disabled:opacity-40" disabled={!polesLeft || stale} onClick={onComplete}>
          Completar polos
        </button>
        <button type="button" className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm text-fg disabled:opacity-40" disabled={stale} onClick={onOrder}>
          Ordenar por la unidad
        </button>
        <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-sm text-fg" onClick={onCopy}>
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? "Copiado" : "Copiar protocolo"}
        </button>
      </div>
    </div>
  );
}

function PhaseBoard({ result }: { result: OptResult }) {
  return (
    <div className="mt-4 space-y-3">
      {(["adv", "ret"] as const).map((phase) => (
        <div key={phase}>
          <h3 className="text-lg text-fg">
            {PHASE_META[phase].label} · {PHASE_META[phase].flow}
          </h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {([0, 1, 2] as const).map((position) => {
              const group = result.assignments.filter(
                (step) => step.role.phase === phase && step.role.position === position,
              );
              return (
                <div key={position} className="min-w-0 rounded-md bg-raised p-2">
                  <p className="text-xs text-muted">
                    {position === 1 ? "0" : PHASE_META[phase].arrow} {PERSPECTIVE[position].label}
                  </p>
                  {group.length === 0 ? (
                    <p className="mt-2 text-sm text-muted">vacío</p>
                  ) : (
                    group.map((step) => (
                      <p key={step.id} className="mt-2 text-sm break-words text-fg">
                        {step.name}
                      </p>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Pole({ phase, position, label }: { phase: "adv" | "ret"; position: Position; label: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted">
        {position === 1 ? "0" : PHASE_META[phase].arrow} {PERSPECTIVE[position].id}
      </p>
      <p className="text-sm break-words text-fg">{label}</p>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="text-fg tabular-nums">{Math.round(value * 100)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-raised">
        <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-raised px-3 py-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-lg text-fg tabular-nums">{value}</dd>
    </div>
  );
}

function Confusion({ matrix }: { matrix?: number[][] }) {
  const labels = ["ninguna", "mirrorOf", "creates"];
  if (!matrix) return <p className="mt-3 text-sm text-muted">Aparece al terminar el entreno.</p>;
  return (
    <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
      <span />
      {labels.map((label) => (
        <span key={label} className="text-muted">
          {label}
        </span>
      ))}
      {matrix.map((row, rowIndex) => (
        <div key={labels[rowIndex]} className="contents">
          <span className="text-left text-muted">{labels[rowIndex]}</span>
          {row.map((cell, colIndex) => (
            <span
              key={`${rowIndex}-${colIndex}`}
              className={
                "rounded-md py-3 tabular-nums " + (rowIndex === colIndex ? "bg-primary text-on-primary" : "bg-raised text-fg")
              }
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number }[];
  label?: number | string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-line bg-bg px-3 py-2 text-xs text-fg">
      <p className="text-muted">Época {label}</p>
      {payload.map((item) => (
        <p key={item.name}>
          {item.name}: {typeof item.value === "number" ? pct(item.value) : "—"}
        </p>
      ))}
    </div>
  );
}

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}
