"use client";

import { useState, useMemo } from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { IndustryCard } from "@/app/components/clientLayout";
import { ProfessionCard } from "@/app/components/clientLayout/ProfessionCard";
import { useIndustries } from "@/lib/hooks/useIndustries";
import { INDUSTRIES, FILTER_CATEGORIES } from "@/lib/constants";
import PROFESSIONS_JSON from "@/public/professions.json";
import type { PublicProfession } from "@/lib/types";

// ─── PersonalResultSection ────────────────────────────────────────────────────

function PersonalResultSection() {
  const t = useTranslations();
  const professions = useMemo(
    () => (PROFESSIONS_JSON as unknown as PublicProfession[]).slice(0, 5),
    []
  );

  return (
    <Box sx={{}}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {t("careers_personal_title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {t("careers_personal_subtitle")}
      </Typography>
      <Box sx={styles.scrollBox}>
        {professions.map((prof) => (
          <ProfessionCard key={prof.id} profession={prof} t={t} compact />
        ))}
      </Box>
    </Box>
  );
}

// ─── PassTestCtaSection ───────────────────────────────────────────────────────

function PassTestCtaSection() {
  const t = useTranslations();

  return (
    <Box sx={styles.ctaCard}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box sx={styles.ctaIcon}>
          <PsychologyOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("careers_pass_test_title")}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            {t("careers_pass_test_subtitle")}
          </Typography>
        </Box>
      </Box>
      <Button
        component={Link}
        href="/client/tests"
        variant="contained"
        size="large"
        sx={styles.ctaButton}
      >
        {t("careers_pass_test_cta")}
      </Button>
    </Box>
  );
}

// ─── CareersPage ──────────────────────────────────────────────────────────────

const CareersPage = () => {
  const t = useTranslations();
  useIndustries();

  const hasPersonalResult = false;

  const [activeFilter, setActiveFilter] = useState("all");
  const filteredIndustries = useMemo(() => {
    if (activeFilter === "all") return INDUSTRIES;
    return INDUSTRIES.filter((ind) => ind.filterCategory === activeFilter);
  }, [activeFilter]);

  return (
    <AppLayout title={t("header_professions")}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>

        {hasPersonalResult ? <PersonalResultSection /> : <PassTestCtaSection />}

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {t("careers_explain_title")}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {FILTER_CATEGORIES.map(({ id, nameKey }) => (
              <Chip
                key={id}
                label={t(nameKey)}
                onClick={() => setActiveFilter(id)}
                variant={activeFilter === id ? "filled" : "outlined"}
                color={activeFilter === id ? "primary" : "default"}
                sx={{ fontWeight: activeFilter === id ? 600 : 500 }}
              />
            ))}
          </Box>

          <Grid container spacing={2}>
            {filteredIndustries.map((industry) => (
              <Grid key={industry.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <IndustryCard industry={industry} t={t} />
              </Grid>
            ))}
          </Grid>
        </Box>

      </Box>
    </AppLayout>
  );
};

export default CareersPage;

const styles = {
  scrollBox: {
    display: "flex",
    gap: 2,
    overflowX: "auto",
    pb: 2,
    scrollSnapType: "x mandatory",
    "& > *": { scrollSnapAlign: "start" },
    // Ограничиваем ширину родительским контейнером, чтобы не выходить за экран
    minWidth: 0,
    width: "100%",
  },
  ctaCard: {
    p: 3,
    borderRadius: 2,
    background: "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
    color: "white",
  },
  ctaIcon: {
    width: 56,
    height: 56,
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButton: {
    bgcolor: "white",
    color: "primary.main",
    "&:hover": { bgcolor: "grey.100" },
  },
};