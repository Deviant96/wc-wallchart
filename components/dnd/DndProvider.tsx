"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useTournamentActions, useTournamentStore } from "@/lib/store/tournamentStore";
import type { DragTeamData } from "@/lib/types/tournament";
import { TeamChip } from "@/components/match/TeamChip";

export function DndProvider({ children }: { children: React.ReactNode }) {
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const teams = useTournamentStore((s) => s.teams);
  const { assignTeamToSlot } = useTournamentActions();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DragTeamData | undefined;
    if (data?.type === "team") {
      setActiveTeamId(data.teamId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTeamId(null);
    const { active, over } = event;
    if (!over) return;

    const dragData = active.data.current as DragTeamData | undefined;
    const dropData = over.data.current as
      | { type: "slot"; matchId: string; slot: "home" | "away" }
      | undefined;

    if (dragData?.type === "team" && dropData?.type === "slot") {
      assignTeamToSlot(dropData.matchId, dropData.slot, dragData.teamId);
    }
  };

  const activeTeam = activeTeamId ? teams[activeTeamId] : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeTeam ? (
          <TeamChip team={activeTeam} dragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
