"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Team } from "@/lib/types/tournament";
import { TeamChip } from "@/components/match/TeamChip";

interface DroppableSlotProps {
  matchId: string;
  slot: "home" | "away";
  team: Team | undefined;
  placeholder?: string;
  compact?: boolean;
  winner?: boolean;
  onClick?: () => void;
}

export function DroppableSlot({
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
      {team ? (
        <TeamChip team={team} compact={compact} winner={winner} />
      ) : (
        <span className="block truncate px-2 py-1 text-xs italic text-zinc-400">
          {placeholder}
        </span>
      )}
    </div>
  );
}
