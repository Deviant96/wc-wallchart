import { toPng } from "html-to-image";
import { withCompactLayout } from "@/lib/export/compactLayout";

export async function exportPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  await withCompactLayout(element, async () => {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  });
}
