import { create } from "zustand";

/**
 * В этих сторах теперь держим только локальные результаты тестов
 * (для неавторизованных пользователей). Ответы по вопросам и прогресс
 * считаются на уровне компонента.
 */

export interface BigFiveResult {
  finishedAt: number;
  /** Сырые баллы по вопросам или агрегированным шкалам */
  payload: unknown;
}

export interface BigFiveState {
  /** Локальный результат Big Five для неавторизованного пользователя */
  result: BigFiveResult | null;
  setResult: (result: BigFiveResult | null) => void;
}

export const useBigFiveStore = create<BigFiveState>((set) => ({
  result: null,

  setResult: (result) => set({ result }),
}));

