import { api } from "@/lib/api/api";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {
  AiChatPayload,
  AiChatResponse,
  AiReportGeneratePayload,
  AiReportGenerateResponse,
  AnalysisDashboardResponse,
  AnalysisProfile,
  AnalysisReportDetail,
} from "@/lib/types";

type ServiceResult<T> = { body: T | null; error: unknown | null };

// --------------------------------------------------
// /api/v1/analysis/reports/ — list shape used across pages
// --------------------------------------------------

export type AnalysisReportCareerSuggestion = {
  /** Backend profession id from `public/jsons/professions.json`. */
  id?: string | number;
  /** Legacy profession code from AI analysis (e.g. "001", "002"). */
  career_code?: string;
  name: string;
  reasoning?: string;
  match_score?: number;
  salary_range?: string;
  growth_path?: string;
  key_skills?: string[];
};

export type AnalysisReportUniversitySuggestion = {
  /** University id from `public/jsons/universities.json` (numeric). */
  id?: string | number;
  /** Backend institution id from AI analysis. */
  institution_id?: number;
  name: string;
  city?: string;
  reasoning?: string;
  match_score?: number;
  recommended_programs?: string[];
};

export type AnalysisReportIndustryRecommendation = {
  industry?: string;
  fit_score?: number;
  reasoning?: string;
  growth_outlook?: string;
};

export type AnalysisReportTestInsight = {
  test_name?: string;
  insight?: string;
};

export type AnalysisReportNamedItem = {
  title?: string;
  skill?: string;
};

export type AnalysisReportDataSection = {
  primary_type?: string;
  test_name?: string;
  summary?: string;
  scores?: Record<string, number | Record<string, number>>;
};

/**
 * Lightweight reference returned by the backend at the top level of a report.
 * Frontend uses only `id` to look up full data in `public/jsons/*.json`.
 */
export type RecommendedRef = {
  id: number;
  name?: string;
  slug?: string;
};

