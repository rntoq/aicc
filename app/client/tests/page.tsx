"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
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
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import { toast } from "react-toastify";

interface ReportListItem {
  id: number;
  title: string;
  summary: string;
  created_at: string;
  is_premium: boolean;
}

function extractReports(payload: unknown): ReportListItem[] {
  if (Array.isArray(payload)) return payload as ReportListItem[];
  if (payload && typeof payload === "object") {
    const p = payload as { results?: unknown };
    if (Array.isArray(p.results)) return p.results as ReportListItem[];
  }
  return [];
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

function normalizeSessionKey(testSlug: string, testType: string): string {
  if (testSlug === "big-five" || testType === "big_five") return "bigfive";
  if (testSlug === "photo" || testType === "photo") return "photo-career";
  if (testSlug) return testSlug;
  return testType.replace(/_/g, "-");
}

function ReportDownloadBanner({ reports }: { reports: ReportListItem[] }) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const latest = reports[0];

  const handleDownload = async (report: ReportListItem) => {
    if (downloadingId !== null) return;
    setDownloadingId(report.id);
    try {
      const { body, error } = await analyseServices.downloadReportPdf(report.id);
      if (error || !body) {
        toast.error("Не удалось скачать PDF. Попробуйте позже.");
        return;
      }
      const blob = new Blob([body], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF успешно скачан!");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Paper elevation={0} sx={styles.banner}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
        <Box sx={styles.bannerIcon}>
          <AutoAwesomeRoundedIcon sx={{ fontSize: 22 }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.25 }}>
            <Typography variant="h6" sx={styles.bannerTitle}>
              AI-анализ готов
            </Typography>
            <Chip
              icon={<CheckCircleRoundedIcon sx={{ fontSize: "14px !important" }} />}
              label="Готово"
              size="small"
              sx={styles.readyChip}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
            Ваш персональный анализ карьеры сформирован на основе результатов тестов.
            Скачайте PDF-отчёт и сохраните его.
          </Typography>
        </Box>
      </Box>

      {/* Report cards */}
      <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {reports.map((report, i) => {
          const isDownloading = downloadingId === report.id;
          return (
            <Box key={report.id} sx={styles.reportRow(i === 0)}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                <ArticleRoundedIcon sx={{ color: i === 0 ? "primary.main" : "text.secondary", flexShrink: 0, fontSize: 20 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: i === 0 ? "primary.dark" : "text.primary", lineHeight: 1.3 }}
                    noWrap
                  >
                    {report.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(report.created_at)}
                  </Typography>
                </Box>
              </Box>

              {i === 0 && latest.summary && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    mb: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                  }}
                >
                  {latest.summary}
                </Typography>
              )}

              <Button
                variant={i === 0 ? "contained" : "outlined"}
                size="small"
                disabled={isDownloading}
                onClick={() => void handleDownload(report)}
                startIcon={
                  isDownloading ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <DownloadRoundedIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={i === 0 ? styles.downloadBtnPrimary : styles.downloadBtnSecondary}
              >
                {isDownloading ? "Скачивание..." : "Скачать PDF"}
              </Button>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
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
  const reports = extractReports(reportsQuery.data);

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

  const showReportBanner = reportsQuery.isSuccess && reportsCount > 0;
  const showCtaSkeleton = reportsQuery.isLoading;

  return (
    <AppLayout title={t("tests_title")}>
      <Box>
        <Box sx={{ mb: 2 }}>
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

        {showCtaSkeleton && (
          <Skeleton variant="rounded" height={88} sx={{ mb: 3, borderRadius: 3 }} />
        )}

        {!showCtaSkeleton && showReportBanner && (
          <ReportDownloadBanner reports={reports} />
        )}

        {!showCtaSkeleton && !showReportBanner && (
          <AiAnalysisCta isRecommended={mode === "recommended"} skipAuthCheck />
        )}

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
    fontSize: { xs: "0.75rem", md: "1rem" },
    color: mode === "active" ? "primary.light" : "text.secondary",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: mode === "active" ? "primary.light" : "transparent",
  }),

  banner: {
    mb: 3,
    p: { xs: 2, md: 2.5 },
    borderRadius: 3,
    border: "1px solid rgba(99,102,241,0.18)",
    background: "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(145,234,228,0.12) 100%)",
  },

  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "rgba(99,102,241,0.14)",
    color: "primary.main",
    flexShrink: 0,
  },

  bannerTitle: {
    fontWeight: 900,
  },

  readyChip: {
    bgcolor: "rgba(34,197,94,0.12)",
    color: "#16a34a",
    fontWeight: 700,
    fontSize: "0.7rem",
    height: 22,
    "& .MuiChip-icon": { color: "#16a34a" },
  },

  reportRow: (isPrimary: boolean) => ({
    p: { xs: 1.5, md: 2 },
    borderRadius: 2.5,
    bgcolor: isPrimary ? "rgba(99,102,241,0.06)" : "rgba(0,0,0,0.02)",
    border: isPrimary ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column" as const,
    gap: 0.5,
  }),

  downloadBtnPrimary: {
    borderRadius: 999,
    px: 2.5,
    py: 0.8,
    alignSelf: "flex-start",
    background: "linear-gradient(45deg, #86a8e7 0%, #91eae4 100%)",
    boxShadow: "0 6px 18px rgba(99,102,241,0.22)",
    fontWeight: 700,
    fontSize: "0.8rem",
    "&:hover": {
      background: "linear-gradient(45deg, #7f7fd5 0%, #86a8e7 100%)",
    },
  },

  downloadBtnSecondary: {
    borderRadius: 999,
    px: 2,
    py: 0.7,
    alignSelf: "flex-start",
    fontWeight: 600,
    fontSize: "0.78rem",
    borderColor: "rgba(99,102,241,0.3)",
    color: "primary.main",
  },
} as const;
