"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { HollandSessionFinishResponse, HollandScores } from "@/lib/types";
import { ResultRadar } from "@/app/test/_shared/ResultCharts";

export type HollandResultPanelProps = {
  result: HollandSessionFinishResponse | null;
  loading?: boolean;
};

type RIASECKey = keyof HollandScores;
const RIASEC_ORDER: RIASECKey[] = ["R", "I", "A", "S", "E", "C"];

const CATEGORY_LABELS: Record<RIASECKey, Record<string, string>> = {
  R: { ru: "Реалистичный", kk: "Реалистік", en: "Realistic" },
  I: { ru: "Исследовательский", kk: "Зерттеушілік", en: "Investigative" },
  A: { ru: "Артистичный", kk: "Артистік", en: "Artistic" },
  S: { ru: "Социальный", kk: "Әлеуметтік", en: "Social" },
  E: { ru: "Предприимчивый", kk: "Кәсіпкерлік", en: "Enterprising" },
  C: { ru: "Конвенциональный", kk: "Конвенциялық", en: "Conventional" },
};

const CATEGORY_EMOJI: Record<RIASECKey, string> = {
  R: "🔧", I: "🔬", A: "🎨", S: "🤝", E: "💼", C: "📊",
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
        <Typography variant="body2" color="text.secondary">{t("dialog_holland_empty")}</Typography>
      </Paper>
    );
  }

  const scores = result.scores;
  const actualMax = Math.max(...RIASEC_ORDER.map((k) => scores[k] ?? 0));
  const barMax = Math.max(40, actualMax);

  const sorted = RIASEC_ORDER.map((k) => ({ key: k, value: scores[k] ?? 0 })).sort((a, b) => b.value - a.value);
  const codeLetters = sorted.slice(0, 3).map((e) => e.key).join("");

  const radarData = RIASEC_ORDER.map((k) => ({
    label: k,
    value: scores[k] ?? 0,
  }));

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
          <Typography variant="caption" color="text.secondary">{result.secondary_type}</Typography>
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center", mb: 2 }}>
        <ResultRadar data={radarData} domainMax={barMax} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          {sorted.map(({ key, value }, i) => {
            const pct = Math.round((value / barMax) * 100);
            return (
              <Box key={key}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography variant="body2" sx={{ fontWeight: i < 3 ? 700 : 500 }}>
                    {CATEGORY_EMOJI[key]} {CATEGORY_LABELS[key][locale]}
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
                        i === 0 ? "linear-gradient(90deg, #6366f1, #10b981)"
                          : i === 1 ? "linear-gradient(90deg, #7c3aed, #06b6d4)"
                            : "linear-gradient(90deg, #94a3b8, #64748b)",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {result.summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
              {t("common_summary")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {result.summary}
            </Typography>
          </Box>
        </>
      )}

      {result.detailed_report && result.detailed_report !== result.summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
              {t("common_detailedReport")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {result.detailed_report}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
