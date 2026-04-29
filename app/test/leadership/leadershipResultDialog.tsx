"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";

export type LeadershipLocalResult = QuizResult & {
  test_title?: string;
  dimension_scores?: { openness?: number; conscientiousness?: number; agreeableness?: number };
  leadership_type?: { code?: string; name?: string; tagline?: string } | null;
};

export type LeadershipResultPanelProps = { result: LeadershipLocalResult | null; loading?: boolean };

const DIM_INFO: Record<"openness" | "conscientiousness" | "agreeableness", { ru: string; kk: string; en: string; emoji: string; color: string; backendKey: string }> = {
  openness: { ru: "Открытость", kk: "Ашықтық", en: "Openness", emoji: "🌟", color: "#6366f1", backendKey: "O" },
  conscientiousness: { ru: "Добросовестность", kk: "Ұқыптылық", en: "Conscientiousness", emoji: "🎯", color: "#22c55e", backendKey: "C" },
  agreeableness: { ru: "Доброжелательность", kk: "Келісімшілдік", en: "Agreeableness", emoji: "🤝", color: "#06b6d4", backendKey: "A" },
};

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

export default function LeadershipResultPanel({ result, loading = false }: LeadershipResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">Leadership</Typography>
      </Paper>
    );
  }

  const r = result as unknown as Record<string, unknown>;
  const testTitle = typeof r["test_title"] === "string" ? r["test_title"] : "Leadership Style";
  const localType = result.leadership_type ?? null;
  const primaryLabel =
    (typeof r["primary_type"] === "string" && r["primary_type"] !== "" ? r["primary_type"] : null) ??
    localType?.name ?? null;
  const tagline = localType?.tagline ?? null;
  const summary = typeof r["summary"] === "string" ? r["summary"] : (typeof r["detailed_report"] === "string" ? r["detailed_report"] : null);

  // Backend format: scores: { O, C, A } on 1-5 scale
  const backendScores = (result.scores ?? {}) as Record<string, number>;
  const isBackendFmt = ("O" in backendScores || "C" in backendScores || "A" in backendScores);

  const dims = (Object.keys(DIM_INFO) as Array<keyof typeof DIM_INFO>).map((k) => {
    const info = DIM_INFO[k];
    if (isBackendFmt) {
      const raw = Number(backendScores[info.backendKey] ?? 0);
      const pct = Math.max(0, Math.min(100, ((raw - 1) / 4) * 100));
      return { key: k, label: info[locale], emoji: info.emoji, color: info.color, value: pct, display: `${raw.toFixed(1)} / 5` };
    }
    const local = (result.dimension_scores ?? {})[k] ?? 0;
    const pct = Math.max(0, Math.min(100, Math.round(((local - -16) / 32) * 100)));
    return { key: k, label: info[locale], emoji: info.emoji, color: info.color, value: pct, display: `${pct}%` };
  });

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>{testTitle}</Typography>
        {primaryLabel && (
          <Box
            sx={{
              mt: 1.5, p: 1.5, borderRadius: 2,
              background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(16,185,129,0.08) 100%)",
              border: "1px solid rgba(124,58,237,0.15)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={`👑 ${primaryLabel}`}
                color="primary"
                sx={{ fontWeight: 800, fontSize: "0.85rem", height: "auto", py: 0.6 }}
              />
            </Box>
            {tagline && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{tagline}</Typography>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: summary ? 2 : 0 }}>
        {dims.map((d) => (
          <Box key={d.key}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {d.emoji} {d.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>{d.display}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={d.value}
              sx={{
                height: 8, borderRadius: 999, bgcolor: "grey.100",
                "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: d.color },
              }}
            />
          </Box>
        ))}
      </Box>

      {summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              📋 {t("common_summary")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
              {summary}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
