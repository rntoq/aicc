"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ProfessionCard, IndustryCard } from "@/app/components/appLayout";
import {
  INDUSTRIES,
  SAMPLE_RECOMMENDED_PROFESSIONS,
  FILTER_CATEGORIES,
  RECOMMENDED_INDUSTRY_IDS,
} from "@/lib/careers/constants";
import { useTestsStore } from "@/lib/store/testsStore";

function useFilteredIndustries(searchQuery: string, activeFilter: string) {
  const t = useTranslations();
  return useMemo(() => {
    let list = INDUSTRIES;
    if (activeFilter !== "all") {
      list = list.filter((ind) => ind.filterCategory === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((ind) => {
        const name = t(ind.nameKey).toLowerCase();
        const desc = t(ind.descKey).toLowerCase();
        const tags = t(ind.tagsKey).toLowerCase();
        return name.includes(q) || desc.includes(q) || tags.includes(q);
      });
    }
    return list;
  }, [activeFilter, searchQuery, t]);
}

function PersonalResultSection() {
  const t = useTranslations();
  const industryNames = useMemo(() => {
    const map: Record<string, string> = {};
    INDUSTRIES.forEach((ind) => {
      map[ind.id] = t(ind.nameKey);
    });
    return map;
  }, [t]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {t("careers_personal_title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {t("careers_personal_subtitle")}
      </Typography>
      <Box sx={styles.personalScrollBox}>
        {SAMPLE_RECOMMENDED_PROFESSIONS.map((prof) => (
          <ProfessionCard
            key={prof.id}
            profession={prof}
            t={t}
            industryName={industryNames[prof.industryId] ?? prof.industryId}
            compact
          />
        ))}
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
        href="/app/tests"
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
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  hasPersonalResult,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  hasPersonalResult: boolean;
}) {
  const t = useTranslations();
  const filteredIndustries = useFilteredIndustries(searchQuery, activeFilter);

  return (
    <Box>
      <Box sx={{ py: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {t("careers_explain_title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("careers_explain_text")}
        </Typography>
      </Box>
      <TextField
        fullWidth
        placeholder={t("careers_search_placeholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, maxWidth: 400 }}
      />

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
            <IndustryCard
              industry={industry}
              t={t}
              isRecommended={hasPersonalResult && RECOMMENDED_INDUSTRY_IDS.includes(industry.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default function CareersPage() {
  const t = useTranslations();
  const hasPersonalResult = useTestsStore((s) => s.completedTestIds.size) > 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <AppLayout title={t("header_professions")}>
      <Box sx={styles.pageLayout}>
        {hasPersonalResult ? <PersonalResultSection /> : <PassTestCtaSection />}
        {/* <PersonalResultSection />  */}

        <IndustriesSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          hasPersonalResult={hasPersonalResult}
        />
      </Box>
    </AppLayout>
  );
}

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
