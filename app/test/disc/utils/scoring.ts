import type { DiscAnswers } from "@/lib/store/discStore";
import type { DiscQuestion, DiscType } from "../questions";

export interface DiscRawScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DiscNormalizedScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DiscProfile {
  dominant: DiscType;
  dominantScore: number;
  secondary: DiscType | null;
  secondaryScore: number;
  style: string;
  allScores: DiscNormalizedScores;
}

export interface DiscResult {
  rawScores: DiscRawScores;
  normalizedScores: DiscNormalizedScores;
  profile: DiscProfile;
}

export const calculateDiscScores = (
  answers: DiscAnswers,
  questions: DiscQuestion[]
): DiscRawScores => {
  const scores: DiscRawScores = { D: 0, I: 0, S: 0, C: 0 };

  const questionMap = new Map<string, DiscQuestion>();
  questions.forEach((q) => questionMap.set(q.id, q));

  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questionMap.get(questionId);
    if (!question || !answer.most || !answer.least) return;

    const mostStatement = question.statements.find(
      (s) => s.id === answer.most
    );
    const leastStatement = question.statements.find(
      (s) => s.id === answer.least
    );

    if (mostStatement) {
      scores[mostStatement.type] += 1;
    }
    if (leastStatement) {
      scores[leastStatement.type] -= 1;
    }
  });

  return scores;
};

export const normalizeDiscScores = (
  raw: DiscRawScores
): DiscNormalizedScores => {
  const normalized: DiscNormalizedScores = { D: 0, I: 0, S: 0, C: 0 };

  (["D", "I", "S", "C"] as DiscType[]).forEach((type) => {
    const rawScore = raw[type];
    const shifted = rawScore + 24; // [-24,24] -> [0,48]
    normalized[type] = Math.round(((shifted / 48) * 100 + Number.EPSILON) * 100) / 100;
  });

  return normalized;
};

export const determineDiscStyle = (
  dominant: DiscType,
  scores: DiscNormalizedScores
): string => {
  const HIGH = 60;

  const otherHigh = (["D", "I", "S", "C"] as DiscType[])
    .filter((t) => t !== dominant && scores[t] >= HIGH)
    .sort((a, b) => scores[b] - scores[a]);

  if (!otherHigh.length) {
    return dominant;
  }

  const secondary = otherHigh[0];
  const combo = [dominant, secondary].sort().join("");

  const STYLE_MAP: Record<string, string> = {
    DI: "Di",
    DC: "DC",
    ID: "ID",
    IS: "IS",
    SI: "SI",
    SC: "SC",
    CD: "CD",
    CS: "CS",
  };

  return STYLE_MAP[combo] || dominant;
};

export const determineDiscProfile = (
  normalized: DiscNormalizedScores
): DiscProfile => {
  const entries = Object.entries(normalized) as [DiscType, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const [domType, domScore] = sorted[0];
  const [secType, secScore] = sorted[1] || [null, 0];

  const style = determineDiscStyle(domType, normalized);

  return {
    dominant: domType,
    dominantScore: domScore,
    secondary: secType,
    secondaryScore: secScore,
    style,
    allScores: normalized,
  };
};

export const calculateDiscResult = (
  answers: DiscAnswers,
  questions: DiscQuestion[]
): DiscResult => {
  const rawScores = calculateDiscScores(answers, questions);
  const normalizedScores = normalizeDiscScores(rawScores);
  const profile = determineDiscProfile(normalizedScores);

  return {
    rawScores,
    normalizedScores,
    profile,
  };
};

