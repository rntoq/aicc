"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ALL_TESTS, getRecommendedTests } from "@/utils/constants";
import { TestCard } from "@/app/components/tests/TestCard";
import { useState } from "react";
import { AiAnalysisCta } from "@/app/components/layout/AiAnalysisCta";
import { useQuizSessionHydrated } from "@/lib/hooks/useQuizSessionHydrated";
import {
  useAnalysisReports,
  getAnalysisReportsCount,
  type AnalysisReportItem,
} from "@/lib/services/analyseServices";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import { useReportPdfDownload } from "@/lib/hooks/useReportPdfDownload";

// ─── types ───────────────────────────────────────────────────────────────────

// ─── ReportDownloadBanner ─────────────────────────────────────────────────────

function ReportDownloadBanner({ reports }: { reports: AnalysisReportItem[] }) {
  const { downloadingId, downloadReport } = useReportPdfDownload({
    downloadError: "Не удалось скачать PDF",
    downloadSuccess: "PDF успешно скачан!",
  });
  const latest = reports[0];

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Paper elevation={0} sx={s.banner}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
        <Box sx={s.bannerIcon}><AutoAwesomeRoundedIcon sx={{ fontSize: 22 }} /></Box>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.25 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>AI-анализ готов</Typography>
            <Chip
              icon={<CheckCircleRoundedIcon sx={{ fontSize: "14px !important" }} />}
              label="Готово" size="small" sx={s.readyChip}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Скачайте PDF-отчёт с персональным анализом карьеры.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {reports.map((report, i) => (
          <Box key={report.id} sx={s.reportRow(i === 0)}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
              <ArticleRoundedIcon sx={{ color: i === 0 ? "primary.main" : "text.secondary", flexShrink: 0, fontSize: 20 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: i === 0 ? "primary.dark" : "text.primary", lineHeight: 1.3 }} noWrap>
                  {report.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">{fmt(report.created_at)}</Typography>
              </Box>
            </Box>

            {i === 0 && latest.summary && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "0.8rem" }}>
                {latest.summary}
              </Typography>
            )}

            <Button
              variant={i === 0 ? "contained" : "outlined"} size="small"
              disabled={downloadingId === report.id}
              onClick={() => void downloadReport(report.id, report.title)}
              startIcon={downloadingId === report.id ? <CircularProgress size={14} color="inherit" /> : <DownloadRoundedIcon sx={{ fontSize: 16 }} />}
              sx={i === 0 ? s.downloadBtnPrimary : s.downloadBtnSecondary}
            >
              {downloadingId === report.id ? "Скачивание..." : "Скачать PDF"}
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TestsPage = () => {
  const t = useTranslations();
  const recommended = getRecommendedTests();
  const [mode, setMode] = useState<"recommended" | "all">("recommended");

  /** Rehydrates guest store from LS, then syncs completed sessions from API when logged in. */
  useQuizSessionHydrated();

  const reportsQuery = useAnalysisReports();
  const reports = reportsQuery.data ?? [];
  const hasReports = getAnalysisReportsCount(reports) > 0;
  const loading = reportsQuery.isLoading;

  return (
    <AppLayout title={t("tests_title")}>
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {t("tests_carousel_subtitle")}
          </Typography>
          <ButtonGroup sx={{ flexWrap: "wrap", mt: 5 }}>
            <Button variant="text" onClick={() => setMode("recommended")} sx={s.tabBtn(mode === "recommended")}>
              {t("test_recommended_title")}
            </Button>
            <Button variant="text" onClick={() => setMode("all")} sx={s.tabBtn(mode === "all")}>
              {t("test_showAllTests")}
            </Button>
          </ButtonGroup>
        </Box>

        {loading && (
          <Box sx={{ mb: 3, borderRadius: 3, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
            <LinearProgress />
          </Box>
        )}
        {!loading && hasReports && <ReportDownloadBanner reports={reports} />}
        {!loading && !hasReports && <AiAnalysisCta isRecommended={mode === "recommended"} skipAuthCheck />}

        <Grid container spacing={3}>
          {(mode === "recommended" ? recommended : ALL_TESTS).map((test, index) => (
            <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TestCard test={test} index={index} variant={mode === "recommended" ? "recommended" : "custom"} skipAuthModal />
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default TestsPage;

// ─── styles ───────────────────────────────────────────────────────────────────

const s = {
  tabBtn: (active: boolean) => ({
    px: 2.5,
    borderRadius: 0,
    fontSize: { xs: "0.75rem", md: "1rem" },
    color: active ? "primary.light" : "text.secondary",
    borderBottomWidth: 2,
    borderBottomStyle: "solid" as const,
    borderBottomColor: active ? "primary.light" : "transparent",
  }),
  banner: {
    mb: 3, p: { xs: 2, md: 2.5 }, borderRadius: 3,
    border: "1px solid rgba(99,102,241,0.18)",
    background: "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(145,234,228,0.12) 100%)",
  },
  bannerIcon: {
    width: 44, height: 44, borderRadius: 2,
    display: "flex", alignItems: "center", justifyContent: "center",
    bgcolor: "rgba(99,102,241,0.14)", color: "primary.main", flexShrink: 0,
  },
  readyChip: {
    bgcolor: "rgba(34,197,94,0.12)", color: "#16a34a", fontWeight: 700,
    fontSize: "0.7rem", height: 22,
    "& .MuiChip-icon": { color: "#16a34a" },
  },
  reportRow: (isPrimary: boolean) => ({
    p: { xs: 1.5, md: 2 }, borderRadius: 2.5,
    bgcolor: isPrimary ? "rgba(99,102,241,0.06)" : "rgba(0,0,0,0.02)",
    border: isPrimary ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column" as const, gap: 0.5,
  }),
  downloadBtnPrimary: {
    borderRadius: 999, px: 2.5, py: 0.8, alignSelf: "flex-start",
    background: "linear-gradient(45deg, #86a8e7 0%, #91eae4 100%)",
    fontWeight: 700, fontSize: "0.8rem",
    "&:hover": { background: "linear-gradient(45deg, #7f7fd5 0%, #86a8e7 100%)" },
  },
  downloadBtnSecondary: {
    borderRadius: 999, px: 2, py: 0.7, alignSelf: "flex-start",
    fontWeight: 600, fontSize: "0.78rem",
    borderColor: "rgba(99,102,241,0.3)", color: "primary.main",
  },
} as const;
