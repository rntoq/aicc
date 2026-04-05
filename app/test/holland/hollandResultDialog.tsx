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
import { useLocale } from "next-intl";
import type { HollandSessionFinishResponse, HollandScores } from "@/lib/types";

export type HollandResultDialogProps = {
  open: boolean;
  onClose: () => void;
  result: HollandSessionFinishResponse | null;
  loading?: boolean;
};

type RIASECKey = keyof HollandScores;
const RIASEC_ORDER: RIASECKey[] = ["R", "I", "A", "S", "E", "C"];

const CATEGORY_LABELS: Record<RIASECKey, Record<string, string>> = {
  R: { ru: "Реалистичный (R)", kk: "Реалистік (R)", en: "Realistic (R)" },
  I: { ru: "Исследовательский (I)", kk: "Зерттеушілік (I)", en: "Investigative (I)" },
  A: { ru: "Артистичный (A)", kk: "Артистік (A)", en: "Artistic (A)" },
  S: { ru: "Социальный (S)", kk: "Әлеуметтік (S)", en: "Social (S)" },
  E: { ru: "Предприимчивый (E)", kk: "Кәсіпкерлік (E)", en: "Enterprising (E)" },
  C: { ru: "Конвенциональный (C)", kk: "Конвенциялық (C)", en: "Conventional (C)" },
};

export const HollandResultDialog = ({
  open,
  onClose,
  result,
  loading = false,
}: HollandResultDialogProps) => {
  const locale = useLocale() as "ru" | "kk" | "en";

  const closeLabel = locale === "kk" ? "Жабу" : locale === "en" ? "Close" : "Закрыть";

  if (loading || !result) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Holland Code (RIASEC)</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {locale === "kk"
                ? "Профильді көру үшін Холланд тестін тапсырыңыз."
                : locale === "en"
                  ? "Complete the Holland test to see your RIASEC profile."
                  : "Пройдите тест Holland, чтобы увидеть ваш RIASEC-профиль."}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
            {closeLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const scores = result.scores;

  // Normalize bars relative to the max possible score (8 questions × 5 = 40)
  // If actual max differs, fall back to dynamic max
  const MAX_SCORE = 40;
  const actualMax = Math.max(...RIASEC_ORDER.map((k) => scores[k] ?? 0));
  const barMax = Math.max(MAX_SCORE, actualMax);

  const sorted = RIASEC_ORDER
    .map((k) => ({ key: k, value: scores[k] ?? 0 }))
    .sort((a, b) => b.value - a.value);

  const codeLetters = sorted.slice(0, 3).map((e) => e.key).join("");

  const summaryLabel = locale === "kk" ? "Қорытынды" : locale === "en" ? "Summary" : "Краткий вывод";
  const detailedLabel = locale === "kk" ? "Толық есеп" : locale === "en" ? "Detailed Report" : "Подробный отчёт";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {result.test_title}
            </Typography>
            <Chip
              label={codeLetters}
              color="primary"
              size="small"
              sx={{ fontWeight: 800, letterSpacing: 2, flexShrink: 0 }}
            />
          </Box>

          {result.primary_type && (
            <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
              {result.primary_type}
            </Typography>
          )}
          {result.secondary_type && (
            <Typography variant="caption" color="text.secondary">
              {result.secondary_type}
            </Typography>
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Score bars */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {sorted.map(({ key, value }, i) => {
              const pct = Math.round((value / barMax) * 100);
              return (
                <Box key={key}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                    <Typography variant="body2" sx={{ fontWeight: i < 3 ? 700 : 500 }}>
                      {CATEGORY_LABELS[key][locale] ?? CATEGORY_LABELS[key].ru}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                      {value} / {barMax}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: i === 0
                          ? "linear-gradient(90deg, #6366f1, #10b981)"
                          : i === 1
                            ? "linear-gradient(90deg, #7c3aed, #06b6d4)"
                            : "linear-gradient(90deg, #1E3A8A, #10B981)",
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Summary */}
          {result.summary && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
                  {summaryLabel}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                  {result.summary}
                </Typography>
              </Box>
            </>
          )}

          {/* Detailed report — only if different from summary */}
          {result.detailed_report && result.detailed_report !== result.summary && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
                  {detailedLabel}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                  {result.detailed_report}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          {closeLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
