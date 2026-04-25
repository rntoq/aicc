"use client";

import { useMemo } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ProfessionCard } from "@/app/components/clientLayout";
import { INDUSTRIES } from "@/utils/constants";
import type { PublicProfession } from "@/lib/types";
import PROFESSIONS_JSON from "@/public/jsons/professions.json";
import { useIndustries } from "@/lib/services/careerServices";

type ProfJson = PublicProfession;

function useIndustryData(industryId: string) {
  const industry = useMemo(
    () => INDUSTRIES.find((ind) => ind.id === industryId),
    [industryId]
  );
  const professions = useMemo(
    () =>
      (PROFESSIONS_JSON as ProfJson[]).filter(
        (prof) => prof.industry === industryId
      ),
    [industryId]
  );
  return { industry, professions };
}

function IndustryNotFound() {
  const t = useTranslations();
  return (
    <AppLayout title={t("header_professions")}>
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Направление не найдено
        </Typography>
        <Button component={Link} href="/client/careers" startIcon={<ArrowBackRoundedIcon />}>
          К направлениям
        </Button>
      </Box>
    </AppLayout>
  );
}

const IndustryProfessionsPage = () => {
  const t = useTranslations();
  const params = useParams();
  const industryId = typeof params.industryId === "string" ? params.industryId : "";
  // Backend industries list (local page uses public JSON ids; keep JSON rendering as-is).
  useIndustries();
  const { industry, professions } = useIndustryData(industryId);

  if (!industry) {
    return <IndustryNotFound />;
  }

  const industryName = t(industry.nameKey);

  return (
    <AppLayout title={industryName}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Button
          component={Link}
          href="/client/careers"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ alignSelf: "flex-start" }}
        >
          К направлениям
        </Button>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {industryName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t(industry.descKey)}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Профессии в этой сфере
        </Typography>

        {professions.length > 0 ? (
          <Grid container spacing={2}>
            {professions.map((prof) => (
              <Grid key={prof.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProfessionCard profession={prof} t={t} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              Список профессий по этой индустрии скоро появится.
            </Typography>
          </Card>
        )}
      </Box>
    </AppLayout>
  );
};

export default IndustryProfessionsPage;
