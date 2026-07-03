export function flagUrl(code: string | undefined | null): string | null {
  if (!code || code.length !== 3) return null;
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

export function teamDisplayName(
  teamId: string | null,
  teams: Record<string, { name: string }>
): string {
  if (!teamId) return "TBD";
  return teams[teamId]?.name ?? "Unknown";
}
