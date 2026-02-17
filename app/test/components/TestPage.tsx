"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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

  const openCustomSection = () => {
    setShowCustom(true);
    setTimeout(
      () => customRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120
    );
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
        {/* 1) HERO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
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
            <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, mb: 1.5 }}>
              {t("test_title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.92, maxWidth: 720, mb: 3 }}
              whiteSpace="pre-line"
            >
              {t("test_subtitle")}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
              <Stack direction="row" spacing={1}>
                <Chip label="20 минут" sx={styles.heroChip} />
                <Chip label="Точность до 90%" sx={styles.heroChip} />
              </Stack>
            </Stack>
          </Box>
        </motion.section>

        {/* 2) Рекомендуемый набор */}
        <Box
          component="section"
          sx={styles.section}
          ref={recommendedRef}
        >
          <Box sx={styles.recommendedHeader}>
            <Box>
              <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
                Рекомендуемый набор
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={styles.sectionSubtitle}>
                5 тестов для максимально точного результата
              </Typography>
            </Box>
            <Button
                size="large"
                color="primary"
                sx={{ borderRadius: 2, px: 3, alignSelf: { xs: "flex-start", md: "flex-end" } }}
                onClick={openCustomSection}
              >
                Посмотреть все тесты
            </Button>
          </Box>
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

        {/* 3) Почему именно этот набор */}
        <Box component="section" sx={styles.section}>
          <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
            Почему именно этот набор?
          </Typography>
          <Paper elevation={0} sx={styles.infoPaper}>
            <Grid container spacing={2}>
              {WHY_ITEMS.map((item) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                  <Box sx={styles.whyItem}>
                    <Typography variant="h3" sx={styles.whyItemTitle}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={styles.whyConclusion}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Мы анализируем тебя с 4 сторон → точная рекомендация профессии
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* 4) Что ты получишь */}
        <Box component="section" sx={styles.section}>
          <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
            Что ты получишь
          </Typography>
          <Paper elevation={0} sx={styles.resultPaper}>
            <Grid container spacing={1.5}>
              {RESULT_ITEMS.map((item) => (
                <Grid key={item} size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body1" sx={styles.resultItem}>
                    ✓ {item}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* 5) CTA усиление */}
        <Box component="section" sx={styles.section}>
          <Paper elevation={0} sx={styles.ctaPaper}>
            <Typography component="h2" variant="h2" sx={styles.ctaTitle}>
              Готов узнать свою профессию?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => recommendedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                sx={{ borderRadius: 2.5, px: 5 }}
              >
                Начать тесты
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ borderRadius: 2, px: 4, mt: 2 }}
                onClick={openCustomSection}
              >
                Выбрать самому
              </Button>
            </Stack>
          </Paper>
        </Box>

        {/* 7) Custom режим */}
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
                    disabled={selectedIds.size >= MAX_CUSTOM_SELECT && !selectedIds.has(test.id)}
                    index={index}
                  />
                </Grid>
              ))}
            </Grid>
            {/* <motion.div
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
            </motion.div> */}
            <Typography variant="body2" color="text.secondary" sx={styles.warningText}>
              ⚠ Чем больше тестов, тем точнее результат.
            </Typography>
          </Box>
        )}
      </Container>

      <TestResultModal />
    </Box>
  );
}

const WHY_ITEMS = [
  { title: "🧠 Интересы", text: "Что тебе нравится и к чему есть естественная склонность." },
  { title: "👤 Личность", text: "Как ты думаешь, принимаешь решения и взаимодействуешь с людьми." },
  { title: "💡 Ценности", text: "Что для тебя важно в работе: деньги, смысл, стабильность или рост." },
  { title: "🛠 Навыки", text: "Что у тебя уже получается и что можно усилить для карьеры." },
];

const RESULT_ITEMS = [
  "Топ-5 профессий под твой профиль",
  "Процент совпадения по каждому направлению",
  "Сильные стороны и зоны роста",
  "Персональный план развития",
  "Где учиться и какие шаги сделать дальше",
];

const styles = {
  root: {
    py: { xs: 4, md: 7 },
    minHeight: "60vh",
  },
  section: {
    mb: 6,
  },
  recommendedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", md: "flex-end" },
    gap: 2,
    mb: 0.5,
    flexDirection: { xs: "column", md: "row" },
  },
  sectionTitle: {
    mb: 1.5,
    fontSize: "1.4rem",
    fontWeight: 600,
  },
  sectionSubtitle: {
    mb: 2.5,
    maxWidth: 680,
  },
  grid: {
    mt: 1,
  },
  heroChip: {
    bgcolor: "rgba(255,255,255,0.2)",
    color: "white",
    borderRadius: "999px",
    fontWeight: 600,
  },
  infoPaper: {
    borderRadius: 3,
    p: { xs: 2.5, md: 3.5 },
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
  },
  whyItem: {
    p: 1,
    borderRadius: 2,
  },
  whyItemTitle: {
    fontSize: "1.05rem",
    fontWeight: 600,
    mb: 0.5,
  },
  whyConclusion: {
    mt: 2.5,
    pt: 2,
    borderTop: "1px solid",
    borderColor: "divider",
  },
  resultPaper: {
    borderRadius: 3,
    p: { xs: 2.5, md: 3.5 },
    bgcolor: "rgba(127,127,213,0.06)",
    border: "1px solid",
    borderColor: "rgba(127,127,213,0.18)",
  },
  resultItem: {
    fontWeight: 500,
  },
  ctaPaper: {
    borderRadius: 3,
    p: { xs: 3, md: 4 },
    textAlign: "center",
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
    display: "grid",
    gap: 2,
    justifyItems: "center",
  },
  ctaTitle: {
    fontSize: { xs: "1.35rem", md: "1.6rem" },
    fontWeight: 700,
  },
  warningText: {
    mt: 2,
    textAlign: "center",
  },
};
