/** Rows per wing (half-bracket) */
export const WING_SLOTS = 8;
export const GUTTER_W = 32;

export function pairRowSpan(slotsPerMatch: number): number {
  return slotsPerMatch * 2;
}

export function chunkPairs<T>(items: T[]): [T, T | undefined][] {
  const pairs: [T, T | undefined][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i], items[i + 1]]);
  }
  return pairs;
}

/** Vertical centre in slot units (0–WING_SLOTS) for SVG viewBox */
export function matchCenterSlot(index: number, matchCount: number): number {
  const span = WING_SLOTS / matchCount;
  return index * span + span / 2;
}

/** @deprecated use matchCenterSlot with fluid SVG */
export function matchCenterY(index: number, matchCount: number, slotPx: number): number {
  return matchCenterSlot(index, matchCount) * slotPx;
}

export function gridRowStyle(index: number, matchCount: number) {
  const span = WING_SLOTS / matchCount;
  const startRow = index * span + 1;
  return { gridRow: `${startRow} / span ${span}` };
}

export function splitHalf<T>(matches: T[], side: "left" | "right"): T[] {
  const mid = Math.ceil(matches.length / 2);
  const half = side === "left" ? matches.slice(0, mid) : matches.slice(mid);
  return side === "right" ? [...half].reverse() : half;
}

export function isDenseCount(matchCount: number): boolean {
  return matchCount >= 4;
}

/** Extra vertical padding class for dense rounds */
export function denseGapClass(matchCount: number): string {
  if (matchCount >= 8) return "py-2";
  if (matchCount >= 4) return "py-3";
  return "";
}
