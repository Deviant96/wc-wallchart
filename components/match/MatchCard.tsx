"use client";

import type { Match } from "@/lib/types/tournament";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { DroppableSlot } from "@/components/dnd/DroppableSlot";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  onEdit: () => void;
}

export function MatchCard({ match, compact, onEdit }: MatchCardProps) {
  const teams = useTournamentStore((s) => s.teams);
  const homeTeam = match.homeTeamId ? teams[match.homeTeamId] : undefined;
  const awayTeam = match.awayTeamId ? teams[match.awayTeamId] : undefined;

  const hasScore = match.homeScore !== null && match.awayScore !== null;
  const homeWinner = hasScore && match.homeScore! > match.awayScore!;
  const awayWinner = hasScore && match.awayScore! > match.homeScore!;

  const dateStr =
    match.date &&
    new Date(match.date + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className={`rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow ${
        compact ? "w-44 text-xs" : "w-52"
      }`}
    >
      <div
        className="cursor-pointer border-b border-zinc-100 px-2 py-1 text-[10px] text-zinc-500"
        onClick={onEdit}
      >
        {match.label ?? `Match ${match.num}`}
        {dateStr && (
          <span className="float-right">
            {dateStr}
            {match.timeUtc ? ` ${match.timeUtc}` : ""}
          </span>
        )}
      </div>

      <div className="space-y-0.5 p-1.5">
        <div className="flex items-center justify-between gap-1">
          <DroppableSlot
            matchId={match.id}
            slot="home"
            team={homeTeam}
            compact={compact}
            winner={homeWinner}
            onClick={onEdit}
          />
          {hasScore && (
            <span className="shrink-0 font-mono text-sm font-bold text-zinc-700">
              {match.homeScore}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1">
          <DroppableSlot
            matchId={match.id}
            slot="away"
            team={awayTeam}
            compact={compact}
            winner={awayWinner}
            onClick={onEdit}
          />
          {hasScore && (
            <span className="shrink-0 font-mono text-sm font-bold text-zinc-700">
              {match.awayScore}
            </span>
          )}
        </div>
      </div>

      {match.venue && !compact && (
        <div className="border-t border-zinc-100 px-2 py-1 text-[10px] text-zinc-400">
          {match.venue}
        </div>
      )}
    </div>
  );
}
