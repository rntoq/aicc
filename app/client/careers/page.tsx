"use client";

import { useState, useMemo } from "react";
import { Box, Button, Chip, Grid, LinearProgress, Typography } from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { IndustryCard } from "@/app/components/clientLayout";
import { ProfessionCard } from "@/app/components/clientLayout/ProfessionCard";
import { useIndustries, useProfessions } from "@/lib/services/careerServices";
import {
  useLatestAnalysisReport,
  type AnalysisReportCareerSuggestion,
} from "@/lib/services/analyseServices";
import { INDUSTRIES, FILTER_CATEGORIES } from "@/utils/constants";
import type { PublicProfession } from "@/lib/types";
import PROFESSIONS_JSON from "@/public/jsons/professions.json";

const professionsData = PROFESSIONS_JSON as PublicProfession[];
const professionById = new Map<string, PublicProfession>();
for (const p of professionsData) professionById.set(String(p.id), p);

const matchProfession = (s: AnalysisReportCareerSuggestion): PublicProfession | null => {
  if (s?.id == null) return null;
  return professionById.get(String(s.id)) ?? null;
};

// ─── PersonalResultSection ────────────────────────────────────────────────────

type ResolvedRecommendation = {
  profession: PublicProfession;
  matchScore?: number;
};

function PersonalResultSection({
  recommendations,
}: {
  recommendations: ResolvedRecommendation[];
}) {
  const t = useTranslations();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {t("careers_personal_title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {t("careers_personal_subtitle")}
      </Typography>
      <Box sx={styles.scrollBox}>
        {recommendations.map(({ profession, matchScore }) => (
          <Box key={profession.id} sx={styles.cardSlot}>
            {typeof matchScore === "number" && (
              <Chip
                size="small"
                color="success"
                label={t("careers_match", { percent: matchScore })}
                sx={styles.matchChip}
              />
            )}
            <ProfessionCard profession={profession} t={t} compact />
          </Box>
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
        {t("take_test")}
      </Button>
    </Box>
  );
}

// ─── CareersPage ──────────────────────────────────────────────────────────────

const CareersPage = () => {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState("all");

  useIndustries();
  useProfessions({
    industry: activeFilter === "all" ? undefined : activeFilter,
  });

  const reportQuery = useLatestAnalysisReport();

  const recommendations = useMemo<ResolvedRecommendation[]>(() => {
    const careerSuggestions: AnalysisReportCareerSuggestion[] =
      reportQuery.data?.report_data?.ai_analysis?.career_suggestions ?? [];
    const seen = new Set<string>();
    const out: ResolvedRecommendation[] = [];
    for (const s of careerSuggestions) {
      const match = matchProfession(s);
      if (!match || seen.has(match.id)) continue;
      seen.add(match.id);
      out.push({ profession: match, matchScore: s.match_score });
    }
    return out;
  }, [reportQuery.data]);

  const filteredIndustries = useMemo(() => {
    if (activeFilter === "all") return INDUSTRIES;
    return INDUSTRIES.filter((ind) => ind.filterCategory === activeFilter);
  }, [activeFilter]);

  const renderHeader = () => {
    if (reportQuery.isLoading) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="h6">Loading...</Typography>
          <LinearProgress />
        </Box>
      );
    }
    if (recommendations.length > 0) {
      return <PersonalResultSection recommendations={recommendations} />;
    }
    return <PassTestCtaSection />;
  };

  return (
    <AppLayout title={t("header_professions")}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {renderHeader()}

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
    minWidth: 0,
    width: "100%",
  },
  cardSlot: {
    position: "relative" as const,
    flexShrink: 0,
  },
  matchChip: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    zIndex: 1,
    fontWeight: 700,
  },
  ctaCard: {
    p: 3,
    borderRadius: 2,
    background: "linear-gradient(45deg, #86a8e7 0%, #91eae4 100%)",
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
