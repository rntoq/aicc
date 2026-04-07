import { api } from "@/lib/api/api";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {
  AiReportGeneratePayload,
  AiReportGenerateResponse,
  AnalysisDashboardResponse,
  AnalysisProfile,
  AnalysisReportDetail,
} from "@/lib/types";

type ServiceResult<T> = { body: T | null; error: unknown | null };

/**
 * Analysis endpoints (/api/v1/analysis/*)
 * Keep types generic until backend schemas are stabilized.
 */
export const analyseServices = {
  /** GET /api/v1/ (API root) */
  async apiRoot(): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/");
    return { body: body?.data ?? null, error };
  },

  /** POST /api/v1/analysis/ai-report/ */
  async createAiReport(
    payload: AiReportGeneratePayload
  ): Promise<ServiceResult<AiReportGenerateResponse>> {
    const { body, error } = await api.post<AiReportGenerateResponse, AiReportGeneratePayload>(
      "/api/v1/analysis/ai-report/",
      payload
    );
    return { body: body?.data ?? null, error };
  },

  /** GET /api/v1/analysis/reports/ */
  async listReports(params?: { page?: number; limit?: number }): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/analysis/reports/", { params });
    return { body: body?.data ?? null, error };
  },

  /** GET /api/v1/analysis/reports/{report_id}/ */
  async getReport(reportId: number | string): Promise<ServiceResult<AnalysisReportDetail>> {
    const { body, error } = await api.get<AnalysisReportDetail>(`/api/v1/analysis/reports/${reportId}/`);
    return { body: body?.data ?? null, error };
  },

  /**
   * GET /api/v1/analysis/ai-report/{report_id}/download/
   * Returns binary (PDF). Caller should handle Blob/ArrayBuffer.
   */
  async downloadReportPdf(reportId: number | string): Promise<ServiceResult<ArrayBuffer>> {
    const { body, error } = await api.get<ArrayBuffer>(`/api/v1/analysis/ai-report/${reportId}/download/`, {
      responseType: "arraybuffer",
    } as unknown as Record<string, unknown>);
    return { body: body?.data ?? null, error };
  },

  /** GET /api/v1/analysis/dashboard/ */
  async dashboard(): Promise<ServiceResult<AnalysisDashboardResponse>> {
    const { body, error } = await api.get<AnalysisDashboardResponse>("/api/v1/analysis/dashboard/");
    return { body: body?.data ?? null, error };
  },

  /** GET /api/v1/analysis/profile/ */
  async profile(): Promise<ServiceResult<AnalysisProfile>> {
    const { body, error } = await api.get<AnalysisProfile>("/api/v1/analysis/profile/");
    return { body: body?.data ?? null, error };
  },

  /** POST /api/v1/analysis/profile/refresh/ */
  async refreshProfile(): Promise<ServiceResult<AnalysisProfile>> {
    const { body, error } = await api.post<AnalysisProfile, Record<string, never>>(
      "/api/v1/analysis/profile/refresh/",
      {}
    );
    return { body: body?.data ?? null, error };
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

