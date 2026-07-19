"use client";

import { useCallback, useEffect, useState } from "react";
import {
  INITIAL_USER_STREAK,
  simulateCompleteTask,
  type TaskCompletion,
  type UserStreak,
} from "@/lib/gamification-store";
import {
  clearAllGamification,
  loadCompletions as loadCompletionsFromStorage,
  loadStreak,
  saveCompletions as saveCompletionsToStorage,
  saveStreak,
} from "@/lib/gamification-storage";
import { formatLocalDate } from "@/lib/date";

export type TaskResult = {
  state: UserStreak;
  expGained: number;
};

export const TASK_DEFS = [
  { id: "daily-login", label: "Log in ke Ajarin", xp: 10 },
  { id: "send-chat", label: "Chat dengan teman", xp: 15 },
  { id: "join-series", label: "Ikuti series baru", xp: 30 },
] as const;

function makeCompletionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useGamificationInternal() {
  const [state, setState] = useState<UserStreak>(INITIAL_USER_STREAK);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadStreak();
    const loadedCompletions = loadCompletionsFromStorage();
    queueMicrotask(() => {
      setState(loaded);
      setCompletions(loadedCompletions);
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveStreak(state);
  }, [state, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveCompletionsToStorage(completions);
  }, [completions, isHydrated]);

  const completeTask = useCallback(
    (taskId: string, baseExp: number = 10): TaskResult => {
      const prev = state;
      const next = simulateCompleteTask(taskId, prev, baseExp);
      const expGained = next.petExp - prev.petExp;

      setState(next);

      const completion: TaskCompletion = {
        id: makeCompletionId(),
        taskId,
        completedAt: new Date().toISOString(),
      };
      setCompletions((prevCompletions) => [...prevCompletions, completion]);

      return { state: next, expGained };
    },
    [state],
  );

  const isTaskDoneToday = useCallback(
    (taskId: string): boolean => {
      const todayStr = formatLocalDate();
      return completions.some((c) => {
        const localDate = formatLocalDate(new Date(c.completedAt));
        return c.taskId === taskId && localDate === todayStr;
      });
    },
    [completions],
  );

  const setStateForDev = useCallback((next: UserStreak) => {
    setState(next);
  }, []);

  const reset = useCallback(() => {
    clearAllGamification();
    setState({ ...INITIAL_USER_STREAK });
    setCompletions([]);
  }, []);

  const renamePet = useCallback((name: string) => {
    setState((prev) => ({ ...prev, petName: name }));
  }, []);

  const removeTaskCompletion = useCallback((taskId: string) => {
    const todayStr = formatLocalDate();
    setCompletions((prev) =>
      prev.filter((c) => {
        const localDate = formatLocalDate(new Date(c.completedAt));
        return !(c.taskId === taskId && localDate === todayStr);
      }),
    );
  }, []);

  const adjustExp = useCallback((amount: number) => {
    setState((prev) => {
      const newExp = Math.max(0, prev.petExp + amount);
      const newStage = Math.min(6, Math.floor(newExp / 100) + 1);
      return { ...prev, petExp: newExp, petStage: newStage };
    });
  }, []);

  const changePetColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, petColor: color }));
  }, []);

  const changePetAccessory = useCallback((accessory: string) => {
    setState((prev) => ({ ...prev, petAccessory: accessory }));
  }, []);

  return {
    state,
    completions,
    completeTask,
    isTaskDoneToday,
    setStateForDev,
    reset,
    renamePet,
    removeTaskCompletion,
    adjustExp,
    changePetColor,
    changePetAccessory,
    isHydrated,
  };
}
