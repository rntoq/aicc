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
import { useAuth } from "@/lib/hooks/useAuth";
import { Header } from "../components/layout/Header";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/constants";

const RegisterPage = () => {
  const t = useTranslations();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    age: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!form.email || !form.password || !form.passwordConfirm) {
      setLocalError("Заполните e‑mail и пароль.");
      return;
    }
    if (form.password.length < 8) {
      setLocalError("Пароль должен содержать не менее 8 символов.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setLocalError("Пароли не совпадают.");
      return;
    }

    try {
      await register({
        email: form.email,
        password: form.password,
        password_confirm: form.passwordConfirm,
        first_name: form.firstName,
        last_name: form.lastName,
      });
      router.push("/client");
    } catch {
      // ошибка уже есть в authStore.error
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
                <Box
                  sx={styles.row}
                >
                  <TextField
                    label="Имя"
                    name="firstName"
                    required
                    fullWidth
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                  <TextField
                    label="Фамилия"
                    name="lastName"
                    required
                    fullWidth
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                </Box>
                <Box
                  sx={styles.row}
                >
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
                    label="Возраст"
                    name="age"
                    required
                    fullWidth
                    value={form.age}
                    onChange={handleChange}
                    autoComplete="address-level1"
                  />
                </Box>
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
                <TextField
                  label="Подтверждение пароля"
                  type="password"
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
                  {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
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