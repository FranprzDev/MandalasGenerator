export type ComplexityProfile = "simple" | "medium" | "dense";

export type MotifId = "petal" | "arc" | "star" | "dot" | "leaf" | "teardrop";

export interface GenerationInput {
  seed: number;
  profile: ComplexityProfile;
  size: number;
  strokeBase: number;
}

export interface LayerSpec {
  ringIndex: number;
  innerR: number;
  outerR: number;
  sectors: number;
  motif: MotifId;
  paths: string[];
}

export interface MandalaFingerprint {
  hash: string;
  vector: number[];
}

export interface MandalaSpec {
  id: string;
  seed: number;
  viewBox: string;
  layers: LayerSpec[];
  stats: {
    motifsUsed: MotifId[];
    sectors: number;
    layers: number;
  };
  fingerprint: MandalaFingerprint;
}

export interface DiversityPolicy {
  historySize: number;
  similarityThreshold: number;
  maxAttempts: number;
}

export interface GenerationResult {
  spec: MandalaSpec;
  attempts: number;
  rejected: number;
}

export interface ExportOptions {
  page: "A4";
  orientation: "portrait";
  marginMm: number;
  mode: "vector-first" | "raster-only";
  filename?: string;
}
