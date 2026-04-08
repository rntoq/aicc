"use client";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  // From backend finish response
  scores?: CareerInterestScores & CareerPersonalityScores;
  // From local scoring fallback
  interest_scores?: CareerInterestScores;
  personality_scores?: CareerPersonalityScores;
  created_at?: string;
};

export type CareerResultDialogProps = {
  open: boolean;
  onClose: () => void;
  result: CareerAptitudeResult | null;
  loading?: boolean;
};

// ─── Labels ───────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export const CareerResultDialog = ({
  open,
  onClose,
  result,
  loading = false,
}: CareerResultDialogProps) => {
  const locale = useLocale() as "ru" | "kk" | "en";
  const t = useTranslations();

  // Loading or no result yet
  if (loading || !result) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Career Aptitude Test</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("dialog_career_empty")}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("close")}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Resolve interest scores (from backend or local scoring)
  const interestScores: Record<string, number> = {};
  for (const key of ["R", "I", "A", "S", "E", "C"]) {
    const val =
      result.interest_scores?.[key as keyof CareerInterestScores] ??
      result.scores?.[key as keyof CareerInterestScores];
    if (val != null) interestScores[key] = val as number;
  }

  // Resolve personality scores
  const personalityScores: Record<string, number> = {};
  for (const key of ["O", "C", "E", "A", "N"]) {
    const val =
      result.personality_scores?.[key as keyof CareerPersonalityScores] ??
      result.scores?.[key as keyof CareerPersonalityScores];
    if (val != null) personalityScores[key] = val as number;
  }

  const hasInterestScores = Object.keys(interestScores).length > 0;
  const hasPersonalityScores = Object.keys(personalityScores).length > 0;

  // Sort interest areas by score
  const sortedInterests = Object.entries(interestScores).sort(([, a], [, b]) => b - a);
  const hollandCode =
    result.holland_code ??
    result.primary_type ??
    sortedInterests
      .slice(0, 3)
      .map(([k]) => k)
      .join("");

  // Parse summary lines
  const summaryLines = result.summary
    ? result.summary
        .split(/\n|(?<=[.!?])\s+(?=[А-ЯA-Z])/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={styles.dialogTitle}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {result.test_title ?? "Career Aptitude Test"}
          </Typography>
          {hollandCode && (
            <Chip
              label={hollandCode}
              color="primary"
              size="small"
              sx={{ mt: 0.5, fontWeight: 700, letterSpacing: 2 }}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* ─── Interest Scores ─── */}
        {hasInterestScores && (
          <Box sx={styles.section}>
            <Typography variant="subtitle1" sx={styles.sectionTitle}>
              {t("career_interest_profile")}
            </Typography>

            <Box sx={styles.scoresList}>
              {sortedInterests.map(([key, score]) => {
                const info = INTEREST_LABELS[key];
                const label = info?.[locale] ?? info?.ru ?? key;
                const icon = info?.icon ?? "";
                const isTop = sortedInterests.indexOf([key, score]) < 3;

                return (
                  <Box key={key} sx={styles.scoreRow}>
                    <Box sx={styles.scoreLabelBox}>
                      <Typography sx={styles.scoreLabel}>
                        {icon} {label}
                      </Typography>
                      {isTop && (
                        <Chip
                          label="TOP"
                          size="small"
                          color="primary"
                          sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                        />
                      )}
                    </Box>
                    <Box sx={styles.scoreBarBox}>
                      <LinearProgress
                        variant="determinate"
                        value={score}
                        color={getScoreColor(score)}
                        sx={styles.progressBar}
                      />
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

        {/* ─── Personality Scores ─── */}
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
                        <LinearProgress
                          variant="determinate"
                          value={score}
                          color={getScoreColor(score)}
                          sx={styles.progressBar}
                        />
                        <Typography sx={styles.scoreValue}>{score}%</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </>
        )}

        {/* ─── Summary ─── */}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  dialogTitle: {
    pb: 1,
  },
  section: {
    mb: 1,
  },
  sectionTitle: {
    fontWeight: 700,
    mb: 1.5,
    fontSize: "1rem",
  },
  scoresList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 1.2,
  },
  scoreRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr auto",
    alignItems: "center",
    gap: 1.5,
  },
  scoreLabelBox: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },
  scoreLabel: {
    fontSize: "0.875rem",
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
  },
  scoreBarBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    bgcolor: "grey.200",
  },
  scoreValue: {
    fontSize: "0.85rem",
    fontWeight: 600,
    minWidth: 36,
    textAlign: "right" as const,
  },
  scoreLevel: {
    fontSize: "0.75rem",
    minWidth: 80,
    textAlign: "right" as const,
  },
};
