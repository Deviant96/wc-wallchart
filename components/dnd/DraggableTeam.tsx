"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Team } from "@/lib/types/tournament";
import { TeamChip } from "@/components/match/TeamChip";

interface DraggableTeamProps {
  team: Team;
  compact?: boolean;
}

export function DraggableTeam({ team, compact }: DraggableTeamProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `drag-team-${team.id}`,
      data: { type: "team", teamId: team.id },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-40" : ""}
    >
      <TeamChip team={team} compact={compact} draggable />
    </div>
  );
}
