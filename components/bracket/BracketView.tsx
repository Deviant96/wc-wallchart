"use client";

import { useMemo } from "react";
import { MAIN_KNOCKOUT_PHASES, PHASE_LABELS } from "@/lib/bracket/advanceMap";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import type { Match } from "@/lib/types/tournament";
import { MatchCard } from "@/components/match/MatchCard";
import { BracketRound } from "@/components/bracket/BracketRound";

const ROUND_GAPS: Record<string, string> = {
  "last-32": "gap-1",
  "round-of-16": "gap-5",
  "quarter-finals": "gap-12",
  "semi-finals": "gap-24",
};

export function BracketView({ onEditMatch }: { onEditMatch: (id: string) => void }) {
  const matches = useTournamentStore((s) => s.matches);

  const byPhase = useMemo(() => {
    const result: Record<string, Match[]> = {};
    for (const phase of [...MAIN_KNOCKOUT_PHASES, "third-place-play-off"]) {
      result[phase] = Object.values(matches)
        .filter((m) => m.phase === phase)
        .sort((a, b) => a.num - b.num);
    }
    return result;
  }, [matches]);

  const sfMatches = byPhase["semi-finals"] ?? [];
  const thirdMatch = byPhase["third-place-play-off"]?.[0];
  const finalMatch = byPhase["final"]?.[0];

  const earlyPhases = MAIN_KNOCKOUT_PHASES.filter(
    (p) => p !== "semi-finals" && p !== "final"
  );

  return (
    <div className="bracket-scroll overflow-x-auto pb-2">
      <div className="bracket-tree flex min-w-max items-stretch gap-3 px-1">
        {earlyPhases.map((phase) => (
          <BracketRound
            key={phase}
            label={PHASE_LABELS[phase] ?? phase}
            matches={byPhase[phase] ?? []}
            gapClass={ROUND_GAPS[phase]}
            onEditMatch={onEditMatch}
          />
        ))}

        {/* Semi-finals column — sets bracket height */}
        <div className="bracket-col flex flex-col">
          <h3 className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
            {PHASE_LABELS["semi-finals"]}
          </h3>
          <div className={`flex flex-1 flex-col justify-around ${ROUND_GAPS["semi-finals"]}`}>
            {sfMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                compact
                onEdit={() => onEditMatch(match.id)}
              />
            ))}
          </div>
        </div>

        {/* Third place — vertically centred beside semi-finals */}
        {thirdMatch && (
          <div className="bracket-col bracket-third flex flex-col justify-center">
            <h3 className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              {PHASE_LABELS["third-place-play-off"]}
            </h3>
            <MatchCard
              match={thirdMatch}
              compact
              onEdit={() => onEditMatch(thirdMatch.id)}
            />
          </div>
        )}

        {/* Final */}
        {finalMatch && (
          <div className="bracket-col flex flex-col justify-center">
            <h3 className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              {PHASE_LABELS["final"]}
            </h3>
            <MatchCard
              match={finalMatch}
              compact
              onEdit={() => onEditMatch(finalMatch.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
