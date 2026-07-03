import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WIK_BASE = "https://wheniskickoff.com/data/v1";
const OF_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export async function GET(request: Request) {
  const source =
    new URL(request.url).searchParams.get("source") ?? "wheniskickoff";

  try {
    if (source === "openfootball") {
      const res = await fetch(OF_URL, { cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Failed to fetch openfootball data" },
          { status: 502 }
        );
      }
      const data = await res.json();
      return NextResponse.json(data);
    }

    const [teamsRes, matchesRes] = await Promise.all([
      fetch(`${WIK_BASE}/teams.json`, { cache: "no-store" }),
      fetch(`${WIK_BASE}/matches.json`, { cache: "no-store" }),
    ]);

    if (!teamsRes.ok || !matchesRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch wheniskickoff data" },
        { status: 502 }
      );
    }

    const [teams, matches] = await Promise.all([
      teamsRes.json(),
      matchesRes.json(),
    ]);

    return NextResponse.json({ teams, matches });
  } catch {
    return NextResponse.json(
      { error: "Tournament data fetch failed" },
      { status: 500 }
    );
  }
}
