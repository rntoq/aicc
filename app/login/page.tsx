"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Header } from "../components/layout/Header";
import { PasswordField } from "../components/layout/PasswordField";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/constants";

const LoginPage = () => {
  const t = useTranslations();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/client";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    try {
      await login({ email, password });
      router.push(redirect);
    } catch {
      // ошибка уже записана в authStore.error
    }
  };

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <Image src={BANNER_PLACEHOLDER_IMAGE} alt="logo" width={100} height={48} />
            </Box>

            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 2 }}
              >
                {error}
              </Typography>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Stack spacing={4}>
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
                <PasswordField
                  label={t("login_password_label")}
                  name="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : t("login")}
                </Button>
              </Stack>

              <Box sx={styles.actionsRow}>
                <Typography variant="body2" color="text.secondary">
                  {t("login_no_account")}
                </Typography>
                <Button
                  component={Link}
                  href="/register"
                  size="small"
                  variant="text"
                >
                  {t("login_register")}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;

const styles = {
  root: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    py: { xs: 4, md: 6 },
  },
  paper: {
    maxWidth: 480,
    width: "100%",
    mx: "auto",
    p: { xs: 3, md: 4 },
    borderRadius: 3,
    boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
  },
  actionsRow: {
    mt: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};