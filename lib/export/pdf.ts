import type { ExportOptions } from "@/types/mandala";

const MM_TO_PT = 72 / 25.4;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportRaster(svgEl: SVGSVGElement, options: ExportOptions): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const { Canvg } = await import("canvg");

  const dpi = 300;
  const widthPx = Math.round((A4_WIDTH_MM / 25.4) * dpi);
  const heightPx = Math.round((A4_HEIGHT_MM / 25.4) * dpi);
  const marginPx = Math.round((options.marginMm / 25.4) * dpi);
  const square = Math.min(widthPx - marginPx * 2, heightPx - marginPx * 2);

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear canvas context.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, widthPx, heightPx);

  const source = new XMLSerializer().serializeToString(svgEl);
  const wrapped = `<svg xmlns="http://www.w3.org/2000/svg" width="${square}" height="${square}" viewBox="${svgEl.getAttribute("viewBox")}">${source.replace("<svg", "<g").replace("</svg>", "</g>")}</svg>`;
  const v = await Canvg.fromString(ctx, wrapped);
  ctx.save();
  ctx.translate((widthPx - square) / 2, (heightPx - square) / 2);
  await v.render();
  ctx.restore();

  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(img, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

  return pdf.output("blob");
}

export async function exportMandalaPdf(svgEl: SVGSVGElement, options: ExportOptions): Promise<Blob> {
  if (options.mode === "raster-only") return exportRaster(svgEl, options);

  try {
    const [{ jsPDF }, svg2pdfModule] = await Promise.all([import("jspdf"), import("svg2pdf.js")]);
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const marginPt = options.marginMm * MM_TO_PT;
    const pageWidth = A4_WIDTH_MM * MM_TO_PT;
    const pageHeight = A4_HEIGHT_MM * MM_TO_PT;
    const targetSide = Math.min(pageWidth - marginPt * 2, pageHeight - marginPt * 2);
    const x = (pageWidth - targetSide) / 2;
    const y = (pageHeight - targetSide) / 2;

    const svg2pdf = (svg2pdfModule as unknown as { svg2pdf: Function }).svg2pdf;
    await svg2pdf(svgEl, pdf, { x, y, width: targetSide, height: targetSide });

    return pdf.output("blob");
  } catch {
    return exportRaster(svgEl, options);
  }
}

export async function exportAndDownload(svgEl: SVGSVGElement, options: ExportOptions): Promise<void> {
  const blob = await exportMandalaPdf(svgEl, options);
  downloadBlob(blob, options.filename ?? "mandala-a4.pdf");
}
