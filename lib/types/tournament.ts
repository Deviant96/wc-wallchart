export type Phase =
  | "group"
  | "last-32"
  | "round-of-16"
  | "quarter-finals"
  | "semi-finals"
  | "third-place-play-off"
  | "final";

export type TabView = "groups" | "bracket";

export interface Team {
  id: string;
  code: string;
  name: string;
  flag?: string;
  group?: string;
}

export interface FeedTarget {
  matchId: string;
  slot: "home" | "away";
}

export interface Match {
  id: string;
  num: number;
  phase: Phase;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  date: string | null;
  timeUtc: string | null;
  venue?: string;
  venueCity?: string;
  group?: string;
  label?: string;
  feedsInto?: FeedTarget[];
  penaltyNote?: string;
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export interface TournamentState {
  teams: Record<string, Team>;
  matches: Record<string, Match>;
  matchOrder: string[];
  autoAdvance: boolean;
  activeTab: TabView;
  lastFetchedAt: string | null;
  dataSource: "seed" | "wheniskickoff" | "openfootball" | "manual";
}

export type MatchSlot = "home" | "away";

export interface DragTeamData {
  type: "team";
  teamId: string;
}

export interface DragSlotData {
  type: "slot";
  matchId: string;
  slot: MatchSlot;
}
