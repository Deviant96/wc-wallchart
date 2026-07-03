"use client";

import type { Match, Team } from "@/lib/types/tournament";
import { flagUrl } from "@/lib/utils/flags";

interface GroupMatchListProps {
  group: string;
  matches: Record<string, Match>;
  teams: Record<string, Team>;
  onEditMatch: (id: string) => void;
}

export function GroupMatchList({
  group,
  matches,
  teams,
  onEditMatch,
}: GroupMatchListProps) {
  const groupMatches = Object.values(matches)
    .filter((m) => m.phase === "group" && m.group === group)
    .sort((a, b) => a.num - b.num);

  return (
    <div className="space-y-1 border-t border-zinc-200 pt-2">
      {groupMatches.map((match) => {
        const home = match.homeTeamId ? teams[match.homeTeamId] : null;
        const away = match.awayTeamId ? teams[match.awayTeamId] : null;
        const hasScore =
          match.homeScore !== null && match.awayScore !== null;

        return (
          <button
            key={match.id}
            onClick={() => onEditMatch(match.id)}
            className="flex w-full items-center gap-1 rounded px-1 py-1 text-left text-[11px] hover:bg-white"
          >
            <span className="w-12 shrink-0 text-zinc-400">
              {match.date?.slice(5).replace("-", "/") ?? "—"}
            </span>
            <span className="flex flex-1 items-center justify-end gap-1 truncate">
              {home ? (
                <>
                  {flagUrl(home.code) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={flagUrl(home.code)!}
                      alt=""
                      className="h-3 w-4 object-cover"
                    />
                  ) : null}
                  <span className="truncate">{home.name}</span>
                </>
              ) : (
                <span className="italic text-zinc-400">TBD</span>
              )}
            </span>
            <span className="w-10 shrink-0 text-center font-mono font-bold">
              {hasScore ? `${match.homeScore}-${match.awayScore}` : "vs"}
            </span>
            <span className="flex flex-1 items-center gap-1 truncate">
              {away ? (
                <>
                  {flagUrl(away.code) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={flagUrl(away.code)!}
                      alt=""
                      className="h-3 w-4 object-cover"
                    />
                  ) : null}
                  <span className="truncate">{away.name}</span>
                </>
              ) : (
                <span className="italic text-zinc-400">TBD</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
