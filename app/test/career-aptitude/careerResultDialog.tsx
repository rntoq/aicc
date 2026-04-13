"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

export type CareerInterestScores = {
  R?: number;
  I?: number;
  A?: number;
  S?: number;
  E?: number;
  C?: number;
};

export type CareerPersonalityScores = {
  O?: number;
  C?: number;
  E?: number;
  A?: number;
  N?: number;
};

export type CareerAptitudeResult = {
  id?: number;
  test_type?: string;
  test_title?: string;
  primary_type?: string;
  secondary_type?: string;
  summary?: string | null;
  detailed_report?: string | null;
  holland_code?: string;
  scores?: CareerInterestScores & CareerPersonalityScores;
  interest_scores?: CareerInterestScores;
  personality_scores?: CareerPersonalityScores;
  created_at?: string;
};

export type CareerResultPanelProps = {
  result: CareerAptitudeResult | null;
  loading?: boolean;
};

const INTEREST_LABELS: Record<string, { ru: string; kk: string; en: string; icon: string }> = {
  R: { ru: "Строительство", kk: "Құрылыс", en: "Building", icon: "🏗️" },
  I: { ru: "Аналитика", kk: "Аналитика", en: "Thinking", icon: "🔬" },
  A: { ru: "Творчество", kk: "Шығармашылық", en: "Creating", icon: "🎨" },
  S: { ru: "Помощь", kk: "Көмек", en: "Helping", icon: "🤝" },
  E: { ru: "Предпринимательство", kk: "Кәсіпкерлік", en: "Persuading", icon: "💼" },
  C: { ru: "Организация", kk: "Ұйымдастыру", en: "Organizing", icon: "📊" },
};

const PERSONALITY_LABELS: Record<string, { ru: string; kk: string; en: string }> = {
  O: { ru: "Открытость", kk: "Ашықтық", en: "Openness" },
  C: { ru: "Добросовестность", kk: "Жауапкершілік", en: "Conscientiousness" },
  E: { ru: "Экстраверсия", kk: "Экстраверсия", en: "Extraversion" },
  A: { ru: "Доброжелательность", kk: "Жақсылық", en: "Agreeableness" },
  N: { ru: "Нейротизм", kk: "Нейротизм", en: "Neuroticism" },
};

function getScoreColor(score: number): "error" | "warning" | "success" {
  if (score >= 65) return "success";
  if (score >= 40) return "warning";
  return "error";
}

function getInterestLevel(score: number, locale: string): string {
  const levels: Record<string, string[]> = {
    ru: ["Очень низкий", "Низкий", "Умеренный", "Высокий", "Очень высокий"],
    kk: ["Өте төмен", "Төмен", "Орташа", "Жоғары", "Өте жоғары"],
    en: ["Very Low", "Low", "Moderate", "High", "Very High"],
  };
  const lvl = levels[locale] ?? levels.ru;
  if (score >= 75) return lvl[4];
  if (score >= 60) return lvl[3];
  if (score >= 40) return lvl[2];
  if (score >= 25) return lvl[1];
  return lvl[0];
}

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

const styles = {
  section: { mb: 1 },
  sectionTitle: { fontWeight: 700, mb: 1.5, fontSize: "1rem" },
  scoresList: { display: "flex", flexDirection: "column" as const, gap: 1.2 },
  scoreRow: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "180px 1fr auto" },
    alignItems: "center",
    gap: 1.5,
  },
  scoreLabelBox: { display: "flex", alignItems: "center", gap: 0.5 },
  scoreLabel: { fontSize: "0.875rem", fontWeight: 500, whiteSpace: "nowrap" as const },
  scoreBarBox: { display: "flex", alignItems: "center", gap: 1 },
  progressBar: { flex: 1, height: 8, borderRadius: 4, bgcolor: "grey.200" },
  scoreValue: { fontSize: "0.85rem", fontWeight: 600, minWidth: 36, textAlign: "right" as const },
  scoreLevel: { fontSize: "0.75rem", minWidth: 80, textAlign: "right" as const },
};

