"use client";

import { Box, Button, ButtonGroup, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ALL_TESTS, getRecommendedTests } from "@/utils/constants";
import { TestCard } from "@/app/components/tests/TestCard";
import { useEffect, useState } from "react";
import { AiAnalysisCta } from "@/app/components/layout/AiAnalysisCta";
import { useQuizCategories, useQuizSessions, useQuizTestTypes, useQuizTests } from "@/lib/services/quizServices";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { analyseServices } from "@/lib/services/analyseServices";
import { useQuery } from "@tanstack/react-query";

function normalizeSessionKey(testSlug: string, testType: string): string {
  if (testSlug === "big-five" || testType === "big_five") return "bigfive";
  if (testSlug === "photo" || testType === "photo") return "photo-career";
  if (testSlug) return testSlug;
  return testType.replace(/_/g, "-");
}

function getReportsCount(payload: unknown): number {
  if (Array.isArray(payload)) return payload.length;
  if (payload && typeof payload === "object") {
    const withCount = payload as { count?: unknown; results?: unknown };
    if (typeof withCount.count === "number") return withCount.count;
    if (Array.isArray(withCount.results)) return withCount.results.length;
  }
  return 0;
}

const TestsPage = () => {
  const t = useTranslations();
  const recommended = getRecommendedTests();
  const [mode, setMode] = useState<"recommended" | "all">("recommended");

  useQuizTests();
  useQuizCategories();
  useQuizTestTypes();
  const completedSessionsQuery = useQuizSessions({ completed: true });
  const reportsQuery = useQuery({
    queryKey: ["analysis", "reports", "tests-page"],
    queryFn: async () => {
      const { body, error } = await analyseServices.listReports();
      if (error) throw error;
      return body;
    },
  });
  const reportsCount = getReportsCount(reportsQuery.data);

  useEffect(() => {
    if (!completedSessionsQuery.data?.length) return;

    const { setSession, setResult } = useQuizSessionStore.getState();
    completedSessionsQuery.data.forEach((session) => {
      if (!session.is_completed) return;
      const sessionKey = normalizeSessionKey(session.test_slug, String(session.test_type ?? ""));
      setSession(sessionKey, session.id);
      setResult(sessionKey, session.result ?? {});
    });
  }, [completedSessionsQuery.data]);

  return (
    <AppLayout title={t("tests_title")}>
      <Box>
        <Box sx={{mb: 2 }}>
          <Box>
            <Typography variant="body1" color="text.secondary">
              {t("tests_carousel_subtitle")}
            </Typography>
          </Box>

          <ButtonGroup sx={{ flexWrap: "wrap", mt: 5 }}>
            <Button
              variant="text"
              onClick={() => setMode("recommended")}
              sx={styles.button(mode === "recommended" ? "active" : "inactive")}
            >
              {t("test_recommended_title")}
            </Button>
            <Button
              variant="text"
              onClick={() => setMode("all")}
              sx={styles.button(mode === "all" ? "active" : "inactive")}
            >
              {t("test_showAllTests")}
            </Button>
          </ButtonGroup>
        </Box>

        {/* AI analysis CTA */}
        <AiAnalysisCta isRecommended={mode === "recommended"} skipAuthCheck />

        <Grid container spacing={3}>
          {(mode === "recommended" ? recommended : ALL_TESTS).map((test, index) => (
            <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TestCard
                test={test}
                index={index}
                variant={mode === "recommended" ? "recommended" : "custom"}
                skipAuthModal
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default TestsPage;

const styles = {
  button: (mode: "active" | "inactive") => ({
    px: 2.5,
    borderRadius: 0,
    color: mode === "active" ? "primary.light" : "text.secondary",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: mode === "active" ? "primary.light" : "transparent",
  }),
};
