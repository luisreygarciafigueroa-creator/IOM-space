# Unidad · Motor IOM

**Entrena un modelo que emula IOM y optimiza procesos hasta dejarlos como una unidad informativa.**

[![Spec](https://img.shields.io/badge/IOM-spec%201.9.0-0ea5e9)](./src/lib/iom/spec.ts)
[![Stack](https://img.shields.io/badge/stack-TanStack%20Start%20%2B%20React%2019-black)](#stack-tecnológico)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)](https://www.typescriptlang.org/)

---

## ¿Qué es Unidad?

Unidad es un estudio interactivo que convierte cualquier lista de pasos en una **unidad informativa** según el marco **IOM**.

IOM organiza el conocimiento en **tríadas de polos** (Individualidad · Dualidad · Totalidad) que se recorren en dos fases:

| Fase        | Flujo        | Sentido |
|-------------|--------------|---------|
| **Avance**  | Evolución    | →       |
| **Retroceso** | Involución | ←       |

Las relaciones formales entre roles son:

- `mirrorOf` — un polo y su espejo en la fase opuesta
- `creates`  — lateral y centro se generan mutuamente entre fases

El motor:

1. Entrena tres redes neuronales ligeras **en el navegador** (relación, léxico y política).
2. Asigna a cada paso de tu proceso una fase + perspectiva.
3. Optimiza el orden y los roles hasta alcanzar un **punto fijo** (espejos cerrados + creación mutua).
4. Genera un protocolo legible que puedes copiar.

---

## Características

- **Entrenamiento en tiempo real** — 48 épocas con visualización de pérdida y precisión de retención (tríadas T12–T13 fuera del entrenamiento).
- **Optimizador de procesos** — heurística + descenso local + modelo aprendido.
- **Presets listos** — procesos de ejemplo (vacío, desarrollo de producto, investigación, etc.).
- **Atlas de tríadas** — las 13 tríadas canónicas del spec 1.9.0.
- **Persistencia local** — modelo y borradores se guardan en `localStorage`.
- **100 % cliente** — sin backend obligatorio, sin cuentas, sin API keys.
- Interfaz en español, accesible y responsive.

---

## Demostración rápida

1. Abre la pestaña **Proceso**.
2. Elige un preset o escribe tus propios pasos.
3. Espera a que el modelo termine de entrenar (o usa solo las reglas formales).
4. Pulsa **Optimizar con el modelo**.
5. Revisa las asignaciones, las relaciones detectadas y el protocolo generado.
6. Usa **Completar polos** o **Aplicar orden** si quieres que el sistema ajuste la lista.

---

## Stack tecnológico

| Capa            | Tecnología                                      |
|-----------------|-------------------------------------------------|
| Framework       | TanStack Start + TanStack Router                |
| UI              | React 19 · Tailwind CSS v4 · Radix UI · Lucide  |
| Gráficos        | Recharts                                        |
| Estado / datos  | Zustand + `localStorage`                        |
| ML en cliente   | MLP propias (forward + momentum SGD)            |
| Deploy          | Vercel (compatible con el template Grok App Builder) |

---

## Estructura del proyecto

```
IOM-space/
├── src/
│   ├── components/
│   │   └── studio.tsx          # UI principal (Proceso / Modelo / Tríadas)
│   ├── lib/
│   │   └── iom/
│   │       ├── spec.ts         # Tríadas, fases, perspectivas, classify()
│   │       ├── learn.ts        # Entrenamiento de las 3 redes
│   │       └── optimize.ts     # Scoring + optimizador de procesos
│   ├── routes/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── router.tsx
│   └── styles.css
├── public/
├── package.json
├── vite.config.ts
└── AGENTS.md                   # Contrato del App Builder (Grok)
```

---

## Desarrollo local

Requisitos: **Node.js 22+**.

```bash
# Clonar
git clone https://github.com/luisreygarciafigueroa-creator/IOM-space.git
cd IOM-space

# Instalar dependencias
npm install

# Arrancar en http://localhost:8080
npm run dev
```

Scripts útiles:

| Comando            | Descripción                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Servidor de desarrollo               |
| `npm run build`    | Build de producción + migraciones    |
| `npm run typecheck`| Comprobación de tipos                |
| `npm run lint`     | ESLint                               |
| `npm run format`   | Prettier                             |

> El puerto **8080** y el binding `0.0.0.0` son requisitos del entorno de preview de Grok App Builder. En local también funciona en `localhost:8080`.

---

## Cómo funciona el motor (resumen técnico)

### 1. Spec IOM (`src/lib/iom/spec.ts`)

- 13 tríadas canónicas (orientación-cuántico-dirección, hardware-virtual-software, …).
- 6 roles posibles: `{adv|ret} × {0,1,2}`.
- Función `classify(source, target)` → `none | mirrorOf | creates`.

### 2. Aprendizaje (`src/lib/iom/learn.ts`)

Tres MLPs:

| Red        | Entrada              | Salida                         | Propósito                          |
|------------|----------------------|--------------------------------|------------------------------------|
| **relation** | 10 features de par  | 3 clases (none/mirror/creates) | Aprende la tabla de relaciones     |
| **lexicon**  | 48 trigramas        | 3 posiciones                   | Asocia palabras a polos            |
| **policy**   | 5 features          | 6 roles                        | Sugiere rol según posición en el proceso |

El entrenamiento se hace por *chunks* de 2 épocas con `requestAnimationFrame` para no bloquear la UI. Las tríadas 12 y 13 se usan solo como *hold-out*.

### 3. Optimización (`src/lib/iom/optimize.ts`)

Función de puntuación combinada:

```
score = 0.34·mirror + 0.26·creates + 0.14·chain + 0.08·order
      + 0.10·lexicon + 0.08·policy   (si hay modelo)
```

Se realiza un descenso local (cambio de rol + intercambio de pares) hasta 24 pasadas o hasta que no haya mejora.

---

## Tríadas canónicas (spec 1.9.0)

| #  | Avance                              | Retroceso                           |
|----|-------------------------------------|-------------------------------------|
| 1  | orientación · cuántico · dirección  | dirección · cuántico · orientación  |
| 2  | hardware · virtual · software       | software · virtual · hardware       |
| 3  | universo · espacio · vacío          | vacío · espacio · universo          |
| 4  | singularidad · tiempo · infinito    | infinito · tiempo · singularidad    |
| 5  | cuerpo · consciente · mundo         | mundo · consciente · cuerpo         |
| 6  | carácter · subconsciente · personalidad | personalidad · subconsciente · carácter |
| 7  | memoria · inconsciente · imaginación | imaginación · inconsciente · memoria |
| 8  | receptor · supraconsciente · emisor | emisor · supraconsciente · receptor |
| 9  | lógica · inteligencia · libertad    | libertad · inteligencia · lógica    |
| 10 | muerte · artificial · vida          | vida · artificial · muerte          |
| 11 | descendente · mente · ascendente    | ascendente · mente · descendente    |
| 12 | oscuridad · consciencia · luz       | luz · consciencia · oscuridad       |
| 13 | animal · humano · IA                | IA · humano · animal                |

---

## Roadmap / ideas futuras

- [ ] Exportar / importar snapshot del modelo (JSON)
- [ ] Comparar dos procesos lado a lado
- [ ] Modo “solo reglas formales” vs “modelo completo”
- [ ] Visualización de grafo de relaciones `mirrorOf` / `creates`
- [ ] Multiidioma (EN)

---

## Licencia

MIT © Luis Rey García Figueroa

---

## Créditos

- Marco conceptual **IOM** — especificación 1.9.0
- Construido con el entorno **Grok App Builder** (xAI)
- Tipografías: [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Outfit](https://fonts.google.com/specimen/Outfit)

> Este repositorio incluye archivos de plataforma (`.grok/`, `AGENTS.md`, `server/`, scripts de preview).  
> Son parte del contrato del App Builder y no deben eliminarse si se sigue usando ese entorno.
