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

export function classifyAiChatResponseRole(body: unknown): ChatRole {
  if (!body || typeof body !== "object") return "ai";
  const obj = body as Record<string, unknown>;
  if (obj.in_scope === false) return "system";
  const answer = typeof obj.answer === "string" ? obj.answer : "";
  if (answer.includes("RESOURCE_EXHAUSTED") || answer.includes("429")) return "system";
  return "ai";
}

