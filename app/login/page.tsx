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
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // TODO: интегрировать с backend API.
    // Сейчас просто имитация запроса.
    setTimeout(() => {
      setSubmitting(false);
      router.push("/app");
    }, 800);
  };

  return (
    <Box sx={styles.root}>
      <Container maxWidth="sm">
        <Paper sx={styles.paper}>
          <Typography component="h1" variant="h4" sx={styles.title}>
            Вход
          </Typography>
          <Typography variant="body2" sx={styles.subtitle}>
            Войдите по e‑mail и паролю, чтобы продолжить.
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="E‑mail"
                type="email"
                name="email"
                autoComplete="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Пароль"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Минимум 8 символов, используйте буквы и цифры."
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting}
              >
                {submitting ? "Вход..." : "Войти"}
              </Button>
            </Stack>

            <Box sx={styles.actionsRow}>
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?
              </Typography>
              <Button
                component={Link}
                href="/register"
                size="small"
                variant="text"
              >
                Зарегистрироваться
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
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
  title: {
    mb: 0.5,
    fontWeight: 700,
  },
  subtitle: {
    mb: 3,
    color: "text.secondary",
  },
  actionsRow: {
    mt: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};