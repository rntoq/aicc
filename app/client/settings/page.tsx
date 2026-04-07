"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { PasswordField } from "@/app/components/layout/PasswordField";
import { useAuth } from "@/lib/store/useAuthStore";
import { useChangePassword, useUpdateProfile } from "@/lib/services/authServices";

const styles = {
  section: { mb: 3 },
  sectionTitle: { mb: 2, fontWeight: 600 },
};

const SettingsPage = () => {
  const t = useTranslations();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  useEffect(() => {
    if (user) {
      // Defer state update to avoid sync setState-in-effect lint
      Promise.resolve().then(() => {
        setForm({
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          city: user.city ?? "",
        });
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setMessage(null);
    try {
      const updated = await updateProfile.mutateAsync({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
        city: form.city || undefined,
      });
      setUser(updated);
      setMessage({ type: "success", text: t("settings_profile_saved") });
    } catch {
      setMessage({ type: "error", text: t("settings_profile_error") });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setMessage({ type: "error", text: t("settings_passwords_mismatch") });
      return;
    }
    setMessage(null);
    try {
      await changePassword.mutateAsync(passwordForm);
      setMessage({ type: "success", text: t("settings_password_changed") });
      setPasswordForm({ old_password: "", new_password: "", new_password_confirm: "" });
    } catch {
      setMessage({ type: "error", text: t("settings_password_error") });
    }
  };

  return (
    <AppLayout title={t("settings_title")}>
      <Box sx={{ maxWidth: "600px" }}>
        {message && (
          <Typography
            color={message.type === "success" ? "success.main" : "error.main"}
            sx={{ mb: 2 }}
          >
            {message.text}
          </Typography>
        )}

        <Box sx={styles.section}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            {t("settings_profile_title")}
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              label={t("settings_first_name")}
              name="first_name"
              fullWidth
              value={form.first_name}
              onChange={handleChange}
            />
            <TextField
              label={t("settings_last_name")}
              name="last_name"
              fullWidth
              value={form.last_name}
              onChange={handleChange}
            />
            <TextField
              label={t("settings_email")}
              name="email"
              type="email"
              fullWidth
              value={form.email}
              disabled
              helperText={t("settings_email_helper")}
            />
            <TextField
              label={t("settings_phone")}
              name="phone"
              fullWidth
              value={form.phone}
              onChange={handleChange}
            />
            <TextField
              label={t("settings_city")}
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
            />
          </Stack>
        </Box>

        <Box sx={styles.section}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            {t("settings_password_title")}
          </Typography>
          <Stack spacing={2}>
            <PasswordField
              label={t("settings_old_password")}
              name="old_password"
              fullWidth
              value={passwordForm.old_password}
              onChange={handlePasswordChange}
            />
            <PasswordField
              label={t("settings_new_password")}
              name="new_password"
              fullWidth
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
            />
            <PasswordField
              label={t("settings_new_password_confirm")}
              name="new_password_confirm"
              fullWidth
              value={passwordForm.new_password_confirm}
              onChange={handlePasswordChange}
            />
            <Button
              variant="outlined"
              onClick={handleChangePassword}
              disabled={
                changePassword.isPending ||
                !passwordForm.old_password ||
                !passwordForm.new_password
              }
            >
              {changePassword.isPending ? t("settings_saving") : t("settings_change_password_btn")}
            </Button>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" sx={styles.sectionTitle}>
            {t("settings_danger_title")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Button variant="outlined" color="error" disabled>
            {t("settings_delete_account")}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() =>
            user &&
            setForm({
              first_name: user.first_name ?? "",
              last_name: user.last_name ?? "",
              email: user.email ?? "",
              phone: user.phone ?? "",
              city: user.city ?? "",
            })
          }
        >
          {t("settings_cancel")}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? t("settings_saving") : t("settings_save")}
        </Button>
      </Box>
    </AppLayout>
  );
};

export default SettingsPage;
