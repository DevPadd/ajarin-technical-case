# Ajarin Codebase Walkthrough

A gamified peer-learning platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and `react-hot-toast`.

---

## Project Structure

```
app/
  layout.tsx              ← root layout: <html>/<body>, Geist font, global CSS
  page.tsx                ← landing page ("Go to Dashboard" link)
  globals.css             ← Tailwind v4 imports + CSS variables
  (app)/
    layout.tsx            ← app layout: GamificationProvider, Sidebar, Toaster, DevFab
    loading.tsx           ← loading spinner for route group
    error.tsx             ← error boundary with retry button
    dashboard/page.tsx    ← dashboard with PetCard, tutor CTA, daily-login trigger
    chat/page.tsx         ← chatroom with localStorage, XP on send
    series/page.tsx       ← series listing with search/filter, XP on join

components/
  Sidebar.tsx             ← responsive sidebar (desktop rail + mobile drawer)
  pet.tsx                 ← SVG pet renderer (body, eyes, blush, accessories, aura, breathing/blinking)
  pet-card.tsx            ← pet widget card (name, stage, XP bar, task list, customize button)
  customize-modal.tsx     ← color + accessory picker modal with focus trap
  streak-provider.tsx     ← renamed to GamificationProvider / useGamification
  dev-fab.tsx             ← debug panel (view state, adjust XP, toggle tasks, reset)

hooks/
  use-streak.ts           ← renamed to useGamificationInternal — all state logic

lib/
  gamification-store.ts   ← types, constants (PET_COLORS, PET_ACCESSORIES), simulateCompleteTask, getExpForNextStage
  gamification-storage.ts ← localStorage read/write with SSR safety and type guards
  chat-storage.ts         ← chat message persistence to localStorage
  date.ts                 ← formatLocalDate, formatLocalTime
```

---

## Gamification Data Flow

### State shape (`UserStreak` in `lib/gamification-store.ts`)

```typescript
{
  petName: "Blobby",
  petStage: 1,        // 1–6 (Telur → Legenda)
  petExp: 0,          // 0–599 (100 XP per stage)
  petColor: "#FB923C",
  petAccessory: "none"
}
```

Plus a separate `TaskCompletion[]` array in localStorage:

```typescript
[{ id: "uuid", taskId: "daily-login", completedAt: "2026-07-19T..." }]
```

### Provider chain (`app/(app)/layout.tsx`)

```
GamificationProvider
  └─ Sidebar
  └─ <main> {children} </main>
  └─ Toaster
  └─ DevFab
```

`useGamification()` can be called by any component inside this provider.

---

## Task Triggers

There are **3 task types** defined in `TASK_DEFS` (`hooks/use-streak.ts:26`):

| id | label | XP | Trigger location |
|---|---|---|---|
| `daily-login` | Log in ke Ajarin | 10 | Dashboard page — `useEffect` on mount, fires once per session via `useRef` guard, only if not done today |
| `send-chat` | Chat dengan teman | 15 | Chat page — `handleSend` fires on every message send |
| `join-series` | Ikuti series baru | 30 | Series page — `handleJoin` fires on button click |

### How `completeTask(taskId, baseExp)` works (`hooks/use-streak.ts:65`)

1. Takes the current `state` from closure
2. Calls `simulateCompleteTask(taskId, state, baseExp)` which:
   - Adds `baseExp` to `petExp`
   - Recalculates stage: `Math.min(6, Math.floor(newExp / 100) + 1)`
3. `setState(next)` — updates gamification state
4. Creates a `TaskCompletion` record with today's timestamp and appends it to the completions array
5. Returns `{ state: next, expGained }`

### Dedup

`isTaskDoneToday(taskId)` checks if there's a `TaskCompletion` with that `taskId` whose date matches today's local date. If true, the caller skips the task. Callers handle this at the UI level:

- **Dashboard**: effect checks `isTaskDoneToday("daily-login")` before calling
- **Chat/Send**: no dedup — every message fires the task (XP each time)
- **Series**: the button is disabled via `joined` state after first click

---

## Pet Rendering (`components/pet.tsx`)

SVG built from inline path data:

1. **Body** — orange blob path, color driven by `state.petColor`
2. **Blush** — ellipse on the left cheek, color driven by the matching blush from `PET_COLORS`
3. **Eyes** — two ellipses that blink randomly every 3–7 seconds (animated `ry` via Framer Motion)
4. **Accessory** — rendered last (on top): `AccessoryCap`, `AccessoryCrown`, or `AccessoryBeanie` — paths inlined from `public/*.svg`
5. **Breathing** — SVG scale animates `[1, 1.02, 1]` on a 3.5s loop
6. **Aura** — radial gradient behind the pet, pulsing at stages 3–6, increasing opacity

### Stage progression

| Stage | XP Range | Label | Aura |
|-------|----------|-------|------|
| 1 | 0–99 | Telur | transparent, no pulse |
| 2 | 100–199 | Bayi | faint orange, no pulse |
| 3 | 200–299 | Remaja | orange, pulses |
| 4 | 300–399 | Dewasa | stronger orange, pulses |
| 5 | 400–499 | Ultimate | bright orange, pulses |
| 6 | 500–599 | Legenda | deep orange, max pulse |

---

## Pet Card (`components/pet-card.tsx`)

- **Double-click name** → inline edit (`renamePet`)
- **Pencil icon** (top-left) → opens `CustomizeModal` for color/accessory
- **XP bar** → shows `exp.current / 100` with total XP counter; max stage shows "MAX"
- **Task list** → renders `TASK_DEFS` with checkmarks for tasks done today

---

## Pet Customization (`components/customize-modal.tsx`)

- **Colors**: 7 color swatches — Orange, Biru, Ungu, Hijau, Pink, Merah, Teal
- **Accessories**: None, Cap, Crown, Beanie — each button shows a 36×36 SVG preview
- **Focus trap**: Tab cycles through modal elements, Escape closes, scroll locked
- **Save**: calls `changePetColor` + `changePetAccessory` → updates `UserStreak` in state + localStorage

---

## Persistence

Everything auto-saves to `localStorage` on every state change via `useEffect` watchers:

| Key | Content |
|---|---|
| `ajarin:streak` | `UserStreak` (pet name, stage, XP, color, accessory) |
| `ajarin:completions` | `TaskCompletion[]` (task records) |
| `ajarin:chat` | `ChatMessage[]` (chat history) |

On hydration (page load), data is loaded and merged with `INITIAL_USER_STREAK` defaults so new fields don't break old saves.

---

## DevFab (`components/dev-fab.tsx`)

Visible on all app pages. Provides:
- **State viewer** — raw JSON of `UserStreak`
- **XP controls** — +10/+50/+100, -10/-50/-100
- **Task toggles** — force-complete or undo any task for today
- **Danger zone** — Reset All (clears everything), Hapus Riwayat Chat

---

## Key Design Decisions

- **No backend** — all data is client-side in localStorage. No auth, no database. The user "Dio V" with initials "DN" is hardcoded.
- **No streak system** — the original consecutive-day streak was removed. Tasks just give flat XP.
- **Light mode only** — the dark mode CSS is commented out.
- **Chat XSS protection** — user messages render via `textContent` (not `innerHTML` or JSX interpolation).
- **Static export** — all pages are prerendered as static content.
