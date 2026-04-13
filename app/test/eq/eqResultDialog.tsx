"use client";

import { Box, Chip, CircularProgress, LinearProgress, Paper, Typography } from "@mui/material";
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

export type EqResultPanelProps = {
  result: EqLocalResult | null;
  loading?: boolean;
};

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

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export function EqResultPanel({ result, loading = false }: EqResultPanelProps) {
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
          EQ-5
        </Typography>
      </Paper>
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

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", mb: 1 }}>
        <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
          {result.test_title ?? "Emotional Intelligence (EQ)"}
        </Typography>
        {powerCode ? (
          <Chip label={`${powerCode}`} color="primary" size="small" sx={{ fontWeight: 800, letterSpacing: 1 }} />
        ) : null}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("eq_superpower")}: {power?.title}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t("eq_overall")}
          </Typography>
          <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 900 }}>
            {overall}%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={overall} sx={{ mt: 1.25, height: 10, borderRadius: 2 }} />
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
    </Paper>
  );
}
