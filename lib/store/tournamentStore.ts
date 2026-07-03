import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createInitialState, getSeedData } from "@/lib/data/seed";
import { fetchOpenFootball } from "@/lib/data/importers/openFootball";
import { fetchWhenIsKickoff } from "@/lib/data/importers/whenIsKickoff";
import type {
  Match,
  MatchSlot,
  TabView,
  Team,
  TournamentState,
} from "@/lib/types/tournament";

interface TournamentActions {
  setActiveTab: (tab: TabView) => void;
  setAutoAdvance: (value: boolean) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  setMatchScore: (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null
  ) => void;
  setMatchTeam: (matchId: string, slot: MatchSlot, teamId: string | null) => void;
  assignTeamToSlot: (matchId: string, slot: MatchSlot, teamId: string) => void;
  addTeam: (name: string, code?: string, group?: string) => string;
  openMatchEditor: (matchId: string | null) => void;
  fetchLiveData: (source: "wheniskickoff" | "openfootball", overwrite?: boolean) => Promise<void>;
  resetToSeed: () => void;
  getTeam: (id: string | null) => Team | undefined;
  getMatch: (id: string) => Match | undefined;
}

interface TournamentStore extends TournamentState {
  editingMatchId: string | null;
  isFetching: boolean;
  fetchError: string | null;
  actions: TournamentActions;
}

function getWinnerTeamId(match: Match): string | null {
  if (match.homeScore === null || match.awayScore === null) return null;
  if (match.homeScore > match.awayScore) return match.homeTeamId;
  if (match.awayScore > match.homeScore) return match.awayTeamId;
  return null;
}

function applyAutoAdvance(
  matches: Record<string, Match>,
  match: Match,
  autoAdvance: boolean
): Record<string, Match> {
  if (!autoAdvance || match.phase === "group") return matches;

  const winnerId = getWinnerTeamId(match);
  if (!winnerId || !match.feedsInto?.length) return matches;

  const updated = { ...matches };
  for (const target of match.feedsInto) {
    const targetMatch = updated[target.matchId];
    if (!targetMatch) continue;
    updated[target.matchId] = {
      ...targetMatch,
      ...(target.slot === "home"
        ? { homeTeamId: winnerId }
        : { awayTeamId: winnerId }),
    };
  }
  return updated;
}

function mergeTournamentData(
  current: TournamentState,
  incoming: Pick<TournamentState, "teams" | "matches" | "matchOrder">,
  overwrite: boolean,
  source: TournamentState["dataSource"]
): Partial<TournamentState> {
  if (overwrite) {
    return {
      teams: incoming.teams,
      matches: incoming.matches,
      matchOrder: incoming.matchOrder,
      dataSource: source,
      lastFetchedAt: new Date().toISOString(),
    };
  }

  const teams = { ...current.teams, ...incoming.teams };
  const matches = { ...current.matches };

  for (const [id, incomingMatch] of Object.entries(incoming.matches)) {
    const existing = matches[id];
    if (!existing) {
      matches[id] = incomingMatch;
      continue;
    }
    matches[id] = {
      ...incomingMatch,
      homeTeamId: existing.homeTeamId ?? incomingMatch.homeTeamId,
      awayTeamId: existing.awayTeamId ?? incomingMatch.awayTeamId,
      homeScore: existing.homeScore ?? incomingMatch.homeScore,
      awayScore: existing.awayScore ?? incomingMatch.awayScore,
      date: existing.date ?? incomingMatch.date,
      timeUtc: existing.timeUtc ?? incomingMatch.timeUtc,
      penaltyNote: existing.penaltyNote,
    };
  }

  return {
    teams,
    matches,
    matchOrder: incoming.matchOrder,
    dataSource: source,
    lastFetchedAt: new Date().toISOString(),
  };
}

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      editingMatchId: null,
      isFetching: false,
      fetchError: null,

      actions: {
        setActiveTab: (tab) => set({ activeTab: tab }),

        setAutoAdvance: (value) => set({ autoAdvance: value }),

        getTeam: (id) => (id ? get().teams[id] : undefined),

        getMatch: (id) => get().matches[id],

        openMatchEditor: (matchId) => set({ editingMatchId: matchId }),

        updateMatch: (matchId, updates) => {
          set((state) => {
            const match = state.matches[matchId];
            if (!match) return state;

            let matches = {
              ...state.matches,
              [matchId]: { ...match, ...updates },
            };

            const updatedMatch = matches[matchId];
            if (
              updates.homeScore !== undefined ||
              updates.awayScore !== undefined
            ) {
              matches = applyAutoAdvance(matches, updatedMatch, state.autoAdvance);
            }

            return { matches };
          });
        },

        setMatchScore: (matchId, homeScore, awayScore) => {
          get().actions.updateMatch(matchId, { homeScore, awayScore });
        },

        setMatchTeam: (matchId, slot, teamId) => {
          get().actions.updateMatch(matchId, {
            ...(slot === "home" ? { homeTeamId: teamId } : { awayTeamId: teamId }),
          });
        },

        assignTeamToSlot: (matchId, slot, teamId) => {
          get().actions.setMatchTeam(matchId, slot, teamId);
        },

        addTeam: (name, code, group) => {
          const id = `team-custom-${Date.now()}`;
          const team: Team = {
            id,
            code: code?.toUpperCase() ?? name.slice(0, 3).toUpperCase(),
            name,
            group,
          };
          set((state) => ({
            teams: { ...state.teams, [id]: team },
            dataSource: "manual",
          }));
          return id;
        },

        fetchLiveData: async (source, overwrite = false) => {
          set({ isFetching: true, fetchError: null });
          try {
            const data =
              source === "wheniskickoff"
                ? await fetchWhenIsKickoff()
                : await fetchOpenFootball();

            set((state) => ({
              ...mergeTournamentData(state, data, overwrite, source),
              isFetching: false,
            }));
          } catch (err) {
            set({
              isFetching: false,
              fetchError: err instanceof Error ? err.message : "Fetch failed",
            });
          }
        },

        resetToSeed: () => {
          const seed = getSeedData();
          set({
            ...seed,
            autoAdvance: get().autoAdvance,
            activeTab: get().activeTab,
            lastFetchedAt: null,
            dataSource: "seed",
            editingMatchId: null,
            fetchError: null,
          });
        },
      },
    }),
    {
      name: "wc2026-wallchart",
      partialize: (state) => ({
        teams: state.teams,
        matches: state.matches,
        matchOrder: state.matchOrder,
        autoAdvance: state.autoAdvance,
        activeTab: state.activeTab,
        lastFetchedAt: state.lastFetchedAt,
        dataSource: state.dataSource,
      }),
    }
  )
);

export const useTournamentActions = () =>
  useTournamentStore((s) => s.actions);

export const useActiveTab = () => useTournamentStore((s) => s.activeTab);
export const useAutoAdvance = () => useTournamentStore((s) => s.autoAdvance);
export const useEditingMatchId = () =>
  useTournamentStore((s) => s.editingMatchId);
export const useIsFetching = () => useTournamentStore((s) => s.isFetching);
export const useFetchError = () => useTournamentStore((s) => s.fetchError);
