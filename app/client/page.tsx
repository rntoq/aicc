"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AppLayout } from "@/app/components/layout/AppLayout";
import type { PublicProfession, PublicUniversity } from "@/lib/types";
import { ALL_TESTS, type TestItem } from "@/utils/constants";

const dashboardPalette = {
  primaryLight: "#86a8e7",
  secondaryLight: "#91eae4",
  lightGradient: "linear-gradient(135deg, rgba(134, 168, 231, 0.2) 0%, rgba(145, 234, 228, 0.24) 100%)",
};

type DashboardData = {
  userName: string;
  testsDone: number;
  totalTests: number;
  aiReport: null | {
    id: number;
    pdfUrl: string;
    summary: string;
  };
  recommendedProfessions: PublicProfession[];
  lastDoneTest: null | {
    testId: string;
    resultLabel: string;
    finishedAt: string;
  };
  suitableUniversity: PublicUniversity | null;
};

const PROFESSION_CARD_DATA: PublicProfession[] = [
  {
    id: "p1",
    name: { ru: "Data Scientist", kk: "Data Scientist", en: "Data Scientist" },
    industry: "it_technology",
    specialities: [{ code: "B057", id: 57 }],
    demand_level: "high",
    salary_kzt: { min: 450000, max: 1200000, average: 780000 },
    description: {
      ru: "Анализирует данные и строит предиктивные модели для бизнеса.",
      kk: "Деректерді талдап, бизнеске болжам модельдерін жасайды.",
      en: "Analyzes data and builds predictive models for business.",
    },
  },
  {
    id: "p2",
    name: { ru: "Product Manager", kk: "Product Manager", en: "Product Manager" },
    industry: "business_management",
    specialities: [{ code: "B044", id: 44 }],
    demand_level: "high",
    salary_kzt: { min: 500000, max: 1400000, average: 900000 },
    description: {
      ru: "Ведет продукт от идеи до запуска и роста.",
      kk: "Өнімді идеядан іске қосуға және өсіруге дейін басқарады.",
      en: "Leads product from idea to launch and growth.",
    },
  },
  {
    id: "p3",
    name: { ru: "UX Researcher", kk: "UX Researcher", en: "UX Researcher" },
    industry: "design_creative",
    specialities: [{ code: "B073", id: 73 }],
    demand_level: "medium",
    salary_kzt: { min: 350000, max: 850000, average: 550000 },
    description: {
      ru: "Изучает поведение пользователей и улучшает цифровые продукты.",
      kk: "Пайдаланушылар мінез-құлқын зерттеп, цифрлық өнімдерді жақсартады.",
      en: "Studies user behavior and improves digital products.",
    },
  },
  {
    id: "p4",
    name: { ru: "Business Analyst", kk: "Business Analyst", en: "Business Analyst" },
    industry: "finance_accounting",
    specialities: [{ code: "B045", id: 45 }],
    demand_level: "high",
    salary_kzt: { min: 380000, max: 980000, average: 620000 },
    description: {
      ru: "Формулирует требования и связывает бизнес с разработкой.",
      kk: "Талаптарды жинап, бизнес пен әзірлеушілерді байланыстырады.",
      en: "Defines requirements and bridges business with engineering.",
    },
  },
  {
    id: "p5",
    name: { ru: "Cybersecurity Analyst", kk: "Cybersecurity Analyst", en: "Cybersecurity Analyst" },
    industry: "it_technology",
    specialities: [{ code: "B058", id: 58 }],
    demand_level: "very_high",
    salary_kzt: { min: 500000, max: 1300000, average: 870000 },
    description: {
      ru: "Защищает инфраструктуру и данные от киберугроз.",
      kk: "Инфрақұрылым мен деректерді киберқауіптен қорғайды.",
      en: "Protects infrastructure and data from cyber threats.",
    },
  },
];

