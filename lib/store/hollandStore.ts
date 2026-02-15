import { create } from "zustand";

export interface HollandAnswers {
  [questionId: string]: number; // question_id -> Likert value (1-5)
}

export interface HollandState {
  answers: HollandAnswers;
  currentQuestionIndex: number;
  startTime: number | null;
  lastResult: { code: string; scores: Record<string, number> } | null;
  setAnswer: (questionId: string, value: number) => void;
  setCurrentQuestion: (index: number) => void;
  startTest: () => void;
  reset: () => void;
  saveResult: (code: string, scores: Record<string, number>) => void;
  getProgress: () => number; // 0-100
}

const STORAGE_KEY = "holland-test-storage";

function loadFromStorage(): Partial<HollandState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<HollandState>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers: state.answers || {},
      lastResult: state.lastResult || null,
    }));
  } catch {
    // Ignore storage errors
  }
}

const initialState = loadFromStorage();

export const useHollandStore = create<HollandState>((set, get) => ({
  answers: (initialState.answers as HollandAnswers) || {},
  currentQuestionIndex: 0,
  startTime: null,
  lastResult: initialState.lastResult || null,

  setAnswer: (questionId, value) => {
    set((state) => {
      const newAnswers = { ...state.answers, [questionId]: value };
      saveToStorage({ answers: newAnswers, lastResult: state.lastResult });
      return { answers: newAnswers };
    });
  },

  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

  startTest: () => set({ startTime: Date.now(), currentQuestionIndex: 0, answers: {} }),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ answers: {}, currentQuestionIndex: 0, startTime: null, lastResult: null });
  },

  saveResult: (code, scores) => {
    set((state) => {
      const lastResult = { code, scores };
      saveToStorage({ answers: state.answers, lastResult });
      return { lastResult };
    });
  },

  getProgress: () => {
    const { answers } = get();
    const totalQuestions = 48;
    const answered = Object.keys(answers).length;
    return Math.round((answered / totalQuestions) * 100);
  },
}));