export function CareerResultPanel({ result, loading = false }: CareerResultPanelProps) {
  const locale = useLocale() as "ru" | "kk" | "en";
  const t = useTranslations();

  if (loading) {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!result) {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Typography variant="body2" color="text.secondary">
          {t("dialog_career_empty")}
        </Typography>
      </Paper>
    );
  }

  const interestScores: Record<string, number> = {};
  for (const key of ["R", "I", "A", "S", "E", "C"]) {
    const val =
      result.interest_scores?.[key as keyof CareerInterestScores] ??
      result.scores?.[key as keyof CareerInterestScores];
    if (val != null) interestScores[key] = val as number;
  }

  const personalityScores: Record<string, number> = {};
  for (const key of ["O", "C", "E", "A", "N"]) {
    const val =
      result.personality_scores?.[key as keyof CareerPersonalityScores] ??
      result.scores?.[key as keyof CareerPersonalityScores];
    if (val != null) personalityScores[key] = val as number;
  }

  const hasInterestScores = Object.keys(interestScores).length > 0;
  const hasPersonalityScores = Object.keys(personalityScores).length > 0;
  const sortedInterests = Object.entries(interestScores).sort(([, a], [, b]) => b - a);
  const hollandCode =
    result.holland_code ??
    result.primary_type ??
    sortedInterests
      .slice(0, 3)
      .map(([k]) => k)
      .join("");

  const summaryLines = result.summary
    ? result.summary
        .split(/\n|(?<=[.!?])\s+(?=[А-ЯA-Z])/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {result.test_title ?? "Career Aptitude Test"}
        </Typography>
        {hollandCode ? (
          <Chip label={hollandCode} color="primary" size="small" sx={{ mt: 0.5, fontWeight: 700, letterSpacing: 2 }} />
        ) : null}
      </Box>

      {hasInterestScores && (
        <Box sx={styles.section}>
          <Typography variant="subtitle1" sx={styles.sectionTitle}>
            {t("career_interest_profile")}
          </Typography>
          <Box sx={styles.scoresList}>
            {sortedInterests.map(([key, score], idx) => {
              const info = INTEREST_LABELS[key];
              const label = info?.[locale] ?? info?.ru ?? key;
              const icon = info?.icon ?? "";
              const isTop = idx < 3;
              return (
                <Box key={key} sx={styles.scoreRow}>
                  <Box sx={styles.scoreLabelBox}>
                    <Typography sx={styles.scoreLabel}>
                      {icon} {label}
                    </Typography>
                    {isTop ? (
                      <Chip label="TOP" size="small" color="primary" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }} />
                    ) : null}
                  </Box>
                  <Box sx={styles.scoreBarBox}>
                    <LinearProgress variant="determinate" value={score} color={getScoreColor(score)} sx={styles.progressBar} />
                    <Typography sx={styles.scoreValue}>{score}%</Typography>
                  </Box>
                  <Typography sx={styles.scoreLevel} color="text.secondary">
                    {getInterestLevel(score, locale)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {hasPersonalityScores && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={styles.section}>
            <Typography variant="subtitle1" sx={styles.sectionTitle}>
              {t("career_personality_traits")}
            </Typography>
            <Box sx={styles.scoresList}>
              {Object.entries(personalityScores).map(([key, score]) => {
                const info = PERSONALITY_LABELS[key];
                const label = info?.[locale] ?? info?.ru ?? key;
                return (
                  <Box key={key} sx={styles.scoreRow}>
                    <Box sx={styles.scoreLabelBox}>
                      <Typography sx={styles.scoreLabel}>
                        {key} — {label}
                      </Typography>
                    </Box>
                    <Box sx={styles.scoreBarBox}>
                      <LinearProgress variant="determinate" value={score} color={getScoreColor(score)} sx={styles.progressBar} />
                      <Typography sx={styles.scoreValue}>{score}%</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </>
      )}

      {summaryLines.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={styles.section}>
            <Typography variant="subtitle1" sx={styles.sectionTitle}>
              {t("common_summary")}
            </Typography>
            {summaryLines.map((line, i) => (
              <Typography key={i} variant="body2" sx={{ mb: 0.5, lineHeight: 1.7 }}>
                {line}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}
