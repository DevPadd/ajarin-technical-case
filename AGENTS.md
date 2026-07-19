# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:projects-rules-and-context -->

## SYSTEM INSTRUCTION TO ALL AI AGENTS

This document acts as your strict contextual guardrail and behavioral compass. Before editing any file, refactoring routing paths, or generating UI within this workspace, read and fully comply with the technical stack, frontend-only architecture patterns, and technical rules specified below.

---

## 1. Project Context & Platform Vision

**Ajarin** (_"Dari Siswa, Untuk Siswa"_) is an innovative, completely free online learning platform designed to bridge the educational gap by connecting students with passionate volunteer peer tutors.

### Core Platform Domain Model:

- **Series:** Main knowledge tracks or courses structured systematically (e.g., _Kimia - Reaksi Redoks_).
- **Sessions:** Granular, specific units or lessons nested within a single Series (e.g., _Sesi 1 - Pengertian Reaksi Redoks_).
- **Community Engine:** Interactive discussion forums and embedded chat rooms where peer tutoring actively takes place.

### The Objective:

This project serves as a **technical case implementation** aimed at solving real-world student retention challenges. The feature set built into this codebase solves student churn by integrating deep gamification structures (**Task-Based Study Streaks** and an evolving **Virtual Pet Companion**).

---

## 2. Technical Stack Blueprint (FRONTEND ONLY)

All automated changes, refactors, and feature additions must adhere strictly to the frontend engineering stack defined below. **No backend or ORM tools are to be initialized.**

- **Framework:** Next.js (App Router, Client Component state tracking, static local delivery).
- **Language:** TypeScript (Strict compliance, absolute type accuracy, absolute pathing resolution using `@/*`).
- **State Management:** React Context API or `localStorage` wrapper for real-time state synchronization.
- **Styling & Primitive Layers:** Tailwind CSS, Radix UI primitives (via Shadcn UI boilerplate).
- **Animation Engine:** Framer Motion for rich, micro-interactive gamified asset states.
- **Deployment Context:** Highly optimized for static hosting on Vercel.

---

## 3. Feature Mechanics: Client-Side Streak & Virtual Pet

Agents must ensure any work touching user profiles or lesson structures coordinates with the unified local Gamification Core:

### 3.1 The Retention Loop

1. **The Engagement Trigger:** A student marks a `Session` as complete or submits a quiz.
2. **The Evaluation Matrix:** The system computes daily persistence against the client's explicit calendar bounds using clean date strings (`YYYY-MM-DD`).
3. **The Companion Loop:** The student's virtual pet earns Experience Points (XP), evolves over time, and changes mood expressions dynamically based on whether the streak remains active or goes cold.
4. **Customizable Pet:** Students can customize their pets with accessories and cosmetics, also they can rename their pet.

---

## 4. Technical Execution Guidelines for Agents

### 4.1 Local State Contracts (No Database ORM Allowed)

Instead of prisma database schemas, maintain the exact same structured interface objects directly inside a client-side state file (e.g., `@/lib/gamification-store.ts`):

```typescript
export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // Format: "YYYY-MM-DD" to avoid timezone drifting
  petName: string;
  petStage: number; // 1 = Egg, 2 = Baby Slime, 3 = Mature Adult
  petExp: number;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  completedAt: string; // ISO String timestamp
}
```

### 4.2 Local Timezone Bound Validation Rule

**CRITICAL STREAK RULE FOR AI AGENTS:**
Do not use raw time objects or rely on unpredictable host clocks. Compare days exclusively via string matching (`YYYY-MM-DD`) derived from the local browser's time sequence.

#### Pure Calculation Core Engine:

```typescript
export function simulateCompleteTask(
  taskId: string,
  currentState: UserStreak,
): UserStreak {
  const now = new Date();

  // Clean localized date strings
  const todayStr = now.toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreakCount = currentState.currentStreak;
  let expGain = 10; // Base task completion experience

  if (currentState.lastActiveDate === todayStr) {
    expGain = 2; // Already done today, minor bonus given
  } else if (currentState.lastActiveDate === yesterdayStr) {
    newStreakCount += 1; // Maintained consecutive milestone
    expGain = 20; // Bonus streak experience
  } else {
    newStreakCount = 1; // Broken streak cleanly resets to initial state
  }

  const newExp = currentState.petExp + expGain;
  const newStage = Math.min(3, Math.floor(newExp / 100) + 1); // Evolve every 100 XP

  return {
    ...currentState,
    currentStreak: newStreakCount,
    longestStreak: Math.max(currentState.longestStreak, newStreakCount),
    lastActiveDate: todayStr,
    petExp: newExp,
    petStage: newStage,
  };
}
```

## 5. Agent Behavioral & Quality Guidelines

- **Do Not Attempt Database Generation:** Under no circumstances should you pull or build folders for `prisma/`, `drizzle/`, or attempt server action mutations using async SQL engines.
- **Make the UI Pop:** Because the architecture is client-side, emphasize heavy visual polish using Framer Motion. Ensure state updates are immediately accompanied by rich animations, leveling effects, and immediate responsive layouts.
- **Enforce Local Storage Persistence:** On initial mount, hydrations must seamlessly bind current progress parameters out of local states to ensure that hard updates or page refreshes do not delete the reviewer's ongoing progress.
<!-- END:project-rules-and-context -->
