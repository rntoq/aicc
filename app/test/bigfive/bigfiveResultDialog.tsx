"use client";

import { Box, Chip, CircularProgress, LinearProgress, Paper, Typography } from "@mui/material";
import type { BigFiveScores, BigFiveSessionFinishResponse } from "@/lib/types";
import { ResultRadar } from "@/app/test/_shared/ResultCharts";

export type BigFiveResultPanelProps = {
  result: BigFiveSessionFinishResponse | null;
  loading?: boolean;
};

const DIM_MAX: Record<keyof BigFiveScores, number> = { O: 95, C: 75, E: 70, A: 70, N: 60 };

const DIMENSIONS: { key: keyof BigFiveScores; label: string; emoji: string; color: string; matchName: RegExp }[] = [
  { key: "O", label: "Открытость", emoji: "🌟", color: "#6366f1", matchName: /Openness/i },
  { key: "C", label: "Добросовестность", emoji: "🎯", color: "#22c55e", matchName: /Conscientiousness/i },
  { key: "E", label: "Экстраверсия", emoji: "⚡", color: "#f59e0b", matchName: /Extraversion/i },
  { key: "A", label: "Доброжелательность", emoji: "🤝", color: "#06b6d4", matchName: /Agreeableness/i },
  { key: "N", label: "Нейротизм", emoji: "🌀", color: "#ef4444", matchName: /Neuroticism/i },
];

// Per guide: percents are pre-computed by backend and embedded in `summary`.
function parsePercentsFromSummary(summary: string | undefined): Partial<Record<keyof BigFiveScores, number>> {
  if (!summary) return {};
  const out: Partial<Record<keyof BigFiveScores, number>> = {};
  for (const d of DIMENSIONS) {
    const re = new RegExp(`${d.matchName.source}[^0-9]{0,30}(\\d{1,3})\\s*%`, "i");
    const m = summary.match(re);
    if (m?.[1]) out[d.key] = Number(m[1]);
  }
  return out;
}

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export function BigFiveResultPanel({ result, loading = false }: BigFiveResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">
          Пройдите тест Big Five, чтобы увидеть ваш OCEAN-профиль.
        </Typography>
      </Paper>
    );
  }

  const scores = result.scores;
  // Prefer percents pre-computed by the backend (embedded in summary), fallback to raw / DIM_MAX.
  const parsedPercents = parsePercentsFromSummary(result.summary ?? undefined);
  const getPct = (key: keyof BigFiveScores): number => {
    const fromSummary = parsedPercents[key];
    if (typeof fromSummary === "number") return fromSummary;
    return Math.round(((scores[key] ?? 0) / DIM_MAX[key]) * 100);
  };

  const radarData = DIMENSIONS.map(({ key, label }) => ({
    label,
    value: getPct(key),
  }));

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {result.test_title}
        </Typography>
        <Chip label="OCEAN" color="primary" size="small" sx={{ fontWeight: 800, letterSpacing: 1, flexShrink: 0 }} />
      </Box>
      {result.primary_type && (
        <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
          {result.primary_type}
        </Typography>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center", mb: 2 }}>
        <ResultRadar data={radarData} domainMax={100} color="#6366f1" fill="rgba(99,102,241,0.22)" />

        <Box sx={{ display: "grid", gap: 1.5 }}>
          {DIMENSIONS.map(({ key, label, emoji, color }) => {
            const pct = getPct(key);
            return (
              <Box key={key}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {emoji} {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {pct}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 8, borderRadius: 999, bgcolor: "grey.100",
                    "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: color },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {result.summary && (
        <Box
          sx={{
            bgcolor: "rgba(99,102,241,0.04)", borderRadius: 2, p: 2,
            border: "1px solid rgba(99,102,241,0.12)",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>📝 Ваш профиль</Typography>
          {result.summary
            .split("\n")
            .filter((line) => line.trim())
            .map((line, i) => (
              <Typography
                key={i}
                variant="body2"
                color={line.includes(":") && !line.startsWith("Ваш") ? "text.primary" : "text.secondary"}
                sx={{
                  fontWeight: line.includes(":") && !line.startsWith("Ваш") ? 600 : 400,
                  mt: line.includes(":") && !line.startsWith("Ваш") ? 1 : 0,
                }}
              >
                {line.trim()}
              </Typography>
            ))}
        </Box>
      )}
    </Paper>
  );
}
