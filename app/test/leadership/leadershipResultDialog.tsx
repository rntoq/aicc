"use client";

import { Box, Chip, CircularProgress, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale } from "next-intl";
import type { QuizResult } from "@/lib/types";

export type LeadershipLocalResult = QuizResult & {
  test_title?: string;
  dimension_scores?: {
    openness?: number;
    conscientiousness?: number;
    agreeableness?: number;
  };
  leadership_type?: {
    code?: string;
    name?: string;
    tagline?: string;
  } | null;
};

export type LeadershipResultPanelProps = {
  result: LeadershipLocalResult | null;
  loading?: boolean;
};

const dimensionLabels: Record<string, { ru: string; kk: string; en: string }> = {
  openness: { ru: "Открытость", kk: "Ашықтық", en: "Openness" },
  conscientiousness: { ru: "Добросовестность", kk: "Ұқыптылық", en: "Conscientiousness" },
  agreeableness: { ru: "Доброжелательность", kk: "Келісімшілдік", en: "Agreeableness" },
};

type DimRow = { key: string; label: string; value: number; display: string };

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export default function LeadershipResultPanel({ result, loading = false }: LeadershipResultPanelProps) {
  const locale = useLocale() as "ru" | "kk" | "en";

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
          Leadership
        </Typography>
      </Paper>
    );
  }

  const r = result as unknown as Record<string, unknown>;
  const testTitle =
    typeof r["test_title"] === "string" ? r["test_title"] : "Leadership Style Assessment";
  const localType = result.leadership_type ?? null;
  const primaryLabel =
    (typeof r["primary_type"] === "string" && r["primary_type"] !== "" ? r["primary_type"] : null) ??
    localType?.name ??
    null;
  const tagline = localType?.tagline ?? null;
  const summary =
    typeof r["summary"] === "string" && r["summary"] !== ""
      ? r["summary"]
      : typeof r["detailed_report"] === "string" && r["detailed_report"] !== ""
        ? r["detailed_report"]
        : null;

  const backendScores = r["scores"];
  const isBackendFormat =
    backendScores &&
    typeof backendScores === "object" &&
    ("O" in (backendScores as object) || "C" in (backendScores as object) || "A" in (backendScores as object));

  const dims: DimRow[] = [];
  if (isBackendFormat) {
    const s = backendScores as Record<string, unknown>;
    const pairs: Array<{ backendKey: string; localKey: string }> = [
      { backendKey: "O", localKey: "openness" },
      { backendKey: "C", localKey: "conscientiousness" },
      { backendKey: "A", localKey: "agreeableness" },
    ];
    for (const { backendKey, localKey } of pairs) {
      const raw = typeof s[backendKey] === "number" ? (s[backendKey] as number) : 0;
      const pct = Math.max(0, Math.min(100, Math.round(((raw - 1) / 4) * 100)));
      dims.push({
        key: localKey,
        label: dimensionLabels[localKey][locale],
        value: pct,
        display: `${raw.toFixed(1)} / 5`,
      });
    }
  } else {
    const localScores = result.dimension_scores ?? {};
    const toPercent = (score: number) => {
      const v = ((score - -16) / 32) * 100;
      return Math.max(0, Math.min(100, Math.round(v)));
    };
    for (const k of ["openness", "conscientiousness", "agreeableness"] as const) {
      const raw = localScores[k] ?? 0;
      const pct = toPercent(raw);
      dims.push({
        key: k,
        label: dimensionLabels[k][locale],
        value: pct,
        display: `${pct}%`,
      });
    }
  }

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, flex: 1 }}>
          {testTitle}
        </Typography>
      </Box>
      {primaryLabel ? (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={primaryLabel}
            color="primary"
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.8rem", height: "auto", py: 0.5 }}
          />
          {tagline ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {tagline}
            </Typography>
          ) : null}
        </Box>
      ) : null}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: summary ? 2.5 : 0 }}>
        {dims.map((d) => (
          <Box key={d.key}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {d.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 900 }}>
                {d.display}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={d.value}
              sx={{
                height: 8,
                borderRadius: 2,
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #7c3aed, #10b981)",
                },
              }}
            />
          </Box>
        ))}
      </Box>

      {summary ? (
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
          {summary}
        </Typography>
      ) : null}
    </Paper>
  );
}
