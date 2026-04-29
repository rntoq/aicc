"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";

export type StrengthsResultPanelProps = { result: QuizResult | null; loading?: boolean };

const STRENGTH_LABELS: Record<string, { ru: string; kk: string; en: string; emoji: string }> = {
  awe: { ru: "Восхищение", kk: "Таңдану", en: "Appreciation of beauty", emoji: "🌅" },
  love: { ru: "Любовь", kk: "Махаббат", en: "Love", emoji: "💕" },
  zest: { ru: "Энтузиазм", kk: "Энтузиазм", en: "Zest", emoji: "⚡" },
  humor: { ru: "Юмор", kk: "Әзіл", en: "Humor", emoji: "😄" },
  bravery: { ru: "Смелость", kk: "Батылдық", en: "Bravery", emoji: "🦁" },
  honesty: { ru: "Честность", kk: "Адалдық", en: "Honesty", emoji: "🤝" },
  fairness: { ru: "Справедливость", kk: "Әділдік", en: "Fairness", emoji: "⚖️" },
  judgment: { ru: "Здравомыслие", kk: "Парасаттылық", en: "Judgment", emoji: "🧠" },
  kindness: { ru: "Доброта", kk: "Мейірімділік", en: "Kindness", emoji: "💗" },
  optimism: { ru: "Оптимизм", kk: "Оптимизм", en: "Optimism", emoji: "🌞" },
  curiosity: { ru: "Любознательность", kk: "Қызығушылық", en: "Curiosity", emoji: "🔍" },
  integrity: { ru: "Честность и целостность", kk: "Тұтастық", en: "Integrity", emoji: "🛡️" },
  tradition: { ru: "Уважение к традициям", kk: "Дәстүрлерді сыйлау", en: "Tradition", emoji: "🏛️" },
  creativity: { ru: "Креативность", kk: "Креативтілік", en: "Creativity", emoji: "🎨" },
  discipline: { ru: "Дисциплина", kk: "Тәртіп", en: "Discipline", emoji: "🎯" },
  leadership: { ru: "Лидерство", kk: "Көшбасшылық", en: "Leadership", emoji: "👑" },
  perspective: { ru: "Перспективное мышление", kk: "Перспектива", en: "Perspective", emoji: "🔭" },
  sociability: { ru: "Общительность", kk: "Әлеуметтік", en: "Sociability", emoji: "🗣️" },
  independence: { ru: "Независимость", kk: "Тәуелсіздік", en: "Independence", emoji: "🦅" },
  perseverance: { ru: "Настойчивость", kk: "Табандылық", en: "Perseverance", emoji: "⛰️" },
  spirituality: { ru: "Духовность", kk: "Руханилық", en: "Spirituality", emoji: "✨" },
  self_regulation: { ru: "Самоконтроль", kk: "Өзін-өзі реттеу", en: "Self-regulation", emoji: "🧘" },
  love_of_learning: { ru: "Любовь к обучению", kk: "Білуге құмарлық", en: "Love of learning", emoji: "📚" },
  stress_management: { ru: "Управление стрессом", kk: "Стрессті басқару", en: "Stress management", emoji: "🌊" },
  social_intelligence: { ru: "Социальный интеллект", kk: "Әлеуметтік интеллект", en: "Social intelligence", emoji: "💡" },
};

const RANK_COLORS = ["#fbbf24", "#94a3b8", "#cd7f32", "#6366f1", "#22c55e"];

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

export default function StrengthsResultPanel({ result, loading = false }: StrengthsResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">Personal Strengths</Typography>
      </Paper>
    );
  }

  const r = result as unknown as Record<string, unknown>;
  const testTitle = typeof r["test_title"] === "string" ? r["test_title"] : "Personal Strengths";
  const summary = typeof r["summary"] === "string" ? r["summary"] : "";
  const primaryType = typeof r["primary_type"] === "string" ? r["primary_type"] : "";
  const secondaryType = typeof r["secondary_type"] === "string" ? r["secondary_type"] : "";

  // Source 1: explicit `top_5_strengths` (legacy frontend shape)
  const topRaw = (r["top_5_strengths"] ?? r["top5_strengths"]) as Array<Record<string, unknown>> | undefined;

  // Source 2: build from raw `scores` map (current backend shape)
  const scores = (result.scores ?? {}) as Record<string, number>;
  const fromScores = Object.entries(scores)
    .map(([k, v]) => ({ key: k, value: typeof v === "number" ? v : Number(v) || 0 }))
    .sort((a, b) => b.value - a.value);

  const max = Math.max(...fromScores.map((s) => s.value), 1);
  const top5: Array<{ rank: number; key: string; name: string; value: number; emoji: string }> = topRaw && topRaw.length
    ? topRaw.slice(0, 5).map((item, idx) => {
        const rank = typeof item["rank"] === "number" ? item["rank"] as number : idx + 1;
        const nameRaw = (item["name"] ?? item["strength_name"] ?? item["strength"] ?? "") as string;
        const key = String(item["key"] ?? "").toLowerCase();
        const info = STRENGTH_LABELS[key];
        return {
          rank, key, name: info?.[locale] ?? nameRaw, value: Number(item["score"] ?? item["percentage"] ?? 0),
          emoji: info?.emoji ?? "⭐",
        };
      })
    : fromScores.slice(0, 5).map((s, idx) => {
        const info = STRENGTH_LABELS[s.key];
        return { rank: idx + 1, key: s.key, name: info?.[locale] ?? s.key, value: s.value, emoji: info?.emoji ?? "⭐" };
      });

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>{testTitle}</Typography>
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
          {primaryType && <Chip label={`💎 ${primaryType}`} size="small" color="primary" sx={{ fontWeight: 700 }} />}
          {secondaryType && <Chip label={secondaryType} size="small" variant="outlined" />}
        </Box>
      </Box>

      {top5.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            🏆 Топ-5 сильных сторон
          </Typography>
          {top5.map((s, idx) => {
            const pct = Math.round((s.value / max) * 100);
            const color = RANK_COLORS[idx];
            return (
              <Box
                key={`${s.rank}-${s.key}`}
                sx={{
                  p: 1.5, borderRadius: 2, border: "1px solid",
                  borderColor: idx === 0 ? `${color}66` : "divider",
                  bgcolor: idx === 0 ? `${color}10` : "transparent",
                  display: "flex", alignItems: "center", gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: 999, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    bgcolor: color, color: "white", fontWeight: 900, fontSize: 14, flexShrink: 0,
                  }}
                >
                  #{s.rank}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {s.emoji} {s.name}
                  </Typography>
                  {s.value > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          flex: 1, height: 6, borderRadius: 999, bgcolor: "grey.100",
                          "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: color },
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 28, textAlign: "right" }}>
                        {s.value}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : null}

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
