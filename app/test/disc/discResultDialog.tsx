"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";
import { ResultRadar } from "@/app/test/_shared/ResultCharts";

type DiscLetter = "D" | "I" | "S" | "C";

type DiscLocalResult = QuizResult & { disc_code?: string; disc_primary?: DiscLetter };

export type DiscResultPanelProps = { result: DiscLocalResult | null; loading?: boolean };

const TYPE_INFO: Record<DiscLetter, { ru: string; kk: string; en: string; tagline: string; emoji: string; color: string }> = {
  D: { ru: "Доминирование", kk: "Басымдық", en: "Dominance", tagline: "Результаты и решения", emoji: "🎯", color: "#ef4444" },
  I: { ru: "Влияние", kk: "Ықпал", en: "Influence", tagline: "Коммуникация и вдохновение", emoji: "✨", color: "#f59e0b" },
  S: { ru: "Стабильность", kk: "Тұрақтылық", en: "Steadiness", tagline: "Команда и терпение", emoji: "🤝", color: "#22c55e" },
  C: { ru: "Соответствие", kk: "Сәйкестік", en: "Conscientiousness", tagline: "Точность и качество", emoji: "📐", color: "#6366f1" },
};

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

export default function DiscResultPanel({ result, loading = false }: DiscResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">DISC Assessment</Typography>
      </Paper>
    );
  }

  // Per guide: backend may omit zero-keys (e.g. {C:2, I:7, S:15} without D). Default missing → 0.
  const rawScores = (result.scores ?? {}) as Partial<Record<DiscLetter, number>>;
  const order: DiscLetter[] = ["D", "I", "S", "C"];
  const filledScores: Record<DiscLetter, number> = {
    D: rawScores.D ?? 0, I: rawScores.I ?? 0, S: rawScores.S ?? 0, C: rawScores.C ?? 0,
  };
  const max = Math.max(...order.map((k) => filledScores[k]), 1);

  // Per guide: build combo style (DI/SC/...) from top-2 of `scores`, not from text.
  const sorted = order.map((k) => ({ k, v: filledScores[k] }))
    .sort((a, b) => b.v - a.v || order.indexOf(a.k) - order.indexOf(b.k));
  const primaryLetter: DiscLetter | undefined = result.disc_primary ?? sorted[0]?.k;
  const code = result.disc_code ?? sorted.filter((s) => s.v > 0).slice(0, 2).map((s) => s.k).join("");
  const primaryInfo = primaryLetter ? TYPE_INFO[primaryLetter] : null;
  const primaryFromBackend = result.primary_type ?? "";

  const radarData = order.map((k) => ({ label: k, value: filledScores[k] }));

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start", mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {result.test_title ?? "DISC Assessment"}
          </Typography>
          {primaryInfo && (
            <Typography variant="body2" sx={{ fontWeight: 700, color: primaryInfo.color, mt: 0.5 }}>
              {primaryInfo.emoji} {primaryFromBackend || `${primaryLetter} — ${primaryInfo[locale]}`}
            </Typography>
          )}
          {primaryInfo && (
            <Typography variant="caption" color="text.secondary">{primaryInfo.tagline}</Typography>
          )}
        </Box>
        {code && <Chip label={code} color="primary" sx={{ fontWeight: 900, letterSpacing: 1, height: 32, fontSize: "0.95rem" }} />}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center", mt: 2 }}>
        <ResultRadar data={radarData} domainMax={max} color="#22c55e" fill="rgba(34,197,94,0.22)" />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          {order.map((k) => {
            const v = filledScores[k];
            const info = TYPE_INFO[k];
            const pct = Math.round((v / max) * 100);
            return (
              <Box key={k}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {info.emoji} {k} · {info[locale]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>{v}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 8, borderRadius: 999, bgcolor: "grey.100",
                    "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: info.color },
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
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
              📋 {t("common_interpretation")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
              {result.summary}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
