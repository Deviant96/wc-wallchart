import teamsRaw from "@/lib/data/seed/teams-raw.json";
import matchesRaw from "@/lib/data/seed/matches-raw.json";
import { loadSeedFromRaw } from "@/lib/data/importers/whenIsKickoff";
import type { TournamentState } from "@/lib/types/tournament";

export function getSeedData(): Pick<
  TournamentState,
  "teams" | "matches" | "matchOrder"
> {
  return loadSeedFromRaw(
    teamsRaw as Parameters<typeof loadSeedFromRaw>[0],
    matchesRaw as Parameters<typeof loadSeedFromRaw>[1]
  );
}

export function createInitialState(): TournamentState {
  const seed = getSeedData();
  return {
    ...seed,
    autoAdvance: true,
    activeTab: "groups",
    lastFetchedAt: null,
    dataSource: "seed",
  };
}
