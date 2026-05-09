import { describeArc, toCartesian } from "./geometry";
import type { MotifId } from "@/types/mandala";

interface MotifInput {
  cx: number;
  cy: number;
  innerR: number;
  outerR: number;
  startAngle: number;
  endAngle: number;
}

function petal({ cx, cy, innerR, outerR, startAngle, endAngle }: MotifInput): string[] {
  const mid = (startAngle + endAngle) / 2;
  const a = toCartesian(cx, cy, innerR, startAngle);
  const b = toCartesian(cx, cy, outerR, mid);
  const c = toCartesian(cx, cy, innerR, endAngle);
  return [
    `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${b.x.toFixed(2)} ${b.y.toFixed(2)} ${c.x.toFixed(2)} ${c.y.toFixed(2)} Q ${b.x.toFixed(2)} ${b.y.toFixed(2)} ${a.x.toFixed(2)} ${a.y.toFixed(2)}`,
  ];
}

function arc({ cx, cy, innerR, outerR, startAngle, endAngle }: MotifInput): string[] {
  const midR = innerR + (outerR - innerR) * 0.6;
  return [describeArc(cx, cy, midR, startAngle, endAngle)];
}

function star({ cx, cy, innerR, outerR, startAngle, endAngle }: MotifInput): string[] {
  const mid = (startAngle + endAngle) / 2;
  const a = toCartesian(cx, cy, innerR, startAngle);
  const b = toCartesian(cx, cy, outerR, mid);
  const c = toCartesian(cx, cy, innerR, endAngle);
  return [`M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)} L ${c.x.toFixed(2)} ${c.y.toFixed(2)} Z`];
}

function dot({ cx, cy, innerR, outerR, startAngle, endAngle }: MotifInput): string[] {
  const mid = (startAngle + endAngle) / 2;
  const pos = toCartesian(cx, cy, innerR + (outerR - innerR) * 0.5, mid);
  const r = Math.max((outerR - innerR) * 0.12, 1.5);
  return [
    `M ${(pos.x - r).toFixed(2)} ${pos.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(pos.x + r).toFixed(2)} ${pos.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(pos.x - r).toFixed(2)} ${pos.y.toFixed(2)}`,
  ];
}

function leaf({ cx, cy, innerR, outerR, startAngle, endAngle }: MotifInput): string[] {
  const mid = (startAngle + endAngle) / 2;
  const p0 = toCartesian(cx, cy, innerR, mid);
  const p1 = toCartesian(cx, cy, outerR, startAngle + 2);
  const p2 = toCartesian(cx, cy, outerR, endAngle - 2);
  return [
    `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} C ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
  ];
}

function teardrop({ cx, cy, innerR, outerR, startAngle, endAngle }: MotifInput): string[] {
  const mid = (startAngle + endAngle) / 2;
  const baseL = toCartesian(cx, cy, innerR, startAngle);
  const baseR = toCartesian(cx, cy, innerR, endAngle);
  const tip = toCartesian(cx, cy, outerR, mid);
  return [
    `M ${baseL.x.toFixed(2)} ${baseL.y.toFixed(2)} Q ${tip.x.toFixed(2)} ${tip.y.toFixed(2)} ${baseR.x.toFixed(2)} ${baseR.y.toFixed(2)} Q ${(tip.x * 0.98).toFixed(2)} ${(tip.y * 0.98).toFixed(2)} ${baseL.x.toFixed(2)} ${baseL.y.toFixed(2)}`,
  ];
}

export function createMotif(id: MotifId, input: MotifInput): string[] {
  switch (id) {
    case "petal":
      return petal(input);
    case "arc":
      return arc(input);
    case "star":
      return star(input);
    case "dot":
      return dot(input);
    case "leaf":
      return leaf(input);
    case "teardrop":
      return teardrop(input);
    default:
      return petal(input);
  }
}
