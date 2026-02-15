"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { ALL_TESTS, getRecommendedTests } from "../constants";
import { TestCard } from "./TestCard";
import { TestResultModal } from "./TestResultModal";

const MAX_CUSTOM_SELECT = 4;

export function TestPage() {
  const t = useTranslations();
  const recommended = getRecommendedTests();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCustom, setShowCustom] = useState(false);
  const recommendedRef = useRef<HTMLDivElement | null>(null);
  const customRef = useRef<HTMLDivElement | null>(null);

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
        {/* Баннер */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <Box
            sx={{
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              background: "linear-gradient(135deg, #1E3A8A, #6366F1)",
              color: "white",
              boxShadow: "0 18px 45px rgba(15,23,42,0.35)",
            }}
          >
            <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, mb: 1 }}>
              {t("test_title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.9, maxWidth: 720 }}
              whiteSpace="pre-line"
            >
              {t("test_subtitle")}
            </Typography>
          </Box>
        </motion.section>

        {/* Наш набор: 5 тестов */}
        <Box
          component="section"
          sx={styles.section}
          ref={recommendedRef}
        >
          <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
            Наш рекомендуемый набор тестов
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

        {/* Почему именно эти 5 тестов */}
        <Box component="section" sx={styles.section}>
          <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
            Почему именно эти 5 тестов
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              p: { xs: 2.5, md: 3 },
              bgcolor: "background.paper",
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              maxWidth: 900,
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
              Этот набор покрывает интересы (Holland), стиль поведения (DiSC), визуальные предпочтения
              (Photo Quiz), карьерные ценности и базовые черты личности (Big Five). Вместе они дают
              цельный профиль, с которым AI‑анализ может построить точные рекомендации.
            </Typography>
          </Box>
        </Box>

        {/* Кнопки действий */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 6,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 2, px: 4 }}
            onClick={() => {
              recommendedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Начать тесты
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 4 }}
            onClick={() => {
              setShowCustom(true);
              setTimeout(
                () => customRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                100
              );
            }}
          >
            Выбрать свой набор
          </Button>
        </Box>

        {/* Свой набор — показываем только после клика */}
        {showCustom && (
          <Box
            component="section"
            sx={styles.section}
            ref={customRef}
          >
            <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
              Выбрать свой набор (максимум {MAX_CUSTOM_SELECT} теста)
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
        )}
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
