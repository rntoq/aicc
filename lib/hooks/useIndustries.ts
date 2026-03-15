import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type { Industry, Profession } from "@/lib/types";

// --------------------------------------------------
// Types (API /api/v1/careers/*)
// --------------------------------------------------

export type CareersDemand = "low" | "medium" | "high" | "very_high" | (string & {});

export type CareersListParams = {
  category?: string;
  demand?: CareersDemand;
  education?: string;
  search?: string;
  holland?: string;
  limit?: number;
};

export type ProfessionListParams = {
  /** Industry ID or code */
  industry?: string | number;
  search?: string;
  demand?: CareersDemand;
  limit?: number;
  page?: number;
};

export type PaginatedResponse<T> = {
  count: number;
  total_pages: number;
  current_page: number;
  limit: number;
  results: T[];
};

export type CareerCategory = {
  id?: number;
  name: string;
  slug: string;
};

export type Career = {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  category?: string | CareerCategory;
  industry?: number | string | Industry;
  demand?: CareersDemand;
  education?: string;
  holland?: string;
};

export type CareerRecommendation = {
  id?: number;
  career?: Career;
  profession?: Profession;
  score?: number;
  reason?: string;
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function compactParams<T extends Record<string, unknown>>(params?: T): Record<string, unknown> {
  if (!params) return {};
  const out: Record<string, unknown> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    out[k] = v;
  });
  return out;
}

export const useIndustries = (): UseQueryResult<Industry[], unknown> => {
  return useQuery({
    queryKey: ["careers", "industries"],
    queryFn: async () => {
      const { data } = await api.get<Industry[]>("/api/v1/careers/industries/");
      return data;
    },
  });
};

export const useIndustry = (
  id: number | string | null
): UseQueryResult<Industry, unknown> => {
  return useQuery({
    queryKey: ["careers", "industries", id],
    queryFn: async () => {
      const { data } = await api.get<Industry>(
        `/api/v1/careers/industries/${id}/`
      );
      return data;
    },
    enabled: id != null,
  });
};

// --------------------------------------------------
// Careers (list/detail/categories)
// --------------------------------------------------

export const useCareers = (
  params?: CareersListParams
): UseQueryResult<Career[], unknown> => {
  const qp = compactParams(params);
  return useQuery({
    queryKey: ["careers", "list", qp],
    queryFn: async () => {
      const { data } = await api.get<Career[]>("/api/v1/careers/", {
        params: qp,
      });
      return data;
    },
  });
};

export const useCareer = (
  careerSlug: string | null
): UseQueryResult<Career, unknown> => {
  return useQuery({
    queryKey: ["careers", "detail", careerSlug],
    queryFn: async () => {
      const { data } = await api.get<Career>(`/api/v1/careers/${careerSlug}/`);
      return data;
    },
    enabled: !!careerSlug,
  });
};

export const useCareerCategories = (): UseQueryResult<CareerCategory[], unknown> => {
  return useQuery({
    queryKey: ["careers", "categories"],
    queryFn: async () => {
      const { data } = await api.get<CareerCategory[]>(
        "/api/v1/careers/categories/"
      );
      return data;
    },
  });
};

// --------------------------------------------------
// Professions (list/detail)
// --------------------------------------------------

export const useProfessions = (
  params?: ProfessionListParams
): UseQueryResult<PaginatedResponse<Profession>, unknown> => {
  const qp = compactParams(params);
  return useQuery({
    queryKey: ["careers", "professions", "list", qp],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Profession>>(
        "/api/v1/careers/professions/",
        { params: qp }
      );
      return data;
    },
  });
};

export const useProfession = (
  id: number | string | null
): UseQueryResult<Profession, unknown> => {
  return useQuery({
    queryKey: ["careers", "professions", "detail", id],
    queryFn: async () => {
      const { data } = await api.get<Profession>(
        `/api/v1/careers/professions/${id}/`
      );
      return data;
    },
    enabled: id != null && id !== "",
  });
};

// --------------------------------------------------
// Recommendations (auth)
// --------------------------------------------------

export const useCareerRecommendations = (): UseQueryResult<
  CareerRecommendation[],
  unknown
> => {
  return useQuery({
    queryKey: ["careers", "recommendations"],
    queryFn: async () => {
      const { data } = await api.get<CareerRecommendation[]>(
        "/api/v1/careers/recommendations/"
      );
      return data;
    },
  });
};

export const useGenerateCareerRecommendations = (): UseMutationResult<
  unknown,
  unknown,
  void
> => {
  return useMutation({
    mutationFn: async () => {
      await api.post("/api/v1/careers/recommendations/generate/");
    },
  });
};

