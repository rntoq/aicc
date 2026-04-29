"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Header } from "@/app/components/layout/Header";
import { useVerifyEmailConfirmPageState } from "@/lib/hooks/useAuthPages";

const VerifyEmailConfirmPage = () => {
  const t = useTranslations();
  const { status, ui } = useVerifyEmailConfirmPageState(
    t as unknown as (key: string, values?: Record<string, unknown>) => string
  );
  const icon =
    status === "success" ? (
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />
    ) : status === "error" ? (
      <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
    ) : (
      <MarkEmailReadOutlinedIcon color="primary" sx={{ fontSize: 64 }} />
    );

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              {icon}
              <Typography variant="h5" sx={styles.title}>
                {ui.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {ui.message}
              </Typography>
              {status === "loading" && <CircularProgress size={28} sx={{ mt: 1 }} />}
              <Box sx={styles.actionsRow}>
                <Button component={Link} href="/login" variant="contained">
                  {t("login")}
                </Button>
                {status === "error" && (
                  <Button component={Link} href="/verify-email" variant="text">
                    {t("verify_email_request_submit")}
                  </Button>
                )}
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default VerifyEmailConfirmPage;

const styles = {
  root: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    py: { xs: 4, md: 6 },
  },
  paper: {
    maxWidth: 520,
    width: "100%",
    mx: "auto",
    p: { xs: 3, md: 4 },
    borderRadius: 3,
    boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
  },
  title: { fontWeight: 700 },
  actionsRow: {
    marginTop: 8,
    display: "flex",
    justifyContent: "center",
    gap: 1,
    flexWrap: "wrap" as const,
  },
};
