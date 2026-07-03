"use client";

import type { Match } from "@/lib/types/tournament";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { DroppableSlot } from "@/components/dnd/DroppableSlot";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  bracket?: boolean;
  dense?: boolean;
  highlight?: "gold" | "bronze" | "default";
  onEdit: () => void;
}

export function MatchCard({
  match,
  compact,
  bracket,
  dense,
  highlight = "default",
  onEdit,
}: MatchCardProps) {
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

  const highlightStyles = {
    gold: "border-amber-400 bg-gradient-to-br from-amber-50 to-white ring-1 ring-amber-300/50 shadow-md shadow-amber-100",
    bronze: "border-orange-300 bg-gradient-to-br from-orange-50 to-white ring-1 ring-orange-200/50",
    default: bracket
      ? "border-emerald-200/80 bg-white shadow-sm shadow-emerald-100/50"
      : "border-zinc-200 bg-white shadow-sm",
  };

  const headerStyles = {
    gold: "border-amber-200 bg-gradient-to-r from-amber-600 to-amber-500 text-white",
    bronze: "border-orange-200 bg-gradient-to-r from-orange-500 to-amber-600 text-white",
    default: bracket
      ? "border-emerald-100 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white"
      : "border-zinc-100 bg-zinc-50 text-zinc-500",
  };

  const widthClass = dense ? "w-[164px]" : compact ? "w-44" : "w-52";
  const label = dense
    ? `M${match.num}`
    : (match.label ?? `Match ${match.num}`);

  return (
    <div
      className={`match-card max-h-full overflow-hidden rounded-lg border transition hover:shadow-md ${
        dense ? "text-[10px]" : compact ? "text-xs" : "text-sm"
      } ${widthClass} ${highlightStyles[highlight]}`}
    >
      <div
        className={`cursor-pointer truncate ${
          dense ? "px-1.5 py-0.5 text-[9px] leading-tight" : "px-2 py-1.5 text-[10px]"
        } font-medium ${headerStyles[highlight]}`}
        onClick={onEdit}
      >
        {label}
        {!dense && dateStr && (
          <span
            className={`mt-0.5 block text-[9px] ${highlight !== "default" ? "text-white/80" : ""}`}
          >
            {dateStr}
            {match.timeUtc ? ` · ${match.timeUtc}` : ""}
          </span>
        )}
      </div>

      <div className={dense ? "space-y-0 p-1" : "space-y-0.5 p-1.5"}>
        <div className="flex items-center justify-between gap-0.5">
          <DroppableSlot
            matchId={match.id}
            slot="home"
            team={homeTeam}
            compact
            winner={homeWinner}
            onClick={onEdit}
          />
          {hasScore && (
            <span
              className={`shrink-0 rounded bg-zinc-100 font-mono font-bold text-zinc-800 ${
                dense ? "px-1 text-[10px]" : "px-1.5 text-sm"
              }`}
            >
              {match.homeScore}
            </span>
          )}
        </div>
        {!dense && <div className="mx-1 border-t border-dashed border-zinc-200" />}
        <div className="flex items-center justify-between gap-0.5">
          <DroppableSlot
            matchId={match.id}
            slot="away"
            team={awayTeam}
            compact
            winner={awayWinner}
            onClick={onEdit}
          />
          {hasScore && (
            <span
              className={`shrink-0 rounded bg-zinc-100 font-mono font-bold text-zinc-800 ${
                dense ? "px-1 text-[10px]" : "px-1.5 text-sm"
              }`}
            >
              {match.awayScore}
            </span>
          )}
        </div>
      </div>

      {match.venue && !compact && !bracket && (
        <div className="border-t border-zinc-100 px-2 py-1 text-[10px] text-zinc-400">
          {match.venue}
        </div>
      )}
    </div>
  );
}
