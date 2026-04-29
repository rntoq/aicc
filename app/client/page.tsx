"use client";

import {
  Box,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import {
  useLatestAnalysisReport,
  flattenAnalysisScores,
  buildDashboardReportView,
} from "@/lib/services/analyseServices";
import DiamondIcon from "@mui/icons-material/Diamond";
import { ReportDownloadCart } from "@/app/components/clientLayout/ReportContainer";
import { CareerReportCart } from "@/app/components/clientLayout/ProfessionContainer";
import { UniversityReportCart } from "@/app/components/clientLayout/UniversityContainer";
import { IndustryReportCart } from "@/app/components/clientLayout/IndustryContainer";
import { TestReportCart } from "@/app/components/clientLayout/TestContainer";
import { SkillReportCart } from "@/app/components/clientLayout/SkillContainer";
import { useReportPdfDownload } from "@/lib/hooks/useReportPdfDownload";
import { useBackendTranslations } from "@/lib/hooks/useBackendTranslation";

const DashboardPage = () => {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "kk" | "en";
  const { downloadingId, downloadReport } = useReportPdfDownload({
    downloadError: t("dashboard_download_error"),
    downloadSuccess: t("dashboard_download_success"),
  });
  const latestReportQuery = useLatestAnalysisReport();
  const latestReport = latestReportQuery.data;
  const { careers, universities, industries, insights, strengths, topSkills, weaknesses, tests } =
    buildDashboardReportView(latestReport ?? null);

  const translationPlan = [
    latestReport?.title ?? "",
    latestReport?.summary ?? "",
    ...careers.flatMap((x) => [x?.name ?? "", x?.reasoning ?? "", x?.growth_path ?? "", x?.salary_range ?? ""]),
    ...universities.flatMap((x) => [x?.name ?? "", x?.city ?? "", x?.reasoning ?? "", ...(x?.recommended_programs ?? [])]),
    ...industries.flatMap((x) => [x?.industry ?? "", x?.reasoning ?? "", x?.growth_outlook ?? ""]),
    ...tests.flatMap((x) => [x?.test_name ?? "", x?.primary_type ?? "", x?.summary ?? ""]),
    ...insights.map((x) => x?.insight ?? ""),
    ...strengths,
    ...topSkills,
    ...weaknesses,
  ];
  const translated = useBackendTranslations(translationPlan, locale);
  let cursor = 0;
  const translatedTitle = translated[cursor++] || latestReport?.title || "";
  const translatedSummary = translated[cursor++] || latestReport?.summary || "";
  const tCareers = careers.map((x) => {
    const item = {
      name: translated[cursor++] || x?.name,
      reasoning: translated[cursor++] || x?.reasoning,
      growth_path: translated[cursor++] || x?.growth_path,
      salary_range: translated[cursor++] || x?.salary_range,
      match_score: x?.match_score,
    };
    return item;
  });
  const tUniversities = universities.map((x) => {
    const name = translated[cursor++] || x?.name;
    const city = translated[cursor++] || x?.city;
    const reasoning = translated[cursor++] || x?.reasoning;
    const programs = (x?.recommended_programs ?? []).map((p) => translated[cursor++] || p);
    return {
      name,
      city,
      reasoning,
      recommended_programs: programs,
    };
  });
  const tIndustries = industries.map((x) => ({
    industry: translated[cursor++] || x?.industry,
    reasoning: translated[cursor++] || x?.reasoning,
    growth_outlook: translated[cursor++] || x?.growth_outlook,
    fit_score: x?.fit_score,
  }));
  const tTests = tests.map((x) => ({
    test_name: translated[cursor++] || x?.test_name,
    primary_type: translated[cursor++] || x?.primary_type,
    summary: translated[cursor++] || x?.summary,
    scores: x?.scores,
  }));
  const tInsights = insights.map((x) => ({ ...x, insight: translated[cursor++] || x?.insight }));
  const tStrengths = strengths.map((x) => translated[cursor++] || x);
  const tTopSkills = topSkills.map((x) => translated[cursor++] || x);
  const tWeaknesses = weaknesses.map((x) => translated[cursor++] || x);

  return (
    <AppLayout title={t("sidebar_dashboard")}>
      <Box sx={styles.dashboardRoot}>
        <Box sx={styles.ctaCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={styles.ctaIcon}>
              <DiamondIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {t("dashboard_welcome")}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                {t("dashboard_subtitle")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {latestReportQuery.isLoading ? (
          <Paper sx={styles.loadingCard}>
            <CircularProgress size={26} />
          </Paper>
        ) : (
          <Box sx={styles.parent}>
            <Box sx={styles.div1}>
              {latestReport ? (
                <ReportDownloadCart
                  title={translatedTitle}
                  summary={translatedSummary}
                  downloading={downloadingId === latestReport.id}
                  onDownload={() => downloadReport(latestReport.id, latestReport.title)}
                />
              ) : (
                <ReportDownloadCart
                  title=""
                  downloading={false}
                  onDownload={async () => undefined}
                />
              )}
            </Box>

            <Box sx={styles.div2}>
              <CareerReportCart
                items={tCareers.map((item) => ({
                  name: item?.name,
                  reason: item?.reasoning,
                  matchScore: item?.match_score,
                  growthPath: item?.growth_path,
                  salaryRange: item?.salary_range,
                }))}
              />
            </Box>

            <Box sx={styles.div3}>
              <UniversityReportCart
                items={tUniversities.map((item) => ({
                  name: item?.name,
                  city: item?.city,
                  reason: item?.reasoning,
                  programs: item?.recommended_programs,
                }))}
              />
            </Box>

            <Box sx={styles.div4}>
              <IndustryReportCart
                items={tIndustries.map((item) => ({
                  industry: item?.industry,
                  fitScore: item?.fit_score,
                  reason: item?.reasoning,
                  growthOutlook: item?.growth_outlook,
                }))}
              />
            </Box>

            <Box sx={styles.div5}>
              <TestReportCart
                items={tTests.map((test, idx) => ({
                  testName: test?.test_name ?? `Test ${idx + 1}`,
                  primaryType: test?.primary_type,
                  summary: test?.summary,
                  scores: flattenAnalysisScores(test?.scores),
                  insight: tInsights[idx]?.insight,
                }))}
              />
            </Box>

            <Box sx={styles.div6}>
              <SkillReportCart strengths={tStrengths} topSkills={tTopSkills} weaknesses={tWeaknesses} />
            </Box>
          </Box>
        )}
      </Box>
    </AppLayout>
  );
};

export default DashboardPage;

const styles = {
  dashboardRoot: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
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
  loadingCard: {
    p: 3,
    borderRadius: 3,
    display: "flex",
    justifyContent: "center",
  },
  parent: {
    display: "grid",
    gap: 1,
    minWidth: 0,
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(8, 1fr)",
    },
    gridTemplateAreas: {
      xs: `
        "one"
        "two"
        "three"
        "four"
        "five"
        "six"
      `,
      sm: `
        "one two"
        "three four"
        "five five"
        "six six"
      `,
      md: "none",
    },
  },
  div1: {
    gridArea: { xs: "one" },
    gridColumn: { md: "span 2 / span 2" },
    gridRow: { md: "1" },
    minWidth: 0,
  },
  div2: {
    gridArea: { xs: "two" },
    gridColumn: { md: "span 3 / span 3" },
    gridColumnStart: { md: 3 },
    gridRow: { md: "1" },
    minWidth: 0, overflow: "hidden",
  },
  div3: {
    gridArea: { xs: "three" },
    gridColumn: { md: "span 3 / span 3" },
    gridColumnStart: { md: 6 },
    gridRow: { md: "1" },
    minWidth: 0, overflow: "hidden",
  },
  div4: {
    gridArea: { xs: "four" },
    gridColumn: { md: "span 4 / span 4" },
    gridRow: { md: "2" },
    minWidth: 0, overflow: "hidden",
  },
  div5: {
    gridArea: { xs: "five" },
    gridColumn: { md: "span 4 / span 4" },
    gridColumnStart: { md: 5 },
    gridRow: { md: "2" },
    minWidth: 0, overflow: "hidden",
  },
  div6: {
    gridArea: { xs: "six" },
    gridColumn: { md: "span 8 / span 8" },
    gridRow: { md: "3" },
    minWidth: 0, overflow: "hidden",
  },
};

