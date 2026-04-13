"use client";

import { Box, Chip, CircularProgress, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";
import { formatPercent } from "@/utils/functions";

export type EnneagramLocalResult = QuizResult & {
  test_title?: string;
  scores?: Record<string, number>;
  primary_type?: string;
  primary_name?: string;
  wing_notation?: string;
  triad?: {
    code?: "heart" | "head" | "body";
    label?: string;
    description?: string;
  } | null;
  summary?: string | null;
};

export type EnneagramResultPanelProps = {
  result: EnneagramLocalResult | null;
  loading?: boolean;
};

const TYPE_INFO: Record<string, { name: { ru: string; kk: string; en: string } }> = {
  type_1: { name: { ru: "Перфекционист", kk: "Перфекционист", en: "The Perfectionist" } },
  type_2: { name: { ru: "Дариель", kk: "Дәл жомарт", en: "The Giver" } },
  type_3: { name: { ru: "Достигатель", kk: "Жетістікке жетуші", en: "The Achiever" } },
  type_4: { name: { ru: "Индивидуалист", kk: "Индивидуалист", en: "The Individualist" } },
  type_5: { name: { ru: "Исследователь", kk: "Зерттеуші", en: "The Investigator" } },
  type_6: { name: { ru: "Скептик", kk: "Скептик", en: "The Skeptic" } },
  type_7: { name: { ru: "Энтузиаст", kk: "Энтузиаст", en: "The Enthusiast" } },
  type_8: { name: { ru: "Соперник", kk: "Батыл", en: "The Challenger" } },
  type_9: { name: { ru: "Миротворец", kk: "Татуластырушы", en: "The Peacemaker" } },
};

const TRIAD_LABELS: Record<"heart" | "head" | "body", { ru: string; kk: string; en: string }> = {
  heart: { ru: "Сердце", kk: "Жүрек", en: "Heart" },
  head: { ru: "Голова", kk: "Бас", en: "Head" },
  body: { ru: "Тело", kk: "Дене", en: "Body" },
};

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export default function EnneagramResultPanel({ result, loading = false }: EnneagramResultPanelProps) {
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
          Enneagram
        </Typography>
      </Paper>
    );
  }

  const scores =
    result.scores && typeof result.scores === "object" ? (result.scores as Record<string, unknown>) : {};
  const typeKeys = ["type_1", "type_2", "type_3", "type_4", "type_5", "type_6", "type_7", "type_8", "type_9"];
  const sorted = [...typeKeys].sort((a, b) => formatPercent(scores[b]) - formatPercent(scores[a]));
  const primaryCode = result.primary_type ?? "";
  const primaryNum = primaryCode.replace("type_", "");
  const primaryName = result.primary_name ?? TYPE_INFO[primaryCode]?.name?.[locale] ?? primaryCode;
  const wingNotation = result.wing_notation ?? "";
  const triadCode = result.triad?.code ?? null;
  const triadLabel = triadCode ? TRIAD_LABELS[triadCode][locale] : "";

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {result.test_title ?? "Enneagram Personality Test"}
        </Typography>
        {primaryNum ? (
          <Chip label={`${primaryNum}`} color="primary" size="small" sx={{ fontWeight: 900, letterSpacing: 1 }} />
        ) : null}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {primaryName}
        {wingNotation ? ` • ${wingNotation}` : ""}
        {triadLabel ? ` • ${triadLabel}` : ""}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sorted.map((k) => {
          const v = formatPercent(scores[k]);
          const info = TYPE_INFO[k];
          return (
            <Box key={k}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {info?.name?.[locale] ?? k}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 900 }}>
                  {v}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={v}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": { borderRadius: 2, background: "linear-gradient(90deg, #3b82f6, #10b981)" },
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
