import type {
  CareerValueCategory,
  CareerValueQuestion,
  CAREER_VALUE_CATEGORIES,
} from "../questions";
import type { ValuesAnswers } from "@/lib/store/valuesStore";

export type ValuesCategoryKey = (typeof CAREER_VALUE_CATEGORIES)[number];

export type AverageScores = Record<CareerValueCategory, number>;

export interface RankedValue {
  rank: number;
  category: CareerValueCategory;
  score: number;
  importanceLevel:
    | "critically_important"
    | "very_important"
    | "moderately_important"
    | "somewhat_important"
    | "not_important";
}

export interface ValuesResult {
  averageScores: AverageScores;
  ranked: RankedValue[];
  top5: RankedValue[];
}

export function calculateAverageScores(
  answers: ValuesAnswers,
  questions: CareerValueQuestion[]
): AverageScores {
  const grouped: Record<CareerValueCategory, number[]> = {
    ACHIEVEMENT: [],
    INDEPENDENCE: [],
    RECOGNITION: [],
    RELATIONSHIPS: [],
    SUPPORT: [],
    WORKING_CONDITIONS: [],
    CHALLENGE: [],
    CREATIVITY: [],
    KNOWLEDGE: [],
    SECURITY: [],
    MEANING: [],
    COLLABORATION: [],
  };

  const questionMap = new Map<string, CareerValueQuestion>();
  questions.forEach((q) => questionMap.set(q.id, q));

  Object.entries(answers).forEach(([id, value]) => {
    const q = questionMap.get(id);
    if (!q) return;
    grouped[q.category].push(value);
  });

  const averages = {} as AverageScores;

  (Object.keys(grouped) as CareerValueCategory[]).forEach((cat) => {
    const list = grouped[cat];
    if (!list.length) {
      averages[cat] = 0;
    } else {
      const avg = list.reduce((s, v) => s + v, 0) / list.length;
      averages[cat] = Math.round((avg + Number.EPSILON) * 100) / 100;
    }
  });

  return averages;
}

export function determineImportanceLevel(
  score: number
): RankedValue["importanceLevel"] {
  if (score >= 4.5) return "critically_important";
  if (score >= 3.5) return "very_important";
  if (score >= 2.5) return "moderately_important";
  if (score >= 1.5) return "somewhat_important";
  return "not_important";
}

export function rankValues(averageScores: AverageScores): RankedValue[] {
  const entries = Object.entries(averageScores) as [
    CareerValueCategory,
    number
  ][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);

  return sorted.map(([category, score], index) => ({
    rank: index + 1,
    category,
    score,
    importanceLevel: determineImportanceLevel(score),
  }));
}

export function getTopValues(
  ranked: RankedValue[],
  count = 5
): RankedValue[] {
  return ranked.slice(0, count);
}

export function calculateValuesResult(
  answers: ValuesAnswers,
  questions: CareerValueQuestion[]
): ValuesResult {
  const averageScores = calculateAverageScores(answers, questions);
  const ranked = rankValues(averageScores);
  const top5 = getTopValues(ranked, 5);

  return { averageScores, ranked, top5 };
}

