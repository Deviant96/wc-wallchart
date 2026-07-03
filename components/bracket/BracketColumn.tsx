import type { Match } from "@/lib/types/tournament";
import {
  denseGapClass,
  gridRowStyle,
  isDenseCount,
} from "@/lib/bracket/bracketLayout";
import { MatchCard } from "@/components/match/MatchCard";
import { BracketMatchNode } from "@/components/bracket/BracketMatchNode";

interface BracketColumnProps {
  label: string;
  matches: Match[];
  onEditMatch: (id: string) => void;
  highlight?: "gold" | "bronze" | "default";
}

export function BracketColumn({
  label,
  matches,
  onEditMatch,
  highlight = "default",
}: BracketColumnProps) {
  if (matches.length === 0) return null;

  const matchCount = matches.length;
  const dense = isDenseCount(matchCount);
  const gapClass = denseGapClass(matchCount);

  const cardProps = (match: Match) => ({
    match,
    compact: true as const,
    bracket: true as const,
    dense,
    onEdit: () => onEditMatch(match.id),
  });

  return (
    <BracketColumnShell label={label} highlight={highlight}>
      {matches.map((match, index) => (
        <BracketMatchNode
          key={match.id}
          className={gapClass}
          style={gridRowStyle(index, matchCount)}
        >
          <MatchCard
            {...cardProps(match)}
            highlight={matches.length === 1 ? highlight : "default"}
          />
        </BracketMatchNode>
      ))}
    </BracketColumnShell>
  );
}

function BracketColumnShell({
  label,
  highlight = "default",
  children,
}: {
  label: string;
  highlight?: "gold" | "bronze" | "default";
  children: React.ReactNode;
}) {
  const labelColor =
    highlight === "gold"
      ? "bg-amber-700/10 text-amber-800"
      : highlight === "bronze"
        ? "bg-orange-700/10 text-orange-800"
        : "bg-emerald-700/10 text-emerald-800";

  return (
    <div className="bracket-col flex shrink-0 flex-col">
      <div className="bracket-col-label mb-3 h-6 shrink-0 text-center">
        <span
          className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${labelColor}`}
        >
          {label}
        </span>
      </div>
      <div className="bracket-col-grid relative grid grid-rows-8 overflow-visible">
        {children}
      </div>
    </div>
  );
}
