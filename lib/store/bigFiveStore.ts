import { create } from "zustand";

export interface BigFiveAnswers {
  [questionId: string]: number; // 1-5
}

export interface BigFiveState {
  hydrated: boolean;
  answers: BigFiveAnswers;
  startTime: number | null;
  hydrate: () => void;
  setAnswer: (questionId: string, value: number) => void;
  startTest: () => void;
  reset: () => void;
}

const STORAGE_KEY = "bigfive-ocean-storage";

function readStorage(): BigFiveAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { answers?: BigFiveAnswers };
    return parsed.answers || {};
  } catch {
    return {};
  }
}

function writeStorage(answers: BigFiveAnswers) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers }));
  } catch {
    // ignore
  }
}

export const useBigFiveStore = create<BigFiveState>((set, get) => ({
  hydrated: false,
  answers: {},
  startTime: null,

  hydrate: () => {
    if (get().hydrated) return;
    const answers = readStorage();
    set({ hydrated: true, answers });
  },

  setAnswer: (questionId, value) => {
    set((state) => {
      const next = { ...state.answers, [questionId]: value };
      writeStorage(next);
      return { answers: next };
    });
  },

  startTest: () => {
    // keep stored answers; only set start time
    set({ startTime: Date.now() });
  },

  reset: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    set({ answers: {}, startTime: null, hydrated: true });
  },
}));

