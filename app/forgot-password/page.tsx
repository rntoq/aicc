"use client";

import { Box, Button, CircularProgress, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Header } from "../components/layout/Header";
import { authServices } from "@/lib/services/authServices";
import { useEmailActionPageState } from "@/lib/hooks/useAuthPages";

const ForgotPasswordPage = () => {
  const t = useTranslations();
  const { email, setEmail, loading, handleSubmit } = useEmailActionPageState({
    successFallbackText: t("forgot_password_success"),
    errorText: t("forgot_password_error"),
    request: (email) => authServices.requestPasswordReset({ email }),
  });

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>
            <Typography variant="h5" sx={styles.title}>
              {t("forgot_password_title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={styles.subtitle}>
              {t("forgot_password_subtitle")}
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label={t("login_email_label")}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : t("forgot_password_submit")}
                </Button>
              </Stack>
            </Box>

            <Box sx={styles.actionsRow}>
              <Button component={Link} href="/login" size="small" variant="text">
                {t("login")}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;

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
  actionsRow: { mt: 1, display: "flex", justifyContent: "flex-start" },
};
