"use client";

import type { GroupStanding, Team } from "@/lib/types/tournament";
import { DraggableTeam } from "@/components/dnd/DraggableTeam";

interface GroupTableProps {
  group: string;
  standings: GroupStanding[];
  teams: Record<string, Team>;
}

export function GroupTable({ standings, teams }: GroupTableProps) {
  return (
    <table className="mb-3 w-full text-xs">
      <thead>
        <tr className="border-b border-zinc-200 text-zinc-500">
          <th className="py-1 text-left font-medium">Team</th>
          <th className="w-6 py-1 text-center font-medium">P</th>
          <th className="w-6 py-1 text-center font-medium">W</th>
          <th className="w-6 py-1 text-center font-medium">D</th>
          <th className="w-6 py-1 text-center font-medium">L</th>
          <th className="w-6 py-1 text-center font-medium">GD</th>
          <th className="w-7 py-1 text-center font-bold">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, i) => {
          const team = teams[s.teamId];
          if (!team) return null;
          return (
            <tr
              key={s.teamId}
              className={`border-b border-zinc-100 ${i < 2 ? "bg-emerald-50/50" : ""}`}
            >
              <td className="py-1">
                <DraggableTeam team={team} compact />
              </td>
              <td className="text-center">{s.played}</td>
              <td className="text-center">{s.won}</td>
              <td className="text-center">{s.drawn}</td>
              <td className="text-center">{s.lost}</td>
              <td className="text-center">{s.gd > 0 ? `+${s.gd}` : s.gd}</td>
              <td className="text-center font-bold">{s.points}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