const UNIVERSITY_DATA: PublicUniversity = {
  id: 1,
  logo: "/images/default.png",
  code: "NU",
  region: 1,
  military_faculty: false,
  dormitory: true,
  price: 3200000,
  paid: true,
  url: "https://nu.edu.kz",
  consult_landing_url: null,
  specialities_count: 77,
  name: {
    ru: "Назарбаев Университет",
    kk: "Назарбаев Университеті",
    en: "Nazarbayev University",
  },
  short_name: { ru: "NU", kk: "NU", en: "NU" },
  address: "Astana",
};

const DASHBOARD_DATA: DashboardData = {
  userName: "Aruzhan",
  testsDone: 8,
  totalTests: 10,
  aiReport: {
    id: 25,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "You show strong analytical thinking and leadership potential in structured environments.",
  },
  recommendedProfessions: PROFESSION_CARD_DATA,
  lastDoneTest: {
    testId: "holland",
    resultLabel: "Primary profile: RIA",
    finishedAt: "20 Apr 2026",
  },
  suitableUniversity: UNIVERSITY_DATA,
};

const formatKzt = (value: number) =>
  `${new Intl.NumberFormat("ru-RU").format(value)} ₸`;

const getDemandMeta = (demand: PublicProfession["demand_level"]) => {
  if (demand === "very_high") return { label: "Очень высокий спрос", color: "#1a8f64" };
  if (demand === "high") return { label: "Высокий спрос", color: "#1f7a9d" };
  if (demand === "medium") return { label: "Средний спрос", color: "#946200" };
  return { label: "Базовый спрос", color: "#5c6384" };
};

const normalizeSpecialityCode = (spec: string | { code: string; id: number }) =>
  typeof spec === "string" ? spec : spec.code;

const DashboardPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const [professionIndex, setProfessionIndex] = useState(0);
  const data = DASHBOARD_DATA;
  const selectedProfession = data.recommendedProfessions[professionIndex] ?? null;
  const mappedLastTest: TestItem | null = data.lastDoneTest
    ? ALL_TESTS.find((item) => item.id === data.lastDoneTest?.testId) ?? null
    : null;
  const testsProgress = useMemo(
    () => (data.totalTests > 0 ? (data.testsDone / data.totalTests) * 100 : 0),
    [data.testsDone, data.totalTests]
  );

  const hasProfessions = data.recommendedProfessions.length > 0;

  const handlePrevProfession = () => {
    if (!hasProfessions) return;
    setProfessionIndex((prev) => (prev === 0 ? data.recommendedProfessions.length - 1 : prev - 1));
  };

  const handleNextProfession = () => {
    if (!hasProfessions) return;
    setProfessionIndex((prev) => (prev + 1) % data.recommendedProfessions.length);
  };

  const goToAiChat = () => {
    if (typeof window !== "undefined" && data.aiReport) {
      window.sessionStorage.setItem(
        "ai_chat_report_context",
        JSON.stringify({
          reportId: data.aiReport.id,
          reportPdfUrl: data.aiReport.pdfUrl,
          reportSummary: data.aiReport.summary,
        })
      );
    }
    router.push(data.aiReport ? `/client/ai-chat?reportId=${data.aiReport.id}` : "/client/ai-chat");
  };

  return (
    <AppLayout title={t("sidebar_dashboard")}>
      <Box sx={styles.dashboardRoot}>
        <Box sx={styles.welcomeCard}>
          <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
            {t("dashboard_welcome")}, {data.userName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            Dashboard preview mode for different user states.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Box sx={{ ...styles.boxCard, ...styles.compactStatCard }}>
              <Typography variant="overline" color="text.secondary">
                Tests progress
              </Typography>
              <Typography variant="h5" sx={styles.metricValue}>
                {data.testsDone}/{data.totalTests}
              </Typography>
              <LinearProgress variant="determinate" value={testsProgress} sx={styles.metricProgress} />
              <Typography variant="caption" color="text.secondary">
                Completed tests
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Box sx={styles.boxCard}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <DescriptionRoundedIcon color="primary" fontSize="small" />
                <Typography variant="h6" sx={styles.sectionTitle}>
                  AI report
                </Typography>
              </Stack>
              {data.aiReport ? (
                <Stack spacing={1.25}>
                  <Typography variant="caption" color="text.secondary">
                    {data.aiReport.summary}
                  </Typography>
                  <Box sx={styles.fileFallbackBox}>
                    <DescriptionRoundedIcon sx={styles.fileFallbackIcon} />
                    <Box>
                      <Typography sx={styles.fileFallbackTitle}>PDF preview is unavailable</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Open or download the file to view full report.
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Button
                      size="small"
                      variant="contained"
                      href={data.aiReport.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      sx={styles.primaryButton}
                    >
                      Open
                    </Button>
                    <Button size="small" variant="outlined" href={data.aiReport.pdfUrl} download sx={styles.outlinedButton}>
                      Download PDF
                    </Button>
                    <Button size="small" variant="text" onClick={goToAiChat} sx={styles.textButton}>
                      AI chat
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No AI analysis yet. Complete tests and generate AI report to see PDF and insights here.
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Box sx={{ ...styles.boxCard, ...styles.equalPanel }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={styles.sectionTitle}>
                  Recommended professions
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" sx={styles.navIconButton} onClick={handlePrevProfession} disabled={!hasProfessions}>
                    <ArrowBackIosNewRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={styles.navIconButton} onClick={handleNextProfession} disabled={!hasProfessions}>
                    <ArrowForwardIosRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              {selectedProfession ? (
                <Stack spacing={0.8} sx={styles.sectionContentCompact}>
                  <Box sx={styles.innerCard}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                      <Box>
                        <Typography sx={styles.innerTitle}>{selectedProfession.name.ru}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(selectedProfession.industry)}
                        </Typography>
                      </Box>
                      <Chip
                        label={getDemandMeta(selectedProfession.demand_level).label}
                        size="small"
                        sx={{ ...styles.infoChip, color: getDemandMeta(selectedProfession.demand_level).color }}
                      />
                    </Stack>
                    <Divider sx={styles.innerDivider} />
                    <Typography variant="body2" sx={styles.lineClamp2}>
                      {selectedProfession.description?.ru ?? "Описание скоро будет доступно."}
                    </Typography>
                    <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap" sx={{ mt: 1.2 }}>
                      {selectedProfession.specialities.slice(0, 3).map((spec) => (
                        <Chip key={normalizeSpecialityCode(spec)} label={normalizeSpecialityCode(spec)} size="small" sx={styles.codeChip} />
                      ))}
                    </Stack>
                    <Box sx={styles.salaryStrip}>
                      {formatKzt(selectedProfession.salary_kzt.min ?? 0)} - {formatKzt(selectedProfession.salary_kzt.max ?? 0)}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {professionIndex + 1} / {data.recommendedProfessions.length}
                  </Typography>
                  <Link component="button" underline="hover" sx={styles.moreLink} onClick={() => router.push("/client/careers")}>
                    More professions
                  </Link>
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  No recommended professions yet. Complete required tests to get career matches.
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Box sx={{ ...styles.boxCard, ...styles.equalPanel }}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                Last done test
              </Typography>
              {mappedLastTest && data.lastDoneTest ? (
                <Stack spacing={0.8} sx={styles.sectionContentCompact}>
                  <Box sx={styles.innerCard}>
                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.8 }}>
                      <Box sx={styles.testIconCircle}>
                        <mappedLastTest.icon />
                      </Box>
                      <Box>
                        <Typography sx={styles.innerTitle}>{mappedLastTest.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {mappedLastTest.required ? "Required test" : "Optional test"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1.5}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeRoundedIcon sx={styles.metaIcon} />
                        <Typography variant="caption" color="text.secondary">
                          {mappedLastTest.duration ?? "-"} min
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <QuizRoundedIcon sx={styles.metaIcon} />
                        <Typography variant="caption" color="text.secondary">
                          {mappedLastTest.questions ?? "-"} questions
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Box sx={styles.smallInfoBox}>
                    <Typography sx={{ fontWeight: 700 }}>{data.lastDoneTest.resultLabel}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed: {data.lastDoneTest.finishedAt}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Done tests now: {data.testsDone}
                    </Typography>
                  </Box>
                  <Link component="button" underline="hover" sx={styles.moreLink} onClick={() => router.push("/client")}>
                    More tests
                  </Link>
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  No test results yet. Start with any test and your latest result will appear here.
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
            <Box sx={{ ...styles.boxCard, ...styles.equalPanel }}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                Most suitable university
              </Typography>
              {data.suitableUniversity ? (
                <Stack spacing={0.8} sx={styles.sectionContentCompact}>
                  <Box sx={styles.innerCard}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box sx={styles.uniLogoWrap}>
                        <Image
                          src={data.suitableUniversity.logo || "/images/default.png"}
                          alt={data.suitableUniversity.short_name.ru ?? "University"}
                          fill
                          sizes="48px"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={styles.innerTitle}>{data.suitableUniversity.short_name.ru ?? "University"}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {data.suitableUniversity.name.ru ?? data.suitableUniversity.name.en ?? "University profile"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider sx={styles.innerDivider} />
                    <Stack spacing={0.6}>
                      <Typography variant="body2" color="text.secondary">
                        Город: <b>{data.suitableUniversity.address ?? "-"}</b>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Стоимость: <b>{formatKzt(data.suitableUniversity.price ?? 0)}</b>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Специальностей: <b>{data.suitableUniversity.specialities_count}</b>
                      </Typography>
                    </Stack>
                  </Box>
                  <Link component="button" underline="hover" sx={styles.moreLink} onClick={() => router.push("/client/education")}>
                    More universities
                  </Link>
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  No university recommendation yet. Finish analysis to unlock suitable university suggestions.
                </Typography>
              )}
            </Box>
          </Grid>

        </Grid>
      </Box>
    </AppLayout>
  );
};

export default DashboardPage;

const styles = {
  dashboardRoot: {
    minHeight: "calc(100vh - 96px)",
    display: "flex",
    flexDirection: "column",
    gap: { xs: 1.25, md: 1.5 },
  },
  welcomeCard: {
    p: { xs: 1.2, md: 1.6 },
    borderRadius: 3,
    background: dashboardPalette.lightGradient,
    color: "#182453",
    border: "1px solid rgba(134, 168, 231, 0.32)",
    boxShadow: "0 8px 18px rgba(62, 93, 152, 0.08)",
  },
  boxCard: {
    borderRadius: 3,
    height: "100%",
    border: "1px solid",
    borderColor: "rgba(134, 168, 231, 0.28)",
    bgcolor: "background.paper",
    backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(145, 234, 228, 0.06) 100%)",
    p: { xs: 1.2, md: 1.35 },
    boxShadow: "0 10px 24px rgba(27, 46, 94, 0.06)",
    display: "flex",
    flexDirection: "column",
    minHeight: { xs: 300, md: 340 },
  },
  compactStatCard: {
    justifyContent: "center",
    minHeight: { xs: 140, md: 160 },
    display: "flex",
    flexDirection: "column",
  },
  equalPanel: {
    minHeight: { xs: 340, sm: 360, md: 400 },
    maxHeight: { xs: "none", md: 400 },
    overflow: "hidden",
  },
  metricValue: {
    mt: 0.35,
    fontWeight: 800,
    fontSize: { xs: "1.7rem", md: "2rem" },
    color: "#233f74",
    lineHeight: 1.05,
  },
  metricProgress: {
    my: 1,
    height: 8,
    borderRadius: 999,
    bgcolor: "rgba(134, 168, 231, 0.16)",
    "& .MuiLinearProgress-bar": {
      borderRadius: 999,
      backgroundImage: "linear-gradient(90deg, #7fa7ea 0%, #7de0cf 100%)",
    },
  },
  sectionTitle: {
    mb: 0.35,
    fontWeight: 700,
    color: "#1f2a56",
    fontSize: { xs: "0.98rem", md: "1rem" },
  },
  sectionContentCompact: {
    minHeight: 0,
    height: "100%",
    overflow: "hidden",
  },
  primaryButton: {
    bgcolor: dashboardPalette.primaryLight,
    color: "#0f2547",
    borderColor: dashboardPalette.primaryLight,
    "&:hover": { bgcolor: "#78a0e4" },
  },
  outlinedButton: {
    borderColor: "rgba(134, 168, 231, 0.7)",
    color: "#35538a",
    "&:hover": {
      borderColor: dashboardPalette.secondaryLight,
      bgcolor: "rgba(145, 234, 228, 0.12)",
    },
  },
  textButton: {
    color: "#35538a",
    "&:hover": { bgcolor: "rgba(145, 234, 228, 0.12)" },
  },
  navIconButton: {
    border: "1px solid rgba(134, 168, 231, 0.5)",
    color: "#35538a",
    bgcolor: "rgba(134, 168, 231, 0.08)",
    "&:hover": { bgcolor: "rgba(145, 234, 228, 0.18)" },
  },
  fileFallbackBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    p: 1,
    borderRadius: 2,
    border: "1px solid rgba(134, 168, 231, 0.4)",
    bgcolor: "rgba(134, 168, 231, 0.08)",
    minHeight: 50,
  },
  fileFallbackIcon: {
    fontSize: 20,
    color: "#3f6fb8",
    flexShrink: 0,
  },
  fileFallbackTitle: {
    fontWeight: 700,
    fontSize: "0.86rem",
  },
  smallInfoBox: {
    p: 1,
    borderRadius: 2,
    bgcolor: "rgba(145, 234, 228, 0.08)",
    border: "1px solid",
    borderColor: "rgba(145, 234, 228, 0.4)",
  },
  innerCard: {
    p: 1.2,
    borderRadius: 2.2,
    border: "1px solid rgba(134, 168, 231, 0.35)",
    bgcolor: "rgba(255,255,255,0.9)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
    minHeight: { xs: 180, md: 195 },
  },
  innerTitle: {
    fontSize: "0.98rem",
    fontWeight: 700,
    color: "#22325f",
  },
  innerDivider: {
    my: 1,
    borderColor: "rgba(134, 168, 231, 0.2)",
  },
  lineClamp2: {
    fontSize: "0.86rem",
    color: "text.secondary",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  salaryStrip: {
    mt: 1.2,
    borderRadius: 1.6,
    py: 0.55,
    px: 0.9,
    textAlign: "center",
    fontSize: "0.84rem",
    fontWeight: 700,
    color: "#23416a",
    bgcolor: "rgba(125, 224, 207, 0.22)",
  },
  codeChip: {
    height: 24,
    fontSize: "0.72rem",
    borderRadius: 1.2,
    bgcolor: "rgba(134, 168, 231, 0.12)",
    color: "#2a4b7a",
  },
  infoChip: {
    height: 24,
    fontSize: "0.72rem",
    borderRadius: 1.2,
    bgcolor: "rgba(125, 224, 207, 0.2)",
    border: "1px solid rgba(125, 224, 207, 0.35)",
  },
  testIconCircle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    color: "#2c4f86",
    bgcolor: "rgba(134, 168, 231, 0.2)",
    border: "1px solid rgba(134, 168, 231, 0.34)",
    flexShrink: 0,
  },
  metaIcon: {
    fontSize: 16,
    color: "#446594",
  },
  moreLink: {
    mt: "auto",
    alignSelf: "flex-end",
    fontSize: "0.84rem",
    fontWeight: 600,
    color: "#3c5f9f",
    textUnderlineOffset: "3px",
    "&:hover": {
      color: "#2a4f92",
      bgcolor: "transparent",
    },
  },
  uniLogoWrap: {
    width: 48,
    height: 48,
    borderRadius: 1.4,
    overflow: "hidden",
    border: "1px solid rgba(134, 168, 231, 0.35)",
    position: "relative",
    flexShrink: 0,
  },
};
