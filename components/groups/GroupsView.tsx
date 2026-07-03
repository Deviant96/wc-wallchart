"use client";

import { useMemo } from "react";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { calcAllStandings } from "@/lib/standings/calcStandings";
import { GroupTable } from "@/components/groups/GroupTable";
import { GroupMatchList } from "@/components/groups/GroupMatchList";

const GROUPS = "ABCDEFGHIJKL".split("");

export function GroupsView({ onEditMatch }: { onEditMatch: (id: string) => void }) {
  const teams = useTournamentStore((s) => s.teams);
  const matches = useTournamentStore((s) => s.matches);

  const standings = useMemo(
    () => calcAllStandings(teams, matches),
    [teams, matches]
  );

  return (
    <div className="groups-grid grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {GROUPS.map((group) => (
        <div
          key={group}
          className="group-card rounded-lg border border-zinc-200 bg-zinc-50 p-2"
        >
          <h3 className="group-title mb-1 text-center text-xs font-bold tracking-wider text-emerald-700">
            GROUP {group}
          </h3>
          <GroupTable
            group={group}
            standings={standings[group] ?? []}
            teams={teams}
          />
          <GroupMatchList
            group={group}
            matches={matches}
            teams={teams}
            onEditMatch={onEditMatch}
          />
        </div>
      ))}
    </div>
  );
}
