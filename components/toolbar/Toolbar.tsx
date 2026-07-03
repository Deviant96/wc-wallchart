"use client";

import { useState } from "react";
import {
  useAutoAdvance,
  useFetchError,
  useIsFetching,
  useTournamentActions,
} from "@/lib/store/tournamentStore";
import { ExportMenu } from "@/components/toolbar/ExportMenu";
import type { TabView } from "@/lib/types/tournament";

interface ToolbarProps {
  exportRef: React.RefObject<HTMLElement | null>;
  activeTab: TabView;
}

export function Toolbar({ exportRef, activeTab }: ToolbarProps) {
  const autoAdvance = useAutoAdvance();
  const isFetching = useIsFetching();
  const fetchError = useFetchError();
  const { setAutoAdvance, fetchLiveData, resetToSeed, addTeam } =
    useTournamentActions();

  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamGroup, setTeamGroup] = useState("");

  const handleFetch = async (overwrite: boolean) => {
    await fetchLiveData("wheniskickoff", overwrite);
  };

  const handleFetchClick = () => {
    if (
      confirm(
        "Fetch live data from wheniskickoff.com?\n\nChoose OK to merge (keep your manual edits).\nChoose Cancel, then use 'Overwrite fetch' from the menu if you want a full reset."
      )
    ) {
      handleFetch(false);
    }
  };

  const handleAddTeam = () => {
    if (!teamName.trim()) return;
    addTeam(teamName.trim(), teamCode.trim() || undefined, teamGroup || undefined);
    setTeamName("");
    setTeamCode("");
    setTeamGroup("");
    setShowAddTeam(false);
  };

  return (
    <div className="no-print space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFetchClick}
          disabled={isFetching}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isFetching ? "Fetching…" : "Fetch Live Data"}
        </button>
        <button
          onClick={() => {
            if (confirm("Overwrite all data with live fetch?")) handleFetch(true);
          }}
          disabled={isFetching}
          className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
        >
          Overwrite Fetch
        </button>
        <button
          onClick={() => {
            if (confirm("Reset to bundled seed data?")) resetToSeed();
          }}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Reset to Seed
        </button>
        <button
          onClick={() => setShowAddTeam(true)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Add Team
        </button>
        <ExportMenu exportRef={exportRef} activeTab={activeTab} />

        <label className="ml-auto flex items-center gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="rounded border-zinc-300"
          />
          Auto-advance winners
        </label>
      </div>

      {fetchError && (
        <p className="text-sm text-red-600">Fetch error: {fetchError}</p>
      )}

      {showAddTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 font-bold">Add Team</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Country name *"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="ISO code (e.g. USA)"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
              <select
                value={teamGroup}
                onChange={(e) => setTeamGroup(e.target.value)}
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="">No group</option>
                {"ABCDEFGHIJKL".split("").map((g) => (
                  <option key={g} value={g}>
                    Group {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAddTeam(false)}
                className="rounded px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeam}
                className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
