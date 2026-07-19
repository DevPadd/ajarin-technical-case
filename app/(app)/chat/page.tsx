"use client";

import { Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useGamification } from "@/components/streak-provider";
import { formatLocalTime } from "@/lib/date";
import {
  type ChatMessage,
  clearMessages,
  loadMessages,
  saveMessages,
} from "@/lib/chat-storage";

function SafeText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = text;
    }
  }, [text]);
  return (
    <p ref={ref} className="text-sm whitespace-pre-wrap wrap-break-word" />
  );
}

const CURRENT_USER_ID = "me";
const CURRENT_USER_NAME = "Kamu";

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChatPage() {
  const { completeTask, isHydrated } = useGamification();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = loadMessages();
    queueMicrotask(() => {
      setMessages(loaded);
      setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveMessages(messages);
  }, [messages, hasHydrated]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (text === "") return;

    const message: ChatMessage = {
      id: makeId(),
      authorId: CURRENT_USER_ID,
      authorName: CURRENT_USER_NAME,
      text,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
    setDraft("");

    if (isHydrated) {
      const result = completeTask("send-chat", 15);
      if (result.expGained > 0) {
        toast.success(`+${result.expGained} XP — Pesan terkirim!`, {
          duration: 2000,
        });
      }
    }
  }

  function handleClear() {
    clearMessages();
    setMessages([]);
  }

  const renderedMessages = useMemo(
    () =>
      messages.map((m) => {
        const isSelf = m.authorId === CURRENT_USER_ID;
        const time = formatLocalTime(new Date(m.sentAt));
        return (
          <div
            key={m.id}
            className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-2 shadow-sm ${
                isSelf
                  ? "bg-orange-400 text-white rounded-br-sm"
                  : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm"
              }`}
            >
              {!isSelf && (
                <div className="text-xs font-semibold text-zinc-500 mb-0.5">
                  {m.authorName}
                </div>
              )}
              <SafeText text={m.text} />
              <div
                className={`text-[10px] mt-1 ${
                  isSelf ? "text-orange-50/80" : "text-zinc-400"
                }`}
              >
                {time}
              </div>
            </div>
          </div>
        );
      }),
    [messages],
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen px-4 md:px-10 lg:px-20 py-6 md:py-10">
      <header className="flex items-end justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Chat
          </h1>
          <p className="text-sm text-zinc-500">
            Ruang diskusi bersama teman-teman sekelasmu.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          aria-label="Hapus riwayat chat"
          className="text-xs text-zinc-400 hover:text-zinc-600"
        >
          Hapus riwayat
        </button>
      </header>

      <div className="relative flex-1 flex flex-col border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {renderedMessages}
          {renderedMessages.length === 0 && (
            <div className="h-full flex items-center justify-center text-sm text-zinc-400">
              Belum ada pesan. Mulai obrolan!
            </div>
          )}
          <div ref={listEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="border-t border-zinc-200 bg-white p-3 flex items-center gap-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tulis pesan..."
            aria-label="Tulis pesan"
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
          />
          <button
            type="submit"
            disabled={draft.trim() === ""}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-orange-400 text-white text-sm font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
