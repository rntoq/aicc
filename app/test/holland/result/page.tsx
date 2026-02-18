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
import { useHollandStore } from "@/lib/store/hollandStore";
import { HOLLAND_QUESTIONS } from "../questions";
import { calculateHollandResult } from "../utils/scoring";
import type { HollandResult } from "../utils/scoring";

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

const HollandResultPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { answers, reset } = useHollandStore();
  const [result, setResult] = useState<HollandResult | null>(null);

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      // No answers - redirect to test
      router.push("/test/holland");
      return;
    }

    const calculated = calculateHollandResult(answers, HOLLAND_QUESTIONS);
    setResult(calculated);
  }, [answers, router]);

  if (!result) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography>Загрузка результатов...</Typography>
      </Box>
    );
  }

  const categories: Array<keyof typeof result.normalizedScores> = ["R", "I", "A", "S", "E", "C"];
  const sortedCategories = [...categories].sort(
    (a, b) => result.normalizedScores[b] - result.normalizedScores[a]
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
              {t("holland_resultTitle")}
            </Typography>
            <Box sx={styles.codeBadge}>
              <Typography variant="h2" sx={styles.codeText}>
                {result.hollandCode.code}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={styles.subtitle}>
              {t(CATEGORY_KEYS[result.hollandCode.primary])} +{" "}
              {t(CATEGORY_KEYS[result.hollandCode.secondary])} +{" "}
              {t(CATEGORY_KEYS[result.hollandCode.tertiary])}
            </Typography>
          </Box>

          {/* Scores visualization */}
          <Box sx={styles.scoresSection}>
            <Typography component="h2" variant="h2" sx={styles.sectionTitle}>
              {t("holland_scoresTitle")}
            </Typography>
            <Box sx={styles.scoresGrid}>
              {sortedCategories.map((category, index) => {
                const score = result.normalizedScores[category];
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
                        <Typography variant="h3" sx={styles.categoryName}>
                          {category} - {t(CATEGORY_KEYS[category])}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                          {t(DESC_KEYS[category])}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={score}
                          sx={styles.progressBar}
                        />
                        <Typography variant="h3" sx={styles.scoreValue}>
                          {score}%
                        </Typography>
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
              {t("holland_interpretationTitle")}
            </Typography>
            <Card sx={styles.interpretationCard}>
              <CardContent>
                <Typography variant="h3" sx={styles.interpretationTitle}>
                  {result.hollandCode.code} - {getCodeInterpretation(result.hollandCode.code)}
                </Typography>
                <Typography variant="body1" sx={styles.interpretationText}>
                  Ваш профиль сочетает {t(CATEGORY_KEYS[result.hollandCode.primary]).toLowerCase()},
                  {t(CATEGORY_KEYS[result.hollandCode.secondary]).toLowerCase()} и{" "}
                  {t(CATEGORY_KEYS[result.hollandCode.tertiary]).toLowerCase()} типы. Это означает, что вы
                  предпочитаете работу, которая включает в себя{" "}
                  {t(DESC_KEYS[result.hollandCode.primary]).toLowerCase()}, а также
                  {t(DESC_KEYS[result.hollandCode.secondary]).toLowerCase()} и{" "}
                  {t(DESC_KEYS[result.hollandCode.tertiary]).toLowerCase()}.
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
                router.push("/test/holland");
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
};

const getCodeInterpretation = (code: string): string => {
  const interpretations: Record<string, string> = {
    RIA: "Техно-Креатор",
    RIC: "Системный Техник",
    RIS: "Практичный Помощник",
    IAS: "Креативный Исследователь",
    IAC: "Аналитический Креатор",
    SAE: "Социальный Лидер",
    SEC: "Организованный Помощник",
    EAS: "Харизматичный Креатор",
    ECS: "Организованный Лидер",
    CAI: "Организованный Аналитик",
  };
  return interpretations[code] || "Уникальная комбинация";
};

export default HollandResultPage;

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
  categoryName: {
    fontSize: "1rem",
    fontWeight: 600,
    mb: 0.5,
  },
  progressBar: {
    height: 8,
    borderRadius: 1,
    bgcolor: "grey.200",
    mb: 1,
    "& .MuiLinearProgress-bar": {
      borderRadius: 1,
      background: "linear-gradient(90deg, #1E3A8A, #10B981)",
    },
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
