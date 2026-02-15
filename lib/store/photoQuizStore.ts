import { create } from "zustand";

export interface PhotoQuizAnswers {
  [questionId: string]: "optionA" | "optionB"; // question_id -> selected option
}

export interface PhotoQuizState {
  answers: PhotoQuizAnswers;
  startTime: number | null;
  setAnswer: (questionId: string, option: "optionA" | "optionB") => void;
  startTest: () => void;
  reset: () => void;
  getProgress: () => number; // 0-100
}

const STORAGE_KEY = "photo-quiz-storage";

function loadFromStorage(): Partial<PhotoQuizState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<PhotoQuizState>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers: state.answers || {},
    }));
  } catch {
    // Ignore storage errors
  }
}

const initialState = loadFromStorage();

export const usePhotoQuizStore = create<PhotoQuizState>((set, get) => ({
  answers: (initialState.answers as PhotoQuizAnswers) || {},
  startTime: null,

  setAnswer: (questionId, option) => {
    set((state) => {
      const newAnswers = { ...state.answers, [questionId]: option };
      saveToStorage({ answers: newAnswers });
      return { answers: newAnswers };
    });
  },

  startTest: () => set({ startTime: Date.now(), answers: {} }),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ answers: {}, startTime: null });
  },

  getProgress: () => {
    const { answers } = get();
    const totalQuestions = 30;
    const answered = Object.keys(answers).length;
    return Math.round((answered / totalQuestions) * 100);
  },
}));
