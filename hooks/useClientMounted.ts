"use client";

import { useSyncExternalStore } from "react";

/** Safe client-only gate — avoids SSR hydration mismatches from dnd-kit runtime IDs. */
export function useClientMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
