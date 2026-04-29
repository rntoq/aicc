"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";
import { ResultRadar } from "@/app/test/_shared/ResultCharts";

export type EnneagramLocalResult = QuizResult & {
  test_title?: string;
  scores?: Record<string, number>;
  primary_type?: string;
  primary_name?: string;
  wing_notation?: string;
  triad?: { code?: "heart" | "head" | "body"; label?: string; description?: string } | null;
  summary?: string | null;
};

export type EnneagramResultPanelProps = { result: EnneagramLocalResult | null; loading?: boolean };

const TYPE_INFO: Record<string, { ru: string; kk: string; en: string; emoji: string }> = {
  type_1: { ru: "Перфекционист", kk: "Перфекционист", en: "Perfectionist", emoji: "🎯" },
  type_2: { ru: "Помощник", kk: "Көмекші", en: "Giver", emoji: "💝" },
  type_3: { ru: "Достигатель", kk: "Жетістікке жетуші", en: "Achiever", emoji: "🏆" },
  type_4: { ru: "Индивидуалист", kk: "Индивидуалист", en: "Individualist", emoji: "🎨" },
  type_5: { ru: "Исследователь", kk: "Зерттеуші", en: "Investigator", emoji: "🔬" },
  type_6: { ru: "Скептик", kk: "Скептик", en: "Skeptic", emoji: "🛡️" },
  type_7: { ru: "Энтузиаст", kk: "Энтузиаст", en: "Enthusiast", emoji: "🎉" },
  type_8: { ru: "Соперник", kk: "Батыл", en: "Challenger", emoji: "⚡" },
  type_9: { ru: "Миротворец", kk: "Татуластырушы", en: "Peacemaker", emoji: "🕊️" },
};

const TRIAD_LABELS: Record<"heart" | "head" | "body", { ru: string; kk: string; en: string; emoji: string }> = {
  heart: { ru: "Сердце", kk: "Жүрек", en: "Heart", emoji: "❤️" },
  head: { ru: "Голова", kk: "Бас", en: "Head", emoji: "🧠" },
  body: { ru: "Тело", kk: "Дене", en: "Body", emoji: "💪" },
};

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

export default function EnneagramResultPanel({ result, loading = false }: EnneagramResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">Enneagram</Typography>
      </Paper>
    );
  }

  const scores = (result.scores ?? {}) as Record<string, number>;
  const typeKeys = ["type_1", "type_2", "type_3", "type_4", "type_5", "type_6", "type_7", "type_8", "type_9"];
  const allValues = typeKeys.map((k) => scores[k] ?? 0);
  const max = Math.max(...allValues, 1);

  const sorted = typeKeys.map((k) => ({ k, v: scores[k] ?? 0 })).sort((a, b) => b.v - a.v);

  // Per guide: extract type number reliably via regex from primary_type ("Тип 1 — ...")
  // Fallback: legacy "type_1" format, then highest-score key.
  const primaryRaw = result.primary_type ?? "";
  const primaryNum =
    primaryRaw.match(/Тип\s+(\d)/i)?.[1] ??
    primaryRaw.match(/(?:^|[^\d])(\d)(?:[^\d]|$)/)?.[1] ??
    primaryRaw.replace("type_", "") ??
    sorted[0].k.replace("type_", "");
  const primaryKey = `type_${primaryNum}`;
  const info = TYPE_INFO[primaryKey];
  const primaryName = info?.[locale] ?? result.primary_name ?? primaryRaw;
  const triadCode = result.triad?.code ?? null;
  const triad = triadCode ? TRIAD_LABELS[triadCode] : null;

  const radarData = typeKeys.map((k) => ({
    label: k.replace("type_", "T"),
    value: scores[k] ?? 0,
  }));

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start", mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {result.test_title ?? "Enneagram Personality Test"}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", mt: 0.5 }}>
            {info?.emoji} Тип {primaryNum} — {primaryName}
          </Typography>
          {triad && (
            <Typography variant="caption" color="text.secondary">
              {triad.emoji} {triad[locale]}
              {result.wing_notation ? ` • ${result.wing_notation}` : ""}
            </Typography>
          )}
        </Box>
        <Chip label={primaryNum} color="primary" sx={{ fontWeight: 900, height: 36, fontSize: "1rem", letterSpacing: 1 }} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center", mt: 2 }}>
        <ResultRadar data={radarData} domainMax={max} color="#a855f7" fill="rgba(168,85,247,0.22)" height={260} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {sorted.map(({ k, v }, i) => {
            const ti = TYPE_INFO[k];
            const pct = Math.round((v / max) * 100);
            const isTop = i < 2;
            return (
              <Box key={k}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography variant="body2" sx={{ fontWeight: isTop ? 800 : 500 }}>
                    {ti?.emoji} {k.replace("type_", "Тип ")} — {ti?.[locale] ?? k}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{v}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 7, borderRadius: 999, bgcolor: "grey.100",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background:
                        i === 0 ? "linear-gradient(90deg, #a855f7, #ec4899)"
                          : i === 1 ? "linear-gradient(90deg, #6366f1, #06b6d4)"
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
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              📋 {t("common_summary")}
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
