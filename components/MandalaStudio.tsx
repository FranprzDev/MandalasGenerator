"use client";

import { useMemo, useRef, useState } from "react";
import { MandalaCanvas } from "@/components/MandalaCanvas";
import { pushHistory, DEFAULT_DIVERSITY_POLICY } from "@/lib/mandala/diversity";
import { generateUniqueMandala } from "@/lib/mandala/generator";
import { createRandomSeed } from "@/lib/mandala/random";
import { exportAndDownload, exportBatchAndDownload } from "@/lib/export/pdf";
import type { MandalaFingerprint, MandalaSpec } from "@/types/mandala";

function createInitialMandala() {
  return generateUniqueMandala(
    {
      profile: "medium",
      size: 1200,
      strokeBase: 1,
      createSeed: createRandomSeed,
    },
    [],
  );
}

export function MandalaStudio() {
  const initial = useMemo(() => createInitialMandala(), []);
  const [mandala, setMandala] = useState<MandalaSpec | null>(initial.spec);
  const [history, setHistory] = useState<MandalaFingerprint[]>([initial.spec.fingerprint]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const strokeWidth = 1.0;

  const generate = async () => {
    setErrorMessage(null);
    setIsGenerating(true);
    try {
      const result = generateUniqueMandala(
        {
          profile: "medium",
          size: 1200,
          strokeBase: strokeWidth,
          createSeed: createRandomSeed,
        },
        history,
      );
      setMandala(result.spec);
      setHistory((prev) => pushHistory(prev, result.spec.fingerprint, DEFAULT_DIVERSITY_POLICY));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al generar la mandala.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPdf = async () => {
    if (!svgRef.current) return;
    setErrorMessage(null);
    setIsExporting(true);
    try {
      await exportAndDownload(svgRef.current, {
        page: "A4",
        orientation: "portrait",
        marginMm: 10,
        mode: "vector-first",
        filename: `mandala-${mandala?.seed ?? "random"}.pdf`,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo exportar el PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadBatchPdf = async () => {
    setErrorMessage(null);
    setIsExporting(true);
    try {
      const batchHistory = [...history];
      const batch: MandalaSpec[] = [];

      for (let i = 0; i < 10; i += 1) {
        const result = generateUniqueMandala(
          {
            profile: "medium",
            size: 1200,
            strokeBase: strokeWidth,
            createSeed: createRandomSeed,
          },
          batchHistory,
        );
        batch.push(result.spec);
        batchHistory.push(result.spec.fingerprint);
      }

      await exportBatchAndDownload(batch, {
        page: "A4",
        orientation: "portrait",
        marginMm: 10,
        mode: "raster-only",
        filename: `mandalas-10-${Date.now()}.pdf`,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo exportar el PDF de 10 mandalas.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Mandalas Generator</h1>

        <div className="actions">
          <button className="btn-primary" type="button" onClick={generate} disabled={isGenerating || isExporting}>
            {isGenerating ? "Generando..." : "Generar nueva mandala"}
          </button>
          <button className="btn-dark" type="button" onClick={downloadPdf} disabled={!mandala || isGenerating || isExporting}>
            {isExporting ? "Exportando..." : "Descargar PDF"}
          </button>
          <button className="btn-dark" type="button" onClick={downloadBatchPdf} disabled={isGenerating || isExporting}>
            {isExporting ? "Exportando..." : "Descargar PDF x10"}
          </button>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="canvas-wrap">{mandala && <MandalaCanvas spec={mandala} strokeWidth={strokeWidth} svgRef={svgRef} />}</div>
      </section>
    </main>
  );
}
