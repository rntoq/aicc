"use client";

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
import { Header } from "../components/layout/Header";
import { PasswordField } from "../components/layout/PasswordField";
import { useTranslations } from "next-intl";
import Image from "next/image";
import BANNER_IMAGE from "../../public/icons/user.svg";
import { useLoginPageState } from "@/lib/hooks/useAuthPages";

const LoginPage = () => {
  const t = useTranslations();
  const { loading, email, setEmail, password, setPassword, showVerifyCta, handleSubmit } = useLoginPageState(
    t as unknown as (key: string, values?: Record<string, unknown>) => string
  );

  return (
    <>
      <Header />
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Paper sx={styles.paper}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <Image src={BANNER_IMAGE} alt="logo" width={100} height={48} />
            </Box>

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

                <Button sx={styles.forgotPasswordButton} component={Link} href="/register" size="small" variant="text">
                    {t("register")}
                </Button>
              </Box>
              <Box sx={styles.actionsRow}>
                <Button sx={styles.forgotPasswordButton} component={Link} href="/forgot-password" size="small" variant="text">
                  {t("forgot_password")}
                </Button>
              </Box>
              {showVerifyCta && (
                <Box sx={styles.actionsRow}>
                  <Button
                    sx={styles.forgotPasswordButton}
                    component={Link}
                    href={`/verify-email?email=${encodeURIComponent(email.trim())}`}
                    size="small"
                    variant="text"
                  >
                    {t("verify_email_request_submit")}
                  </Button>
                </Box>
              )}
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
    mt: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotPasswordButton: {
    padding: 0,
    "&:hover": {
      bgcolor: "transparent",
    },
  },
};