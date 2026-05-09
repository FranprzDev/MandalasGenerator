import { createMotif } from "./motifs";
import { createRng } from "./random";
import { DEFAULT_DIVERSITY_POLICY, isDiverseEnough } from "./diversity";
import type {
  ComplexityProfile,
  GenerationInput,
  GenerationResult,
  MandalaFingerprint,
  MandalaSpec,
  MotifId,
} from "@/types/mandala";

const motifSet: MotifId[] = ["petal", "arc", "star", "dot", "leaf", "teardrop"];

function profileConfig(profile: ComplexityProfile) {
  switch (profile) {
    case "simple":
      return { sectorsMin: 8, sectorsMax: 12, layersMin: 6, layersMax: 9 };
    case "dense":
      return { sectorsMin: 16, sectorsMax: 26, layersMin: 10, layersMax: 15 };
    default:
      return { sectorsMin: 12, sectorsMax: 18, layersMin: 8, layersMax: 12 };
  }
}

function hashVector(vector: number[]): string {
  return vector.map((n) => n.toFixed(3)).join("|");
}

function buildFingerprint(spec: Omit<MandalaSpec, "fingerprint">): MandalaFingerprint {
  const vector = [
    spec.stats.sectors / 30,
    spec.stats.layers / 20,
    spec.layers.filter((l) => l.motif === "petal").length / spec.layers.length,
    spec.layers.filter((l) => l.motif === "arc").length / spec.layers.length,
    spec.layers.filter((l) => l.motif === "star").length / spec.layers.length,
    spec.layers.filter((l) => l.motif === "dot").length / spec.layers.length,
  ];
  return { vector, hash: hashVector(vector) };
}

export function generateMandala(input: GenerationInput): MandalaSpec {
  const rng = createRng(input.seed);
  const cfg = profileConfig(input.profile);
  const sectors = rng.int(cfg.sectorsMin, cfg.sectorsMax);
  const layersCount = rng.int(cfg.layersMin, cfg.layersMax);
  const half = input.size / 2;
  const maxR = half * 0.92;
  const step = maxR / layersCount;
  const layers = [] as MandalaSpec["layers"];

  for (let ring = 0; ring < layersCount; ring += 1) {
    const innerR = ring * step + step * 0.25;
    const outerR = (ring + 1) * step;
    const motif = rng.pick(motifSet);
    const paths: string[] = [];
    const span = 360 / sectors;

    for (let s = 0; s < sectors; s += 1) {
      const startAngle = s * span + rng.float(-1.2, 1.2);
      const endAngle = (s + 1) * span + rng.float(-1.2, 1.2);
      paths.push(...createMotif(motif, { cx: half, cy: half, innerR, outerR, startAngle, endAngle }));
    }

    layers.push({ ringIndex: ring, innerR, outerR, sectors, motif, paths });
  }

  const draft = {
    id: `${input.seed}-${Date.now()}`,
    seed: input.seed,
    viewBox: `0 0 ${input.size} ${input.size}`,
    layers,
    stats: {
      motifsUsed: Array.from(new Set(layers.map((l) => l.motif))),
      sectors,
      layers: layersCount,
    },
  } satisfies Omit<MandalaSpec, "fingerprint">;

  return {
    ...draft,
    fingerprint: buildFingerprint(draft),
  };
}

export function generateUniqueMandala(
  input: Omit<GenerationInput, "seed"> & { createSeed: () => number },
  history: MandalaFingerprint[],
): GenerationResult {
  let attempts = 0;
  let rejected = 0;
  let best = generateMandala({ ...input, seed: input.createSeed() });

  while (attempts < DEFAULT_DIVERSITY_POLICY.maxAttempts) {
    attempts += 1;
    const candidate = generateMandala({ ...input, seed: input.createSeed() });
    if (isDiverseEnough(candidate.fingerprint, history, DEFAULT_DIVERSITY_POLICY)) {
      return { spec: candidate, attempts, rejected };
    }
    rejected += 1;
    best = candidate;
  }

  return { spec: best, attempts, rejected };
}
