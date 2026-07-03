"use client";

import { useMemo } from "react";
import { KNOCKOUT_PHASES, PHASE_LABELS } from "@/lib/bracket/advanceMap";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import type { Match } from "@/lib/types/tournament";
import { MatchCard } from "@/components/match/MatchCard";
import { BracketRound } from "@/components/bracket/BracketRound";

export function BracketView({ onEditMatch }: { onEditMatch: (id: string) => void }) {
  const matches = useTournamentStore((s) => s.matches);

  const byPhase = useMemo(() => {
    const result: Record<string, Match[]> = {};
    for (const phase of KNOCKOUT_PHASES) {
      result[phase] = Object.values(matches)
        .filter((m) => m.phase === phase)
        .sort((a, b) => a.num - b.num);
    }
    return result;
  }, [matches]);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max items-start gap-6 px-2">
        {KNOCKOUT_PHASES.map((phase) => {
          const roundMatches = byPhase[phase] ?? [];
          if (roundMatches.length === 0) return null;

          if (phase === "third-place-play-off") {
            return (
              <div key={phase} className="flex flex-col items-center gap-2 self-end pb-32">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {PHASE_LABELS[phase]}
                </h3>
                <MatchCard
                  match={roundMatches[0]}
                  compact
                  onEdit={() => onEditMatch(roundMatches[0].id)}
                />
              </div>
            );
          }

          return (
            <BracketRound
              key={phase}
              label={PHASE_LABELS[phase] ?? phase}
              matches={roundMatches}
              onEditMatch={onEditMatch}
            />
          );
        })}
      </div>
    </div>
  );
}
