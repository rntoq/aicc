import { create } from "zustand";

export interface TestsState {
  /** IDs of tests that user has completed (for UI: show "Показать результат") */
  completedTestIds: Set<string>;
  /** ID of test whose result modal is open, or null */
  openResultModalId: string | null;
  setCompleted: (id: string) => void;
  setOpenResultModalId: (id: string | null) => void;
  isCompleted: (id: string) => boolean;
}

export const useTestsStore = create<TestsState>((set, get) => ({
  completedTestIds: new Set(),
  openResultModalId: null,

  setCompleted: (id) =>
    set((state) => ({
      completedTestIds: new Set(state.completedTestIds).add(id),
    })),

  setOpenResultModalId: (id) => set({ openResultModalId: id }),

  isCompleted: (id) => get().completedTestIds.has(id),
}));
