import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Copy, c as ArrowDown, i as Plus, n as Trash2, o as Check, r as RotateCcw, s as ArrowUp } from "../_libs/lucide-react.mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CYE_di-l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TRIADS = [
	{
		adv: [
			"orientación",
			"cuántico",
			"dirección"
		],
		ret: [
			"dirección",
			"cuántico",
			"orientación"
		]
	},
	{
		adv: [
			"hardware",
			"virtual",
			"software"
		],
		ret: [
			"software",
			"virtual",
			"hardware"
		]
	},
	{
		adv: [
			"universo",
			"espacio",
			"vacío"
		],
		ret: [
			"vacío",
			"espacio",
			"universo"
		]
	},
	{
		adv: [
			"singularidad",
			"tiempo",
			"infinito"
		],
		ret: [
			"infinito",
			"tiempo",
			"singularidad"
		]
	},
	{
		adv: [
			"cuerpo",
			"consciente",
			"mundo"
		],
		ret: [
			"mundo",
			"consciente",
			"cuerpo"
		]
	},
	{
		adv: [
			"carácter",
			"subconsciente",
			"personalidad"
		],
		ret: [
			"personalidad",
			"subconsciente",
			"carácter"
		]
	},
	{
		adv: [
			"memoria",
			"inconsciente",
			"imaginación"
		],
		ret: [
			"imaginación",
			"inconsciente",
			"memoria"
		]
	},
	{
		adv: [
			"receptor",
			"supraconsciente",
			"emisor"
		],
		ret: [
			"emisor",
			"supraconsciente",
			"receptor"
		]
	},
	{
		adv: [
			"lógica",
			"inteligencia",
			"libertad"
		],
		ret: [
			"libertad",
			"inteligencia",
			"lógica"
		]
	},
	{
		adv: [
			"muerte",
			"artificial",
			"vida"
		],
		ret: [
			"vida",
			"artificial",
			"muerte"
		]
	},
	{
		adv: [
			"descendente",
			"mente",
			"ascendente"
		],
		ret: [
			"ascendente",
			"mente",
			"descendente"
		]
	},
	{
		adv: [
			"oscuridad",
			"consciencia",
			"luz"
		],
		ret: [
			"luz",
			"consciencia",
			"oscuridad"
		]
	},
	{
		adv: [
			"animal",
			"humano",
			"IA"
		],
		ret: [
			"IA",
			"humano",
			"animal"
		]
	}
];
var POSITIONS = [
	0,
	1,
	2
];
var PERSPECTIVE = {
	0: {
		id: "Ind",
		label: "Individualidad"
	},
	1: {
		id: "D",
		label: "Dualidad"
	},
	2: {
		id: "Tot",
		label: "Totalidad"
	}
};
var PHASE_META = {
	adv: {
		label: "Avance",
		flow: "Evolución",
		arrow: "→"
	},
	ret: {
		label: "Retroceso",
		flow: "Involución",
		arrow: "←"
	}
};
var CHAIN = [
	"vacío",
	"distinción",
	"relación",
	"integración",
	"transformación",
	"unidad"
];
function mirrorPosition(position) {
	return 2 - position;
}
function classify(source, target) {
	if (source.phase === target.phase) return "none";
	if (target.position === mirrorPosition(source.position)) return "mirrorOf";
	const sourceLateral = source.position !== 1;
	const targetLateral = target.position !== 1;
	if (sourceLateral && target.position === 1 || source.position === 1 && targetLateral) return "creates";
	return "none";
}
function sameRole(a, b) {
	return a.phase === b.phase && a.position === b.position;
}
function formatRole(role) {
	const phase = PHASE_META[role.phase];
	const perspective = PERSPECTIVE[role.position];
	const mark = role.position === 1 ? "0" : phase.arrow;
	return `${phase.label} ${mark} ${perspective.label}`;
}
var CANONICAL_LABELS = TRIADS.flatMap((triad) => POSITIONS.map((position) => ({
	label: triad.adv[position],
	position
})));
var REL_INDEX = {
	none: 0,
	mirrorOf: 1,
	creates: 2
};
function mulberry32$1(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function foldText(value) {
	return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}
function hashTrigram(gram, dim) {
	let h = 2166136261;
	for (let i = 0; i < gram.length; i++) {
		h ^= gram.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) % dim;
}
function lexiconFeatures(text) {
	const features = new Array(48).fill(0);
	const folded = foldText(text);
	if (!folded) return features;
	const padded = ` ${folded} `;
	let count = 0;
	for (let i = 0; i < padded.length - 2; i++) {
		features[hashTrigram(padded.slice(i, i + 3), 48)] += 1;
		count += 1;
	}
	if (count > 0) for (let i = 0; i < 48; i++) features[i] /= count;
	return features;
}
function pairFeatures(source, target) {
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
		target.position === 2 ? 1 : 0
	];
}
function roleIndex(role) {
	return (role.phase === "adv" ? 0 : 3) + role.position;
}
function roleFromIndex(index) {
	return {
		phase: index < 3 ? "adv" : "ret",
		position: index % 3
	};
}
function zeros(n) {
	return new Array(n).fill(0);
}
function initMLP(inn, h, out, rng) {
	const s1 = Math.sqrt(2 / inn);
	const s2 = Math.sqrt(2 / h);
	return {
		in: inn,
		h,
		out,
		w1: Array.from({ length: h * inn }, () => (rng() * 2 - 1) * s1),
		b1: zeros(h),
		w2: Array.from({ length: out * h }, () => (rng() * 2 - 1) * s2),
		b2: zeros(out)
	};
}
function momentum(net) {
	return {
		w1: zeros(net.w1.length),
		b1: zeros(net.b1.length),
		w2: zeros(net.w2.length),
		b2: zeros(net.b2.length)
	};
}
function softmax(logits) {
	let max = logits[0] ?? 0;
	for (const value of logits) if (value > max) max = value;
	const exps = logits.map((value) => Math.exp(value - max));
	const sum = exps.reduce((total, value) => total + value, 0);
	return exps.map((value) => value / sum);
}
function forward(net, input) {
	const hidden = new Array(net.h);
	for (let j = 0; j < net.h; j++) {
		let sum = net.b1[j] ?? 0;
		const base = j * net.in;
		for (let i = 0; i < net.in; i++) sum += (net.w1[base + i] ?? 0) * (input[i] ?? 0);
		hidden[j] = sum > 0 ? sum : 0;
	}
	const logits = new Array(net.out);
	for (let k = 0; k < net.out; k++) {
		let sum = net.b2[k] ?? 0;
		const base = k * net.h;
		for (let j = 0; j < net.h; j++) sum += (net.w2[base + j] ?? 0) * (hidden[j] ?? 0);
		logits[k] = sum;
	}
	return {
		hidden,
		probs: softmax(logits)
	};
}
function emptyGrads(net) {
	return momentum(net);
}
function accumulate(net, input, y, grads) {
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
		for (let i = 0; i < net.in; i++) grads.w1[base + i] = (grads.w1[base + i] ?? 0) + (hiddenDelta[j] ?? 0) * (input[i] ?? 0);
	}
	return -Math.log(Math.max(probs[y] ?? 1e-12, 1e-12));
}
function applyGrads(net, grads, mom, lr, batch) {
	const decay = 1 - lr * 1e-4;
	const scale = (value) => value / batch;
	const step = (weights, gradients, velocity) => {
		for (let i = 0; i < weights.length; i++) {
			const v = .9 * (velocity[i] ?? 0) + scale(gradients[i] ?? 0);
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
function shuffle(rng, list) {
	const copy = list.slice();
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const swap = copy[i];
		copy[i] = copy[j];
		copy[j] = swap;
	}
	return copy;
}
function accuracy(net, samples) {
	if (samples.length === 0) return 0;
	let hit = 0;
	for (const sample of samples) {
		const { probs } = forward(net, sample.x);
		if (argmax(probs) === sample.y) hit += 1;
	}
	return hit / samples.length;
}
function argmax(values) {
	let best = 0;
	for (let i = 1; i < values.length; i++) if ((values[i] ?? 0) > (values[best] ?? 0)) best = i;
	return best;
}
function trainEpoch(net, samples, mom, rng, lr) {
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
function relationSamples() {
	const train = [];
	const test = [];
	TRIADS.forEach((_, index) => {
		const triad = index + 1;
		const nodes = [];
		for (const phase of ["adv", "ret"]) for (const position of [
			0,
			1,
			2
		]) nodes.push({
			phase,
			position
		});
		for (const source of nodes) for (const target of nodes) {
			if (source.phase === target.phase && source.position === target.position) continue;
			const sample = {
				x: pairFeatures(source, target),
				y: REL_INDEX[classify(source, target)]
			};
			if (triad >= 12) test.push(sample);
			else train.push(sample);
		}
	});
	return {
		train,
		test
	};
}
function lexiconSamples() {
	return CANONICAL_LABELS.map((entry) => ({
		x: lexiconFeatures(entry.label),
		y: entry.position
	}));
}
function sequenceSamples(lexicon, nodes) {
	const n = nodes.length;
	return nodes.map((node, index) => {
		const { probs } = forward(lexicon, lexiconFeatures(node.label));
		const t = n <= 1 ? .5 : index / (n - 1);
		return {
			x: [
				probs[0] ?? 0,
				probs[1] ?? 0,
				probs[2] ?? 0,
				t,
				1 - t
			],
			y: roleIndex(node.role)
		};
	});
}
function fullSequenceSamples(lexicon) {
	const samples = [];
	for (const triad of TRIADS) {
		const full = triadNodes(triad);
		samples.push(...sequenceSamples(lexicon, full));
	}
	return samples;
}
function policySamples(lexicon) {
	const samples = [];
	for (const triad of TRIADS) {
		const full = triadNodes(triad);
		samples.push(...sequenceSamples(lexicon, full));
		samples.push(...sequenceSamples(lexicon, full.slice(0, 3)));
		samples.push(...sequenceSamples(lexicon, full.slice(3)));
		samples.push(...sequenceSamples(lexicon, [{
			label: triad.adv[0],
			role: {
				phase: "adv",
				position: 0
			}
		}, {
			label: triad.ret[2],
			role: {
				phase: "ret",
				position: 2
			}
		}]));
	}
	return samples;
}
function triadNodes(triad) {
	return [
		{
			label: triad.adv[0],
			role: {
				phase: "adv",
				position: 0
			}
		},
		{
			label: triad.adv[1],
			role: {
				phase: "adv",
				position: 1
			}
		},
		{
			label: triad.adv[2],
			role: {
				phase: "adv",
				position: 2
			}
		},
		{
			label: triad.ret[0],
			role: {
				phase: "ret",
				position: 0
			}
		},
		{
			label: triad.ret[1],
			role: {
				phase: "ret",
				position: 1
			}
		},
		{
			label: triad.ret[2],
			role: {
				phase: "ret",
				position: 2
			}
		}
	];
}
function createJob(seed = 20261028) {
	const rng = mulberry32$1(seed);
	const relation = initMLP(10, 32, 3, rng);
	const lexicon = initMLP(48, 24, 3, rng);
	const policy = initMLP(5, 16, 6, rng);
	const lexMom = momentum(lexicon);
	const lexData = lexiconSamples();
	for (let epoch = 0; epoch < 80; epoch++) trainEpoch(lexicon, lexData, lexMom, rng, .28 * (1 - epoch / 80) + .04);
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
		rng
	};
}
function stepJob(job, epoch) {
	const fade = 1 - epoch / 48;
	const relLoss = trainEpoch(job.relation, job.trainRel, job.relMom, job.rng, .22 * fade + .03);
	trainEpoch(job.policy, job.polSamples, job.polMom, job.rng, .18 * fade + .03);
	job.history.push({
		epoch: epoch + 1,
		loss: relLoss,
		trainAcc: accuracy(job.relation, job.trainRel),
		holdoutAcc: accuracy(job.relation, job.testRel)
	});
}
function countParams(net) {
	return net.w1.length + net.b1.length + net.w2.length + net.b2.length;
}
function confusionOf(net, samples) {
	const matrix = [
		[
			0,
			0,
			0
		],
		[
			0,
			0,
			0
		],
		[
			0,
			0,
			0
		]
	];
	for (const sample of samples) {
		const pred = argmax(forward(net, sample.x).probs);
		const row = matrix[sample.y];
		if (row) row[pred] = (row[pred] ?? 0) + 1;
	}
	return matrix;
}
function negativeControl(net, samples) {
	const mirror = samples.find((sample) => sample.y === REL_INDEX.mirrorOf);
	if (!mirror) return false;
	const prediction = argmax(forward(net, mirror.x).probs);
	return prediction === REL_INDEX.mirrorOf && prediction !== REL_INDEX.none;
}
function finalize(job, seed) {
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
		epochs: job.history.length
	};
}
function isSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	const snap = value;
	return snap.version === 1 && validNet(snap.relation, 10, 32, 3) && validNet(snap.lexicon, 48, 24, 3) && validNet(snap.policy, 5, 16, 6);
}
function validNet(net, inn, h, out) {
	return Boolean(net && net.w1?.length === h * inn && net.b1?.length === h && net.w2?.length === out * h && net.b2?.length === out);
}
var PERSPECTIVES = [
	"Individualidad",
	"Dualidad",
	"Totalidad"
];
function trigramWeights(text) {
	const padded = ` ${foldText(text)} `;
	const weights = /* @__PURE__ */ new Map();
	for (let i = 0; i < padded.length - 2; i++) {
		const gram = padded.slice(i, i + 3);
		weights.set(gram, (weights.get(gram) ?? 0) + 1);
	}
	return weights;
}
function cosineMap(left, right) {
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
var canonicalGrams = null;
function nearestCanonical(word) {
	if (!canonicalGrams) canonicalGrams = CANONICAL_LABELS.map((entry) => trigramWeights(entry.label));
	const features = trigramWeights(word);
	let best = 0;
	for (const known of canonicalGrams) {
		const similarity = cosineMap(features, known);
		if (similarity > best) best = similarity;
	}
	return best;
}
function lexiconDistribution(lexicon, word) {
	const { probs } = forward(lexicon, lexiconFeatures(word));
	const similarity = nearestCanonical(word);
	const keep = similarity >= .78 ? 1 : Math.max(0, (similarity - .4) / .38);
	return {
		probs: probs.map((value) => keep * value + (1 - keep) / 3),
		similarity
	};
}
function probeWord(lexicon, word) {
	const { probs } = lexiconDistribution(lexicon, word);
	const position = argmax(probs);
	return {
		position,
		confidence: probs[position] ?? 0,
		perspective: PERSPECTIVES[position] ?? "Dualidad",
		probs
	};
}
function policyFeatures(lexicon, name, index, total) {
	const { probs } = lexiconDistribution(lexicon, name);
	const t = total <= 1 ? .5 : index / (total - 1);
	return [
		probs[0] ?? 0,
		probs[1] ?? 0,
		probs[2] ?? 0,
		t,
		1 - t
	];
}
function predictRole(policy, features) {
	const { probs } = forward(policy, features);
	const index = argmax(probs);
	return {
		role: roleFromIndex(index),
		confidence: probs[index] ?? 0,
		probs
	};
}
function predictRelation(relation, source, target) {
	const { probs } = forward(relation, pairFeatures(source, target));
	const index = argmax(probs);
	return {
		rel: index === 1 ? "mirrorOf" : index === 2 ? "creates" : "none",
		confidence: probs[index] ?? 0
	};
}
var ROLES = [
	{
		phase: "adv",
		position: 0
	},
	{
		phase: "adv",
		position: 1
	},
	{
		phase: "adv",
		position: 2
	},
	{
		phase: "ret",
		position: 0
	},
	{
		phase: "ret",
		position: 1
	},
	{
		phase: "ret",
		position: 2
	}
];
function patternFor(count) {
	const reading = [
		{
			phase: "adv",
			position: 0
		},
		{
			phase: "adv",
			position: 1
		},
		{
			phase: "adv",
			position: 2
		},
		{
			phase: "ret",
			position: 0
		},
		{
			phase: "ret",
			position: 1
		},
		{
			phase: "ret",
			position: 2
		}
	];
	const subsets = {
		1: [{
			phase: "adv",
			position: 1
		}],
		2: [{
			phase: "adv",
			position: 0
		}, {
			phase: "ret",
			position: 2
		}],
		3: [
			{
				phase: "adv",
				position: 0
			},
			{
				phase: "adv",
				position: 1
			},
			{
				phase: "adv",
				position: 2
			}
		],
		4: [
			{
				phase: "adv",
				position: 0
			},
			{
				phase: "adv",
				position: 1
			},
			{
				phase: "ret",
				position: 1
			},
			{
				phase: "ret",
				position: 2
			}
		],
		5: [
			{
				phase: "adv",
				position: 0
			},
			{
				phase: "adv",
				position: 1
			},
			{
				phase: "adv",
				position: 2
			},
			{
				phase: "ret",
				position: 1
			},
			{
				phase: "ret",
				position: 2
			}
		]
	};
	if (count <= 5) return subsets[count].map((role) => ({ ...role }));
	return Array.from({ length: count }, (_, index) => ({ ...reading[index % 6] }));
}
function counts(roles) {
	const adv = [
		0,
		0,
		0
	];
	const ret = [
		0,
		0,
		0
	];
	for (const role of roles) {
		const bucket = role.phase === "adv" ? adv : ret;
		bucket[role.position] = (bucket[role.position] ?? 0) + 1;
	}
	return {
		adv,
		ret
	};
}
function mirrorScore(roles) {
	if (roles.length === 0) return 0;
	const { adv, ret } = counts(roles);
	let covered = 0;
	for (const position of [
		0,
		1,
		2
	]) covered += Math.min(adv[position] ?? 0, ret[2 - position] ?? 0) * 2;
	return Math.min(1, covered / roles.length);
}
function createsScore(roles) {
	if (roles.length === 0) return 0;
	let hit = 0;
	for (let i = 0; i < roles.length; i++) {
		const source = roles[i];
		if (roles.some((target, j) => i !== j && classify(source, target) === "creates")) hit += 1;
	}
	return hit / roles.length;
}
function chainScore(roles) {
	if (roles.length === 0) return 0;
	const positions = new Set(roles.map((role) => role.position));
	const phases = new Set(roles.map((role) => role.phase));
	const flags = [
		1,
		positions.size >= 2 ? 1 : 0,
		positions.has(1) ? 1 : 0,
		phases.size === 2 ? 1 : 0,
		roles.length >= 3 ? 1 : 0
	];
	return flags.reduce((total, flag) => total + flag, 0) / flags.length;
}
function orderScore(roles) {
	if (roles.length < 2) return 1;
	let penalty = 0;
	for (let i = 1; i < roles.length; i++) {
		const prev = roles[i - 1];
		const next = roles[i];
		if (prev.phase === "ret" && next.phase === "adv") penalty += 1;
		else if (prev.phase === next.phase && next.position < prev.position) penalty += .5;
	}
	return Math.max(0, 1 - penalty / (roles.length - 1));
}
function lexiconFit(lexicon, name, role) {
	if (!lexicon || !name.trim()) return .5;
	const probe = probeWord(lexicon, name);
	if (probe.confidence < .62) return .5;
	if (role.position === probe.position) return .55 + .45 * probe.confidence;
	if (role.position === 2 - probe.position) return .45 + .3 * probe.confidence;
	return Math.max(0, .45 - .4 * probe.confidence);
}
function policyFit(policy, lexicon, name, index, total, role) {
	if (!policy || !lexicon) return 1 / 6;
	const predicted = predictRole(policy, policyFeatures(lexicon, name, index, total));
	const slot = (role.phase === "adv" ? 0 : 3) + role.position;
	return predicted.probs[slot] ?? 0;
}
function scoreParts(steps, roles, models) {
	const lexicon = models ? steps.reduce((total, step, index) => total + lexiconFit(models.lexicon, step.name, roles[index]), 0) / Math.max(steps.length, 1) : .5;
	const policy = models ? steps.reduce((total, step, index) => total + policyFit(models.policy, models.lexicon, step.name, index, steps.length, roles[index]), 0) / Math.max(steps.length, 1) : 1 / 6;
	return {
		mirror: mirrorScore(roles),
		creates: createsScore(roles),
		chain: chainScore(roles),
		order: orderScore(roles),
		lexicon,
		policy
	};
}
function combine(parts, withModel) {
	if (!withModel) return parts.mirror * .42 + parts.creates * .32 + parts.chain * .16 + parts.order * .1;
	return parts.mirror * .34 + parts.creates * .26 + parts.chain * .14 + parts.order * .08 + parts.lexicon * .1 + parts.policy * .08;
}
function objective(steps, roles, models) {
	return combine(scoreParts(steps, roles, models), Boolean(models));
}
function descent(steps, seed, models) {
	const roles = seed.map((role) => ({ ...role }));
	let best = objective(steps, roles, models);
	let passes = 0;
	let improved = true;
	while (improved && passes < 24) {
		improved = false;
		passes += 1;
		for (let i = 0; i < roles.length; i++) for (const candidate of ROLES) {
			const previous = roles[i];
			if (sameRole(previous, candidate)) continue;
			roles[i] = { ...candidate };
			const next = objective(steps, roles, models);
			if (next > best + 1e-6) {
				best = next;
				improved = true;
			} else roles[i] = previous;
		}
		for (let i = 0; i < roles.length; i++) for (let j = i + 1; j < roles.length; j++) {
			const left = roles[i];
			const right = roles[j];
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
	return {
		roles,
		score: best,
		passes
	};
}
function heuristic(steps, models) {
	const pattern = patternFor(steps.length);
	if (!models) return pattern;
	return steps.map((step, index) => {
		const base = pattern[index] ?? pattern[pattern.length - 1];
		const probe = probeWord(models.lexicon, step.name);
		if (probe.confidence < .62) return { ...base };
		return {
			phase: base.phase,
			position: probe.position
		};
	});
}
function randomRoles(count, rng) {
	return Array.from({ length: count }, () => ({ ...ROLES[Math.floor(rng() * ROLES.length)] }));
}
function chainLights(roles, parts) {
	const positions = new Set(roles.map((role) => role.position));
	const phases = new Set(roles.map((role) => role.phase));
	return [
		true,
		roles.length >= 1,
		positions.size >= 2,
		positions.has(1),
		phases.size === 2,
		parts.mirror >= .8 && parts.creates >= .8
	];
}
function suggestions(steps, roles, parts, models) {
	const notes = [];
	const { adv, ret } = counts(roles);
	for (const position of [
		0,
		1,
		2
	]) {
		const forward = adv[position] ?? 0;
		const back = ret[2 - position] ?? 0;
		if (forward > back) {
			const partner = steps.find((_, index) => roles[index]?.phase === "adv" && roles[index]?.position === position);
			notes.push(`Falta el espejo en retroceso de «${partner?.name || "un paso"}» (${PERSPECTIVE[position].label} → ${PERSPECTIVE[2 - position].label}).`);
		} else if (back > forward) {
			const partner = steps.find((_, index) => roles[index]?.phase === "ret" && roles[index]?.position === 2 - position);
			notes.push(`Falta el polo de avance que refleja «${partner?.name || "un paso"}».`);
		}
	}
	if (!roles.some((role) => role.position === 1)) notes.push("No hay dualidad: el proceso distingue polos pero no los integra.");
	if (new Set(roles.map((role) => role.phase)).size < 2) notes.push("Todo queda en una sola fase. Sin retroceso no hay transformación trazable.");
	if (parts.creates < .999 && roles.some((role) => role.position === 1)) notes.push("Algún paso no participa en creates: lateral y centro deben poder generarse entre fases.");
	if (models) for (let i = 0; i < steps.length; i++) {
		const probe = probeWord(models.lexicon, steps[i].name);
		const role = roles[i];
		if (probe.confidence >= .72 && role.position !== probe.position && role.position !== 2 - probe.position) notes.push(`«${steps[i].name}» se parece al polo ${probe.perspective.toLowerCase()}, no a ${PERSPECTIVE[role.position].label.toLowerCase()}.`);
	}
	if (notes.length === 0) notes.push("La unidad cierra: espejos, creación y ambas fases están presentes.");
	return notes.slice(0, 5);
}
function modelAgreement(roles, relation) {
	if (!relation || roles.length < 2) return 0;
	let seen = 0;
	let agree = 0;
	for (let i = 0; i < roles.length; i++) for (let j = 0; j < roles.length; j++) {
		if (i === j) continue;
		seen += 1;
		if (predictRelation(relation, roles[i], roles[j]).rel === classify(roles[i], roles[j])) agree += 1;
	}
	return seen ? agree / seen : 0;
}
function relationsOf(steps, roles, relation) {
	const hits = [];
	for (let i = 0; i < roles.length; i++) for (let j = 0; j < roles.length; j++) {
		if (i === j) continue;
		const formal = classify(roles[i], roles[j]);
		if (formal === "none") continue;
		if (!relation) {
			hits.push({
				source: steps[i].name,
				target: steps[j].name,
				rel: formal,
				confidence: 1,
				agrees: true
			});
			continue;
		}
		const predicted = predictRelation(relation, roles[i], roles[j]);
		hits.push({
			source: steps[i].name,
			target: steps[j].name,
			rel: predicted.rel,
			confidence: predicted.confidence,
			agrees: predicted.rel === formal
		});
	}
	return hits.sort((a, b) => b.confidence - a.confidence || a.rel.localeCompare(b.rel)).slice(0, 8);
}
function decorate(steps, roles) {
	return steps.map((step, index) => {
		const role = roles[index];
		const phase = PHASE_META[role.phase];
		return {
			...step,
			role,
			perspective: PERSPECTIVE[role.position].label,
			phaseLabel: phase.label,
			flow: phase.flow,
			mark: role.position === 1 ? "0" : phase.arrow
		};
	});
}
function optimizeProcess(steps, models, seed = 7) {
	const usable = steps.map((step) => ({
		...step,
		name: step.name.trim() || "sin nombre"
	}));
	const modelPick = models ? {
		lexicon: models.lexicon,
		policy: models.policy
	} : null;
	const before = heuristic(usable, modelPick);
	const beforeScore = objective(usable, before, modelPick);
	let rng = mulberry32(seed + usable.length * 17);
	let best = descent(usable, before, modelPick);
	for (let restart = 0; restart < 10; restart++) {
		const attempt = descent(usable, randomRoles(usable.length, rng), modelPick);
		if (attempt.score > best.score + 1e-6) best = attempt;
	}
	const polished = descent(usable, best.roles, modelPick);
	const fixedPoint = polished.score <= best.score + 1e-6 && polished.roles.every((role, index) => sameRole(role, best.roles[index]));
	const after = polished.roles;
	const parts = scoreParts(usable, after, modelPick);
	const changes = usable.map((step, index) => sameRole(before[index], after[index]) ? "" : `${step.name}: ${formatRole(before[index])} → ${formatRole(after[index])}`).filter(Boolean);
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
		modelAgreement: modelAgreement(after, models?.relation ?? null)
	};
}
function missingPoles(steps, roles) {
	const { adv, ret } = counts(roles);
	const extra = [];
	let serial = 0;
	for (const position of [
		0,
		1,
		2
	]) {
		const forward = adv[position] ?? 0;
		const reflected = 2 - position;
		const back = ret[reflected] ?? 0;
		if (forward > back) {
			const partner = steps.find((_, index) => roles[index]?.phase === "adv" && roles[index]?.position === position);
			for (let n = 0; n < forward - back && steps.length + extra.length < 12; n++) {
				serial += 1;
				extra.push({
					id: `polo-${position}-${serial}`,
					name: `Espejo · ${partner?.name || PERSPECTIVE[position].label}`
				});
			}
		}
		if (back > forward) {
			const partner = steps.find((_, index) => roles[index]?.phase === "ret" && roles[index]?.position === reflected);
			for (let n = 0; n < back - forward && steps.length + extra.length < 12; n++) {
				serial += 1;
				extra.push({
					id: `polo-adv-${position}-${serial}`,
					name: `Origen · ${partner?.name || PERSPECTIVE[reflected].label}`
				});
			}
		}
	}
	if (!roles.some((role) => role.position === 1) && steps.length + extra.length < 12) extra.push({
		id: `polo-centro-${serial + 1}`,
		name: "Integración"
	});
	return extra;
}
function protocolText(result) {
	const lines = [
		"Unidad informativa",
		`Coherencia ${(result.score * 100).toFixed(1)} · punto fijo ${result.fixedPoint ? "sí" : "no"}`,
		"",
		...CHAIN.map((name, index) => `${result.lights[index] ? "●" : "○"} ${name}`),
		"",
		"Avance · evolución"
	];
	for (const position of [
		0,
		1,
		2
	]) {
		const group = result.assignments.filter((step) => step.role.phase === "adv" && step.role.position === position);
		const mark = position === 1 ? "0" : "→";
		lines.push(`  ${mark} ${PERSPECTIVE[position].label}: ${group.map((step) => step.name).join(", ") || "—"}`);
	}
	lines.push("", "Retroceso · involución");
	for (const position of [
		0,
		1,
		2
	]) {
		const group = result.assignments.filter((step) => step.role.phase === "ret" && step.role.position === position);
		const mark = position === 1 ? "0" : "←";
		lines.push(`  ${mark} ${PERSPECTIVE[position].label}: ${group.map((step) => step.name).join(", ") || "—"}`);
	}
	if (result.relations.length) {
		lines.push("", "Relaciones");
		for (const hit of result.relations) lines.push(`  ${hit.source} → ${hit.target} · ${hit.rel} · ${(hit.confidence * 100).toFixed(0)}%`);
	}
	lines.push("", "Lectura");
	for (const note of result.suggestions) lines.push(`  ${note}`);
	return lines.join("\n");
}
function orderByUnit(steps, roles) {
	return steps.map((step, index) => ({
		step,
		role: roles[index]
	})).sort((a, b) => {
		const phaseDelta = (a.role.phase === "adv" ? 0 : 1) - (b.role.phase === "adv" ? 0 : 1);
		if (phaseDelta !== 0) return phaseDelta;
		return a.role.position - b.role.position;
	}).map((entry) => entry.step);
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var PRESETS = [
	{
		id: "vacio",
		name: "Desde el vacío",
		steps: [
			"Vacío",
			"Distinción",
			"Relación",
			"Integración",
			"Transformación"
		]
	},
	{
		id: "sistema",
		name: "Construir un sistema",
		steps: [
			"Hardware",
			"Capa virtual",
			"Software",
			"Prueba",
			"Despliegue"
		]
	},
	{
		id: "servicio",
		name: "Ciclo de un servicio",
		steps: [
			"Recepción",
			"Diagnóstico",
			"Respuesta",
			"Cierre",
			"Aprendizaje"
		]
	},
	{
		id: "decision",
		name: "Decisión",
		steps: [
			"Oscuridad del problema",
			"Consciencia",
			"Claridad",
			"Acción",
			"Revisión"
		]
	},
	{
		id: "tramite",
		name: "Trámite",
		steps: [
			"Solicitud",
			"Revisión",
			"Resolución",
			"Notificación",
			"Archivo"
		]
	},
	{
		id: "canon",
		name: "Tríada canónica",
		steps: [
			"orientación",
			"cuántico",
			"dirección",
			"dirección",
			"cuántico",
			"orientación"
		]
	}
];
function stepsFromNames(names, prefix) {
	return names.map((name, index) => ({
		id: `${prefix}-${index + 1}`,
		name
	}));
}
var MODEL_KEY = "unidad-modelo-v1";
var PROCESS_KEY = "unidad-proceso-v1";
var SEED = 20261028;
var TABS = [
	{
		id: "proceso",
		label: "Proceso"
	},
	{
		id: "modelo",
		label: "Modelo"
	},
	{
		id: "atlas",
		label: "Tríadas"
	}
];
function stampOf(steps) {
	return steps.filter((step) => step.name.trim()).map((step) => `${step.id}:${step.name.trim()}`).join("|");
}
function namedSteps(steps) {
	return steps.filter((step) => step.name.trim());
}
function Studio() {
	const [tab, setTab] = (0, import_react.useState)("proceso");
	const [steps, setSteps] = (0, import_react.useState)(() => stepsFromNames(PRESETS[0].steps, "vacio"));
	const [presetId, setPresetId] = (0, import_react.useState)(PRESETS[0].id);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [snap, setSnap] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [runId, setRunId] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const [resultStamp, setResultStamp] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [probe, setProbe] = (0, import_react.useState)("consciencia");
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(PROCESS_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				if (Array.isArray(saved.steps) && saved.steps.length > 0 && saved.steps.every((step) => step?.id && typeof step.name === "string")) {
					setSteps(saved.steps);
					setPresetId(saved.presetId || "custom");
				}
			}
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(PROCESS_KEY, JSON.stringify({
			presetId,
			steps
		}));
	}, [
		hydrated,
		presetId,
		steps
	]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		if (runId === 0) try {
			const raw = localStorage.getItem(MODEL_KEY);
			if (raw && isSnapshot(JSON.parse(raw))) {
				const saved = JSON.parse(raw);
				setSnap(saved);
				setHistory(saved.history);
				return;
			}
		} catch {}
		setRunning(true);
		if (runId > 0) setHistory([]);
		const frame = requestAnimationFrame(() => {
			if (!alive) return;
			const job = createJob(SEED + runId);
			let epoch = 0;
			const tick = () => {
				if (!alive) return;
				const chunk = 2;
				for (let i = 0; i < chunk && epoch < 48; i++) {
					stepJob(job, epoch);
					epoch += 1;
				}
				setHistory(job.history.slice());
				if (epoch < 48) {
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
	function applyPreset(id) {
		const preset = PRESETS.find((item) => item.id === id);
		if (!preset) return;
		setPresetId(id);
		setSteps(stepsFromNames(preset.steps, id));
		setResult(null);
	}
	function updateStep(id, name) {
		setPresetId("custom");
		setSteps((current) => current.map((step) => step.id === id ? {
			...step,
			name
		} : step));
	}
	function moveStep(index, direction) {
		setPresetId("custom");
		setSteps((current) => {
			const next = current.slice();
			const target = index + direction;
			if (target < 0 || target >= next.length) return current;
			const swap = next[index];
			next[index] = next[target];
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-screen max-w-6xl px-4 py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-muted uppercase",
						children: "Motor IOM · spec 1.9.0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-4xl text-fg md:text-5xl",
						children: "Unidad"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-muted",
						children: "Tres redes aprenden el marco: la relación entre polos, el vocabulario de las tríadas y dónde colocar cada paso. Con eso, un proceso se reescribe hasta poder sostenerse solo."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-2 overflow-x-auto border-b border-line",
				role: "tablist",
				"aria-label": "Secciones",
				children: TABS.map((item) => {
					const selected = tab === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": selected,
						className: "min-h-11 shrink-0 border-b-2 px-3 text-sm " + (selected ? "border-primary text-fg" : "border-transparent text-muted"),
						onClick: () => setTab(item.id),
						children: item.label
					}, item.id);
				})
			}),
			tab === "proceso" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-2 lg:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-full border px-3 text-sm " + (presetId === preset.id ? "border-primary bg-raised text-fg" : "border-line text-muted"),
							onClick: () => applyPreset(preset.id),
							children: preset.name
						}, preset.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 space-y-2",
						children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 shrink-0 text-right text-sm text-muted tabular-nums",
									children: index + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: step.name,
									"aria-label": `Paso ${index + 1}`,
									onChange: (event) => updateStep(step.id, event.target.value),
									className: "min-h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 text-base text-fg"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center rounded-md border border-line text-fg",
									"aria-label": "Subir paso",
									onClick: () => moveStep(index, -1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
										className: "size-4",
										"aria-hidden": "true"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center rounded-md border border-line text-fg",
									"aria-label": "Bajar paso",
									onClick: () => moveStep(index, 1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
										className: "size-4",
										"aria-hidden": "true"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center rounded-md border border-line text-fg disabled:opacity-40",
									"aria-label": "Quitar paso",
									disabled: steps.length <= 1,
									onClick: () => {
										setPresetId("custom");
										setSteps((current) => current.filter((item) => item.id !== step.id));
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-4",
										"aria-hidden": "true"
									})
								})
							]
						}, step.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-4 text-sm text-fg",
							onClick: () => {
								setPresetId("custom");
								setSteps((current) => [...current, {
									id: `paso-${Date.now()}`,
									name: ""
								}]);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Paso"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary disabled:opacity-40",
							disabled: usable.length === 0,
							onClick: optimize,
							children: snap ? "Optimizar con el modelo" : "Optimizar estructura"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						"aria-live": "polite",
						children: running ? `Entrenando emulación · época ${latest?.epoch ?? 0} de 48` : snap ? `Modelo listo · retención ${(holdout * 100).toFixed(0)}% en tríadas no vistas` : "Sin modelo todavía. La optimización usa solo las reglas formales."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-lg border border-line bg-surface p-4",
					"aria-live": "polite",
					children: !result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl text-fg",
						children: "Todavía no hay lectura"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "El optimizador asigna cada paso a una fase y una perspectiva, cierra espejos y exige que lateral y centro puedan crear al otro. Si ya no mejora, está en punto fijo."
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultView, {
						result,
						stale,
						hasModel: Boolean(snap),
						copied,
						onComplete: completePoles,
						onOrder: applyOrder,
						onCopy: () => void copyProtocol(),
						polesLeft: missingPoles(usable, result.after).length > 0
					})
				})]
			}) : null,
			tab === "modelo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl text-fg",
								children: "Emulación"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "La red de relaciones no ve el índice de tríada. T12 y T13 quedan fuera del entreno: si acierta, la regla vive en la fase y la posición."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-line px-3 text-sm text-fg disabled:opacity-40",
								disabled: running,
								onClick: () => setRunId((value) => value + 1),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Reentrenar"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1.5 overflow-hidden rounded-full bg-raised",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary",
								style: { width: `${running ? (latest?.epoch ?? 0) / 48 * 100 : 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Retención",
									value: pct(holdout)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Léxico",
									value: snap ? pct(snap.lexiconAcc) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Política",
									value: snap ? pct(snap.policyAcc) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Parámetros",
									value: snap ? String(snap.params) : "—"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-48 w-full",
							children: mounted && history.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: history,
									margin: {
										top: 8,
										right: 8,
										left: 0,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											stroke: "var(--color-line)",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "epoch",
											tick: {
												fill: "var(--color-muted)",
												fontSize: 12
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											domain: [0, 1],
											tick: {
												fill: "var(--color-muted)",
												fontSize: 12
											},
											axisLine: false,
											tickLine: false,
											width: 36
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "trainAcc",
											name: "Entreno",
											stroke: "var(--color-primary)",
											dot: false,
											strokeWidth: 2
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "holdoutAcc",
											name: "Retenidas",
											stroke: "var(--color-fg)",
											dot: false,
											strokeWidth: 2
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "La curva aparece en cuanto corre la primera época."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: ["Control negativo: ", snap ? snap.negativeControl ? "una arista mirrorOf alterada sigue siendo reconocida como espejo." : "el control no distinguió la corrupción." : "pendiente de entreno."]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl text-fg",
								children: "Matriz retenida"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Filas reales, columnas que predice el modelo."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confusion, { matrix: snap?.confusion })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl text-fg",
								children: "Probar una palabra"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Si no se parece al vocabulario canónico, la confianza baja y no arrastra el proceso."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: probe,
								"aria-label": "Palabra a clasificar",
								onChange: (event) => setProbe(event.target.value),
								className: "mt-3 min-h-11 w-full rounded-md border border-line bg-bg px-3 text-base text-fg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-fg",
								children: reading ? `${reading.perspective} · confianza ${pct(reading.confidence)}` : "El léxico todavía no está entrenado."
							})
						]
					})]
				})]
			}) : null,
			tab === "atlas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-2xl text-sm text-muted",
					children: "Cada tríada es un modo de composición. Avance lee → 0 →. Retroceso invierte los laterales: ← 0 ←. El centro no se mueve."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 md:grid-cols-2",
					children: TRIADS.map((triad, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-line bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xl text-fg tabular-nums",
								children: ["T", String(index + 1).padStart(2, "0")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm text-fg",
								onClick: () => {
									const names = [...triad.adv, ...triad.ret];
									setSteps(stepsFromNames(names, `t${index + 1}`));
									setPresetId(`triad-${index + 1}`);
									setResult(null);
									setTab("proceso");
								},
								children: "Usar como proceso"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-3 gap-2",
							children: [[
								0,
								1,
								2
							].map((position) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pole, {
								phase: "adv",
								position,
								label: triad.adv[position]
							}, position)), [
								0,
								1,
								2
							].map((position) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pole, {
								phase: "ret",
								position,
								label: triad.ret[position]
							}, `r${position}`))]
						})]
					}, triad.adv.join("-")))
				})]
			}) : null
		]
	});
}
function ResultView({ result, stale, hasModel, copied, polesLeft, onComplete, onOrder, onCopy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-widest text-muted uppercase",
			children: "Coherencia"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-5xl text-fg tabular-nums",
			children: (result.score * 100).toFixed(1)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted tabular-nums",
			children: [
				"desde ",
				(result.beforeScore * 100).toFixed(1),
				" · punto fijo ",
				result.fixedPoint ? "sí" : "no",
				hasModel ? ` · acuerdo del modelo ${pct(result.modelAgreement)}` : ""
			]
		}),
		stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-primary",
			children: "El proceso cambió. Vuelve a optimizar."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex flex-wrap gap-x-3 gap-y-1",
			children: CHAIN.map((name, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-2 rounded-full " + (result.lights[index] ? "bg-primary" : "bg-line"),
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: result.lights[index] ? "text-fg" : void 0,
					children: name
				})]
			}, name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: "Espejo",
					value: result.parts.mirror
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: "Creación",
					value: result.parts.creates
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: "Cadena",
					value: result.parts.chain
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: "Orden",
					value: result.parts.order
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseBoard, { result }),
		result.changes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg text-fg",
				children: "Qué movió"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-sm text-muted",
				children: result.changes.slice(0, 6).map((change) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: change }, change))
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "La lectura inicial ya estaba en un máximo local."
		}),
		result.relations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg text-fg",
				children: "Relaciones"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: result.relations.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-fg",
						children: [
							hit.source,
							" → ",
							hit.target
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							" ",
							"· ",
							hit.rel,
							" · ",
							pct(hit.confidence),
							hit.agrees ? "" : " · no coincide con la regla"
						]
					})]
				}, `${hit.source}-${hit.target}-${hit.rel}`))
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg text-fg",
				children: "Lectura"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-sm text-muted",
				children: result.suggestions.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm text-fg disabled:opacity-40",
					disabled: !polesLeft || stale,
					onClick: onComplete,
					children: "Completar polos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm text-fg disabled:opacity-40",
					disabled: stale,
					onClick: onOrder,
					children: "Ordenar por la unidad"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-sm text-fg",
					onClick: onCopy,
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "size-4",
						"aria-hidden": "true"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
						className: "size-4",
						"aria-hidden": "true"
					}), copied ? "Copiado" : "Copiar protocolo"]
				})
			]
		})
	] });
}
function PhaseBoard({ result }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 space-y-3",
		children: ["adv", "ret"].map((phase) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-lg text-fg",
			children: [
				PHASE_META[phase].label,
				" · ",
				PHASE_META[phase].flow
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 grid grid-cols-3 gap-2",
			children: [
				0,
				1,
				2
			].map((position) => {
				const group = result.assignments.filter((step) => step.role.phase === phase && step.role.position === position);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 rounded-md bg-raised p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							position === 1 ? "0" : PHASE_META[phase].arrow,
							" ",
							PERSPECTIVE[position].label
						]
					}), group.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "vacío"
					}) : group.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm break-words text-fg",
						children: step.name
					}, step.id))]
				}, position);
			})
		})] }, phase))
	});
}
function Pole({ phase, position, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted",
			children: [
				position === 1 ? "0" : PHASE_META[phase].arrow,
				" ",
				PERSPECTIVE[position].id
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm break-words text-fg",
			children: label
		})]
	});
}
function Meter({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex justify-between text-xs text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg tabular-nums",
			children: Math.round(value * 100)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 overflow-hidden rounded-full bg-raised",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-primary",
			style: { width: `${Math.max(0, Math.min(100, value * 100))}%` }
		})
	})] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-raised px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-lg text-fg tabular-nums",
			children: value
		})]
	});
}
function Confusion({ matrix }) {
	const labels = [
		"ninguna",
		"mirrorOf",
		"creates"
	];
	if (!matrix) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted",
		children: "Aparece al terminar el entreno."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 grid grid-cols-4 gap-2 text-center text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			labels.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: label
			}, label)),
			matrix.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "contents",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-left text-muted",
					children: labels[rowIndex]
				}), row.map((cell, colIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md py-3 tabular-nums " + (rowIndex === colIndex ? "bg-primary text-on-primary" : "bg-raised text-fg"),
					children: cell
				}, `${rowIndex}-${colIndex}`))]
			}, labels[rowIndex]))
		]
	});
}
function ChartTip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-line bg-bg px-3 py-2 text-xs text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-muted",
			children: ["Época ", label]
		}), payload.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			item.name,
			": ",
			typeof item.value === "number" ? pct(item.value) : "—"
		] }, item.name))]
	});
}
function pct(value) {
	return `${Math.round(value * 100)}%`;
}
var SplitComponent = Studio;
//#endregion
export { SplitComponent as component };
