"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { ResultRadar } from "@/app/test/_shared/ResultCharts";

export type CareerInterestScores = { R?: number; I?: number; A?: number; S?: number; E?: number; C?: number };
export type CareerPersonalityScores = { O?: number; C?: number; E?: number; A?: number; N?: number };

export type CareerAptitudeResult = {
  id?: number;
  test_type?: string;
  test_title?: string;
  primary_type?: string;
  secondary_type?: string;
  summary?: string | null;
  detailed_report?: string | null;
  holland_code?: string;
  scores?: (CareerInterestScores & CareerPersonalityScores) | {
    interests?: CareerInterestScores;
    personality?: CareerPersonalityScores;
  };
  interest_scores?: CareerInterestScores;
  personality_scores?: CareerPersonalityScores;
  created_at?: string;
};

export type CareerResultPanelProps = { result: CareerAptitudeResult | null; loading?: boolean };

const INTEREST_LABELS: Record<string, { ru: string; kk: string; en: string; icon: string }> = {
  R: { ru: "Строительство", kk: "Құрылыс", en: "Building", icon: "🏗️" },
  I: { ru: "Аналитика", kk: "Аналитика", en: "Thinking", icon: "🔬" },
  A: { ru: "Творчество", kk: "Шығармашылық", en: "Creating", icon: "🎨" },
  S: { ru: "Помощь", kk: "Көмек", en: "Helping", icon: "🤝" },
  E: { ru: "Предпринимательство", kk: "Кәсіпкерлік", en: "Persuading", icon: "💼" },
  C: { ru: "Организация", kk: "Ұйымдастыру", en: "Organizing", icon: "📊" },
};

const PERSONALITY_LABELS: Record<string, { ru: string; kk: string; en: string }> = {
  O: { ru: "Открытость", kk: "Ашықтық", en: "Openness" },
  C: { ru: "Добросовестность", kk: "Жауапкершілік", en: "Conscientiousness" },
  E: { ru: "Экстраверсия", kk: "Экстраверсия", en: "Extraversion" },
  A: { ru: "Доброжелательность", kk: "Жақсылық", en: "Agreeableness" },
  N: { ru: "Нейротизм", kk: "Нейротизм", en: "Neuroticism" },
};

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

function getScoreColor(score: number, max: number): "error" | "warning" | "success" {
  const pct = (score / max) * 100;
  if (pct >= 65) return "success";
  if (pct >= 40) return "warning";
  return "error";
}

export function CareerResultPanel({ result, loading = false }: CareerResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">{t("dialog_career_empty")}</Typography>
      </Paper>
    );
  }

  // Parse scores: support both nested {interests:{}, personality:{}} and flat formats
  const rawScores = result.scores ?? {};
  const nested = rawScores as { interests?: CareerInterestScores; personality?: CareerPersonalityScores };
  const flat = rawScores as CareerInterestScores & CareerPersonalityScores;

  const interestScores: Record<string, number> = {};
  const personalityScores: Record<string, number> = {};

  // Take only finite numeric values — guards against `NaN` produced by
  // local fallback scoring (division by zero) or malformed backend data.
  const pickNumber = (...candidates: Array<unknown>): number | null => {
    for (const c of candidates) {
      if (typeof c === "number" && Number.isFinite(c)) return c;
    }
    return null;
  };

  for (const k of ["R", "I", "A", "S", "E", "C"] as const) {
    const v = pickNumber(result.interest_scores?.[k], nested.interests?.[k], flat[k]);
    if (v != null) interestScores[k] = v;
  }
  for (const k of ["O", "C", "E", "A", "N"] as const) {
    const v = pickNumber(result.personality_scores?.[k], nested.personality?.[k], flat[k]);
    if (v != null) personalityScores[k] = v;
  }

  const hasInterests = Object.keys(interestScores).length > 0;
  const hasPersonality = Object.keys(personalityScores).length > 0;
  const interestMax = Math.max(...Object.values(interestScores), 1);
  const personalityMax = Math.max(...Object.values(personalityScores), 1);
  const sortedInterests = Object.entries(interestScores).sort(([, a], [, b]) => b - a);

  // Per guide: build Holland code from top-3 of `interests` (not from text).
  // Backend's primary_type already contains it (e.g. "Интересы: ECR").
  const computedCode = sortedInterests.slice(0, 3).map(([k]) => k).join("");
  const hollandCode = result.holland_code ?? computedCode;
  // Avoid showing duplicate chips: prefer backend's primary_type when present.
  const showPrimaryAsChip = !!result.primary_type;

  const interestRadar = ["R", "I", "A", "S", "E", "C"].map((k) => ({ label: k, value: interestScores[k] ?? 0 }));
  const personalityRadar = ["O", "C", "E", "A", "N"].map((k) => ({ label: k, value: personalityScores[k] ?? 0 }));

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {result.test_title ?? "Career Aptitude Test"}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap", alignItems: "center" }}>
          {showPrimaryAsChip
            ? <Chip label={result.primary_type} color="primary" size="small" sx={{ fontWeight: 700, letterSpacing: 1 }} />
            : hollandCode
              ? <Chip label={hollandCode} color="primary" size="small" sx={{ fontWeight: 700, letterSpacing: 2 }} />
              : null}
        </Box>
      </Box>

      {hasInterests && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            🎯 {t("career_interest_profile")}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center" }}>
            <ResultRadar data={interestRadar} domainMax={interestMax} color="#6366f1" fill="rgba(99,102,241,0.22)" />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {sortedInterests.map(([key, score], idx) => {
                const info = INTEREST_LABELS[key];
                const label = info?.[locale] ?? key;
                const pct = Math.round((score / interestMax) * 100);
                return (
                  <Box key={key}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.4, gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: idx < 3 ? 700 : 500 }}>
                          {info?.icon} {label}
                        </Typography>
                        {idx < 3 && <Chip label="TOP" size="small" color="primary" sx={{ height: 16, fontSize: "0.6rem", "& .MuiChip-label": { px: 0.6 } }} />}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, flexShrink: 0 }}>{score}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      color={getScoreColor(score, interestMax)}
                      sx={{ height: 7, borderRadius: 999, bgcolor: "grey.100" }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}

      {hasPersonality && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                🧬 {t("career_personality_traits")}
              </Typography>
              {result.secondary_type && (
                <Chip label={result.secondary_type} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              )}
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, alignItems: "center" }}>
              <ResultRadar data={personalityRadar} domainMax={personalityMax} color="#a855f7" fill="rgba(168,85,247,0.22)" />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {Object.entries(personalityScores).map(([key, score]) => {
                  const info = PERSONALITY_LABELS[key];
                  const pct = Math.round((score / personalityMax) * 100);
                  return (
                    <Box key={key}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {key} — {info?.[locale] ?? key}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{score}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 7, borderRadius: 999, bgcolor: "grey.100",
                          "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#a855f7,#06b6d4)", borderRadius: 999 },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </>
      )}

      {result.summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
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
