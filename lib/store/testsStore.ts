import { create } from "zustand";

export interface TestsState {
  /** ID теста, для которого открыт модальный результат, или null */
  openResultModalId: string | null;
  setOpenResultModalId: (id: string | null) => void;
}

export const useTestsStore = create<TestsState>((set) => ({
  openResultModalId: null,
  setOpenResultModalId: (id) => set({ openResultModalId: id }),
}));
