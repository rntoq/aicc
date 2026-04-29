"use client";

import { Box, Chip, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { QuizResult } from "@/lib/types";

export type TypeFinderResultPanelProps = { result: QuizResult | null; loading?: boolean };

type MBTIScores = Partial<Record<"E" | "I" | "S" | "N" | "T" | "F" | "J" | "P", number>>;

type Pair = { left: "E" | "S" | "T" | "J"; right: "I" | "N" | "F" | "P"; leftLabel: string; rightLabel: string; emoji: string };

const PAIRS: Pair[] = [
  { left: "E", right: "I", leftLabel: "Extraversion", rightLabel: "Introversion", emoji: "⚡" },
  { left: "S", right: "N", leftLabel: "Sensing", rightLabel: "iNtuition", emoji: "🔍" },
  { left: "T", right: "F", leftLabel: "Thinking", rightLabel: "Feeling", emoji: "💭" },
  { left: "J", right: "P", leftLabel: "Judging", rightLabel: "Perceiving", emoji: "🎯" },
];

const paperSx = { p: { xs: 2, md: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" };

export default function TypeFinderResultPanel({ result, loading = false }: TypeFinderResultPanelProps) {
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
        <Typography variant="body2" color="text.secondary">TypeFinder (16 personalities)</Typography>
      </Paper>
    );
  }

  const r = result as unknown as Record<string, unknown>;
  const title = typeof r["test_title"] === "string" ? r["test_title"] : "Myers-Briggs Type Indicator";
  const primaryRaw = r["primary_type"] != null ? String(r["primary_type"]) : "";
  const summary = typeof r["summary"] === "string" ? r["summary"] : "";
  const rawScores = (r["scores"] ?? {}) as MBTIScores;

  // Per guide: extract 4-letter code via regex from primary_type ("ENFJ — Протагонист...")
  const mbtiCode = primaryRaw.match(/\b[EI][NS][TF][JP]\b/)?.[0] ?? primaryRaw.slice(0, 4);
  const personalityName = primaryRaw.replace(mbtiCode, "").replace(/^[\s—–-]+/, "").trim();

  // Edge case (per guide): older sessions may return scores: {} while primary_type is set.
  // In that case derive 100% bias toward each letter present in the MBTI code.
  const scoresEmpty = !rawScores || Object.keys(rawScores).length === 0;
  const scores: MBTIScores = scoresEmpty && mbtiCode.length === 4
    ? {
        E: mbtiCode[0] === "E" ? 1 : 0,
        I: mbtiCode[0] === "I" ? 1 : 0,
        S: mbtiCode[1] === "S" ? 1 : 0,
        N: mbtiCode[1] === "N" ? 1 : 0,
        T: mbtiCode[2] === "T" ? 1 : 0,
        F: mbtiCode[2] === "F" ? 1 : 0,
        J: mbtiCode[3] === "J" ? 1 : 0,
        P: mbtiCode[3] === "P" ? 1 : 0,
      }
    : rawScores;

  return (
    <Paper elevation={0} sx={paperSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          {title}
        </Typography>
        {mbtiCode && (
          <Chip
            label={mbtiCode}
            color="primary"
            sx={{ fontWeight: 900, fontSize: "0.95rem", letterSpacing: 2, flexShrink: 0, height: 32 }}
          />
        )}
      </Box>

      {personalityName && (
        <Box
          sx={{
            p: 2, borderRadius: 2, mb: 2,
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.08) 100%)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "primary.dark" }}>
            ✨ {personalityName}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: summary ? 2 : 0 }}>
        {PAIRS.map(({ left, right, leftLabel, rightLabel, emoji }) => {
          const leftRaw = scores[left] ?? 0;
          const rightRaw = scores[right] ?? 0;
          const sum = leftRaw + rightRaw;
          const leftPct = sum > 0 ? Math.round((leftRaw / sum) * 100) : 50;
          const rightPct = 100 - leftPct;
          const dominant = leftPct >= rightPct ? "left" : "right";

          return (
            <Box key={left + right}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: dominant === "left" ? 800 : 500,
                    color: dominant === "left" ? "primary.main" : "text.secondary",
                  }}
                >
                  {emoji} {left} · {leftLabel}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: dominant === "right" ? 800 : 500,
                    color: dominant === "right" ? "secondary.main" : "text.secondary",
                  }}
                >
                  {right} · {rightLabel} {emoji}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex", height: 14, borderRadius: 999, overflow: "hidden",
                  border: "1px solid rgba(148,163,184,0.2)", bgcolor: "grey.100",
                }}
              >
                <Box
                  sx={{
                    width: `${leftPct}%`,
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "flex-start",
                    pl: leftPct > 15 ? 1 : 0, color: "white", fontSize: 11, fontWeight: 800,
                  }}
                >
                  {leftPct > 15 ? `${leftPct}%` : ""}
                </Box>
                <Box
                  sx={{
                    width: `${rightPct}%`,
                    background: "linear-gradient(90deg, #ec4899, #f43f5e)",
                    display: "flex", alignItems: "center", justifyContent: "flex-end",
                    pr: rightPct > 15 ? 1 : 0, color: "white", fontSize: 11, fontWeight: 800,
                  }}
                >
                  {rightPct > 15 ? `${rightPct}%` : ""}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
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
