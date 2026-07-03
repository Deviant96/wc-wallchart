import type { Team } from "@/lib/types/tournament";
import { flagUrl } from "@/lib/utils/flags";

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
  const url = flagUrl(team.code);

  return (
    <div
      className={`flex items-center gap-1.5 rounded border bg-white px-2 py-1 ${
        compact ? "text-xs" : "text-sm"
      } ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${
        dragging ? "shadow-lg ring-2 ring-emerald-400" : "border-zinc-200"
      } ${winner ? "border-emerald-500 bg-emerald-50 font-semibold" : ""}`}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-4 w-6 shrink-0 object-cover" />
      ) : team.flag ? (
        <span className="text-base leading-none">{team.flag}</span>
      ) : null}
      <span className="truncate">{team.name}</span>
    </div>
  );
}
