import { describe, expect, it } from "vitest";
import { generateMandala } from "@/lib/mandala/generator";

describe("generator", () => {
  it("generates stable output with same seed", () => {
    const a = generateMandala({ seed: 42, profile: "medium", size: 1200, strokeBase: 1 });
    const b = generateMandala({ seed: 42, profile: "medium", size: 1200, strokeBase: 1 });
    expect(a.fingerprint.hash).toBe(b.fingerprint.hash);
    expect(a.stats.layers).toBeGreaterThan(0);
    expect(a.stats.sectors).toBeGreaterThan(0);
  });
});
