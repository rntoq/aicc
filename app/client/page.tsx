"use client";

import { Alert, Box, CardContent, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { useAnalysisDashboard } from "@/lib/services/analyseServices";
import { muiTheme } from "@/ui/theme/muiTheme";

const DashboardPage = () => {
  const t = useTranslations();
  const { data, isLoading, isError } = useAnalysisDashboard();

  return (
    <AppLayout title={t("sidebar_dashboard")}>
      <Box>
        <Box sx={styles.welcomeCard}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              {t("dashboard_welcome")}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              {t("dashboard_subtitle")}
            </Typography>
          </CardContent>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">{t("common_error") as string}</Alert>
        ) : (
          <Box component="pre" sx={styles.pre}>
            {JSON.stringify(data, null, 2)}
          </Box>
        )}
      </Box>
    </AppLayout>
  );
};

export default DashboardPage;

const styles = {
  welcomeCard: {
    mb: 3,
    p: 3,
    borderRadius: 2,
    background: muiTheme.landing.lightGradient,
    color: "white",
  },
  card: {
    height: "100%",
    borderRadius: 2,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    textDecoration: "none",
    display: "block",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
  },
  pre: {
    mt: 2,
    p: 2,
    borderRadius: 2,
    bgcolor: "grey.100",
    fontSize: 12,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};
