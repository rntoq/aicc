"use client";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Header } from "../components/layout/Header";
import { PasswordField } from "../components/layout/PasswordField";
import { useTranslations } from "next-intl";
import Image from "next/image";
import BANNER_IMAGE from "../../public/icons/user.svg";
import { useRegisterPageState } from "@/lib/hooks/useAuthPages";

const RegisterPage = () => {
  const t = useTranslations();
  const { loading, error, localError, form, handleChange, handleSubmit } = useRegisterPageState(t);

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <Image src={BANNER_IMAGE} alt="logo" width={100} height={48} />
            </Box>

            {(localError || error) && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 2 }}
              >
                {localError || error}
              </Typography>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <Box sx={styles.row}>
                  <TextField
                    label={t("register_first_name_label")}
                    name="firstName"
                    required
                    fullWidth
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                  <TextField
                    label={t("register_last_name_label")}
                    name="lastName"
                    required
                    fullWidth
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                </Box>
                <TextField
                  label={t("register_email_label")}
                  type="email"
                  name="email"
                  required
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <PasswordField
                  label={t("register_password_label")}
                  name="password"
                  required
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  helperText={t("register_password_helper")}
                />
                <PasswordField
                  label={t("register_password_confirm_label")}
                  name="passwordConfirm"
                  required
                  fullWidth
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : t("register")}
                </Button>
              </Stack>

              <Box
                sx={styles.actionsRow}
              >
                <Typography variant="body2" color="text.secondary">
                  {t("register_have_account")}
                </Typography>
                <Button
                  component={Link}
                  href="/login"
                  size="small"
                  variant="text"
                >
                  {t("login")}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default RegisterPage;

const styles = {
  root: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    py: { xs: 4, md: 6 },
    mt: "50px",
  },
  paper: {
    maxWidth: 560,
    width: "100%",
    mx: "auto",
    p: { xs: 3, md: 4 },
    borderRadius: 3,
    boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
  },
  title: {
    mb: 0.5,
    fontWeight: 700,
  },
  subtitle: {
    mb: 3,
    color: "text.secondary",
  },
  row: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" } as const,
    gap: 2,
  },
  actionsRow: {
    mt: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: 1,
  },
};