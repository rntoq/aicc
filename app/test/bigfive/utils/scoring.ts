import type { BigFiveAnswers } from "@/lib/store/bigFiveStore";
import type { BigFiveQuestion, BigFiveTrait } from "../questions";

export interface BigFiveRawScores {
  OPENNESS: number;
  CONSCIENTIOUSNESS: number;
  EXTRAVERSION: number;
  AGREEABLENESS: number;
  NEUROTICISM: number;
}

export interface BigFiveNormalizedScores {
  OPENNESS: number;
  CONSCIENTIOUSNESS: number;
  EXTRAVERSION: number;
  AGREEABLENESS: number;
  NEUROTICISM: number;
}

export interface BigFiveResult {
  raw: BigFiveRawScores;
  normalized: BigFiveNormalizedScores;
}

function emptyRaw(): BigFiveRawScores {
  return {
    OPENNESS: 0,
    CONSCIENTIOUSNESS: 0,
    EXTRAVERSION: 0,
    AGREEABLENESS: 0,
    NEUROTICISM: 0,
  };
}

export function processAnswer(reverse: boolean, value: number): number {
  if (!reverse) return value;
  // 1→5, 2→4, 3→3, 4→2, 5→1
  return 6 - value;
}

export function calculateRawScores(
  answers: BigFiveAnswers,
  questions: BigFiveQuestion[]
): BigFiveRawScores {
  const traitToValues: Record<BigFiveTrait, number[]> = {
    OPENNESS: [],
    CONSCIENTIOUSNESS: [],
    EXTRAVERSION: [],
    AGREEABLENESS: [],
    NEUROTICISM: [],
  };

  const questionMap = new Map<string, BigFiveQuestion>();
  questions.forEach((q) => questionMap.set(q.id, q));

  Object.entries(answers).forEach(([id, value]) => {
    const q = questionMap.get(id);
    if (!q) return;
    const processed = processAnswer(q.reverse, value);
    traitToValues[q.trait].push(processed);
  });

  const raw = emptyRaw();

  (Object.keys(traitToValues) as BigFiveTrait[]).forEach((trait) => {
    const arr = traitToValues[trait];
    if (!arr.length) {
      raw[trait] = 0;
    } else {
      const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
      raw[trait] = Math.round((avg + Number.EPSILON) * 100) / 100;
    }
  });

  return raw;
}

export function normalizeScores(
  raw: BigFiveRawScores
): BigFiveNormalizedScores {
  const normalized: BigFiveNormalizedScores = {
    OPENNESS: 0,
    CONSCIENTIOUSNESS: 0,
    EXTRAVERSION: 0,
    AGREEABLENESS: 0,
    NEUROTICISM: 0,
  };

  (Object.keys(raw) as (keyof BigFiveRawScores)[]).forEach((trait) => {
    const val = raw[trait];
    if (val <= 0) {
      normalized[trait] = 0;
    } else {
      // raw 1–5 -> 0–100
      const n = ((val - 1) / 4) * 100;
      normalized[trait] = Math.round((n + Number.EPSILON) * 100) / 100;
    }
  });

  return normalized;
}

export function calculateBigFiveResult(
  answers: BigFiveAnswers,
  questions: BigFiveQuestion[]
): BigFiveResult {
  const raw = calculateRawScores(answers, questions);
  const normalized = normalizeScores(raw);
  return { raw, normalized };
}

