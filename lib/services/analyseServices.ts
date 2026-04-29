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
  /** Profession id from `public/jsons/professions.json` (e.g. "001"). */
  id?: string | number;
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
  name: string;
  city?: string;
  reasoning?: string;
  recommended_programs?: string[];
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
    ai_analysis?: {
      career_suggestions?: AnalysisReportCareerSuggestion[];
      university_suggestions?: AnalysisReportUniversitySuggestion[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
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
      const list: AnalysisReportItem[] = Array.isArray(body)
        ? (body as AnalysisReportItem[])
        : body && typeof body === "object" && Array.isArray((body as { results?: unknown[] }).results)
          ? ((body as { results: AnalysisReportItem[] }).results)
          : [];
      if (!list.length) return null;
      return [...list].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
      )[0];
    },
  });
};

