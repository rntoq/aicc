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
import { useLocale } from "next-intl";
import type { QuizResult } from "@/lib/types";

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

const formatPercent = (v: unknown): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

export function EqResultDialog({ open, onClose, result, loading = false }: EqResultDialogProps) {
  const locale = useLocale() as "ru" | "kk" | "en";

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
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const overall = formatPercent(result.overall_eq ?? 0);
  const scores = (result.dimension_scores ?? {}) as Partial<Record<EqDimensionKey, number>>;

  const power = result.eq_superpower ?? null;
  const powerCode = power?.archetype ?? "";
  const powerTitle =
    locale === "kk"
      ? "EQ-суперсила"
      : locale === "en"
        ? "EQ Superpower"
        : "EQ-суперсила";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
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
              {locale === "en" ? "Overall EQ" : locale === "kk" ? "Жалпы EQ" : "Общий EQ"}
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
                    {locale === "ru" ? ru : locale === "kk" ? kk : en}
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
              {locale === "en" ? "Summary" : locale === "kk" ? "Қорытынды" : "Краткий вывод"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {result.summary}
            </Typography>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {locale === "en" ? "Close" : locale === "kk" ? "Жабу" : "Закрыть"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

