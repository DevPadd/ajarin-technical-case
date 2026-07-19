export interface UserStreak {
  petName: string;
  petStage: number;
  petExp: number;
  petColor: string;
  petAccessory: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  completedAt: string;
}

export const INITIAL_USER_STREAK: UserStreak = {
  petName: "Blobby",
  petStage: 1,
  petExp: 0,
  petColor: "#FB923C",
  petAccessory: "none",
};

export const PET_COLORS = [
  { name: "Orange", primary: "#FB923C", blush: "#FFB374" },
  { name: "Biru", primary: "#60A5FA", blush: "#93C5FD" },
  { name: "Ungu", primary: "#A78BFA", blush: "#C4B5FD" },
  { name: "Hijau", primary: "#34D399", blush: "#6EE7B7" },
  { name: "Pink", primary: "#F472B6", blush: "#F9A8D4" },
  { name: "Merah", primary: "#F87171", blush: "#FCA5A5" },
  { name: "Teal", primary: "#2DD4BF", blush: "#5EEAD4" },
];

export const PET_ACCESSORIES = [
  { id: "none", label: "None" },
  { id: "cap", label: "Cap" },
  { id: "crown", label: "Crown" },
  { id: "beanie", label: "Beanie" },
] as const;

export const TASK_XP: Record<string, number> = {
  "daily-login": 10,
  "send-chat": 15,
  "join-series": 30,
};

export function simulateCompleteTask(
  _taskId: string,
  currentState: UserStreak,
  baseExp: number = 10,
): UserStreak {
  const newExp = currentState.petExp + baseExp;
  const newStage = Math.min(6, Math.floor(newExp / 100) + 1);

  return {
    ...currentState,
    petExp: newExp,
    petStage: newStage,
  };
}

export interface ExpProgress {
  current: number;
  needed: number;
  progress: number;
}

export function getExpForNextStage(petExp: number): ExpProgress {
  if (petExp >= 600) {
    return { current: 0, needed: 0, progress: 1 };
  }
  const current = petExp % 100;
  return { current, needed: 100, progress: current / 100 };
}
