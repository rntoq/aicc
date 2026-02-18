import type { PhotoQuestion, PhotoCategory } from "../questions";
import type { PhotoQuizAnswers } from "@/lib/store/photoQuizStore";

export interface CategoryCounts {
  BUILDING: number;
  THINKING: number;
  CREATING: number;
  HELPING: number;
  PERSUADING: number;
  ORGANIZING: number;
}

export interface CategoryPercentages {
  BUILDING: number;
  THINKING: number;
  CREATING: number;
  HELPING: number;
  PERSUADING: number;
  ORGANIZING: number;
}

export interface HollandScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface PhotoQuizResult {
  categoryCounts: CategoryCounts;
  categoryPercentages: CategoryPercentages;
  hollandScores: HollandScores;
  hollandCode: string;
  primary: "R" | "I" | "A" | "S" | "E" | "C";
  secondary: "R" | "I" | "A" | "S" | "E" | "C";
  tertiary: "R" | "I" | "A" | "S" | "E" | "C";
}

const CATEGORY_TO_HOLLAND: Record<PhotoCategory, "R" | "I" | "A" | "S" | "E" | "C"> = {
  BUILDING: "R",
  THINKING: "I",
  CREATING: "A",
  HELPING: "S",
  PERSUADING: "E",
  ORGANIZING: "C",
};

/**
 * Calculate category counts from answers
 */
export const calculateCategoryCounts = (
  answers: PhotoQuizAnswers,
  questions: PhotoQuestion[]
): CategoryCounts => {
  const counts: CategoryCounts = {
    BUILDING: 0,
    THINKING: 0,
    CREATING: 0,
    HELPING: 0,
    PERSUADING: 0,
    ORGANIZING: 0,
  };

  questions.forEach((question) => {
    const selectedOption = answers[question.id];
    if (selectedOption) {
      const selected = selectedOption === "optionA" ? question.optionA : question.optionB;
      counts[selected.category] += 1;
    }
  });

  return counts;
};

/**
 * Normalize counts to percentages
 */
export const normalizeToPercentages = (counts: CategoryCounts): CategoryPercentages => {
  const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
  if (total === 0) {
    return {
      BUILDING: 0,
      THINKING: 0,
      CREATING: 0,
      HELPING: 0,
      PERSUADING: 0,
      ORGANIZING: 0,
    };
  }

  return {
    BUILDING: Math.round((counts.BUILDING / total) * 100 * 10) / 10,
    THINKING: Math.round((counts.THINKING / total) * 100 * 10) / 10,
    CREATING: Math.round((counts.CREATING / total) * 100 * 10) / 10,
    HELPING: Math.round((counts.HELPING / total) * 100 * 10) / 10,
    PERSUADING: Math.round((counts.PERSUADING / total) * 100 * 10) / 10,
    ORGANIZING: Math.round((counts.ORGANIZING / total) * 100 * 10) / 10,
  };
};

/**
 * Convert Photo categories to Holland Code scores
 */
export const convertToHollandScores = (
  percentages: CategoryPercentages
): HollandScores => {
  return {
    R: percentages.BUILDING,
    I: percentages.THINKING,
    A: percentages.CREATING,
    S: percentages.HELPING,
    E: percentages.PERSUADING,
    C: percentages.ORGANIZING,
  };
};

/**
 * Determine Holland Code from scores
 */
export const determineHollandCode = (scores: HollandScores): {
  code: string;
  primary: "R" | "I" | "A" | "S" | "E" | "C";
  secondary: "R" | "I" | "A" | "S" | "E" | "C";
  tertiary: "R" | "I" | "A" | "S" | "E" | "C";
} => {
  const entries = Object.entries(scores) as [
    "R" | "I" | "A" | "S" | "E" | "C",
    number
  ][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);

  return {
    code: top3.map(([code]) => code).join(""),
    primary: top3[0][0],
    secondary: top3[1][0],
    tertiary: top3[2][0],
  };
};

/**
 * Calculate complete Photo Quiz result
 */
export const calculatePhotoQuizResult = (
  answers: PhotoQuizAnswers,
  questions: PhotoQuestion[]
): PhotoQuizResult => {
  const categoryCounts = calculateCategoryCounts(answers, questions);
  const categoryPercentages = normalizeToPercentages(categoryCounts);
  const hollandScores = convertToHollandScores(categoryPercentages);
  const hollandCode = determineHollandCode(hollandScores);

  return {
    categoryCounts,
    categoryPercentages,
    hollandScores,
    ...hollandCode,
  };
};