export type AnalysisReportItem = {
  id: number;
  title: string;
  summary?: string;
  created_at: string;
  recommended_careers?: RecommendedRef[];
  recommended_institutions?: RecommendedRef[];
  report_data?: {
    photo?: AnalysisReportDataSection;
    holland?: AnalysisReportDataSection;
    big_five?: AnalysisReportDataSection;
    career_aptitude?: AnalysisReportDataSection;
    ai_analysis?: {
      career_suggestions?: AnalysisReportCareerSuggestion[];
      university_suggestions?: AnalysisReportUniversitySuggestion[];
      industry_recommendations?: AnalysisReportIndustryRecommendation[];
      test_insights?: AnalysisReportTestInsight[];
      strengths?: AnalysisReportNamedItem[];
      top_skills?: AnalysisReportNamedItem[];
      weaknesses?: AnalysisReportNamedItem[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

export type FlattenedScoreItem = { key: string; value: number };

/**
 * Known test sections inside `report_data`, in display order.
 * `insightTokens` — слова, по которым ищется соответствующий AI-инсайт по его `test_name`.
 */
const TEST_SECTIONS: Array<{ key: string; insightTokens: string[] }> = [
  { key: "holland", insightTokens: ["holland", "riasec", "голланд"] },
  { key: "big_five", insightTokens: ["big five", "ocean", "больш"] },
  { key: "bigfive", insightTokens: ["big five", "ocean", "больш"] },
  { key: "enneagram", insightTokens: ["enneagram", "эннеаграм"] },
  { key: "eq5", insightTokens: ["eq", "emotional", "эмоцион"] },
  { key: "eq", insightTokens: ["eq", "emotional", "эмоцион"] },
  { key: "disc", insightTokens: ["disc"] },
  { key: "career_aptitude", insightTokens: ["aptitude", "карьер"] },
  { key: "photo", insightTokens: ["photo", "фото"] },
  { key: "photo_career", insightTokens: ["photo", "фото"] },
  { key: "leadership", insightTokens: ["leadership", "лидер"] },
  { key: "strengths", insightTokens: ["strength", "сильн"] },
  { key: "typefinder_16", insightTokens: ["mbti", "typefinder", "16 type"] },
  { key: "mbti", insightTokens: ["mbti", "typefinder", "16 type"] },
];

const TEST_ORDER = new Map(TEST_SECTIONS.map((s, index) => [s.key, index]));
const TEST_INSIGHT_TOKENS = new Map(TEST_SECTIONS.map((s) => [s.key, s.insightTokens]));

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, " ").trim();
}

function isTestSection(value: unknown): value is AnalysisReportDataSection {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const section = value as AnalysisReportDataSection;
  return Boolean(section.test_name || section.scores || section.summary || section.primary_type);
}

/** Все секции тестов из `report_data` (кроме `ai_analysis`), отсортированные по порядку отображения. */
function extractReportTestEntries(
  reportData?: AnalysisReportItem["report_data"]
): Array<{ key: string; section: AnalysisReportDataSection }> {
  if (!reportData) return [];
  return Object.entries(reportData)
    .filter(([key, value]) => key !== "ai_analysis" && isTestSection(value))
    .map(([key, value]) => ({ key, section: value as AnalysisReportDataSection }))
    .sort((a, b) => {
      const orderA = TEST_ORDER.get(a.key) ?? Number.MAX_SAFE_INTEGER;
      const orderB = TEST_ORDER.get(b.key) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.key.localeCompare(b.key);
    });
}

/** Находит AI-инсайт, относящийся к секции теста: по токенам ключа, иначе по совпадению названия. */
function findTestInsight(
  reportKey: string,
  section: AnalysisReportDataSection,
  insights: AnalysisReportTestInsight[]
): AnalysisReportTestInsight | undefined {
  const tokens = TEST_INSIGHT_TOKENS.get(reportKey) ?? [];
  const byTokens = insights.find((insight) => {
    const label = normalizeLabel(insight.test_name ?? "");
    return tokens.some((token) => label.includes(token));
  });
  if (byTokens) return byTokens;

  const name = normalizeLabel(section.test_name ?? "");
  if (!name) return undefined;
  return insights.find((insight) => {
    const label = normalizeLabel(insight.test_name ?? "");
    return label.length > 0 && (name.includes(label) || label.includes(name));
  });
}

export function flattenAnalysisScores(
  scores?: Record<string, number | Record<string, number>>
): FlattenedScoreItem[] {
  if (!scores) return [];
  return Object.entries(scores).flatMap(([key, value]) => {
    if (typeof value === "number") return [{ key, value }];
    return Object.entries(value).map(([nestedKey, nestedValue]) => ({
      key: `${key}:${nestedKey}`,
      value: typeof nestedValue === "number" ? nestedValue : 0,
    }));
  });
}

export function buildDashboardReportView(report: AnalysisReportItem | null) {
  const analysis = report?.report_data?.ai_analysis;
  const insights = analysis?.test_insights ?? [];
  const testEntries = extractReportTestEntries(report?.report_data);

  return {
    careers: analysis?.career_suggestions ?? [],
    universities: analysis?.university_suggestions ?? [],
    industries: analysis?.industry_recommendations ?? [],
    tests: testEntries.map((entry) => entry.section),
    testInsights: testEntries.map((entry) => findTestInsight(entry.key, entry.section, insights)),
    strengths: (analysis?.strengths ?? []).map((x) => x.title).filter(Boolean) as string[],
    topSkills: (analysis?.top_skills ?? []).map((x) => x.skill).filter(Boolean) as string[],
    weaknesses: (analysis?.weaknesses ?? []).map((x) => x.title).filter(Boolean) as string[],
  };
}

export function extractAnalysisReportList(payload: unknown): AnalysisReportItem[] {
  if (Array.isArray(payload)) return payload as AnalysisReportItem[];
  if (payload && typeof payload === "object" && Array.isArray((payload as { results?: unknown[] }).results)) {
    return (payload as { results: AnalysisReportItem[] }).results;
  }
  return [];
}

export function getAnalysisReportsCount(payload: unknown): number {
  if (Array.isArray(payload)) return payload.length;
  if (payload && typeof payload === "object") {
    const p = payload as { count?: number; results?: unknown[] };
    if (typeof p.count === "number") return p.count;
    if (Array.isArray(p.results)) return p.results.length;
  }
  return 0;
}

export type AiChatMessage = {
  id: number;
  session: number;
  role: "user" | "assistant";
  message: string;
  in_scope: boolean | null;
  created_at: string;
};

export type AiChatSession = {
  id: number;
  title: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  last_message: string;
  messages_count: number;
};

/**
 * Analysis endpoints (/api/v1/analysis/*)
 * Keep types generic until backend schemas are stabilized.
 */
export const analyseServices = {
  /** GET /api/v1/ (API root) */
  async apiRoot(): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/");
    return { body: body ?? null, error };
  },

  /** POST /api/v1/analysis/ai-report/ */
  async createAiReport(
    payload: AiReportGeneratePayload = {}
  ): Promise<ServiceResult<AiReportGenerateResponse>> {
    const { body, error } = await api.post<AiReportGenerateResponse, AiReportGeneratePayload>(
      "/api/v1/analysis/ai-report/",
      payload
    );
    return { body: body ?? null, error };
  },

  /** POST /api/v1/analysis/ai-chat/ */
  async aiChat(payload: AiChatPayload): Promise<ServiceResult<AiChatResponse>> {
    const { body, error } = await api.post<AiChatResponse, AiChatPayload>("/api/v1/analysis/ai-chat/", payload);
    return { body: body ?? null, error };
  },

  /** GET /api/v1/analysis/ai-chat/ */
  async listAiChatMessages(params?: { chat_id?: number; limit?: number }): Promise<ServiceResult<AiChatMessage[]>> {
    const { body, error } = await api.get<AiChatMessage[]>("/api/v1/analysis/ai-chat/", { params });
    return { body: body ?? null, error };
  },

  /** GET /api/v1/analysis/ai-chat/sessions/ */
  async listAiChatSessions(): Promise<ServiceResult<AiChatSession[]>> {
    const { body, error } = await api.get<AiChatSession[]>("/api/v1/analysis/ai-chat/sessions/");
    return { body: body ?? null, error };
  },

  /** DELETE /api/v1/analysis/ai-chat/sessions/{chat_id}/ */
  async deleteAiChatSession(chatId: number): Promise<ServiceResult<unknown>> {
    const { body, error } = await api.delete<unknown>(`/api/v1/analysis/ai-chat/sessions/${chatId}/`);
    return { body: body ?? null, error };
  },

  /** GET /api/v1/analysis/reports/ */
  async listReports(params?: { page?: number; limit?: number }): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/analysis/reports/", { params });
    return { body: body ?? null, error };
  },

  /** GET /api/v1/analysis/reports/{report_id}/ */
  async getReport(reportId: number | string): Promise<ServiceResult<AnalysisReportDetail>> {
    const { body, error } = await api.get<AnalysisReportDetail>(`/api/v1/analysis/reports/${reportId}/`);
    return { body: body ?? null, error };
  },

  /**
   * GET /api/v1/analysis/ai-report/{report_id}/download/
   * Returns binary (PDF). Caller should handle Blob/ArrayBuffer.
   */
  async downloadReportPdf(reportId: number | string): Promise<ServiceResult<ArrayBuffer>> {
    const { body, error } = await api.get<ArrayBuffer>(`/api/v1/analysis/ai-report/${reportId}/download/`, {
      responseType: "arraybuffer",
    } as unknown as Record<string, unknown>);
    return { body: body ?? null, error };
  },

  /** GET /api/v1/analysis/dashboard/ */
  async dashboard(): Promise<ServiceResult<AnalysisDashboardResponse>> {
    const { body, error } = await api.get<AnalysisDashboardResponse>("/api/v1/analysis/dashboard/");
    return { body: body ?? null, error };
  },

  /** GET /api/v1/analysis/profile/ */
  async profile(): Promise<ServiceResult<AnalysisProfile>> {
    const { body, error } = await api.get<AnalysisProfile>("/api/v1/analysis/profile/");
    return { body: body ?? null, error };
  },

  /** POST /api/v1/analysis/profile/refresh/ */
  async refreshProfile(): Promise<ServiceResult<AnalysisProfile>> {
    const { body, error } = await api.post<AnalysisProfile, Record<string, never>>(
      "/api/v1/analysis/profile/refresh/",
      {}
    );
    return { body: body ?? null, error };
  },
};

