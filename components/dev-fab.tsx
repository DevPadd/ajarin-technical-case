"use client";

import { useEffect, useRef, useState } from "react";
import { Wrench, X, Plus, Minus, RotateCcw, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGamification, TASK_DEFS } from "@/components/streak-provider";
import { clearMessages } from "@/lib/chat-storage";

export default function DevFab() {
  const {
    state,
    completeTask,
    isTaskDoneToday,
    removeTaskCompletion,
    adjustExp,
    reset,
    isHydrated,
  } = useGamification();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Dev tools"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-orange-400 text-white shadow-lg hover:bg-orange-500 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
      >
        <Wrench size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="fab-backdrop"
              className="fixed inset-0 bg-black/30 z-50"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              key="fab-modal"
              ref={panelRef}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
            >
              <motion.div
                className="pointer-events-auto w-full max-w-sm bg-white rounded-xl shadow-xl border border-zinc-200 max-h-[80vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                  <h2 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                    <Wrench size={14} />
                    Dev Tools
                  </h2>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-5 space-y-5 text-sm">
                  {/* Pet State */}
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                      Pet State
                    </h3>
                    <pre className="text-[11px] bg-zinc-50 border border-zinc-200 rounded-md p-3 overflow-x-auto text-zinc-600">
                      {JSON.stringify(state, null, 2)}
                    </pre>
                  </section>

                  {/* XP Controls */}
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                      XP
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {[10, 50, 100].map((n) => (
                        <button
                          key={`add-${n}`}
                          type="button"
                          onClick={() => adjustExp(n)}
                          disabled={!isHydrated}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-orange-50 text-orange-600 text-xs font-medium hover:bg-orange-100 disabled:opacity-40"
                        >
                          <Plus size={12} /> {n}
                        </button>
                      ))}
                      {[10, 50, 100].map((n) => (
                        <button
                          key={`sub-${n}`}
                          type="button"
                          onClick={() => adjustExp(-n)}
                          disabled={!isHydrated || state.petExp < n}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 disabled:opacity-40"
                        >
                          <Minus size={12} /> {n}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Task Toggles */}
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                      Tugas
                    </h3>
                    <div className="space-y-2">
                      {TASK_DEFS.map((task) => {
                        const done = isTaskDoneToday(task.id);
                        return (
                          <div
                            key={task.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                  done
                                    ? "bg-green-400 border-green-400 text-white"
                                    : "border-zinc-300"
                                }`}
                              >
                                {done && "✓"}
                              </span>
                              <span className="text-xs text-zinc-600">
                                {task.label}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-mono">
                                +{task.xp}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                done
                                  ? removeTaskCompletion(task.id)
                                  : completeTask(task.id, task.xp)
                              }
                              disabled={!isHydrated}
                              className={`text-xs px-2 py-0.5 rounded font-medium transition-colors disabled:opacity-40 ${
                                done
                                  ? "text-red-500 hover:bg-red-50"
                                  : "text-orange-500 hover:bg-orange-50"
                              }`}
                            >
                              {done ? "Batalkan" : "Selesaikan"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Danger Zone */}
                  <section className="border-t border-zinc-100 pt-4 space-y-2">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                      Danger Zone
                    </h3>
                    <button
                      type="button"
                      onClick={reset}
                      disabled={!isHydrated}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 disabled:opacity-40"
                    >
                      <RotateCcw size={12} />
                      Reset All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 ml-2"
                    >
                      <Trash2 size={12} />
                      Hapus Riwayat Chat
                    </button>
                  </section>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
