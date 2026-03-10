import { create } from "zustand";

export interface DiscResult {
  finishedAt: number;
  payload: unknown;
}

export interface DiscState {
  result: DiscResult | null;
  setResult: (result: DiscResult | null) => void;
}

export const useDiscStore = create<DiscState>((set) => ({
  result: null,

  setResult: (result) => set({ result }),
}));

