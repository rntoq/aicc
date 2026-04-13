import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Единый стор для всех тестов с персистентностью в localStorage.
 * Ключ (testKey) – идентификатор теста: "holland" | "disc" | "bigfive" | "photo-career" | …
 *
 * После старта сессии: setSession(key, sessionId)
 * После завершения:    setResult(key, backendResponse)
 * Данные сохраняются между перезагрузками страницы.
 */

export interface QuizSessionEntry {
  sessionId: number;
  result: unknown | null;
  completedAt: number | null;
}

export interface QuizSessionStoreState {
  sessions: Partial<Record<string, QuizSessionEntry>>;

  /** Вызывать сразу после POST /sessions/start/ */
  setSession: (testKey: string, sessionId: number) => void;

  /** Вызывать после POST /sessions/finish/, передаём весь ответ бэкенда */
  setResult: (testKey: string, result: unknown) => void;

  getSession: (testKey: string) => QuizSessionEntry | undefined;

  /** true если тест завершён (result получен) */
  isCompleted: (testKey: string) => boolean;

  /** Сбросить сессию конкретного теста */
  clearSession: (testKey: string) => void;

  /** Сбросить все сессии */
  clearAll: () => void;
}

export const useQuizSessionStore = create<QuizSessionStoreState>()(
  persist(
    (set, get) => ({
      sessions: {},

      setSession: (testKey, sessionId) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [testKey]: {
              sessionId,
              result: state.sessions[testKey]?.result ?? null,
              completedAt: state.sessions[testKey]?.completedAt ?? null,
            },
          },
        })),

      setResult: (testKey, result) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [testKey]: {
              sessionId: state.sessions[testKey]?.sessionId ?? 0,
              result,
              completedAt: Date.now(),
            },
          },
        })),

      getSession: (testKey) => get().sessions[testKey],

      isCompleted: (testKey) => {
        const entry = get().sessions[testKey];
        return entry != null && entry.completedAt != null;
      },

      clearSession: (testKey) =>
        set((state) => {
          const next = { ...state.sessions };
          delete next[testKey];
          return { sessions: next };
        }),

      clearAll: () => set({ sessions: {} }),
    }),
    {
      name: "quiz-sessions",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

