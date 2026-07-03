"use client";

import { useState } from "react";
import type { Team } from "@/lib/types/tournament";
import { flagUrl } from "@/lib/utils/flags";

interface TeamFlagProps {
  team: Pick<Team, "code" | "flag" | "name">;
  className?: string;
}

export function TeamFlag({ team, className = "h-4 w-6" }: TeamFlagProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const url = flagUrl(team.code);

  if (url && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className={`shrink-0 object-cover ${className}`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  if (team.flag) {
    return <span className="shrink-0 text-base leading-none">{team.flag}</span>;
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded bg-zinc-200 text-[8px] font-bold text-zinc-500 ${className}`}
      title={team.name}
    >
      {team.code.slice(0, 2)}
    </span>
  );
}
