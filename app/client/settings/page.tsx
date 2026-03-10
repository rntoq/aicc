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
import { AppLayout } from "@/app/components/layout/AppLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { authServices } from "@/lib/services/authServices";

const styles = {
  section: { mb: 3 },
  sectionTitle: { mb: 2, fontWeight: 600 },
};

const SettingsPage = () => {
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
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        city: user.city ?? "",
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
    setSaving(true);
    setMessage(null);
    try {
      const updated = await authServices.updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
        city: form.city || undefined,
      });
      setUser(updated);
      setMessage({ type: "success", text: "Профиль обновлён" });
    } catch {
      setMessage({ type: "error", text: "Не удалось сохранить" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setMessage({ type: "error", text: "Пароли не совпадают" });
      return;
    }
    setSavingPassword(true);
    setMessage(null);
    try {
      await authServices.changePassword(passwordForm);
      setMessage({ type: "success", text: "Пароль изменён" });
      setPasswordForm({ old_password: "", new_password: "", new_password_confirm: "" });
    } catch {
      setMessage({ type: "error", text: "Не удалось сменить пароль" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <Box sx={{maxWidth: "600px"}}>
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
              Profile Information
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label="First name"
                name="first_name"
                fullWidth
                value={form.first_name}
                onChange={handleChange}
              />
              <TextField
                label="Last name"
                name="last_name"
                fullWidth
                value={form.last_name}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={form.email}
                disabled
                helperText="Email нельзя изменить"
              />
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
              />
              <TextField
                label="City"
                name="city"
                fullWidth
                value={form.city}
                onChange={handleChange}
              />
            </Stack>
        </Box>

        <Box sx={styles.section}>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Change password
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Current password"
                name="old_password"
                type="password"
                fullWidth
                value={passwordForm.old_password}
                onChange={handlePasswordChange}
              />
              <TextField
                label="New password"
                name="new_password"
                type="password"
                fullWidth
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
              />
              <TextField
                label="Confirm new password"
                name="new_password_confirm"
                type="password"
                fullWidth
                value={passwordForm.new_password_confirm}
                onChange={handlePasswordChange}
              />
              <Button
                variant="outlined"
                onClick={handleChangePassword}
                disabled={savingPassword || !passwordForm.old_password || !passwordForm.new_password}
              >
                {savingPassword ? "Сохранение…" : "Change password"}
              </Button>
            </Stack>
        </Box>

        <Box>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="outlined" color="error" disabled>
              Delete Account (не реализовано в API)
            </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => user && setForm({
              first_name: user.first_name ?? "",
              last_name: user.last_name ?? "",
              email: user.email ?? "",
              phone: user.phone ?? "",
              city: user.city ?? "",
            })}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение…" : "Save Changes"}
          </Button>
        </Box>
    </AppLayout>
  );
};

export default SettingsPage;
