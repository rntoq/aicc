"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";
import { ResultRadar } from "@/app/test/_shared/ResultCharts";

type EqDimensionKey = "self_awareness" | "other_awareness" | "emotional_control" | "empathy" | "wellbeing";

export type EqLocalResult = QuizResult & {
  test_type?: "eq5" | string;
  overall_eq?: number;
  eq_superpower?: { archetype?: string; title?: string; description?: string } | null;
  dimension_scores?: Record<EqDimensionKey, number>;
  summary?: string | null;
};

export type EqResultPanelProps = { result: EqLocalResult | null; loading?: boolean };

const DIMENSIONS: Array<{ key: EqDimensionKey; backendKey: string; ru: string; kk: string; en: string; emoji: string; color: string }> = [
  { key: "self_awareness", backendKey: "sa", ru: "Самосознание", kk: "Өзін-өзі тану", en: "Self-awareness", emoji: "🔮", color: "#6366f1" },
  { key: "other_awareness", backendKey: "oa", ru: "Социальная чуткость", kk: "Әлеуметтік қабылдау", en: "Other awareness", emoji: "👥", color: "#06b6d4" },
  { key: "emotional_control", backendKey: "ec", ru: "Контроль эмоций", kk: "Эмоцияны бақылау", en: "Emotional control", emoji: "🧘", color: "#22c55e" },
  { key: "empathy", backendKey: "emp", ru: "Эмпатия", kk: "Эмпатия", en: "Empathy", emoji: "💖", color: "#ec4899" },
  { key: "wellbeing", backendKey: "wb", ru: "Эмоциональное благополучие", kk: "Жақсы көңіл-күй", en: "Well-being", emoji: "🌈", color: "#f59e0b" },
];

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

const parseOverall = (text: string): number | null => {
  const m = text.match(/\bEQ\b[^0-9]{0,20}(\d{1,3})\s*%/i);
  return m?.[1] ? Number(m[1]) : null;
};

const parseDimensionPercents = (text: string): Partial<Record<EqDimensionKey, number>> => {
  const out: Partial<Record<EqDimensionKey, number>> = {};
  if (!text) return out;
  const patterns: Record<EqDimensionKey, RegExp> = {
    self_awareness: /(Self[-\s]?Awareness)[^0-9]{0,20}(\d{1,3})\s*%/i,
    other_awareness: /(Other\s+Awareness)[^0-9]{0,20}(\d{1,3})\s*%/i,
    emotional_control: /(Emotional\s+Control)[^0-9]{0,20}(\d{1,3})\s*%/i,
    empathy: /(Empathy)[^0-9]{0,20}(\d{1,3})\s*%/i,
    wellbeing: /(Well[-\s]?being)[^0-9]{0,20}(\d{1,3})\s*%/i,
  };
  for (const k of Object.keys(patterns) as EqDimensionKey[]) {
    const m = text.match(patterns[k]);
    if (m?.[2]) out[k] = Number(m[2]);
  }
  return out;
};

export function EqResultPanel({ result, loading = false }: EqResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">EQ-5</Typography>
      </Paper>
    );
  }

  const r = result as unknown as Record<string, unknown>;
  const summary = typeof r["summary"] === "string" ? r["summary"] : "";
  const detailed = typeof r["detailed_report"] === "string" ? r["detailed_report"] : "";
  const text = summary || detailed;

  // Build scores from multiple sources
  const backendScores = (result.scores ?? {}) as Record<string, number>;
  const parsed = parseDimensionPercents(text);
  const localDims = result.dimension_scores ?? ({} as Record<EqDimensionKey, number>);

  // Per guide: prefer parsed % from summary, then local %, then normalize raw backend (typical max ~70)
  const RAW_MAX = 70;
  const dimensionPct: Record<EqDimensionKey, number> = {} as Record<EqDimensionKey, number>;
  for (const d of DIMENSIONS) {
    const fromBackendRaw = backendScores[d.backendKey];
    const fromParsed = parsed[d.key];
    const fromLocal = localDims[d.key];
    const fromBackendPct = typeof fromBackendRaw === "number" ? Math.round((fromBackendRaw / RAW_MAX) * 100) : undefined;
    dimensionPct[d.key] = Math.max(0, Math.min(100, Math.round(fromParsed ?? fromLocal ?? fromBackendPct ?? 0)));
  }

  // Overall EQ
  const parsedOverall = parseOverall(text);
  const explicitPrimaryNum = result.primary_type?.match(/(\d+)\s*%/)?.[1];
  const overall = Math.round(
    parsedOverall ??
      (explicitPrimaryNum ? Number(explicitPrimaryNum) : null) ??
      result.overall_eq ??
      Object.values(dimensionPct).reduce((s, v) => s + v, 0) / DIMENSIONS.length
  );

  const radarData = DIMENSIONS.map((d) => ({ label: d[locale].split(" ")[0], value: dimensionPct[d.key] }));

  const power = result.eq_superpower ?? null;

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start", mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {result.test_title ?? "Emotional Intelligence (EQ-5)"}
        </Typography>
        {power?.archetype && <Chip label={power.archetype} color="primary" size="small" sx={{ fontWeight: 800 }} />}
      </Box>

      <Box
        sx={{
          p: 2, mb: 2, borderRadius: 2,
          background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(236,72,153,0.08) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              {t("eq_overall")}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main", lineHeight: 1.1 }}>
              {overall}%
            </Typography>
            {power?.title && (
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                ✨ {power.title}
              </Typography>
            )}
          </Box>
          <Box sx={{ width: 80, height: 80, position: "relative", flexShrink: 0 }}>
            <CircularProgress
              variant="determinate"
              value={overall}
              size={80}
              thickness={5}
              sx={{ color: "primary.main" }}
            />
            <Box sx={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 900,
            }}>
              {overall}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center", mb: 2 }}>
        <ResultRadar data={radarData} domainMax={100} color="#ec4899" fill="rgba(236,72,153,0.22)" />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          {DIMENSIONS.map((d) => {
            const v = dimensionPct[d.key];
            return (
              <Box key={d.key}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {d.emoji} {d[locale]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>{v}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={v}
                  sx={{
                    height: 7, borderRadius: 999, bgcolor: "grey.100",
                    "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: d.color },
                  }}
                />
              </Box>
            );
          })}
        </Box>
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
