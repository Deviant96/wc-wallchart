import type { Match } from "@/lib/types/tournament";
import { MatchCard } from "@/components/match/MatchCard";

interface BracketRoundProps {
  label: string;
  matches: Match[];
  gapClass?: string;
  onEditMatch: (id: string) => void;
}

export function BracketRound({
  label,
  matches,
  gapClass = "gap-3",
  onEditMatch,
}: BracketRoundProps) {
  return (
    <div className="bracket-col flex flex-col">
      <h3 className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </h3>
      <div className={`flex flex-1 flex-col justify-around ${gapClass}`}>
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            compact
            onEdit={() => onEditMatch(match.id)}
          />
        ))}
      </div>
    </div>
  );
}
