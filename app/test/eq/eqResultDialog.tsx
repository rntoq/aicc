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
  LinearProgress,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";
import { formatPercent } from "@/utils/functions";

type EqDimensionKey =
  | "self_awareness"
  | "other_awareness"
  | "emotional_control"
  | "empathy"
  | "wellbeing";

export type EqLocalResult = QuizResult & {
  test_type?: "eq5" | string;
  overall_eq?: number;
  eq_superpower?: {
    archetype?: string;
    title?: string;
    description?: string;
  } | null;
  dimension_scores?: Record<EqDimensionKey, number>;
  summary?: string | null;
};

export interface EqResultDialogProps {
  open: boolean;
  onClose: () => void;
  result: EqLocalResult | null;
  loading?: boolean;
}

const DIMENSIONS: Array<{ key: EqDimensionKey; ru: string; kk: string; en: string }> = [
  { key: "self_awareness", ru: "Самосознание", kk: "Өзін-өзі тану", en: "Self-awareness" },
  { key: "other_awareness", ru: "Социальная восприимчивость", kk: "Әлеуметтік қабылдау", en: "Other awareness" },
  { key: "emotional_control", ru: "Контроль эмоций", kk: "Эмоцияны бақылау", en: "Emotional control" },
  { key: "empathy", ru: "Эмпатия", kk: "Эмпатия", en: "Empathy" },
  { key: "wellbeing", ru: "Эмоциональное благополучие", kk: "Жақсы көңіл-күй", en: "Well-being" },
];

const parseOverallEqPercent = (result: EqLocalResult): number | null => {
  const candidates: string[] = [];
  if (typeof result.primary_type === "string") candidates.push(result.primary_type);
  if (typeof result.summary === "string") candidates.push(result.summary);
  if (typeof (result as unknown as Record<string, unknown>)["detailed_report"] === "string") {
    candidates.push(String((result as unknown as Record<string, unknown>)["detailed_report"]));
  }

  for (const text of candidates) {
    // Examples:
    // "EQ: 61%"
    // "Ваш эмоциональный интеллект (EQ): 61%"
    const m = text.match(/\bEQ\b[^0-9]{0,20}(\d{1,3})\s*%/i);
    if (m?.[1]) return formatPercent(Number(m[1]));
  }
  return null;
};

const parseEqDimensionPercents = (result: EqLocalResult): Partial<Record<EqDimensionKey, number>> => {
  const out: Partial<Record<EqDimensionKey, number>> = {};
  const text =
    (typeof result.summary === "string" && result.summary) ||
    (typeof (result as unknown as Record<string, unknown>)["detailed_report"] === "string"
      ? String((result as unknown as Record<string, unknown>)["detailed_report"])
      : "");

  if (!text) return out;

  const patterns: Record<EqDimensionKey, RegExp> = {
    self_awareness: /(Self[-\s]?Awareness)[^0-9]{0,20}(\d{1,3})\s*%/i,
    other_awareness: /(Other\s+Awareness)[^0-9]{0,20}(\d{1,3})\s*%/i,
    emotional_control: /(Emotional\s+Control)[^0-9]{0,20}(\d{1,3})\s*%/i,
    empathy: /(Empathy)[^0-9]{0,20}(\d{1,3})\s*%/i,
    wellbeing: /(Well[-\s]?being)[^0-9]{0,20}(\d{1,3})\s*%/i,
  };

  for (const key of Object.keys(patterns) as EqDimensionKey[]) {
    const m = text.match(patterns[key]);
    if (m?.[2]) out[key] = formatPercent(Number(m[2]));
  }

  return out;
};

export function EqResultDialog({ open, onClose, result, loading = false }: EqResultDialogProps) {
  const locale = useLocale() as "ru" | "kk" | "en";
  const t = useTranslations();

  if (loading || !result) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle>EQ-5</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("close")}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const parsedOverall = parseOverallEqPercent(result);
  const parsedScores = parseEqDimensionPercents(result);

  const overall = formatPercent(parsedOverall ?? result.overall_eq ?? 0);
  const scores = {
    ...(result.dimension_scores ?? {}),
    ...parsedScores,
  } as Partial<Record<EqDimensionKey, number>>;

  const power = result.eq_superpower ?? null;
  const powerCode = power?.archetype ?? "";
  const powerTitle = t("eq_superpower");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
          <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
            {result.test_title ?? "Emotional Intelligence (EQ)"}
          </Typography>
          {powerCode ? (
            <Chip
              label={`${powerCode}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 800, letterSpacing: 1 }}
            />
          ) : null}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {powerTitle}: {power?.title ?? "-"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {t("eq_overall")}
            </Typography>
            <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 900 }}>
              {overall}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overall}
            sx={{ mt: 1.25, height: 10, borderRadius: 2 }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {DIMENSIONS.map(({ key, ru, kk, en }) => {
            const v = formatPercent(scores[key] ?? 0);
            return (
              <Box key={key}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {{ ru, kk, en }[locale]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
                    {v}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={v}
                  sx={{
                    height: 8,
                    borderRadius: 2,
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #1E3A8A, #10B981)",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {result.summary ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              {t("common_summary")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {result.summary}
            </Typography>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

