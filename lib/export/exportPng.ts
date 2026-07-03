import { toPng } from "html-to-image";
import { CAPTURE_OPTIONS } from "@/lib/export/captureOptions";
import { withCompactLayout } from "@/lib/export/compactLayout";

export async function exportPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  await withCompactLayout(element, async () => {
    const dataUrl = await toPng(element, CAPTURE_OPTIONS);

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  });
}
