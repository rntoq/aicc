import { create } from "zustand";

export interface ValuesAnswers {
  [questionId: string]: number; // 1-5
}

export interface ValuesState {
  answers: ValuesAnswers;
  startTime: number | null;
  setAnswer: (questionId: string, value: number) => void;
  startTest: () => void;
  reset: () => void;
  getProgress: (totalQuestions: number) => number;
}

const STORAGE_KEY = "career-values-quiz-storage";

function loadFromStorage(): Partial<ValuesState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<ValuesState>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers: state.answers || {},
      })
    );
  } catch {
    // ignore
  }
}

const initialState = loadFromStorage();

export const useValuesStore = create<ValuesState>((set, get) => ({
  answers: (initialState.answers as ValuesAnswers) || {},
  startTime: null,

  setAnswer: (questionId, value) => {
    set((state) => {
      const next = { ...state.answers, [questionId]: value };
      saveToStorage({ answers: next });
      return { answers: next };
    });
  },

  startTest: () => set({ startTime: Date.now(), answers: {} }),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ answers: {}, startTime: null });
  },

  getProgress: (totalQuestions: number) => {
    const { answers } = get();
    const answered = Object.keys(answers).length;
    return Math.round((answered / totalQuestions) * 100);
  },
}));

