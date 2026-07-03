import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import type { TabView } from "@/lib/types/tournament";

export async function exportPdf(
  element: HTMLElement,
  filename: string,
  tab: TabView
): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = dataUrl;
  });

  const isBracket = tab === "bracket";
  const orientation = isBracket ? "landscape" : "portrait";
  const format = isBracket ? "a3" : "a4";

  const pdf = new jsPDF({ orientation, unit: "mm", format });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;

  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;
  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  const x = (pageWidth - w) / 2;
  const y = (pageHeight - h) / 2;

  pdf.addImage(dataUrl, "PNG", x, y, w, h);
  pdf.save(filename);
}

export function exportPrint(): void {
  window.print();
}
