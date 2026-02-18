import type { HollandQuestion } from "../questions";
import type { HollandAnswers } from "@/lib/store/hollandStore";

export interface HollandScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface HollandCodeResult {
  code: string;
  primary: string;
  secondary: string;
  tertiary: string;
  primaryScore: number;
  secondaryScore: number;
  tertiaryScore: number;
}

export interface HollandResult {
  rawScores: HollandScores;
  normalizedScores: HollandScores;
  hollandCode: HollandCodeResult;
}

/**
 * Calculate raw scores from answers
 */
export const calculateRawScores = (
  answers: HollandAnswers,
  questions: HollandQuestion[]
): HollandScores => {
  const scores: HollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer != null) {
      const weightedScore = answer * question.weight;
      scores[question.category] += weightedScore;
    }
  });

  return scores;
};

/**
 * Normalize scores to 0-100 range
 */
export const normalizeScores = (rawScores: HollandScores): HollandScores => {
  const maxPossiblePerCategory = 40; // 8 questions * 5 max value

  return {
    R: Math.round((rawScores.R / maxPossiblePerCategory) * 100 * 10) / 10,
    I: Math.round((rawScores.I / maxPossiblePerCategory) * 100 * 10) / 10,
    A: Math.round((rawScores.A / maxPossiblePerCategory) * 100 * 10) / 10,
    S: Math.round((rawScores.S / maxPossiblePerCategory) * 100 * 10) / 10,
    E: Math.round((rawScores.E / maxPossiblePerCategory) * 100 * 10) / 10,
    C: Math.round((rawScores.C / maxPossiblePerCategory) * 100 * 10) / 10,
  };
};

/**
 * Determine Holland Code (3-letter code from top 3 categories)
 */
export const determineHollandCode = (
  normalizedScores: HollandScores
): HollandCodeResult => {
  const entries = Object.entries(normalizedScores) as [
    keyof HollandScores,
    number
  ][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);

  return {
    code: top3.map(([cat]) => cat).join(""),
    primary: top3[0][0],
    secondary: top3[1][0],
    tertiary: top3[2][0],
    primaryScore: top3[0][1],
    secondaryScore: top3[1][1],
    tertiaryScore: top3[2][1],
  };
};

/**
 * Calculate complete Holland test result
 */
export const calculateHollandResult = (
  answers: HollandAnswers,
  questions: HollandQuestion[]
): HollandResult => {
  const rawScores = calculateRawScores(answers, questions);
  const normalizedScores = normalizeScores(rawScores);
  const hollandCode = determineHollandCode(normalizedScores);

  return {
    rawScores,
    normalizedScores,
    hollandCode,
  };
};
