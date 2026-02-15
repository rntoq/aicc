import { create } from "zustand";

export interface DiscAnswer {
  most: string | null; // statement id
  least: string | null; // statement id
}

export interface DiscAnswers {
  [questionId: string]: DiscAnswer;
}

export interface DiscState {
  answers: DiscAnswers;
  startTime: number | null;
  setAnswer: (questionId: string, most: string | null, least: string | null) => void;
  startTest: () => void;
  reset: () => void;
  getProgress: (totalQuestions: number) => number;
}

const STORAGE_KEY = "disc-assessment-storage";

function loadFromStorage(): Partial<DiscState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<DiscState>) {
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

export const useDiscStore = create<DiscState>((set, get) => ({
  answers: (initialState.answers as DiscAnswers) || {},
  startTime: null,

  setAnswer: (questionId, most, least) => {
    set((state) => {
      const newAnswers: DiscAnswers = {
        ...state.answers,
        [questionId]: { most, least },
      };
      saveToStorage({ answers: newAnswers });
      return { answers: newAnswers };
    });
  },

  startTest: () => set({ startTime: Date.now(), answers: {} }),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ answers: {}, startTime: null });
  },

  getProgress: (totalQuestions: number) => {
    const { answers } = get();
    const answeredCount = Object.values(answers).filter(
      (a) => a.most && a.least
    ).length;
    return Math.round((answeredCount / totalQuestions) * 100);
  },
}));

