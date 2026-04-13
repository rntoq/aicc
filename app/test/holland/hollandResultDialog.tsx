"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { HollandSessionFinishResponse, HollandScores } from "@/lib/types";

export type HollandResultPanelProps = {
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

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export function HollandResultPanel({ result, loading = false }: HollandResultPanelProps) {
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
          {t("dialog_holland_empty")}
        </Typography>
      </Paper>
    );
  }

  const scores = result.scores;
  const MAX_SCORE = 40;
  const actualMax = Math.max(...RIASEC_ORDER.map((k) => scores[k] ?? 0));
  const barMax = Math.max(MAX_SCORE, actualMax);

  const sorted = RIASEC_ORDER.map((k) => ({ key: k, value: scores[k] ?? 0 })).sort((a, b) => b.value - a.value);
  const codeLetters = sorted.slice(0, 3).map((e) => e.key).join("");
  const summaryLabel = t("common_summary");
  const detailedLabel = t("common_detailedReport");

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                      background:
                        i === 0
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
    </Paper>
  );
}
