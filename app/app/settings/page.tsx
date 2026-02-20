"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";

const styles = {
  section: {
    mb: 3,
  },
  sectionTitle: {
    mb: 2,
    fontWeight: 600,
  },
};

const SettingsPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: save settings to backend
    console.log("Saving settings...", { form, notifications });
  };

  return (
    <AppLayout title="Settings">
      <Box sx={{ maxWidth: 800 }}>
        <Card sx={styles.section}>
          <CardContent>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Profile Information
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={form.email}
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
          </CardContent>
        </Card>

        <Card sx={styles.section}>
          <CardContent>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Notifications
            </Typography>
            <Stack spacing={1.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, email: e.target.checked }))
                    }
                  />
                }
                label="Email notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, push: e.target.checked }))
                    }
                  />
                }
                label="Push notifications"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="outlined" color="error">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default SettingsPage;
