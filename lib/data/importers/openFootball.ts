import { ADVANCE_MAP } from "@/lib/bracket/advanceMap";
import type { Match, Phase, Team, TournamentState } from "@/lib/types/tournament";

interface OFMatch {
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: { ft: [number, number] };
  group?: string;
  ground?: string;
}

interface OFResponse {
  name: string;
  matches: OFMatch[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function teamIdFromName(name: string): string {
  return `team-${slugify(name)}`;
}

function parsePhase(round: string): Phase {
  const r = round.toLowerCase();
  if (r.includes("matchday")) return "group";
  if (r.includes("round of 32")) return "last-32";
  if (r.includes("round of 16") || r.includes("8th final")) return "round-of-16";
  if (r.includes("quarter")) return "quarter-finals";
  if (r.includes("semi")) return "semi-finals";
  if (r.includes("3rd") || r.includes("third")) return "third-place-play-off";
  if (r.includes("final")) return "final";
  return "group";
}

function extractGroup(group?: string): string | undefined {
  if (!group) return undefined;
  const match = group.match(/Group\s+([A-L])/i);
  return match ? match[1].toUpperCase() : undefined;
}

export function parseOpenFootball(data: OFResponse): Pick<
  TournamentState,
  "teams" | "matches" | "matchOrder"
> {
  const teams: Record<string, Team> = {};
  const matches: Record<string, Match> = {};
  const matchOrder: string[] = [];
  let num = 0;

  for (const m of data.matches) {
    num++;
    const id = `m-${num}`;
    const homeId = teamIdFromName(m.team1);
    const awayId = teamIdFromName(m.team2);
    const group = extractGroup(m.group);

    if (!teams[homeId]) {
      teams[homeId] = {
        id: homeId,
        code: homeId.replace("team-", "").slice(0, 3).toUpperCase(),
        name: m.team1,
        group,
      };
    }
    if (!teams[awayId]) {
      teams[awayId] = {
        id: awayId,
        code: awayId.replace("team-", "").slice(0, 3).toUpperCase(),
        name: m.team2,
        group,
      };
    }

    matches[id] = {
      id,
      num,
      phase: parsePhase(m.round),
      homeTeamId: homeId,
      awayTeamId: awayId,
      homeScore: m.score?.ft?.[0] ?? null,
      awayScore: m.score?.ft?.[1] ?? null,
      date: m.date,
      timeUtc: m.time?.split(" ")[0] ?? null,
      venue: m.ground,
      group,
      feedsInto: ADVANCE_MAP[num]?.map((f) => ({ matchId: f.matchId, slot: f.slot })),
    };
    matchOrder.push(id);
  }

  return { teams, matches, matchOrder };
}

export async function fetchOpenFootball(): Promise<
  Pick<TournamentState, "teams" | "matches" | "matchOrder">
> {
  const res = await fetch(
    "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
  );
  if (!res.ok) throw new Error("Failed to fetch openfootball data");
  const data = (await res.json()) as OFResponse;
  return parseOpenFootball(data);
}
