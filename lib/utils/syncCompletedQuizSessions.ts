import { getCookie } from "@/lib/cookies/cookieClient";
import { quizServices } from "@/lib/services/quizServices";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";

/** Legacy: flat JSON array of session ids written by older sync code. */
export const QUIZ_SESSION_IDS_LEGACY_KEY = "quiz-session-ids";

/** Maps API slug/type → `useQuizSessionStore` test key (same rules as `app/client/tests/page.tsx`). */
export function normalizeQuizSessionStoreKey(slug: string, type: string): string {
  const t = type.toLowerCase();
  if (t === "holland") return "holland";
  if (t === "photo") return "photo-career";
  if (t === "disc") return "disc";
  if (t === "career_aptitude") return "career-aptitude";
  if (t === "big_five") return "bigfive";
  if (t === "leadership") return "leadership";
  if (t === "eq5") return "eq";
  if (t === "enneagram") return "enneagram";
  if (t === "mbti") return "typefinder-16";
  if (t === "personal_strengths") return "strengths";
  const sl = slug.toLowerCase();
  if (sl.includes("holland")) return "holland";
  if (sl.includes("photo")) return "photo-career";
  if (sl.includes("disc")) return "disc";
  if (sl.includes("career-aptitude")) return "career-aptitude";
  if (sl.includes("big-five")) return "bigfive";
  if (sl.includes("leadership")) return "leadership";
  if (sl.includes("enneagram")) return "enneagram";
  if (sl.includes("mbti") || sl.includes("typefinder")) return "typefinder-16";
  if (sl.includes("strength")) return "strengths";
  if (sl.includes("emotional") || sl.includes("eq")) return "eq";
  return sl || t.replace(/_/g, "-");
}

type SessionListRow = {
  id: number;
  is_completed?: boolean;
  test_slug?: string;
  test_type?: string;
  completed_at?: string;
  created_at?: string;
  result?: unknown;
};

/**
 * Pull completed quiz sessions from the API into the in-memory session store.
 * Only runs when an access cookie is present (authenticated).
 *
 * Mirrors the merge logic on `/client/tests` so result screens work without
 * persisting heavy `result` blobs to localStorage for logged-in users.
 */
export async function syncCompletedQuizSessionsFromApi(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!getCookie("access")) return;

  try {
    const { body, error } = await quizServices.listSessions({ completed: true });
    if (error || !body?.length) {
      try {
        localStorage.removeItem(QUIZ_SESSION_IDS_LEGACY_KEY);
      } catch {
        /* ignore */
      }
      return;
    }

    const { clearAll, setSession, setResult } = useQuizSessionStore.getState();
    clearAll();

    const latest = new Map<string, { id: number; ts: number; result: unknown }>();
    for (const raw of body) {
      const s = raw as SessionListRow;
      if (!s.is_completed) continue;
      const key = normalizeQuizSessionStoreKey(String(s.test_slug ?? ""), String(s.test_type ?? ""));
      const ts = Date.parse(s.completed_at ?? s.created_at ?? "") || 0;
      const prev = latest.get(key);
      if (!prev || ts > prev.ts || (ts === prev.ts && s.id > prev.id)) {
        latest.set(key, { id: s.id, ts, result: s.result ?? {} });
      }
    }
    latest.forEach(({ id, result }, key) => {
      setSession(key, id);
      setResult(key, result);
    });
  } catch {
    /* ignore sync failures */
  }
}
