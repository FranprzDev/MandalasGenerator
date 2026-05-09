import { describe, expect, it } from "vitest";
import { cosineSimilarity, isDiverseEnough } from "@/lib/mandala/diversity";

describe("diversity", () => {
  it("computes cosine similarity", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });

  it("rejects highly similar candidates", () => {
    const candidate = { hash: "a", vector: [1, 0.5, 0.1] };
    const history = [{ hash: "b", vector: [0.99, 0.5, 0.1] }];
    expect(isDiverseEnough(candidate, history, { historySize: 30, similarityThreshold: 0.88, maxAttempts: 12 })).toBe(false);
  });
});
