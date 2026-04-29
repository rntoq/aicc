"use client";

import { Box, Chip, Divider, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

type GenericResult = {
  test_title?: string;
  test_type?: string;
  primary_type?: string;
  secondary_type?: string;
  summary?: string | null;
  detailed_report?: string | null;
  scores?: unknown;
};

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

/**
 * Universal fallback renderer per guide:
 * - test_title
 * - primary_type, secondary_type
 * - summary
 * - flat scores OR nested scores (handles `{interests, personality}` shape)
 */
export function GenericResultPanel({ result }: { result: GenericResult | null }) {
  const t = useTranslations();
  if (!result) {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Typography variant="body2" color="text.secondary">{t("dialog_holland_empty")}</Typography>
      </Paper>
    );
  }

  const scores = result.scores;
  const hasScores = scores && typeof scores === "object";
  const scoreEntries: Array<{ section: string | null; key: string; value: number }> = [];

  if (hasScores) {
    const obj = scores as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "number") {
        scoreEntries.push({ section: null, key: k, value: v });
      } else if (v && typeof v === "object") {
        for (const [nk, nv] of Object.entries(v as Record<string, unknown>)) {
          if (typeof nv === "number") scoreEntries.push({ section: k, key: nk, value: nv });
        }
      }
    }
  }

  return (
    <Paper elevation={0} sx={paperSx}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        {result.test_title ?? "Test result"}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
        {result.primary_type && <Chip label={result.primary_type} color="primary" size="small" sx={{ fontWeight: 700 }} />}
        {result.secondary_type && <Chip label={result.secondary_type} size="small" variant="outlined" />}
      </Box>

      {scoreEntries.length > 0 && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, gap: 1, mb: 2 }}>
          {scoreEntries.map(({ section, key, value }, i) => (
            <Box
              key={`${section ?? ""}-${key}-${i}`}
              sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
                {section ? `${section} · ${key}` : key}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {result.summary && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            📋 {t("common_summary")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
            {result.summary}
          </Typography>
        </>
      )}

      {result.detailed_report && result.detailed_report !== result.summary && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            📊 {t("common_detailedReport")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
            {result.detailed_report}
          </Typography>
        </>
      )}
    </Paper>
  );
}
