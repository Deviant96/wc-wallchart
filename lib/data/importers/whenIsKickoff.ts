import { ADVANCE_MAP } from "@/lib/bracket/advanceMap";
import type { Match, Phase, Team, TournamentState } from "@/lib/types/tournament";

interface WIKTeam {
  code: string;
  name: string;
  flag?: string;
  group?: string;
}

interface WIKMatch {
  num: number;
  date: string;
  time_utc: string;
  home: string | null;
  away: string | null;
  home_name?: string;
  away_name?: string;
  group: string | null;
  phase: string;
  venue_name?: string;
  venue_city?: string;
  label?: string;
  score_home?: number | null;
  score_away?: number | null;
}

interface WIKTeamsResponse {
  data: WIKTeam[];
}

interface WIKMatchesResponse {
  data: WIKMatch[];
}

function normalizePhase(phase: string): Phase {
  const map: Record<string, Phase> = {
    group: "group",
    "last-32": "last-32",
    "round-of-16": "round-of-16",
    "quarter-finals": "quarter-finals",
    "semi-finals": "semi-finals",
    "third-place-play-off": "third-place-play-off",
    final: "final",
  };
  return map[phase] ?? "group";
}

function teamIdFromCode(code: string): string {
  return `team-${code.toLowerCase()}`;
}

export function parseWhenIsKickoff(
  teamsData: WIKTeamsResponse,
  matchesData: WIKMatchesResponse
): Pick<TournamentState, "teams" | "matches" | "matchOrder"> {
  const teams: Record<string, Team> = {};

  for (const t of teamsData.data) {
    const id = teamIdFromCode(t.code);
    teams[id] = {
      id,
      code: t.code,
      name: t.name,
      flag: t.flag,
      group: t.group,
    };
  }

  const matches: Record<string, Match> = {};
  const matchOrder: string[] = [];

  for (const m of matchesData.data) {
    const id = `m-${m.num}`;
    const homeTeamId = m.home ? teamIdFromCode(m.home) : null;
    const awayTeamId = m.away ? teamIdFromCode(m.away) : null;

    if (m.home && m.home_name && !teams[teamIdFromCode(m.home)]) {
      const tid = teamIdFromCode(m.home);
      teams[tid] = { id: tid, code: m.home, name: m.home_name, group: m.group ?? undefined };
    }
    if (m.away && m.away_name && !teams[teamIdFromCode(m.away)]) {
      const tid = teamIdFromCode(m.away);
      teams[tid] = { id: tid, code: m.away, name: m.away_name, group: m.group ?? undefined };
    }

    const feedsInto = ADVANCE_MAP[m.num]?.map((f) => ({
      matchId: f.matchId,
      slot: f.slot,
    }));

    matches[id] = {
      id,
      num: m.num,
      phase: normalizePhase(m.phase),
      homeTeamId,
      awayTeamId,
      homeScore: m.score_home ?? null,
      awayScore: m.score_away ?? null,
      date: m.date,
      timeUtc: m.time_utc,
      venue: m.venue_name,
      venueCity: m.venue_city,
      group: m.group ?? undefined,
      label: m.label,
      feedsInto,
    };
    matchOrder.push(id);
  }

  return { teams, matches, matchOrder };
}

export async function fetchWhenIsKickoff(): Promise<
  Pick<TournamentState, "teams" | "matches" | "matchOrder">
> {
  const [teamsRes, matchesRes] = await Promise.all([
    fetch("https://wheniskickoff.com/data/v1/teams.json"),
    fetch("https://wheniskickoff.com/data/v1/matches.json"),
  ]);

  if (!teamsRes.ok || !matchesRes.ok) {
    throw new Error("Failed to fetch tournament data from wheniskickoff.com");
  }

  const teamsData = (await teamsRes.json()) as WIKTeamsResponse;
  const matchesData = (await matchesRes.json()) as WIKMatchesResponse;

  return parseWhenIsKickoff(teamsData, matchesData);
}

export function loadSeedFromRaw(
  teamsRaw: WIKTeamsResponse,
  matchesRaw: WIKMatchesResponse
): Pick<TournamentState, "teams" | "matches" | "matchOrder"> {
  return parseWhenIsKickoff(teamsRaw, matchesRaw);
}
