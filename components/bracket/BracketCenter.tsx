import type { Match } from "@/lib/types/tournament";
import { PHASE_LABELS } from "@/lib/bracket/advanceMap";
import { MatchCard } from "@/components/match/MatchCard";

interface BracketCenterProps {
  finalMatch?: Match;
  thirdMatch?: Match;
  onEditMatch: (id: string) => void;
}

export function BracketCenter({
  finalMatch,
  thirdMatch,
  onEditMatch,
}: BracketCenterProps) {
  return (
    <div className="bracket-center relative flex shrink-0 flex-col px-4">
      <div className="bracket-label-spacer mb-3 h-6 shrink-0" aria-hidden />

      <div className="bracket-center-stage relative">
        {finalMatch && (
          <div className="bracket-final-slot absolute left-1/2 top-1/2 z-10 w-max -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="mb-2 inline-block rounded-full bg-amber-700/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800">
              {PHASE_LABELS["final"]}
            </span>
            <MatchCard
              match={finalMatch}
              compact
              bracket
              highlight="gold"
              onEdit={() => onEditMatch(finalMatch.id)}
            />
          </div>
        )}

        {thirdMatch && (
          <div className="bracket-third-slot absolute left-1/2 top-[calc(50%+5.5rem)] z-10 w-max -translate-x-1/2 text-center">
            <span className="mb-2 inline-block rounded-full bg-orange-700/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-800">
              {PHASE_LABELS["third-place-play-off"]}
            </span>
            <MatchCard
              match={thirdMatch}
              compact
              bracket
              highlight="bronze"
              onEdit={() => onEditMatch(thirdMatch.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
