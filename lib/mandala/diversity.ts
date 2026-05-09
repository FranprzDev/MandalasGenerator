import type { DiversityPolicy, MandalaFingerprint } from "@/types/mandala";

export const DEFAULT_DIVERSITY_POLICY: DiversityPolicy = {
  historySize: 30,
  similarityThreshold: 0.88,
  maxAttempts: 12,
};

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function isDiverseEnough(
  candidate: MandalaFingerprint,
  history: MandalaFingerprint[],
  policy: DiversityPolicy = DEFAULT_DIVERSITY_POLICY,
): boolean {
  return history.every((entry) => cosineSimilarity(candidate.vector, entry.vector) < policy.similarityThreshold);
}

export function pushHistory(
  history: MandalaFingerprint[],
  fingerprint: MandalaFingerprint,
  policy: DiversityPolicy = DEFAULT_DIVERSITY_POLICY,
): MandalaFingerprint[] {
  const next = [...history, fingerprint];
  return next.slice(-policy.historySize);
}
