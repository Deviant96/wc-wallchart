import { waitForImages } from "@/lib/export/captureOptions";

export const COMPACT_CLASS = "wallchart-compact";

export async function withCompactLayout(
  element: HTMLElement,
  fn: () => Promise<void>
): Promise<void> {
  element.classList.add(COMPACT_CLASS);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await waitForImages(element);
  try {
    await fn();
  } finally {
    element.classList.remove(COMPACT_CLASS);
  }
}
