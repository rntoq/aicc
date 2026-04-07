import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type {
  Career,
  CareerCategory,
  CareerRecommendation,
  CareersListParams,
  Industry,
  PaginatedResponse,
  Profession,
  ProfessionListParams,
} from "@/lib/types";

type ServiceResult<T> = { body: T | null; error: unknown | null };

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
      const { body, error } = await api.get<Industry[]>("/api/v1/careers/industries/");
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useIndustry = (
  id: number | string | null
): UseQueryResult<Industry, unknown> => {
  return useQuery({
    queryKey: ["careers", "industries", id],
    queryFn: async () => {
      const { body, error } = await api.get<Industry>(`/api/v1/careers/industries/${id}/`);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
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
      const { body, error } = await api.get<Career[]>("/api/v1/careers/", { params: qp });
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useCareer = (
  careerSlug: string | null
): UseQueryResult<Career, unknown> => {
  return useQuery({
    queryKey: ["careers", "detail", careerSlug],
    queryFn: async () => {
      const { body, error } = await api.get<Career>(`/api/v1/careers/${careerSlug}/`);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
    enabled: !!careerSlug,
  });
};

export const useCareerCategories = (): UseQueryResult<CareerCategory[], unknown> => {
  return useQuery({
    queryKey: ["careers", "categories"],
    queryFn: async () => {
      const { body, error } = await api.get<CareerCategory[]>("/api/v1/careers/categories/");
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
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
      const { body, error } = await api.get<PaginatedResponse<Profession>>(
        "/api/v1/careers/professions/",
        { params: qp }
      );
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useProfession = (
  id: number | string | null
): UseQueryResult<Profession, unknown> => {
  return useQuery({
    queryKey: ["careers", "professions", "detail", id],
    queryFn: async () => {
      const { body, error } = await api.get<Profession>(`/api/v1/careers/professions/${id}/`);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
    enabled: id != null && id !== "",
  });
};

// --------------------------------------------------
// Recommendations (auth)
// --------------------------------------------------

export const useCareerRecommendations = (): UseQueryResult<CareerRecommendation[], unknown> => {
  return useQuery({
    queryKey: ["careers", "recommendations"],
    queryFn: async () => {
      const { body, error } = await api.get<CareerRecommendation[]>("/api/v1/careers/recommendations/");
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useGenerateCareerRecommendations = (): UseMutationResult<unknown, unknown, void> => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await api.post("/api/v1/careers/recommendations/generate/");
      if (error) throw error;
    },
  });
};

// --------------------------------------------------
// Non-React service functions (same endpoints)
// --------------------------------------------------

export const careerServices = {
  async listCareers(params?: CareersListParams): Promise<ServiceResult<Career[]>> {
    const { body, error } = await api.get<Career[]>("/api/v1/careers/", { params: compactParams(params) });
    return { body: body?.data ?? null, error };
  },

  async getCareer(careerSlug: string): Promise<ServiceResult<Career>> {
    const { body, error } = await api.get<Career>(`/api/v1/careers/${careerSlug}/`);
    return { body: body?.data ?? null, error };
  },

  async listCategories(): Promise<ServiceResult<CareerCategory[]>> {
    const { body, error } = await api.get<CareerCategory[]>("/api/v1/careers/categories/");
    return { body: body?.data ?? null, error };
  },

  async listIndustries(): Promise<ServiceResult<Industry[]>> {
    const { body, error } = await api.get<Industry[]>("/api/v1/careers/industries/");
    return { body: body?.data ?? null, error };
  },

  async getIndustry(industryId: number | string): Promise<ServiceResult<Industry>> {
    const { body, error } = await api.get<Industry>(`/api/v1/careers/industries/${industryId}/`);
    return { body: body?.data ?? null, error };
  },

  async listProfessions(params?: ProfessionListParams): Promise<ServiceResult<PaginatedResponse<Profession>>> {
    const { body, error } = await api.get<PaginatedResponse<Profession>>(
      "/api/v1/careers/professions/",
      { params: compactParams(params) }
    );
    return { body: body?.data ?? null, error };
  },

  async getProfession(professionId: number | string): Promise<ServiceResult<Profession>> {
    const { body, error } = await api.get<Profession>(`/api/v1/careers/professions/${professionId}/`);
    return { body: body?.data ?? null, error };
  },

  async recommendations(): Promise<ServiceResult<CareerRecommendation[]>> {
    const { body, error } = await api.get<CareerRecommendation[]>("/api/v1/careers/recommendations/");
    return { body: body?.data ?? null, error };
  },

  async generateRecommendations(): Promise<ServiceResult<unknown>> {
    const { body, error } = await api.post("/api/v1/careers/recommendations/generate/");
    return { body: body?.data ?? null, error };
  },
};

// --------------------------------------------------
// Institutions (/api/v1/institutions/*)
// --------------------------------------------------

export const institutionServices = {
  async listInstitutions(): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/institutions/");
    return { body: body?.data ?? null, error };
  },

  async getInstitution(institutionSlug: string): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>(`/api/v1/institutions/${institutionSlug}/`);
    return { body: body?.data ?? null, error };
  },

  async listInstitutionPrograms(institutionSlug: string): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>(
      `/api/v1/institutions/${institutionSlug}/programs/`
    );
    return { body: body?.data ?? null, error };
  },

  async getProgram(programSlug: string): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>(`/api/v1/institutions/programs/${programSlug}/`);
    return { body: body?.data ?? null, error };
  },
};

// --------------------------------------------------
// Payments (/api/v1/payments/*)
// --------------------------------------------------

export const paymentServices = {
  async plans(): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/payments/plans/");
    return { body: body?.data ?? null, error };
  },

  async subscription(): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/payments/subscription/");
    return { body: body?.data ?? null, error };
  },

  async history(): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.get<Record<string, unknown>>("/api/v1/payments/history/");
    return { body: body?.data ?? null, error };
  },

  async subscribe(payload: Record<string, unknown>): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.post<Record<string, unknown>, Record<string, unknown>>(
      "/api/v1/payments/subscribe/",
      payload
    );
    return { body: body?.data ?? null, error };
  },

  async cancel(payload?: Record<string, unknown>): Promise<ServiceResult<Record<string, unknown>>> {
    const { body, error } = await api.post<Record<string, unknown>, Record<string, unknown>>(
      "/api/v1/payments/cancel/",
      payload ?? {}
    );
    return { body: body?.data ?? null, error };
  },
};

