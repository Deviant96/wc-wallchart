"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Team } from "@/lib/types/tournament";
import { TeamChip } from "@/components/match/TeamChip";
import { useClientMounted } from "@/hooks/useClientMounted";

interface DroppableSlotProps {
  matchId: string;
  slot: "home" | "away";
  team: Team | undefined;
  placeholder?: string;
  compact?: boolean;
  winner?: boolean;
  onClick?: () => void;
}

export function DroppableSlot(props: DroppableSlotProps) {
  const mounted = useClientMounted();

  if (!mounted) {
    return (
      <div onClick={props.onClick} className={props.onClick ? "cursor-pointer" : ""}>
        <SlotContent
          team={props.team}
          placeholder={props.placeholder}
          compact={props.compact}
          winner={props.winner}
        />
      </div>
    );
  }

  return <DroppableSlotInner {...props} />;
}

function DroppableSlotInner({
  matchId,
  slot,
  team,
  placeholder = "TBD",
  compact,
  winner,
  onClick,
}: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${matchId}-${slot}`,
    data: { type: "slot", matchId, slot },
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`rounded transition-colors ${
        isOver ? "bg-emerald-100 ring-2 ring-emerald-400" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <SlotContent
        team={team}
        placeholder={placeholder}
        compact={compact}
        winner={winner}
      />
    </div>
  );
}

function SlotContent({
  team,
  placeholder = "TBD",
  compact,
  winner,
}: Pick<DroppableSlotProps, "team" | "placeholder" | "compact" | "winner">) {
  return team ? (
    <TeamChip team={team} compact={compact} winner={winner} />
  ) : (
    <span className="block truncate px-2 py-1 text-xs italic text-zinc-400">
      {placeholder}
    </span>
  );
}
