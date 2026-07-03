"use client";

import { useMemo } from "react";
import { MAIN_KNOCKOUT_PHASES } from "@/lib/bracket/advanceMap";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import type { Match } from "@/lib/types/tournament";
import { BracketCenter } from "@/components/bracket/BracketCenter";
import { BracketWing } from "@/components/bracket/BracketWing";

export function BracketView({ onEditMatch }: { onEditMatch: (id: string) => void }) {
  const matches = useTournamentStore((s) => s.matches);

  const byPhase = useMemo(() => {
    const result: Record<string, Match[]> = {};
    for (const phase of [...MAIN_KNOCKOUT_PHASES, "third-place-play-off"]) {
      result[phase] = Object.values(matches)
        .filter((m) => m.phase === phase)
        .sort((a, b) => a.num - b.num);
    }
    return result;
  }, [matches]);

  const finalMatch = byPhase["final"]?.[0];
  const thirdMatch = byPhase["third-place-play-off"]?.[0];

  return (
    <div className="bracket-poster overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/80 via-white to-amber-50/40 shadow-inner">
      <div className="bracket-banner relative border-b border-emerald-200/50 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 px-6 py-4 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white" />
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-amber-300" />
        </div>
        <p className="relative text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-200">
          FIFA World Cup 2026
        </p>
        <h2 className="relative mt-1 text-lg font-bold tracking-wide text-white">
          Knockout Stage
        </h2>
      </div>

      <div className="bracket-scroll overflow-x-auto overflow-y-hidden px-4 py-4">
        <div className="bracket-tree bracket-tree-split mx-auto flex w-max items-stretch justify-center gap-0">
          <BracketWing side="left" byPhase={byPhase} onEditMatch={onEditMatch} />
          <BracketCenter
            finalMatch={finalMatch}
            thirdMatch={thirdMatch}
            onEditMatch={onEditMatch}
          />
          <BracketWing side="right" byPhase={byPhase} onEditMatch={onEditMatch} />
        </div>
      </div>
    </div>
  );
}
