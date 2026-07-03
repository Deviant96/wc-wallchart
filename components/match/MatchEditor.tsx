"use client";

import { useState } from "react";
import { useTournamentActions, useTournamentStore } from "@/lib/store/tournamentStore";
import type { Match } from "@/lib/types/tournament";

interface MatchEditorProps {
  matchId: string;
  onClose: () => void;
}

export function MatchEditor({ matchId, onClose }: MatchEditorProps) {
  const match = useTournamentStore((s) => s.matches[matchId]);
  const teams = useTournamentStore((s) => s.teams);

  if (!match) return null;

  const teamList = Object.values(teams).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <MatchEditorForm
      match={match}
      teamList={teamList}
      onClose={onClose}
    />
  );
}

function MatchEditorForm({
  match,
  teamList,
  onClose,
}: {
  match: Match;
  teamList: { id: string; name: string }[];
  onClose: () => void;
}) {
  const { updateMatch, addTeam } = useTournamentActions();

  const [homeScore, setHomeScore] = useState(
    match.homeScore !== null ? String(match.homeScore) : ""
  );
  const [awayScore, setAwayScore] = useState(
    match.awayScore !== null ? String(match.awayScore) : ""
  );
  const [date, setDate] = useState(match.date ?? "");
  const [timeUtc, setTimeUtc] = useState(match.timeUtc ?? "");
  const [homeTeamId, setHomeTeamId] = useState(match.homeTeamId ?? "__none__");
  const [awayTeamId, setAwayTeamId] = useState(match.awayTeamId ?? "__none__");
  const [penaltyNote, setPenaltyNote] = useState(match.penaltyNote ?? "");
  const [customHome, setCustomHome] = useState("");
  const [customAway, setCustomAway] = useState("");

  const parseScore = (v: string): number | null => {
    if (v.trim() === "") return null;
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  };

  const resolveTeam = (
    selectedId: string,
    customName: string
  ): string | null => {
    if (selectedId === "__custom__" && customName.trim()) {
      return addTeam(customName.trim());
    }
    if (selectedId === "__none__" || !selectedId) return null;
    return selectedId;
  };

  const handleSave = () => {
    const resolvedHome = resolveTeam(homeTeamId, customHome);
    const resolvedAway = resolveTeam(awayTeamId, customAway);

    updateMatch(match.id, {
      homeTeamId: resolvedHome,
      awayTeamId: resolvedAway,
      homeScore: parseScore(homeScore),
      awayScore: parseScore(awayScore),
      date: date || null,
      timeUtc: timeUtc || null,
      penaltyNote: penaltyNote || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Edit Match</h2>
            <p className="text-sm text-zinc-500">
              {match.label ?? `Match ${match.num}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <TeamSelect
            label="Home team"
            value={homeTeamId}
            onChange={setHomeTeamId}
            teams={teamList}
            customValue={customHome}
            onCustomChange={setCustomHome}
          />
          <TeamSelect
            label="Away team"
            value={awayTeamId}
            onChange={setAwayTeamId}
            teams={teamList}
            customValue={customAway}
            onCustomChange={setCustomAway}
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-zinc-600">Home score</span>
              <input
                type="number"
                min={0}
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-600">Away score</span>
              <input
                type="number"
                min={0}
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-zinc-600">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-600">Time (UTC)</span>
              <input
                type="time"
                value={timeUtc}
                onChange={(e) => setTimeUtc(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-zinc-600">
              Penalty / notes (optional)
            </span>
            <input
              type="text"
              value={penaltyNote}
              onChange={(e) => setPenaltyNote(e.target.value)}
              placeholder="e.g. Won 4-3 on penalties"
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamSelect({
  label,
  value,
  onChange,
  teams,
  customValue,
  onCustomChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  teams: { id: string; name: string }[];
  customValue: string;
  onCustomChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
      >
        <option value="__none__">— TBD —</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
        <option value="__custom__">+ Custom team name</option>
      </select>
      {value === "__custom__" && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Enter team name"
          className="mt-2 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}
