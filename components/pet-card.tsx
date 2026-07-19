"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Check, Pencil } from "lucide-react";
import { useGamification, TASK_DEFS } from "@/components/streak-provider";
import { PET_COLORS, getExpForNextStage } from "@/lib/gamification-store";
import Pet from "@/components/pet";
import CustomizeModal from "@/components/customize-modal";

const STAGE_LABELS: Record<number, string> = {
  1: "Stage 1 — Telur",
  2: "Stage 2 — Bayi",
  3: "Stage 3 — Remaja",
  4: "Stage 4 — Dewasa",
  5: "Stage 5 — Ultimate",
  6: "Stage 6 — Legenda",
};

export default function PetCard() {
  const { state, isTaskDoneToday, renamePet } = useGamification();

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(state.petName);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const stage = state.petStage;
  const exp = getExpForNextStage(state.petExp);
  const isMaxStage = stage >= 5;

  const colorConfig = PET_COLORS.find((c) => c.primary === state.petColor) || PET_COLORS[0];

  function startEditing() {
    setNameDraft(state.petName);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  }

  function saveName() {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== state.petName) {
      renamePet(trimmed);
    }
    setEditing(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") saveName();
    if (e.key === "Escape") setEditing(false);
  }

  return (
    <section className="relative border border-zinc-200 rounded-lg bg-white p-6 flex flex-col items-center gap-5">
      <button
        type="button"
        onClick={() => setCustomizeOpen(true)}
        aria-label="Customize pet"
        className="absolute top-3 left-3 p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
      >
        <Pencil size={16} />
      </button>

      <CustomizeModal
        isOpen={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
      />

      <Pet
        stage={stage}
        color={colorConfig.primary}
        blush={colorConfig.blush}
        accessory={state.petAccessory}
      />

      <div className="text-center">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={saveName}
            onKeyDown={onKeyDown}
            className="text-xl font-bold text-center border-b-2 border-orange-400 outline-none w-40"
          />
        ) : (
          <h2
            className="text-xl font-bold cursor-pointer inline-flex items-center gap-2 group"
            onDoubleClick={startEditing}
          >
            {state.petName}
          </h2>
        )}
        <p className="text-xs text-zinc-500 mt-0.5">{STAGE_LABELS[stage]}</p>
      </div>

      <div className="w-full max-w-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            {isMaxStage ? "MAX" : `XP ${exp.current} / ${exp.needed}`}
          </span>
          <span>{state.petExp} total</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full transition-all duration-300"
            style={{ width: `${isMaxStage ? 100 : exp.progress * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-xs border-t border-zinc-100 pt-4 space-y-2">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Tugas Hari Ini
        </h3>
        {TASK_DEFS.map((task) => {
          const done = isTaskDoneToday(task.id);
          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 text-sm ${
                done ? "text-zinc-400" : "text-zinc-700"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  done
                    ? "bg-orange-400 border-orange-400 text-white"
                    : "border-zinc-300"
                }`}
              >
                {done && <Check size={12} strokeWidth={3} />}
              </span>
              <span className={done ? "line-through" : ""}>{task.label}</span>
              <span className="ml-auto text-xs font-medium">+{task.xp} XP</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
