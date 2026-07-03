import type { Team } from "@/lib/types/tournament";
import { TeamFlag } from "@/components/match/TeamFlag";

interface TeamChipProps {
  team: Team;
  compact?: boolean;
  draggable?: boolean;
  dragging?: boolean;
  winner?: boolean;
}

export function TeamChip({
  team,
  compact,
  draggable,
  dragging,
  winner,
}: TeamChipProps) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded border bg-white px-2 py-1 ${
        compact ? "text-xs" : "text-sm"
      } ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${
        dragging ? "shadow-lg ring-2 ring-emerald-400" : "border-zinc-200"
      } ${winner ? "border-emerald-500 bg-emerald-50 font-semibold" : ""}`}
    >
      <TeamFlag team={team} className={compact ? "h-3 w-4" : "h-4 w-6"} />
      <span className="truncate">{team.name}</span>
    </div>
  );
}
