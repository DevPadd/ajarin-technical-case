"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGamification } from "@/components/streak-provider";
import { PET_COLORS, PET_ACCESSORIES } from "@/lib/gamification-store";
import Pet, {
  AccessoryCap,
  AccessoryCrown,
  AccessoryBeanie,
} from "@/components/pet";

export default function CustomizeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { state, changePetColor, changePetAccessory } = useGamification();
  const [draftColor, setDraftColor] = useState(state.petColor);
  const [draftAccessory, setDraftAccessory] = useState(state.petAccessory);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setDraftColor(state.petColor);
        setDraftAccessory(state.petAccessory);
      });
    }
  }, [isOpen, state.petColor, state.petAccessory]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      modalRef.current?.focus();
    });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  const selectedColorConfig = PET_COLORS.find((c) => c.primary === draftColor) || PET_COLORS[0];

  const ACC_COMPONENTS: Record<string, () => React.ReactNode> = {
    cap: AccessoryCap,
    crown: AccessoryCrown,
    beanie: AccessoryBeanie,
  };

  function handleSave() {
    changePetColor(draftColor);
    changePetAccessory(draftAccessory);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="customize-backdrop"
            className="fixed inset-0 bg-black/30 z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            key="customize-modal"
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              className="pointer-events-auto w-full max-w-xl bg-white rounded-xl shadow-xl border border-zinc-200 outline-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <h2 className="text-sm font-semibold text-zinc-700">
                  Customize Pet
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row">
                <div className="flex items-center justify-center p-6 sm:w-1/2 border-b sm:border-b-0 sm:border-r border-zinc-100">
                  <Pet
                    stage={state.petStage}
                    color={selectedColorConfig.primary}
                    blush={selectedColorConfig.blush}
                    accessory={draftAccessory}
                  />
                </div>

                <div className="flex-1 p-5 space-y-5">
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                      Colors
                    </h3>
                    <div className="flex gap-3">
                      {PET_COLORS.map((c) => (
                        <button
                          key={c.primary}
                          type="button"
                          onClick={() => setDraftColor(c.primary)}
                          title={c.name}
                          className={`w-8 h-8 rounded-full transition-all ${
                            draftColor === c.primary
                              ? "ring-2 ring-offset-2 ring-orange-400 scale-110"
                              : "hover:scale-110"
                          }`}
                          style={{ backgroundColor: c.primary }}
                        />
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                      Accessories
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {PET_ACCESSORIES.map((a) => {
                        const AccComponent = a.id !== "none"
                          ? ACC_COMPONENTS[a.id]
                          : null;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setDraftAccessory(a.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                              draftAccessory === a.id
                                ? "bg-orange-100 text-orange-600 border border-orange-300"
                                : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                            }`}
                          >
                            {AccComponent ? (
                              <svg
                                width="36"
                                height="36"
                                viewBox="0 0 300 300"
                                fill="none"
                              >
                                <AccComponent />
                              </svg>
                            ) : (
                              <span className="w-9 h-9 flex items-center justify-center text-zinc-400">
                                —
                              </span>
                            )}
                            {a.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-orange-400 text-white hover:bg-orange-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
