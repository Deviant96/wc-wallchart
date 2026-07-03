import type { ReactNode } from "react";
import type { Match } from "@/lib/types/tournament";
import { PHASE_LABELS } from "@/lib/bracket/advanceMap";
import { splitHalf } from "@/lib/bracket/bracketLayout";
import { BracketColumn } from "@/components/bracket/BracketColumn";
import {
  BracketGutter,
  BracketGutterToCenter,
} from "@/components/bracket/BracketGutter";

const WING_PHASES = [
  "last-32",
  "round-of-16",
  "quarter-finals",
  "semi-finals",
] as const;

interface BracketWingProps {
  side: "left" | "right";
  byPhase: Record<string, Match[]>;
  onEditMatch: (id: string) => void;
}

export function BracketWing({ side, byPhase, onEditMatch }: BracketWingProps) {
  const direction = side === "left" ? "ltr" : "rtl";

  const columns = WING_PHASES.map((phase) => ({
    phase,
    label: PHASE_LABELS[phase] ?? phase,
    matches: splitHalf(byPhase[phase] ?? [], side),
  }));

  const segments: ReactNode[] = [];

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const next = columns[i + 1];

    segments.push(
      <BracketColumn
        key={col.phase}
        label={col.label}
        matches={col.matches}
        onEditMatch={onEditMatch}
      />
    );

    if (next) {
      segments.push(
        <BracketGutter
          key={`g-${col.phase}`}
          leftCount={col.matches.length}
          rightCount={next.matches.length}
          direction={direction}
        />
      );
    }
  }

  segments.push(
    <BracketGutterToCenter key="g-center" direction={direction} />
  );

  return (
    <div className="bracket-wing flex items-start">
      {side === "left" ? segments : [...segments].reverse()}
    </div>
  );
}
