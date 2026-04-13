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
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { BANNER_PLACEHOLDER_IMAGE } from "@/utils/constants";
import { Footer } from "@/app/components/landing/Footer";
import { ALL_TESTS, getRecommendedTests } from "@/utils/constants";
import { TestCard } from "../components/tests/TestCard";
import { Header } from "../components/layout/Header";
import { useQuizCategories, useQuizTestTypes, useQuizTests } from "@/lib/services/quizServices";
import { AiAnalysisCta } from "../components/layout/AiAnalysisCta";

const MAX_CUSTOM_SELECT = 4;

const WHY_ITEM_KEYS = [
  { titleKey: "test_why_1_title", textKey: "test_why_1_text" },
  { titleKey: "test_why_2_title", textKey: "test_why_2_text" },
  { titleKey: "test_why_3_title", textKey: "test_why_3_text" },
  { titleKey: "test_why_4_title", textKey: "test_why_4_text" },
] as const;

const RESULT_ITEM_KEYS = [
  "test_result_1",
  "test_result_2",
  "test_result_3",
  "test_result_4",
  "test_result_5",
] as const;

const HERO_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  style: { marginBottom: 40 },
};

const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
  ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const TestPage = () => {
  const t = useTranslations();
  const recommended = getRecommendedTests();
  const [showCustom, setShowCustom] = useState(false);
  const recommendedRef = useRef<HTMLDivElement | null>(null);
  const customRef = useRef<HTMLDivElement | null>(null);

  // Подгружаем категории/типы тестов с бэкенда (prefetch)
  useQuizCategories();
  useQuizTestTypes();
  useQuizTests();

  const openCustomSection = () => {
    setShowCustom(true);
    setTimeout(() => scrollToRef(customRef), 120);
  };

  return (
    <>
      <Header onLanding={true} />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="lg">
          <motion.section {...HERO_ANIMATION}>
            <Box sx={styles.heroBox}>
              <Box sx={styles.heroImage}>
                <Image
                  src={BANNER_PLACEHOLDER_IMAGE}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </Box>
              <Box sx={styles.heroContent}>
                <Box sx={styles.heroInner}>
                  <Box sx={styles.heroTextCol}>
                    <Typography component="h1" variant="h1" sx={styles.heroTitle}>
                      {t("test_title")}
                    </Typography>
                    <Typography variant="body1" sx={styles.heroSubtitle}>
                      {t("test_subtitle")}
                    </Typography>
                  </Box>

                  <Box
                    sx={styles.heroMetaCol}
                  >
                    <Chip label={t("test_hero_chip_time")} sx={styles.heroChip} />
                    <Chip label={t("test_hero_chip_accuracy")} sx={styles.heroChip} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.section>

          <Box component="section" sx={styles.section} ref={recommendedRef}>
            <Box sx={styles.recommendedHeader}>
              <Box>
                <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
                  {t("test_recommended_title")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={styles.sectionSubtitle}>
                  {t("test_recommended_subtitle")}
                </Typography>
              </Box>
              <Button
                size="large"
                color="primary"
                sx={styles.headerButton}
                onClick={openCustomSection}
              >
                {t("test_showAllTests")}
              </Button>
            </Box>

            <AiAnalysisCta isRecommended />
            <Grid container spacing={3} sx={styles.grid}>
              {recommended.map((test, index) => (
                <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <TestCard test={test} variant="recommended" index={index} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box component="section" sx={styles.section}>
            <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
              {t("test_why_title")}
            </Typography>
            <Paper elevation={0} sx={styles.infoPaper}>
              <Grid container spacing={2}>
                {WHY_ITEM_KEYS.map((item) => (
                  <Grid key={item.titleKey} size={{ xs: 12, sm: 6 }}>
                    <Box sx={styles.whyItem}>
                      <Typography variant="h3" sx={styles.whyItemTitle}>
                        {t(item.titleKey)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(item.textKey)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={styles.whyConclusion}>
                <Typography variant="body1" sx={styles.whyConclusionText}>
                  {t("test_why_conclusion")}
                </Typography>
              </Box>
            </Paper>
          </Box>

          <Box component="section" sx={styles.section}>
            <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
              {t("test_what_title")}
            </Typography>
            <Paper elevation={0} sx={styles.resultPaper}>
              <Grid container spacing={1.5}>
                {RESULT_ITEM_KEYS.map((key) => (
                  <Grid key={key} size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body1" sx={styles.resultItem}>
                      ✓ {t(key)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>

          <Box component="section" sx={styles.section}>
            <Paper elevation={0} sx={styles.ctaPaper}>
              <Typography component="h2" variant="h2" sx={styles.ctaTitle}>
                {t("test_cta_title")}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToRef(recommendedRef)}
                  sx={styles.ctaPrimaryButton}
                >
                  {t("test_cta_start")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={openCustomSection}
                  sx={styles.ctaSecondaryButton}
                >
                  {t("test_cta_custom")}
                </Button>
              </Stack>
            </Paper>
          </Box>

          {showCustom && (
            <Box component="section" sx={styles.section} ref={customRef}>
              <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
                {t("test_custom_title", { max: MAX_CUSTOM_SELECT })}
              </Typography>
              <AiAnalysisCta isRecommended={false} customDescriptionKey={"test_custom_warning"} />
              <Grid container spacing={3} sx={styles.grid}>
                {ALL_TESTS.map((test, index) => (
                  <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TestCard
                      test={test}
                      variant="custom"
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default TestPage;

const styles = {
    root: { pt: { xs: 7, sm: 8 }, minHeight: "60vh" },
    section: { mb: 6 },
    heroBox: {
      position: "relative",
      borderRadius: 3,
      p: { xs: 3, md: 4 },
      color: "white",
      boxShadow: "0 18px 45px rgba(15,23,42,0.35)",
      overflow: "hidden",
      minHeight: { xs: 220, md: 560 },
      display: "flex",
      alignItems: "flex-end",
    },
    heroImage: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      "& img": { objectFit: "cover" },
    },
    heroContent: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      maxWidth: 980,
      mx: "auto",
      borderRadius: 2.5,
      p: { xs: 2, md: 2.5 },
      backgroundColor: "rgba(15, 23, 42, 0.42)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.16)",
    },
    heroInner: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: { xs: 1.5, md: 3 },
      alignItems: "end",
    },
    heroTextCol: {
      minWidth: 0,
    },
    heroMetaCol: {
      display: "flex",
      mx: "auto",
      flexDirection: "row",
      gap: 1,
    },
    heroTitle: { fontSize: { xs: "1.6rem", md: "2rem" }, mb: 1.5, color: "white" },
    heroSubtitle: { opacity: 0.92, maxWidth: 720, mb: 3, whiteSpace: "pre-line" as const },
    heroChip: {
      bgcolor: "rgba(255,255,255,0.2)",
      color: "white",
      borderRadius: "999px",
      fontWeight: 600,
    },
    recommendedHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: { xs: "flex-start" as const, md: "flex-end" as const },
      gap: 2,
      mb: 0.5,
      flexDirection: { xs: "column" as const, md: "row" as const },
    },
    headerButton: {
      borderRadius: 2,
      px: 3,
      alignSelf: { xs: "flex-start" as const, md: "flex-end" as const },
    },
    sectionTitle: { mb: 1.5, fontSize: "1.4rem", fontWeight: 600 },
    sectionSubtitle: { mb: 2.5, maxWidth: 680 },
    grid: { mt: 1 },
    infoPaper: {
      borderRadius: 3,
      p: { xs: 2.5, md: 3.5 },
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
    },
    whyItem: { p: 1, borderRadius: 2 },
    whyItemTitle: { fontSize: "1.05rem", fontWeight: 600, mb: 0.5 },
    whyConclusion: {
      mt: 2.5,
      pt: 2,
      borderTop: "1px solid",
      borderColor: "divider",
    },
    whyConclusionText: { fontWeight: 600 },
    resultPaper: {
      borderRadius: 3,
      p: { xs: 2.5, md: 3.5 },
      bgcolor: "rgba(127,127,213,0.06)",
      border: "1px solid",
      borderColor: "rgba(127,127,213,0.18)",
    },
    resultItem: { fontWeight: 500 },
    ctaPaper: {
      borderRadius: 3,
      p: { xs: 3, md: 4 },
      textAlign: "center" as const,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      display: "grid",
      gap: 2,
      justifyItems: "center",
    },
    ctaTitle: { fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 700 },
    ctaPrimaryButton: { borderRadius: 2.5, px: 5 },
    ctaSecondaryButton: { borderRadius: 2, px: 4 },
  };