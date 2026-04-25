"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { PasswordField } from "@/app/components/layout/PasswordField";
import { useAuth } from "@/lib/store/useAuthStore";
import { useChangePassword, useUpdateProfile } from "@/lib/services/authServices";
import { arePasswordsMatching } from "@/utils/validators";
import REGIONS_JSON from "@/public/jsons/regions.json";
import { toast } from "react-toastify";

type RegionOption = { id: number; name: { ru: string; kk: string; en: string } };
const regions = REGIONS_JSON as RegionOption[];

const SettingsPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        city: user.city ?? "",
      });
      setAvatarPreview(user.avatar ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (!avatarFile) return;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetFormFromUser = () => {
    if (!user) return;
    setForm({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      city: user.city ?? "",
    });
    setAvatarFile(null);
    setAvatarPreview(user.avatar ?? "");
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();
      payload.append("first_name", form.first_name);
      payload.append("last_name", form.last_name);
      if (form.phone) payload.append("phone", form.phone);
      if (form.city) payload.append("city", form.city);
      if (avatarFile) payload.append("avatar", avatarFile);

      const updated = await updateProfile.mutateAsync(payload);
      setUser(updated);
      setAvatarFile(null);
      setAvatarPreview(updated.avatar ?? "");
      toast.success(t("settings_profile_saved"));
    } catch {
      toast.error(t("settings_profile_error"));
    }
  };

  const handleChangePassword = async () => {
    if (!arePasswordsMatching(passwordForm.new_password, passwordForm.new_password_confirm)) {
      toast.error(t("settings_passwords_mismatch"));
      return;
    }
    try {
      await changePassword.mutateAsync(passwordForm);
      toast.success(t("settings_password_changed"));
      setPasswordForm({ old_password: "", new_password: "", new_password_confirm: "" });
    } catch {
      toast.error(t("settings_password_error"));
    }
  };

  return (
    <AppLayout title={t("settings_title")}>
      <Box sx={styles.page}>
        <Paper elevation={0} variant="outlined" sx={styles.card}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            {t("settings_profile_title")}
          </Typography>
          <Box sx={styles.profileRow}>
            <Box sx={styles.profileColumn}>
              <Avatar src={avatarPreview || undefined} sx={styles.avatar} />
              <Button component="label" variant="outlined" size="small" sx={styles.uploadButton}>
                + {t("upload_avatar")}
                <input hidden type="file" accept="image/*" onChange={handleAvatarChange} />
              </Button>
            </Box>
            <Box sx={styles.profileNameColumn}>
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
            </Box>
          </Box>
          <Stack spacing={2.5}>
            <Box sx={styles.profileRow}>
              <TextField
                label={t("settings_phone")}
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
              />
              <TextField
                select
                label={t("settings_city")}
                name="city"
                fullWidth
                value={form.city}
                onChange={handleChange}
              >
                <MenuItem value="">
                  {t("settings_city_empty")}
                </MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region.id} value={String(region.id)}>
                    {region.name[locale as keyof RegionOption["name"]]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              label={t("settings_email")}
              name="email"
              type="email"
              fullWidth
              value={form.email}
              disabled
              helperText={t("settings_email_helper")}
            />
          </Stack>
        </Paper>

        <Paper elevation={0} variant="outlined" sx={styles.card}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            {t("settings_password_title")}
          </Typography>
          <Stack spacing={2}>
            <Box sx={styles.profileRow}>
              <PasswordField
                label={t("settings_old_password")}
                name="old_password"
                fullWidth
                value={passwordForm.old_password}
                onChange={handlePasswordChange}
              />
              <Box sx={styles.passwordColumn}>
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
              </Box>
            </Box>
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
        </Paper>

        <Paper elevation={0} variant="outlined" sx={styles.card}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            {t("settings_danger_title")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Button variant="outlined" color="error" disabled>
            {t("settings_delete_account")}
          </Button>
        </Paper>

      <Box sx={styles.footer}>
        <Button
          variant="outlined"
          onClick={resetFormFromUser}
        >
          {t("settings_cancel")}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? t("settings_saving") : t("settings_save")}
        </Button>
      </Box>
      </Box>
    </AppLayout>
  );
};

export default SettingsPage;

const styles = {
  page: {
    width: "100%",
    maxWidth: {xs: "100%", md: "700px"},
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
    pb: 1,
  },
  card: {
    p: { xs: 2, sm: 2.5, md: 3 },
    borderRadius: 3,
    borderColor: "divider",
    backgroundColor: "background.paper",
  },
  sectionTitle: { mb: 2.25, fontWeight: 700, fontSize: { xs: "1rem", sm: "1.1rem" } },
  profileRow: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { xs: "stretch", md: "flex-start" },
    gap: 2,
    mb: 2.5,
  },
  profileColumn: { 
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    width: "100%",
  },
  profileNameColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    width: "100%",
  },
  passwordColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    width: "100%",
  },
  avatar: { width: 100, height: 100 },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1.5,
    pt: 0.5,
  },
  uploadButton: {
    px: 1.5,
    py: 0.5,
    fontSize: "0.75rem",
    minHeight: 30,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
};