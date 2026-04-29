"use client";

import { useMemo, useState } from "react";
import { Box, Grid, MenuItem, Skeleton, TextField, Typography } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { UniversityCard } from "@/app/components/clientLayout";
import type { PublicSpeciality, PublicUniversity } from "@/lib/types";
import SPECIALITIES_JSON from "@/public/jsons/specialities.json";
import UNIVERSITIES_JSON from "@/public/jsons/universities.json";
import REGIONS_JSON from "@/public/jsons/regions.json";
import { useInstitutions } from "@/lib/services/careerServices";
import { useLatestAnalysisReport } from "@/lib/services/analyseServices";

const normalizeName = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[«»\"“”]/g, "");

const universitiesData = UNIVERSITIES_JSON as PublicUniversity[];
const specialitiesData = SPECIALITIES_JSON as PublicSpeciality[];
type RegionOption = { id: number; name: { ru: string; kk: string; en: string } };
const regionsData = REGIONS_JSON as RegionOption[];

const EducationPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [regionId, setRegionId] = useState<string>("all");

  useInstitutions({
    search: q.trim() || undefined,
    city: regionId !== "all" ? regionId : undefined,
  });

  // GET /api/v1/analysis/reports/ → берём только `id` из `recommended_institutions`
  // и хайдрейтим карточки из `universities.json` по совпадающему `id`.
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

    const specialityUniNames = new Set(
      (speciality.Universities ?? []).map((n) => n.trim()).filter(Boolean)
    );

    const scoped = universitiesData.filter((u) => specialityUniNames.has(u.short_name?.en ?? ""));

    const byNormName = new Map<string, PublicUniversity>();
    for (const u of scoped) {
      const keys = [
        u.short_name?.en,
        u.short_name?.ru,
        u.short_name?.kk,
        u.name?.en,
        u.name?.ru,
        u.name?.kk,
      ]
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
  }, [speciality, hasSpecialityQuery]);

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
      return (
        u.code.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        shortName.toLowerCase().includes(query)
      );
    });
  }, [q, universitiesForView, locale, regionId]);

  const specialityTitle =
    speciality?.name?.[locale as keyof PublicSpeciality["name"]] ?? null;
  return (
    <AppLayout title={t("education")}>
      <Box sx={styles.page}>
        {speciality && (
          <Box sx={styles.infoBlock}>
            <Typography variant="h3" color="text.primary">
              {t("education_universities_subtitle")}
            </Typography>
            <Typography variant="h5" color="primary.light">
              {t("speciality")}: {specialityTitle}
            </Typography>
          </Box>
        )}

        {!speciality && (
          <Box sx={styles.recommendedBlock}>
            {reportQuery.isLoading ? (
              <>
                <Skeleton variant="text" width={300} height={36} />
                <Skeleton variant="text" width={420} height={22} sx={{ mb: 1 }} />
                <Grid container spacing={2.5}>
                  {[0, 1, 2].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                      <Skeleton variant="rounded" height={220} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : recommendedUniversities.length > 0 ? (
              <>
                <Typography variant="h3" color="text.primary">
                  {t("education_recommended_title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("education_recommended_subtitle")}
                </Typography>
                <Grid container spacing={2.5}>
                  {recommendedUniversities.map((u) => (
                    <Grid key={u.id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                      <UniversityCard university={u} href={`/client/education/${u.id}`} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : null}
          </Box>
        )}

        <Typography variant="h3" color="text.primary" mt={2}>
          {t("universities_list_qazaqstan")}
        </Typography>
        <TextField
          select
          label={t("region")}
          value={regionId}
          sx={{width: { xs: "100%", md: "40%"}}}
          onChange={(e) => setRegionId(e.target.value)}
        >
          <MenuItem value="all">
            {t("all_regions")}
          </MenuItem>
          {regionsData.map((region) => (
            <MenuItem key={region.id} value={String(region.id)}>
              {region.name?.[locale as keyof RegionOption["name"]] ?? region.name.en}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search")}
          sx={{width: { xs: "100%", md: "40%"}}}
        />
        <Grid container spacing={2.5}>
            {filtered.map((u) => (
              <Grid key={u.id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                <UniversityCard university={u} href={`/client/education/${u.id}`} />
              </Grid>
            ))}
            {filtered.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("education_no_universities")}
                </Typography>
              </Grid>
            )}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default EducationPage;

const styles = {
  page: { 
    display: "flex", 
    flexDirection: "column", 
    gap: 2 
  },
  infoBlock: { 
    display: "flex", 
    flexDirection: "column", 
    gap: 1,
    mt: 2
  },
  recommendedBlock: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 1.5,
    mt: 2,
  },
};