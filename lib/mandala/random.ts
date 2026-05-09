import seedrandom from "seedrandom";

export function createRng(seed: number) {
  const rand = seedrandom(String(seed));
  return {
    float(min = 0, max = 1) {
      return min + rand() * (max - min);
    },
    int(min: number, max: number) {
      return Math.floor(this.float(min, max + 1));
    },
    pick<T>(values: T[]): T {
      return values[this.int(0, values.length - 1)];
    },
  };
}

export function createRandomSeed(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0];
}
