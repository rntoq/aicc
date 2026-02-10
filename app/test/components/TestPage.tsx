"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import { ALL_TESTS, getRecommendedTests } from "../constants";
import { TestCard } from "./TestCard";
import { TestResultModal } from "./TestResultModal";

const MAX_CUSTOM_SELECT = 4;

export function TestPage() {
  const t = useTranslations();
  const recommended = getRecommendedTests();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        if (next.size >= MAX_CUSTOM_SELECT) {
          toast.warn(t("test_toastMaxTests", { max: MAX_CUSTOM_SELECT }));
          return prev;
        }
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleStartSelected = () => {
    if (selectedIds.size === 0) {
      toast.info(t("test_toastSelectOne"));
      return;
    }
    // In real app: navigate to first test or combined flow.
    toast.success(`Запуск ${selectedIds.size} тестов (демо)`);
  };

  return (
    <Box component="main" sx={styles.root}>
      <Container maxWidth="lg">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <Typography component="h1" variant="h1" sx={styles.title}>
            {t("test_title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={styles.subtitle} whiteSpace="pre-line">
            {t("test_subtitle")}
          </Typography>
        </motion.header>

        {/* Вариант 1 — Рекомендуемый набор */}
        <Box component="section" sx={styles.section}>
          <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
            {t("test_variant1Title")}
          </Typography>
          <Grid container spacing={3} sx={styles.grid}>
            {recommended.map((test, index) => (
              <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <TestCard
                  test={test}
                  variant="recommended"
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Вариант 2 — Свой набор */}
        <Box component="section" sx={styles.section}>
          <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
            {t("test_variant2Title", { max: MAX_CUSTOM_SELECT })}
          </Typography>
          <Grid container spacing={3} sx={styles.grid}>
            {ALL_TESTS.map((test, index) => (
              <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <TestCard
                  test={test}
                  variant="custom"
                  selected={selectedIds.has(test.id)}
                  onSelect={(checked) => toggleSelected(test.id, checked)}
                  disabled={selectedIds.size >= MAX_CUSTOM_SELECT && !selectedIds.has(test.id)}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: 24, textAlign: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PlaylistPlayOutlinedIcon />}
              onClick={handleStartSelected}
              disabled={selectedIds.size === 0}
              sx={{ borderRadius: 2 }}
            >
              {t("test_startSelected")} {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
            </Button>
          </motion.div>
        </Box>
      </Container>

      <TestResultModal />
    </Box>
  );
}

const styles = {
  root: {
    py: { xs: 4, md: 6 },
    minHeight: "60vh",
  },
  title: {
    mb: 2,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "1rem",
    lineHeight: 1.6,
    maxWidth: 720,
  },
  section: {
    mb: 6,
  },
  sectionTitle: {
    mb: 3,
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  grid: {
    mt: 1,
  },
};
