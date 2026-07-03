import type { Options } from "html-to-image/lib/types";

/** Shared html-to-image options — skipFonts avoids Geist/next/font embed crashes */
export const CAPTURE_OPTIONS: Options = {
  cacheBust: true,
  pixelRatio: 2,
  backgroundColor: "#ffffff",
  skipFonts: true,
};

export function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        })
    )
  ).then(() => undefined);
}
