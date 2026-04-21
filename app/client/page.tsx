"use client";

import { Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { muiTheme } from "@/ui/theme/muiTheme";

const MOCK_DASHBOARD_DATA = {
  user: {
    name: "Aruzhan",
  },
  stats: {
    completed_tests: 6,
    total_tests: 10,
    completed_sessions: 8,
    profile_readiness_percent: 72,
  },
  subscription: {
    plan: "Basic",
  },
  next_step: {
    kind: "test",
    title: "Complete 2 more tests to unlock stronger recommendations",
    cta: "Continue testing",
  },
  top_recommendations: [
    { id: 1, title: "Product Manager", match_score: 91, reason: "Strong communication and leadership profile." },
    { id: 2, title: "UX Researcher", match_score: 86, reason: "High empathy and analytical thinking." },
    { id: 3, title: "Business Analyst", match_score: 83, reason: "Balanced logic, structure, and teamwork style." },
  ],
  recent_results: [
    { id: 101, test_name: "Holland Code", primary_type: "RIA", date: "2026-04-20" },
    { id: 102, test_name: "DiSC", primary_type: "SC", date: "2026-04-18" },
    { id: 103, test_name: "Big Five", primary_type: "Conscientiousness", date: "2026-04-15" },
  ],
  checklist: [
    { id: "required-tests", label: "Pass all required tests", done: true },
    { id: "refresh-profile", label: "Refresh profile summary", done: true },
    { id: "ai-report", label: "Generate AI analysis report", done: false },
    { id: "universities", label: "Review universities and programs", done: false },
  ],
} as const;

const formatIsoDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const DashboardPage = () => {
  const t = useTranslations();
  const data = MOCK_DASHBOARD_DATA;
  const progressValue = Math.round((data.stats.completed_tests / data.stats.total_tests) * 100);

  return (
    <AppLayout title={t("sidebar_dashboard")}>
      <Box>
        <Box sx={styles.welcomeCard}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              {t("dashboard_welcome")}, {data.user.name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              {data.next_step.title}
            </Typography>
          </CardContent>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={styles.metricCard}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Tests completed</Typography>
                  <AssignmentTurnedInRoundedIcon fontSize="small" color="primary" />
                </Stack>
                <Typography variant="h4" sx={styles.metricValue}>
                  {data.stats.completed_tests}/{data.stats.total_tests}
                </Typography>
                <LinearProgress value={progressValue} variant="determinate" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={styles.metricCard}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Completed sessions</Typography>
                  <PsychologyRoundedIcon fontSize="small" color="primary" />
                </Stack>
                <Typography variant="h4" sx={styles.metricValue}>{data.stats.completed_sessions}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={styles.metricCard}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Profile readiness</Typography>
                  <AutoAwesomeRoundedIcon fontSize="small" color="primary" />
                </Stack>
                <Typography variant="h4" sx={styles.metricValue}>{data.stats.profile_readiness_percent}%</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={styles.metricCard}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Plan</Typography>
                  <WorkspacePremiumRoundedIcon fontSize="small" color="primary" />
                </Stack>
                <Typography variant="h4" sx={styles.metricValue}>{data.subscription.plan}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography variant="h6" sx={styles.sectionTitle}>Top career matches</Typography>
                <Stack spacing={1.5}>
                  {data.top_recommendations.map((rec) => (
                    <Box key={rec.id} sx={styles.rowCard}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{rec.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{rec.reason}</Typography>
                      </Box>
                      <Chip label={`${rec.match_score}% match`} color="primary" variant="outlined" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography variant="h6" sx={styles.sectionTitle}>Next step</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {data.next_step.kind === "test"
                    ? "Recommended action based on your progress."
                    : "Your profile is ready for deeper analysis."}
                </Typography>
                <Button fullWidth size="large" variant="contained" sx={styles.ctaButton}>
                  {data.next_step.cta}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography variant="h6" sx={styles.sectionTitle}>Recent test results</Typography>
                <Stack spacing={1.5}>
                  {data.recent_results.map((result) => (
                    <Box key={result.id} sx={styles.rowCard}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{result.test_name}</Typography>
                        <Typography variant="body2" color="text.secondary">Primary type: {result.primary_type}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{formatIsoDate(result.date)}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={styles.card}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <SchoolRoundedIcon color="primary" fontSize="small" />
                  <Typography variant="h6" sx={styles.sectionTitle}>Action checklist</Typography>
                </Stack>
                <Stack spacing={1}>
                  {data.checklist.map((item) => (
                    <Box key={item.id} sx={styles.checklistItem}>
                      <Typography variant="body2">{item.label}</Typography>
                      <Chip
                        size="small"
                        label={item.done ? "Done" : "Pending"}
                        color={item.done ? "success" : "default"}
                        variant={item.done ? "filled" : "outlined"}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default DashboardPage;

const styles = {
  welcomeCard: {
    mb: 3,
    p: 3,
    borderRadius: 3,
    background: muiTheme.landing.lightGradient,
    color: "white",
  },
  metricCard: {
    borderRadius: 3,
    height: "100%",
  },
  metricValue: {
    mt: 1,
    fontWeight: 800,
  },
  card: {
    height: "100%",
    borderRadius: 3,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    textDecoration: "none",
    display: "block",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
  },
  sectionTitle: {
    mb: 1.5,
    fontWeight: 700,
  },
  rowCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    p: 1.5,
    borderRadius: 2,
    bgcolor: "grey.50",
    border: "1px solid",
    borderColor: "divider",
  },
  ctaButton: {
    borderRadius: 999,
    textTransform: "none",
    fontWeight: 700,
  },
  checklistItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    p: 1.25,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
  },
};
