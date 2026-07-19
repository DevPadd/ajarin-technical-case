import {
  INITIAL_USER_STREAK,
  type TaskCompletion,
  type UserStreak,
} from "./gamification-store";

export const STORAGE_KEY_STREAK = "ajarin:streak";
export const STORAGE_KEY_COMPLETIONS = "ajarin:completions";

function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function isUserStreak(value: unknown): value is UserStreak {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.petName === "string" &&
    typeof v.petStage === "number" &&
    typeof v.petExp === "number" &&
    typeof v.petColor === "string" &&
    typeof v.petAccessory === "string"
  );
}

export function loadStreak(): UserStreak {
  if (!hasWindow()) return { ...INITIAL_USER_STREAK };
  const raw = window.localStorage.getItem(STORAGE_KEY_STREAK);
  const parsed = safeParse<unknown>(raw, INITIAL_USER_STREAK);
  if (isUserStreak(parsed)) return { ...INITIAL_USER_STREAK, ...parsed };
  return { ...INITIAL_USER_STREAK };
}

export function saveStreak(state: UserStreak): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(state));
  } catch {
    /* quota or private mode — silently ignore */
  }
}

export function loadCompletions(): TaskCompletion[] {
  if (!hasWindow()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY_COMPLETIONS);
  const parsed = safeParse<unknown>(raw, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (c): c is TaskCompletion =>
      typeof c === "object" &&
      c !== null &&
      typeof (c as TaskCompletion).id === "string" &&
      typeof (c as TaskCompletion).taskId === "string" &&
      typeof (c as TaskCompletion).completedAt === "string",
  );
}

export function saveCompletions(list: TaskCompletion[]): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY_COMPLETIONS,
      JSON.stringify(list),
    );
  } catch {
    /* ignore */
  }
}

export function clearAllGamification(): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_STREAK);
    window.localStorage.removeItem(STORAGE_KEY_COMPLETIONS);
  } catch {
    /* ignore */
  }
}
