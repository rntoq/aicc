import { create } from "zustand";

export interface PhotoQuizResult {
  finishedAt: number;
  payload: unknown;
}

export interface PhotoQuizState {
  result: PhotoQuizResult | null;
  setResult: (result: PhotoQuizResult | null) => void;
}

export const usePhotoQuizStore = create<PhotoQuizState>((set) => ({
  result: null,

  setResult: (result) => set({ result }),
}));

