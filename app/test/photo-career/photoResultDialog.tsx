"use client";

import { Box, Chip, CircularProgress, Divider, LinearProgress, Paper, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";

export type PhotoResultPanelProps = {
  result: QuizResult | null;
  loading?: boolean;
};

type RIASECKey = "R" | "I" | "A" | "S" | "E" | "C";

const SCALE_TO_RIASEC: Record<string, RIASECKey> = {
  Building: "R",
  Thinking: "I",
  Creating: "A",
  Helping: "S",
  Persuading: "E",
  Organizing: "C",
};

const SCALE_LABELS: Record<string, Record<string, string>> = {
  Building: { ru: "Физический труд", kk: "Физикалық еңбек", en: "Building" },
  Thinking: { ru: "Аналитика и наука", kk: "Аналитика", en: "Thinking" },
  Creating: { ru: "Творчество", kk: "Шығармашылық", en: "Creating" },
  Helping: { ru: "Помощь людям", kk: "Адамдарға көмек", en: "Helping" },
  Persuading: { ru: "Переговоры", kk: "Келіссөздер", en: "Persuading" },
  Organizing: { ru: "Организация и данные", kk: "Ұйымдастыру", en: "Organizing" },
  R: { ru: "Физический труд", kk: "Физикалық еңбек", en: "Building" },
  I: { ru: "Аналитика и наука", kk: "Аналитика", en: "Thinking" },
  A: { ru: "Творчество", kk: "Шығармашылық", en: "Creating" },
  S: { ru: "Помощь людям", kk: "Адамдарға көмек", en: "Helping" },
  E: { ru: "Переговоры", kk: "Келіссөздер", en: "Persuading" },
  C: { ru: "Организация и данные", kk: "Ұйымдастыру", en: "Organizing" },
};

function toRelativePercents(raw: Record<string, unknown>): { key: string; letter: RIASECKey; pct: number }[] {
  const entries = Object.entries(raw).map(([k, v]) => ({
    key: k,
    letter: (SCALE_TO_RIASEC[k] ?? k) as RIASECKey,
    raw: typeof v === "number" ? v : Number(v) || 0,
  }));

  const total = entries.reduce((s, e) => s + e.raw, 0);
  if (total <= 0) return entries.map((e) => ({ ...e, pct: 0 }));

  const max = Math.max(...entries.map((e) => e.raw));
  const isRawCount = max <= 30;

  return entries
    .map((e) => ({
      key: e.key,
      letter: e.letter,
      pct: isRawCount ? Math.round((e.raw / total) * 100) : Math.round(Math.min(100, Math.max(0, e.raw))),
    }))
    .sort((a, b) => b.pct - a.pct);
}

const paperSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

export function PhotoResultPanel({ result, loading = false }: PhotoResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">
          Photo Career Quiz
        </Typography>
      </Paper>
    );
  }

  const rawScores = (result.scores ?? {}) as Record<string, unknown>;
  const scoreRows = toRelativePercents(rawScores);
  const top3Letters = scoreRows.slice(0, 3).map((r) => r.letter).join("");
  const primaryType = result.primary_type ?? null;
  const secondaryType =
    typeof (result as unknown as Record<string, unknown>)?.["secondary_type"] === "string"
      ? ((result as unknown as Record<string, unknown>)["secondary_type"] as string)
      : null;
  const summary = result.summary ?? null;
  const detailed = result.detailed_report ?? null;

  const getLabel = (key: string) => SCALE_LABELS[key]?.[locale] ?? SCALE_LABELS[key]?.ru ?? key;

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {result.test_title ?? "Photo Career Quiz"}
          </Typography>
          {top3Letters ? (
            <Chip label={top3Letters} color="primary" size="small" sx={{ fontWeight: 800, letterSpacing: 2, flexShrink: 0 }} />
          ) : null}
        </Box>
        {primaryType ? (
          <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", mt: 0.25 }}>
            {primaryType}
          </Typography>
        ) : null}
        {secondaryType ? (
          <Typography variant="caption" color="text.secondary">
            {secondaryType}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {scoreRows.length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              {t("photo_by_direction")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {scoreRows.map(({ key, pct }, i) => (
                <Box key={key}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                    <Typography variant="body2" sx={{ fontWeight: i < 3 ? 700 : 500 }}>
                      {getLabel(key)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                      {pct}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background:
                          i === 0
                            ? "linear-gradient(90deg, #6366f1, #10b981)"
                            : i === 1
                              ? "linear-gradient(90deg, #7c3aed, #06b6d4)"
                              : "linear-gradient(90deg, #1E3A8A, #10B981)",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {summary ? (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
                {t("common_summary")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {summary}
              </Typography>
            </Box>
          </>
        ) : null}

        {detailed && detailed !== summary ? (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
                {t("common_detailedReport")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {detailed}
              </Typography>
            </Box>
          </>
        ) : null}
      </Box>
    </Paper>
  );
}
