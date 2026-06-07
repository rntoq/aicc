import type { PublicProfession, PublicUniversity } from "@/lib/types";
import type {
  AnalysisReportCareerSuggestion,
  AnalysisReportItem,
  RecommendedRef,
} from "@/lib/services/analyseServices";
import PROFESSIONS_JSON from "@/public/jsons/professions.json";
import PROFESSIONS_BACKEND_JSON from "@/public/jsons/responseofback.json";
import UNIVERSITIES_JSON from "@/public/jsons/universities.json";

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[«»"'""]/g, "");
}

const professionsData = PROFESSIONS_JSON as PublicProfession[];
const universitiesData = UNIVERSITIES_JSON as PublicUniversity[];

const professionById = new Map<string, PublicProfession>();
const professionByName = new Map<string, PublicProfession>();
const professionCodeToId = new Map<string, number>();

for (const p of professionsData) {
  professionById.set(String(p.id), p);
  const ru = normalizeName(p.name?.ru ?? "");
  const en = normalizeName(p.name?.en ?? "");
  if (ru) professionByName.set(ru, p);
  if (en) professionByName.set(en, p);
}

for (const b of PROFESSIONS_BACKEND_JSON as Array<{ id: number; code: string }>) {
  if (b.code) professionCodeToId.set(b.code, b.id);
}

export function matchProfession(
  suggestion: AnalysisReportCareerSuggestion | RecommendedRef
): PublicProfession | null {
  if ("id" in suggestion && suggestion.id != null) {
    const byId = professionById.get(String(suggestion.id));
    if (byId) return byId;
  }

  const careerCode =
    "career_code" in suggestion && suggestion.career_code
      ? suggestion.career_code
      : "slug" in suggestion && suggestion.slug
        ? suggestion.slug.replace(/^prof-/, "")
        : null;

  if (careerCode) {
    const backendId = professionCodeToId.get(careerCode);
    if (backendId != null) {
      const byCode = professionById.get(String(backendId));
      if (byCode) return byCode;
    }
  }

  if ("name" in suggestion && suggestion.name) {
    const byName = professionByName.get(normalizeName(suggestion.name));
    if (byName) return byName;
  }

  return null;
}

export type ResolvedCareerRecommendation = {
  profession: PublicProfession;
  matchScore?: number;
};

export function resolveCareerRecommendations(
  report: AnalysisReportItem | null | undefined
): ResolvedCareerRecommendation[] {
  if (!report) return [];

  const suggestions = report.report_data?.ai_analysis?.career_suggestions ?? [];
  const scoreByProfessionId = new Map<string, number>();

  for (const s of suggestions) {
    const match = matchProfession(s);
    if (match && typeof s.match_score === "number") {
      scoreByProfessionId.set(String(match.id), s.match_score);
    }
  }

  const refs: Array<AnalysisReportCareerSuggestion | RecommendedRef> = [
    ...(report.recommended_careers ?? []),
    ...suggestions,
  ];

  const seen = new Set<string>();
  const out: ResolvedCareerRecommendation[] = [];

  for (const ref of refs) {
    const profession = matchProfession(ref);
    if (!profession || seen.has(String(profession.id))) continue;
    seen.add(String(profession.id));
    out.push({
      profession,
      matchScore: scoreByProfessionId.get(String(profession.id)),
    });
  }

  return out;
}

export function resolveUniversityRecommendations(
  report: AnalysisReportItem | null | undefined
): PublicUniversity[] {
  if (!report) return [];

  const ids: number[] = [];

  for (const ref of report.recommended_institutions ?? []) {
    if (typeof ref.id === "number") ids.push(ref.id);
  }

  for (const s of report.report_data?.ai_analysis?.university_suggestions ?? []) {
    const institutionId =
      "institution_id" in s && typeof s.institution_id === "number"
        ? s.institution_id
        : typeof s.id === "number"
          ? s.id
          : null;
    if (institutionId != null) ids.push(institutionId);
  }

  const seen = new Set<number>();
  const out: PublicUniversity[] = [];

  for (const id of ids) {
    const university = universitiesData.find((u) => u.id === id);
    if (!university || seen.has(university.id)) continue;
    seen.add(university.id);
    out.push(university);
  }

  return out;
}
