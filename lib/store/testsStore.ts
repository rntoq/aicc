import { create } from "zustand";

export interface TestsState {
  /** IDs тестов, которые пользователь завершил (для UI: показывать "Показать результат") */
  completedTestIds: Set<string>;
  /** ID теста, для которого открыт модальный результат, или null */
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

