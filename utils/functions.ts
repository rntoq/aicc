export type ChatRole = "ai" | "user" | "system";

export function clamp(min: number, value: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function clamp01(value: number): number {
  return clamp(0, value, 1);
}

export function formatPercent(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return 0;
  return clamp(0, Math.round(n), 100);
}

export function pairToPct(a: number, b: number): { aPct: number; bPct: number } {
  const sum = a + b;
  if (!Number.isFinite(sum) || sum <= 0) return { aPct: 50, bPct: 50 };
  const aPct = Math.round(clamp01(a / sum) * 100);
  return { aPct, bPct: 100 - aPct };
}

export function formatTime(ms: number, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(ms));
}

export function extractTextFromResponse(body: unknown): string {
  if (typeof body === "string") return body;
  if (!body || typeof body !== "object") return "Empty response from AI.";
  const obj = body as Record<string, unknown>;
  const candidateKeys = ["reply", "answer", "text", "message", "response", "content"];
  for (const k of candidateKeys) {
    if (typeof obj[k] === "string" && (obj[k] as string).trim()) return obj[k] as string;
  }
  return JSON.stringify(body, null, 2);
}

/**
 * Pull a human-readable message out of an API/Axios error.
 *
 * Handles DRF-style payloads such as:
 *  - `{ "detail": "..." }`
 *  - `{ "non_field_errors": ["..."] }`
 *  - `{ "email": ["Введите правильный адрес электронной почты."] }`
 *
 * Returns `null` when nothing meaningful is found (e.g. a bare
 * "Request failed with status code 400"), so callers can fall back to a
 * localized generic message instead of leaking the raw Axios text.
 */
export function extractApiErrorMessage(err: unknown): string | null {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (data == null) return null;

  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof data !== "object") return null;

  const firstString = (value: unknown): string | null => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = firstString(item);
        if (found) return found;
      }
    }
    return null;
  };

  const obj = data as Record<string, unknown>;

  const detail = firstString(obj.detail);
  if (detail) return detail;

  const nonField = firstString(obj.non_field_errors);
  if (nonField) return nonField;

  for (const key of Object.keys(obj)) {
    const found = firstString(obj[key]);
    if (found) return found;
  }

  return null;
}

export function classifyAiChatResponseRole(body: unknown): ChatRole {
  if (!body || typeof body !== "object") return "ai";
  const obj = body as Record<string, unknown>;
  if (obj.in_scope === false) return "system";
  const answer = typeof obj.answer === "string" ? obj.answer : "";
  if (answer.includes("RESOURCE_EXHAUSTED") || answer.includes("429")) return "system";
  return "ai";
}

