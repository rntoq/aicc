"use client";

import {
  Box,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { analyseServices } from "@/lib/services/analyseServices";
import { useQuery } from "@tanstack/react-query";
import DiamondIcon from "@mui/icons-material/Diamond";
import { useMemo, useState } from "react";
import { ReportDownloadCart } from "@/app/components/clientLayout/ReportDownloadCart";
import { CareerReportCart } from "@/app/components/clientLayout/CareerReportCart";
import { UniversityReportCart } from "@/app/components/clientLayout/UniversityReportCart";
import { IndustryReportCart } from "@/app/components/clientLayout/IndustryReportCart";
import { TestReportCart } from "@/app/components/clientLayout/TestReportCart";
import { SkillReportCart } from "@/app/components/clientLayout/SkillReportCart";
import { toast } from "react-toastify";

type SuggestionCareer = { name: string; reasoning?: string; match_score?: number; growth_path?: string; salary_range?: string };
type SuggestionUniversity = { name: string; city?: string; reasoning?: string; recommended_programs?: string[] };
type SuggestionIndustry = { industry: string; fit_score?: number; reasoning?: string; growth_outlook?: string };
type Insight = { test_name?: string; insight?: string };
type NamedItem = { title?: string; skill?: string };
type ReportDataSection = {
  primary_type?: string;
  test_name?: string;
  summary?: string;
  scores?: Record<string, number | Record<string, number>>;
};

type ReportItem = {
  id: number;
  title: string;
  summary?: string;
  created_at: string;
  report_data?: {
    photo?: ReportDataSection;
    holland?: ReportDataSection;
    big_five?: ReportDataSection;
    career_aptitude?: ReportDataSection;
    ai_analysis?: {
      career_suggestions?: SuggestionCareer[];
      university_suggestions?: SuggestionUniversity[];
      industry_recommendations?: SuggestionIndustry[];
      test_insights?: Insight[];
      strengths?: NamedItem[];
      top_skills?: NamedItem[];
      weaknesses?: NamedItem[];
    };
  };
};

const flattenScores = (scores?: Record<string, number | Record<string, number>>) => {
  if (!scores) return [];
  return Object.entries(scores).flatMap(([k, v]) => {
    if (typeof v === "number") return [{ key: k, value: v }];
    return Object.entries(v).map(([nestedKey, nestedValue]) => ({
      key: `${k}:${nestedKey}`,
      value: typeof nestedValue === "number" ? nestedValue : 0,
    }));
  });
};

const DashboardPage = () => {
  const t = useTranslations();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const reportsQuery = useQuery({
    queryKey: ["analysis", "reports", "dashboard-page"],
    queryFn: async () => {
      const { body, error } = await analyseServices.listReports();
      if (error) throw error;
      return body;
    },
  });

  const reports = useMemo<ReportItem[]>(() => {
    const payload = reportsQuery.data;
    if (Array.isArray(payload)) return payload as ReportItem[];
    if (payload && typeof payload === "object" && Array.isArray((payload as { results?: unknown[] }).results)) {
      return (payload as { results: ReportItem[] }).results;
    }
    return [];
  }, [reportsQuery.data]);

  const latestReport = useMemo(() => {
    return [...reports].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];
  }, [reports]);

  const analysis = latestReport?.report_data?.ai_analysis;
  const careers = analysis?.career_suggestions ?? [];
  const universities = analysis?.university_suggestions ?? [];
  const industries = analysis?.industry_recommendations ?? [];
  const insights = analysis?.test_insights ?? [];

  const tests = [
    latestReport?.report_data?.photo,
    latestReport?.report_data?.holland,
    latestReport?.report_data?.big_five,
    latestReport?.report_data?.career_aptitude,
  ].filter(Boolean) as ReportDataSection[];

  const strengths = (analysis?.strengths ?? []).map((x) => x.title).filter(Boolean) as string[];
  const topSkills = (analysis?.top_skills ?? []).map((x) => x.skill).filter(Boolean) as string[];
  const weaknesses = (analysis?.weaknesses ?? []).map((x) => x.title).filter(Boolean) as string[];

  const handleDownload = async (reportId: number, title: string) => {
    setDownloadingId(reportId);
    try {
      const { body, error } = await analyseServices.downloadReportPdf(reportId);
      if (error || !body) {
        toast.error(t("dashboard_download_error"));
        return;
      }
      const blob = new Blob([body], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t("dashboard_download_success"));
    } finally {
      setDownloadingId(null);
    }
  };

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

        {reportsQuery.isLoading ? (
          <Paper sx={styles.loadingCard}>
            <CircularProgress size={26} />
          </Paper>
        ) : (
          <Box sx={styles.parent}>
            <Box sx={styles.div1}>
              {latestReport ? (
                <ReportDownloadCart
                  title={latestReport.title}
                  summary={latestReport.summary}
                  downloading={downloadingId === latestReport.id}
                  onDownload={() => handleDownload(latestReport.id, latestReport.title)}
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
                items={careers.map((item) => ({
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
                items={universities.map((item) => ({
                  name: item?.name,
                  city: item?.city,
                  reason: item?.reasoning,
                  programs: item?.recommended_programs,
                }))}
              />
            </Box>

            <Box sx={styles.div4}>
              <IndustryReportCart
                items={industries.map((item) => ({
                  industry: item?.industry,
                  fitScore: item?.fit_score,
                  reason: item?.reasoning,
                  growthOutlook: item?.growth_outlook,
                }))}
              />
            </Box>

            <Box sx={styles.div5}>
              <TestReportCart
                items={tests.map((test, idx) => ({
                  testName: test?.test_name ?? `Test ${idx + 1}`,
                  primaryType: test?.primary_type,
                  summary: test?.summary,
                  scores: flattenScores(test?.scores),
                  insight: insights[idx]?.insight,
                }))}
              />
            </Box>

            <Box sx={styles.div6}>
              <SkillReportCart strengths={strengths} topSkills={topSkills} weaknesses={weaknesses} />
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
        "five six"
      `,
      md: "none",
    },
  },
  div1: {
    gridArea: { xs: "one" },
    gridColumn: { md: "span 2 / span 2" },
    gridRow: { md: "1" },
  },
  div2: {
    gridArea: { xs: "two" },
    gridColumn: { md: "span 3 / span 3" },
    gridColumnStart: { md: 3 },
    gridRow: { md: "1" },
  },
  div3: {
    gridArea: { xs: "three" },
    gridColumn: { md: "span 3 / span 3" },
    gridColumnStart: { md: 6 },
    gridRow: { md: "1" },
  },
  div4: {
    gridArea: { xs: "four" },
    gridColumn: { md: "span 4 / span 4" },
    gridRow: { md: "2" },
  },
  div5: {
    gridArea: { xs: "five" },
    gridColumn: { md: "span 4 / span 4" },
    gridColumnStart: { md: 5 },
    gridRow: { md: "2" },
  },
  div6: {
    gridArea: { xs: "six" },
    gridColumn: { md: "span 8 / span 8" },
    gridRow: { md: "3" },
  },
};

