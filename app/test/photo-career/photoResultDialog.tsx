"use client";

import { Box, Chip, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";
import { ResultDonut, type DonutSlice } from "@/app/test/_shared/ResultCharts";

export type PhotoResultPanelProps = { result: QuizResult | null; loading?: boolean };

const SCALE_INFO: Record<string, { ru: string; kk: string; en: string; emoji: string; color: string }> = {
  Building: { ru: "Физический труд", kk: "Физикалық еңбек", en: "Building", emoji: "🔧", color: "#6366f1" },
  Thinking: { ru: "Аналитика и наука", kk: "Аналитика", en: "Thinking", emoji: "🔬", color: "#06b6d4" },
  Creating: { ru: "Творчество", kk: "Шығармашылық", en: "Creating", emoji: "🎨", color: "#a855f7" },
  Helping: { ru: "Помощь людям", kk: "Адамдарға көмек", en: "Helping", emoji: "🤝", color: "#22c55e" },
  Persuading: { ru: "Переговоры", kk: "Келіссөздер", en: "Persuading", emoji: "💼", color: "#f59e0b" },
  Organizing: { ru: "Организация и данные", kk: "Ұйымдастыру", en: "Organizing", emoji: "📊", color: "#ef4444" },
};

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

export function PhotoResultPanel({ result, loading = false }: PhotoResultPanelProps) {
  const locale = useLocale() as "ru" | "kk" | "en";
  const t = useTranslations();

  if (loading) {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      </Paper>
    );
  }
  if (!result) {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Typography variant="body2" color="text.secondary">Photo Career Quiz</Typography>
      </Paper>
    );
  }

  const rawScores = (result.scores ?? {}) as Record<string, number>;
  const entries = Object.entries(rawScores)
    .map(([k, v]) => ({ key: k, value: typeof v === "number" ? v : Number(v) || 0 }))
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((s, e) => s + e.value, 0);
  const top = entries.slice(0, 3);

  const donutData: DonutSlice[] = entries.map((e) => ({
    label: SCALE_INFO[e.key]?.[locale] ?? e.key,
    value: e.value,
    color: SCALE_INFO[e.key]?.color,
  }));

  const summary = result.summary ?? null;
  const detailed = result.detailed_report ?? null;
  const primaryLabel = result.primary_type ?? null;

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {result.test_title ?? "Photo Career Quiz"}
          </Typography>
          <Chip label={`Σ ${total}`} color="primary" size="small" sx={{ fontWeight: 700, flexShrink: 0 }} />
        </Box>
        {primaryLabel && (
          <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", mt: 0.5 }}>
            {primaryLabel}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center", mb: 2 }}>
        <ResultDonut
          data={donutData}
          centerLabel={top[0] ? SCALE_INFO[top[0].key]?.emoji : ""}
          centerSubLabel={top[0] ? `${Math.round((top[0].value / total) * 100)}%` : ""}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            🏆 {t("photo_by_direction")}
          </Typography>
          {entries.map((e, i) => {
            const info = SCALE_INFO[e.key];
            const pct = Math.round((e.value / total) * 100);
            return (
              <Box
                key={e.key}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.2,
                  p: 1, borderRadius: 1.5,
                  bgcolor: i < 3 ? `${info?.color}10` : "transparent",
                  border: i < 3 ? `1px solid ${info?.color}30` : "1px solid transparent",
                }}
              >
                <Box
                  sx={{
                    width: 32, height: 32, borderRadius: 1.5, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    bgcolor: i < 3 ? info?.color : "grey.200",
                    color: i < 3 ? "white" : "text.secondary",
                    fontSize: 14, fontWeight: 800, flexShrink: 0,
                  }}
                >
                  {i + 1}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: i < 3 ? 700 : 500, lineHeight: 1.2 }}>
                    {info?.emoji} {info?.[locale] ?? e.key}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: i < 3 ? info?.color : "text.secondary" }}>
                  {pct}%
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
              📋 {t("common_summary")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
              {summary}
            </Typography>
          </Box>
        </>
      )}

      {detailed && detailed !== summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
              📊 {t("common_detailedReport")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
              {detailed}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
