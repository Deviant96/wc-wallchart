import { flagCode } from "@/lib/utils/countryCodes";

export function flagUrl(code: string | undefined | null): string | null {
  const iso2 = flagCode(code);
  if (!iso2) return null;
  return `https://flagcdn.com/w40/${iso2}.png`;
}

export function teamDisplayName(
  teamId: string | null,
  teams: Record<string, { name: string }>
): string {
  if (!teamId) return "TBD";
  return teams[teamId]?.name ?? "Unknown";
}
