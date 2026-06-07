"use client";

import { useMemo } from "react";
import { Box, Button, CircularProgress, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Header } from "../components/layout/Header";
import { authServices } from "@/lib/services/authServices";
import { useEmailActionPageState } from "@/lib/hooks/useAuthPages";

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmailRequestPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const { email, setEmail, loading, cooldown, handleSubmit } = useEmailActionPageState({
    initialEmail,
    successFallbackText: t("verify_email_request_success"),
    errorText: t("verify_email_request_error"),
    request: (email) => authServices.requestEmailVerify({ email }),
    cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    startCooldownOnMount: true,
  });

  const buttonLabel = cooldown > 0
    ? t("verify_email_request_resend_in", { seconds: cooldown })
    : t("verify_email_request_resend");

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>

            {initialEmail && (
              <Box sx={styles.sentToBox}>
                <Typography variant="body2" color="text.secondary">
                  {t("verify_email_request_sent_to")}
                </Typography>
                <Typography variant="body1" sx={styles.sentToEmail}>
                  {initialEmail}
                </Typography>
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" mb={2}>
              {t("verify_email_request_check_inbox")}
            </Typography>
            <Box component="form" mt={2} noValidate onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label={t("login_email_label")}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText={t("verify_email_request_not_received")}
                />
              </Stack>
            </Box>

            <Box sx={styles.actionsRow}>
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                disabled={loading || cooldown > 0}
              >
                {loading ? <CircularProgress size={20} /> : buttonLabel}
              </Button>
              <Button component={Link} href="/login" variant="contained">
                {t("login")}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default VerifyEmailRequestPage;

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
  title: { mb: 1, fontWeight: 700 },
  subtitle: { mb: 3 },
  sentToBox: {
    mb: 1,
    p: 2,
    borderRadius: 2,
    bgcolor: "rgba(99,102,241,0.08)",
  },
  sentToEmail: { fontWeight: 600, wordBreak: "break-all" as const },
  actionsRow: { 
    mt: 1, 
    display: "flex", 
    justifyContent: "space-between", 
    gap: 1,
    button: { padding: 0 },
  },
};
