"use client";

import { useMemo } from "react";
import { Box, Grid, MenuItem, Skeleton, TextField, Typography } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { UniversityCard } from "@/app/components/clientLayout";
import type { PublicSpeciality, PublicUniversity } from "@/lib/types";
import { useEducationPageData } from "@/lib/hooks/useEducationPagesData";
type RegionOption = { id: number; name: { ru: string; kk: string; en: string } };

const EducationPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { q, setQ, regionId, setRegionId, regionsData, reportQuery, recommendedUniversities, speciality, filtered } =
    useEducationPageData();

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