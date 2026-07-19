"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useGamificationInternal } from "@/hooks/use-streak";

export type { TaskResult } from "@/hooks/use-streak";
export { TASK_DEFS } from "@/hooks/use-streak";

type GamificationContextValue = ReturnType<typeof useGamificationInternal>;

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const value = useGamificationInternal();
  return (
    <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>
  );
}

export function useGamification(): GamificationContextValue {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error("useGamification must be used within a <GamificationProvider>");
  }
  return ctx;
}
