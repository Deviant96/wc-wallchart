import type { GroupStanding, Match, Team } from "@/lib/types/tournament";

export function calcStandingsForGroup(
  group: string,
  teams: Record<string, Team>,
  matches: Record<string, Match>
): GroupStanding[] {
  const groupTeams = Object.values(teams).filter((t) => t.group === group);
  const standings: Record<string, GroupStanding> = {};

  for (const team of groupTeams) {
    standings[team.id] = {
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    };
  }

  const groupMatches = Object.values(matches).filter(
    (m) => m.phase === "group" && m.group === group
  );

  for (const match of groupMatches) {
    if (
      match.homeScore === null ||
      match.awayScore === null ||
      !match.homeTeamId ||
      !match.awayTeamId
    ) {
      continue;
    }

    const home = standings[match.homeTeamId];
    const away = standings[match.awayTeamId];
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.gf += match.homeScore;
    home.ga += match.awayScore;
    away.gf += match.awayScore;
    away.ga += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (match.homeScore < match.awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }

  return Object.values(standings).map((s) => ({
    ...s,
    gd: s.gf - s.ga,
  }));
}

export function calcAllStandings(
  teams: Record<string, Team>,
  matches: Record<string, Match>
): Record<string, GroupStanding[]> {
  const groups = [...new Set(Object.values(teams).map((t) => t.group).filter(Boolean))] as string[];
  const result: Record<string, GroupStanding[]> = {};

  for (const group of groups.sort()) {
    result[group] = calcStandingsForGroup(group, teams, matches).sort(
      (a, b) =>
        b.points - a.points ||
        b.gd - a.gd ||
        b.gf - a.gf ||
        a.teamId.localeCompare(b.teamId)
    );
  }

  return result;
}
