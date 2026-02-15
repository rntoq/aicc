"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePhotoQuizStore } from "@/lib/store/photoQuizStore";
import { PHOTO_QUESTIONS, PHOTO_CATEGORIES } from "../questions";
import { calculatePhotoQuizResult } from "../utils/scoring";
import type { PhotoQuizResult } from "../utils/scoring";
const CATEGORY_KEYS: Record<"R" | "I" | "A" | "S" | "E" | "C", string> = {
  R: "holland_category_R",
  I: "holland_category_I",
  A: "holland_category_A",
  S: "holland_category_S",
  E: "holland_category_E",
  C: "holland_category_C",
};

const DESC_KEYS: Record<"R" | "I" | "A" | "S" | "E" | "C", string> = {
  R: "holland_desc_R",
  I: "holland_desc_I",
  A: "holland_desc_A",
  S: "holland_desc_S",
  E: "holland_desc_E",
  C: "holland_desc_C",
};

export default function PhotoCareerResultPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { answers, reset } = usePhotoQuizStore();
  const [result, setResult] = useState<PhotoQuizResult | null>(null);

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      router.push("/test/photo-career");
      return;
    }

    const calculated = calculatePhotoQuizResult(answers, PHOTO_QUESTIONS);
    setResult(calculated);
  }, [answers, router]);

  if (!result) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography>Загрузка результатов...</Typography>
      </Box>
    );
  }

  const categories: Array<keyof typeof result.categoryPercentages> = [
    "BUILDING",
    "THINKING",
    "CREATING",
    "HELPING",
    "PERSUADING",
    "ORGANIZING",
  ];
  const sortedCategories = [...categories].sort(
    (a, b) => result.categoryPercentages[b] - result.categoryPercentages[a]
  );

  return (
    <Box component="main" sx={styles.root}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.header}>
            <Typography component="h1" variant="h1" sx={styles.title}>
              {t("photo_resultTitle")}
            </Typography>
            <Box sx={styles.codeBadge}>
              <Typography variant="h2" sx={styles.codeText}>
                {result.hollandCode}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={styles.subtitle}>
              {t(CATEGORY_KEYS[result.primary])} +{" "}
              {t(CATEGORY_KEYS[result.secondary])} +{" "}
              {t(CATEGORY_KEYS[result.tertiary])}
            </Typography>
          </Box>

          {/* Category scores visualization */}
          <Box sx={styles.scoresSection}>
            <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
              {t("photo_scoresTitle")}
            </Typography>
            <Box sx={styles.scoresGrid}>
              {sortedCategories.map((category, index) => {
                const percentage = result.categoryPercentages[category];
                const count = result.categoryCounts[category];
                const hollandCode = PHOTO_CATEGORIES[category].code;
                const isTop3 = index < 3;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card sx={[styles.scoreCard, isTop3 && styles.scoreCardTop3]}>
                      <CardContent>
                        <Box sx={styles.cardHeader}>
                          <Box
                            sx={[
                              styles.categoryColorBadge,
                              { bgcolor: PHOTO_CATEGORIES[category].color },
                            ]}
                          />
                          <Typography variant="h3" sx={styles.categoryName}>
                            {t(`photo_category_${category}`)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                          {t(DESC_KEYS[hollandCode])}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={[
                            styles.progressBar,
                            { "& .MuiLinearProgress-bar": { bgcolor: PHOTO_CATEGORIES[category].color } },
                          ]}
                        />
                        <Box sx={styles.scoreRow}>
                          <Typography variant="h3" sx={styles.scoreValue}>
                            {percentage}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {count} из 30 выборов
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </Box>
          </Box>

          {/* Interpretation */}
          <Box sx={styles.interpretationSection}>
            <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
              {t("photo_interpretationTitle")}
            </Typography>
            <Card sx={styles.interpretationCard}>
              <CardContent>
                <Typography variant="h3" sx={styles.interpretationTitle}>
                  Ваш код: {result.hollandCode}
                </Typography>
                <Typography variant="body1" sx={styles.interpretationText}>
                  {t("photo_interpretationText", {
                    category1: t(`photo_category_${sortedCategories[0]}`).toLowerCase(),
                    percent1: result.categoryPercentages[sortedCategories[0]],
                    category2: t(`photo_category_${sortedCategories[1]}`).toLowerCase(),
                    percent2: result.categoryPercentages[sortedCategories[1]],
                    category3: t(`photo_category_${sortedCategories[2]}`).toLowerCase(),
                    percent3: result.categoryPercentages[sortedCategories[2]],
                    code: result.hollandCode,
                    desc1: t(DESC_KEYS[result.primary]).toLowerCase(),
                    desc2: t(DESC_KEYS[result.secondary]).toLowerCase(),
                    desc3: t(DESC_KEYS[result.tertiary]).toLowerCase(),
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Actions */}
          <Box sx={styles.actions}>
            <Button
              variant="outlined"
              onClick={() => router.push("/test")}
              sx={styles.actionButton}
            >
              {t("holland_backToTests")}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                reset();
                router.push("/test/photo-career");
              }}
              sx={styles.actionButton}
            >
              {t("holland_retake")}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

const styles = {
  root: {
    py: { xs: 4, md: 6 },
    minHeight: "80vh",
  },
  header: {
    textAlign: "center",
    mb: 6,
  },
  title: {
    mb: 2,
    fontSize: "2rem",
    fontWeight: 700,
  },
  codeBadge: {
    display: "inline-block",
    bgcolor: "primary.main",
    color: "white",
    px: 4,
    py: 2,
    borderRadius: 3,
    mb: 2,
    boxShadow: "0 8px 24px rgba(30, 58, 138, 0.3)",
  },
  codeText: {
    fontSize: "3rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
  },
  subtitle: {
    fontSize: "1.125rem",
  },
  scoresSection: {
    mb: 6,
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: 600,
    mb: 3,
  },
  scoresGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
    gap: 2,
  },
  scoreCard: {
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  scoreCardTop3: {
    borderLeft: "4px solid",
    borderColor: "primary.main",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.5,
  },
  categoryColorBadge: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    flexShrink: 0,
  },
  categoryName: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  progressBar: {
    height: 8,
    borderRadius: 1,
    bgcolor: "grey.200",
    mb: 1,
    "& .MuiLinearProgress-bar": {
      borderRadius: 1,
    },
  },
  scoreRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "primary.main",
  },
  interpretationSection: {
    mb: 6,
  },
  interpretationCard: {
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  interpretationTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    mb: 2,
  },
  interpretationText: {
    lineHeight: 1.7,
    color: "text.secondary",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    flexWrap: "wrap",
  },
  actionButton: {
    borderRadius: 2,
    px: 3,
  },
};
