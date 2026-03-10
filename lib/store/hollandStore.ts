import { create } from "zustand";

export interface HollandLocalResult {
  finishedAt: number;
  payload: unknown;
}

export interface HollandState {
  /** Локальный результат Holland для неавторизованного пользователя */
  result: HollandLocalResult | null;
  setResult: (result: HollandLocalResult | null) => void;
}

export const useHollandStore = create<HollandState>((set) => ({
  result: null,

  setResult: (result) => set({ result }),
}));

