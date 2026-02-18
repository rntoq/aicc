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

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    city: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // TODO: интеграция с backend API регистрации.
    setTimeout(() => {
      setSubmitting(false);
    }, 800);
  };

  return (
    <Box sx={styles.root}>
      <Container maxWidth="sm">
        <Paper sx={styles.paper}>
          <Typography component="h1" variant="h4" sx={styles.title}>
            Регистрация
          </Typography>
          <Typography variant="body2" sx={styles.subtitle}>
            Заполните данные, чтобы создать аккаунт.
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <Box
                sx={styles.row}
              >
                <TextField
                  label="Имя"
                  name="name"
                  required
                  fullWidth
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                <TextField
                  label="Фамилия"
                  name="surname"
                  required
                  fullWidth
                  value={form.surname}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
              </Box>
              <TextField
                label="Город"
                name="city"
                required
                fullWidth
                value={form.city}
                onChange={handleChange}
                autoComplete="address-level2"
              />
              <TextField
                label="E‑mail"
                type="email"
                name="email"
                required
                fullWidth
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <TextField
                label="Пароль"
                type="password"
                name="password"
                required
                fullWidth
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                helperText="Минимум 8 символов, рекомендовано буквы разного регистра и цифры."
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting}
              >
                {submitting ? "Создание аккаунта..." : "Зарегистрироваться"}
              </Button>
            </Stack>

            <Box
              sx={styles.actionsRow}
            >
              <Typography variant="body2" color="text.secondary">
                Уже есть аккаунт?
              </Typography>
              <Button
                component={Link}
                href="/login"
                size="small"
                variant="text"
              >
                Войти
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;

const styles = {
  root: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    py: { xs: 4, md: 6 },
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
    mt: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: 1,
  },
};