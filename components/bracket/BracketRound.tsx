import type { Match } from "@/lib/types/tournament";
import { MatchCard } from "@/components/match/MatchCard";

interface BracketRoundProps {
  label: string;
  matches: Match[];
  onEditMatch: (id: string) => void;
}

export function BracketRound({ label, matches, onEditMatch }: BracketRoundProps) {
  const gap =
    matches.length <= 2 ? "gap-16" : matches.length <= 4 ? "gap-8" : "gap-3";

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </h3>
      <div className={`flex flex-col ${gap} justify-around`}>
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
