"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import type { PublicSpeciality, PublicUniversity } from "@/lib/types";
import SPECIALITIES_JSON from "@/public/jsons/specialities.json";
import UNIVERSITIES_JSON from "@/public/jsons/universities.json";
import REGIONS_JSON from "@/public/jsons/regions.json";
import { useInstitutions } from "@/lib/services/careerServices";
import { useLatestAnalysisReport } from "@/lib/services/analyseServices";
import { institutionServices } from "@/lib/services/careerServices";
import { useQuery } from "@tanstack/react-query";

type RegionOption = { id: number; name: { ru: string; kk: string; en: string } };

const normalizeName = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[«»\"“”]/g, "");

const universitiesData = UNIVERSITIES_JSON as PublicUniversity[];
const specialitiesData = SPECIALITIES_JSON as PublicSpeciality[];
const regionsData = REGIONS_JSON as RegionOption[];

export function useEducationPageData() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [regionId, setRegionId] = useState<string>("all");

  useInstitutions({
    search: q.trim() || undefined,
    city: regionId !== "all" ? regionId : undefined,
  });

  const reportQuery = useLatestAnalysisReport();
  const recommendedUniversities = useMemo<PublicUniversity[]>(() => {
    const ids = reportQuery.data?.recommended_institutions?.map((r) => r.id) ?? [];
    const seen = new Set<number>();
    const out: PublicUniversity[] = [];
    for (const id of ids) {
      const u = universitiesData.find((x) => x.id === id);
      if (u && !seen.has(u.id)) {
        seen.add(u.id);
        out.push(u);
      }
    }
    return out;
  }, [reportQuery.data]);

  const specialityId = Number(searchParams.get("speciality"));
  const hasSpecialityQuery = searchParams.has("speciality");
  const speciality = useMemo(() => {
    if (!Number.isFinite(specialityId)) return null;
    return specialitiesData.find((s) => s.id === specialityId) ?? null;
  }, [specialityId]);

  const universitiesForView = useMemo(() => {
    if (hasSpecialityQuery && !speciality) return [];
    if (!speciality) return universitiesData;

    const specialityUniNames = new Set((speciality.Universities ?? []).map((n) => n.trim()).filter(Boolean));
    const scoped = universitiesData.filter((u) => specialityUniNames.has(u.short_name?.en ?? ""));

    const byNormName = new Map<string, PublicUniversity>();
    for (const u of scoped) {
      const keys = [u.short_name?.en, u.short_name?.ru, u.short_name?.kk, u.name?.en, u.name?.ru, u.name?.kk]
        .filter(Boolean)
        .map((x) => normalizeName(x as string));
      for (const k of keys) {
        if (!byNormName.has(k)) byNormName.set(k, u);
      }
    }

    const ordered = (speciality.Universities ?? [])
      .map((su) => byNormName.get(normalizeName(su)))
      .filter(Boolean) as PublicUniversity[];

    const seenIds = new Set<number>();
    return ordered.filter((u) => {
      if (seenIds.has(u.id)) return false;
      seenIds.add(u.id);
      return true;
    });
  }, [hasSpecialityQuery, speciality]);

  const filtered = useMemo(() => {
    const byRegion =
      regionId === "all"
        ? universitiesForView
        : universitiesForView.filter((u) => String(u.region ?? "") === regionId);

    const query = q.trim().toLowerCase();
    if (!query) return byRegion;

    return byRegion.filter((u) => {
      const name = u.name?.[locale as keyof PublicUniversity["name"]] ?? "";
      const shortName = u.short_name?.[locale as keyof PublicUniversity["short_name"]] ?? "";
      return u.code.toLowerCase().includes(query) || name.toLowerCase().includes(query) || shortName.toLowerCase().includes(query);
    });
  }, [locale, q, regionId, universitiesForView]);

  return {
    q,
    setQ,
    regionId,
    setRegionId,
    regionsData,
    reportQuery,
    recommendedUniversities,
    speciality,
    filtered,
    locale,
  };
}

const listsUniversity = (s: PublicSpeciality, u: PublicUniversity) => {
  const shortEn = (u.short_name?.en ?? "").trim();
  if (!shortEn) return false;
  return (s.Universities ?? []).some((name) => name.trim() === shortEn);
};

export function useUniversitySpecialitiesPageData() {
  const locale = useLocale();
  const params = useParams();
  const idParam = typeof params.id === "string" ? params.id : "";
  const id = Number.parseInt(idParam, 10);

  const universities = useMemo(() => UNIVERSITIES_JSON as Array<PublicUniversity & { slug?: string }>, []);
  const university = useMemo(() => universities.find((u) => u.id === id) ?? null, [id, universities]);
  const specialities = useMemo(() => SPECIALITIES_JSON as PublicSpeciality[], []);
  const institutionSlug = useMemo(() => university?.slug ?? null, [university]);

  useInstitutions();
  useQuery({
    queryKey: ["institutions", "detail", idParam],
    queryFn: async () => {
      const { body, error } = await institutionServices.getInstitution(institutionSlug as string);
      if (error) throw error;
      return body;
    },
    enabled: !!idParam && !!institutionSlug,
  });
  useQuery({
    queryKey: ["institutions", "programs", idParam],
    queryFn: async () => {
      const { body, error } = await institutionServices.listInstitutionPrograms(institutionSlug as string);
      if (error) throw error;
      return body;
    },
    enabled: !!idParam && !!institutionSlug,
  });

  const filteredSpecialities = useMemo(() => {
    if (!university) return [];
    return specialities.filter((s) => listsUniversity(s, university));
  }, [specialities, university]);

  return {
    idParam,
    university,
    filteredSpecialities,
    locale,
  };
}
