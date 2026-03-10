import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type { Industry } from "@/lib/types";

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
  id: number | null
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

