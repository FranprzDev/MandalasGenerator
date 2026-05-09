"use client";

import type { MandalaSpec } from "@/types/mandala";

interface Props {
  spec: MandalaSpec;
  strokeWidth: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function MandalaCanvas({ spec, strokeWidth, svgRef }: Props) {
  return (
    <svg
      ref={svgRef}
      viewBox={spec.viewBox}
      role="img"
      aria-label="Mandala generada"
      className="mandala-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#ffffff" />
      {spec.layers.map((layer) =>
        layer.paths.map((path, idx) => (
          <path
            key={`${layer.ringIndex}-${idx}`}
            d={path}
            stroke="#000000"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )),
      )}
    </svg>
  );
}
