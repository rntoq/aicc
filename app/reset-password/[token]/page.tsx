"use client";

import { Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Header } from "@/app/components/layout/Header";
import { PasswordField } from "@/app/components/layout/PasswordField";
import { useResetPasswordPageState } from "@/lib/hooks/useAuthPages";

const ResetPasswordPage = () => {
  const t = useTranslations();
  const { password, setPassword, passwordConfirm, setPasswordConfirm, loading, handleSubmit } =
    useResetPasswordPageState(t as unknown as (key: string, values?: Record<string, unknown>) => string);

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>
            <Typography variant="h5" sx={styles.title}>
              {t("reset_password_title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={styles.subtitle}>
              {t("reset_password_subtitle")}
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <PasswordField
                  label={t("settings_new_password")}
                  name="password"
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <PasswordField
                  label={t("settings_new_password_confirm")}
                  name="passwordConfirm"
                  required
                  fullWidth
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                />
                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : t("reset_password_submit")}
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

export default ResetPasswordPage;

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
