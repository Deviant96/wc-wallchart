import type { FeedTarget } from "@/lib/types/tournament";

/** Standard knockout bracket wiring by FIFA match number */
export function buildAdvanceMap(): Record<number, FeedTarget[]> {
  const map: Record<number, FeedTarget[]> = {};

  const link = (from: number, to: number, slot: "home" | "away") => {
    const matchId = `m-${to}`;
    if (!map[from]) map[from] = [];
    map[from].push({ matchId, slot });
  };

  // Round of 32 (73-88) → Round of 16 (89-96)
  for (let i = 0; i < 8; i++) {
    const r32a = 73 + i * 2;
    const r32b = 74 + i * 2;
    const r16 = 89 + i;
    link(r32a, r16, "home");
    link(r32b, r16, "away");
  }

  // Round of 16 (89-96) → Quarter-finals (97-100)
  for (let i = 0; i < 4; i++) {
    const r16a = 89 + i * 2;
    const r16b = 90 + i * 2;
    const qf = 97 + i;
    link(r16a, qf, "home");
    link(r16b, qf, "away");
  }

  // Quarter-finals → Semi-finals
  link(97, 101, "home");
  link(98, 101, "away");
  link(99, 102, "home");
  link(100, 102, "away");

  // Semi-finals → Final (winners)
  link(101, 104, "home");
  link(102, 104, "away");

  // Semi-finals → Third place (losers handled in store logic)
  return map;
}

export const ADVANCE_MAP = buildAdvanceMap();

export const KNOCKOUT_PHASES = [
  "last-32",
  "round-of-16",
  "quarter-finals",
  "semi-finals",
  "third-place-play-off",
  "final",
] as const;

export const PHASE_LABELS: Record<string, string> = {
  "last-32": "Round of 32",
  "round-of-16": "Round of 16",
  "quarter-finals": "Quarter-finals",
  "semi-finals": "Semi-finals",
  "third-place-play-off": "Third Place",
  final: "Final",
};