// --------------------------------------------------
// TanStack Query hooks (where caching/refetch helps)
// --------------------------------------------------

export const useAnalysisDashboard = (): UseQueryResult<AnalysisDashboardResponse | null, unknown> => {
  return useQuery({
    queryKey: ["analysis", "dashboard"],
    queryFn: async () => {
      const { body, error } = await analyseServices.dashboard();
      if (error) throw error;
      return body;
    },
  });
};

/**
 * GET /api/v1/analysis/reports/
 *
 * Returns the latest report from the list (sorted by `created_at` desc).
 * Page-level consumers (careers/education/dashboard) work with the latest AI
 * analysis only, so we centralise the parsing/sorting here.
 */
export const useLatestAnalysisReport = (): UseQueryResult<AnalysisReportItem | null, unknown> => {
  return useQuery({
    queryKey: ["analysis", "reports", "latest"],
    queryFn: async () => {
      const { body, error } = await analyseServices.listReports();
      if (error) throw error;
      const list = extractAnalysisReportList(body);
      if (!list.length) return null;
      return [...list].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
      )[0];
    },
  });
};

export const useAnalysisReports = (): UseQueryResult<AnalysisReportItem[], unknown> => {
  return useQuery({
    queryKey: ["analysis", "reports", "list"],
    queryFn: async () => {
      const { body, error } = await analyseServices.listReports();
      if (error) throw error;
      return extractAnalysisReportList(body);
    },
  });
};

