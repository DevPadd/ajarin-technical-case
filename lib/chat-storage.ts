export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  sentAt: string;
}

export const STORAGE_KEY_CHAT = "ajarin:chat";

function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.authorId === "string" &&
    typeof v.authorName === "string" &&
    typeof v.text === "string" &&
    typeof v.sentAt === "string"
  );
}

export function loadMessages(): ChatMessage[] {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CHAT);
    if (raw === null) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isChatMessage);
  } catch {
    return [];
  }
}

export function saveMessages(list: ChatMessage[]): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(list));
  } catch {
    /* quota / private mode — silently ignore */
  }
}

export function clearMessages(): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_CHAT);
  } catch {
    /* ignore */
  }
}
