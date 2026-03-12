"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { IndustryCard } from "@/app/components/clientLayout";
import { useIndustries } from "@/lib/hooks/useIndustries";
import { INDUSTRIES, FILTER_CATEGORIES } from "@/lib/constants";
import PROFESSIONS_JSON from "@/public/professions.json";
import { useTestsStore } from "@/lib/store/testsStore";

function useFilteredIndustries(activeFilter: string) {
  const t = useTranslations();
  return useMemo(() => {
    let list = INDUSTRIES;
    if (activeFilter !== "all") {
      list = list.filter((ind) => ind.filterCategory === activeFilter);
    }
    return list;
  }, [activeFilter, t]);
}

function PersonalResultSection() {
  const t = useTranslations();
  const locale = useLocale();

  type ProfJson = {
    id: string;
    name: { ru: string; kk: string; en: string };
    industry: string;
    specialities: string[];
    demand_level: string;
    salary_kzt: { min: number; max: number; average: number };
  };

  const professions = useMemo(
    () => (PROFESSIONS_JSON as ProfJson[]).slice(0, 5),
    []
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {t("careers_personal_title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {t("careers_personal_subtitle")}
      </Typography>
      <Box sx={styles.personalScrollBox}>
        {professions.map((prof) => {
          const title =
            prof.name[locale as keyof ProfJson["name"]] ??
            prof.name.ru ??
            prof.name.en;
          const salary = prof.salary_kzt;
          return (
            <Box
              key={prof.id}
              sx={{
                minWidth: 280,
                maxWidth: 320,
                borderRadius: 2,
                border: "1px solid #9f9fc0",
                p: 2,
                mr: 2,
                flexShrink: 0,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                industry: {prof.industry}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                specialities: {prof.specialities.join(", ")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                demand_level: {prof.demand_level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                salary_kzt: min {salary.min} / max {salary.max} / avg{" "}
                {salary.average}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function PassTestCtaSection() {
  const t = useTranslations();

  return (
    <Box sx={styles.passTestCard}>
      <Box sx={styles.passTestInner}>
        <Box sx={styles.passTestIconBox}>
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
        sx={styles.passTestButton}
      >
        {t("careers_pass_test_cta")}
      </Button>
    </Box>
  );
}

function IndustriesSection({
  activeFilter,
  setActiveFilter,
  hasPersonalResult,
}: {
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  hasPersonalResult: boolean;
}) {
  const t = useTranslations();
  const filteredIndustries = useFilteredIndustries(activeFilter);

  return (
    <Box>
      <Box sx={{ py: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {t("careers_explain_title")}
        </Typography>
      </Box>

      <Box sx={styles.filtersRow}>
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
  );
}

const CareersPage = () => {
  const t = useTranslations();
  useIndustries();
  const hasPersonalResult = useTestsStore((s) => s.completedTestIds.size) > 0;
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <AppLayout title={t("header_professions")}>
      <Box sx={styles.pageLayout}>
        {hasPersonalResult ? <PersonalResultSection /> : <PassTestCtaSection />}
        {/* <PersonalResultSection />  */}

        <IndustriesSection
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          hasPersonalResult={hasPersonalResult}
        />
      </Box>
    </AppLayout>
  );
};

export default CareersPage;

const styles = {
  personalScrollBox: {
    display: "flex",
    gap: 2,
    width: { xs: "100%", sm: "75vw" },
    overflowX: "auto",
    pb: 3,
    scrollSnapType: "x mandatory",
    "& > *": { scrollSnapAlign: "start", flexShrink: 0 },
  },
  passTestCard: {
    p: 3,
    borderRadius: 2,
    background: "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
    color: "white",
  },
  passTestInner: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 2,
  },
  passTestIconBox: {
    width: 56,
    height: 56,
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  passTestButton: {
    bgcolor: "white",
    color: "primary.main",
    "&:hover": { bgcolor: "grey.100" },
  },
  pageLayout: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  filtersRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    mb: 3,
  },
};
