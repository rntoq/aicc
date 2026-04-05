"use client";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useLocale } from "next-intl";
import type { QuizResult } from "@/lib/types";

export interface TypeFinderResultDialogProps {
  open: boolean;
  onClose: () => void;
  result: QuizResult | null;
  loading?: boolean;
}

export default function TypeFinderResultDialog({
  open,
  onClose,
  result,
  loading = false,
}: TypeFinderResultDialogProps) {
  const locale = useLocale() as "ru" | "kk" | "en";

  if (loading || !result) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle>TypeFinder</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const r = result as unknown as Record<string, unknown>;

  const testTitle = typeof r["test_title"] === "string" ? r["test_title"] : "TypeFinder (16 personalities)";

  const primaryTypeFull =
    typeof r["primary_type"] === "string" ? r["primary_type"] : null;

  // Extract the 4-letter MBTI code from the start of primary_type (e.g. "ENFJ — ...")
  const mbtiCodeMatch = primaryTypeFull?.match(/^([A-Z]{4})/);
  const code = mbtiCodeMatch ? mbtiCodeMatch[1] : null;

  // Full description shown as subtitle
  const primaryTypeLabel = primaryTypeFull ?? null;

  const summary = typeof r["summary"] === "string" ? r["summary"] : null;
  const detailedReport =
    typeof r["detailed_report"] === "string" ? r["detailed_report"] : null;

  const scoresRaw = r["scores"];
  const scores =
    scoresRaw && typeof scoresRaw === "object"
      ? (scoresRaw as Record<string, unknown>)
      : null;

  const getScore = (k: string): number => {
    if (!scores) return 0;
    const v = scores[k];
    return typeof v === "number" && Number.isFinite(v) ? v : 0;
  };

  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
  const pairToPct = (a: number, b: number): { aPct: number; bPct: number } => {
    const sum = a + b;
    if (!Number.isFinite(sum) || sum <= 0) return { aPct: 50, bPct: 50 };
    const aPct = Math.round(clamp01(a / sum) * 100);
    return { aPct, bPct: 100 - aPct };
  };

  const pairs = [
    { a: "E", b: "I", label: locale === "ru" ? "E / I" : locale === "kk" ? "E / I" : "E / I" },
    { a: "S", b: "N", label: locale === "ru" ? "S / N" : locale === "kk" ? "S / N" : "S / N" },
    { a: "T", b: "F", label: locale === "ru" ? "T / F" : locale === "kk" ? "T / F" : "T / F" },
    { a: "J", b: "P", label: locale === "ru" ? "J / P" : locale === "kk" ? "J / P" : "J / P" },
  ] as const;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {testTitle}
            </Typography>
            {code ? (
              <Chip
                label={code}
                color="primary"
                size="small"
                sx={{ fontWeight: 900, letterSpacing: 2, flexShrink: 0 }}
              />
            ) : null}
          </Box>
          {primaryTypeLabel ? (
            <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", mt: 0.25 }}>
              {primaryTypeLabel}
            </Typography>
          ) : null}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {scores ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
              {locale === "en"
                ? "Scores"
                : locale === "kk"
                  ? "Ұпайлар"
                  : "Баллы"}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {pairs.map(({ a, b, label }) => {
                const aScore = getScore(a);
                const bScore = getScore(b);
                const { aPct, bPct } = pairToPct(aScore, bScore);
                const dominant = aPct >= bPct ? a : b;

                return (
                  <Box key={`${a}-${b}`}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {dominant} · {aPct}% / {bPct}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
                          <Typography variant="caption" color="text.secondary">
                            {a}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(aScore)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={aPct}
                          sx={{ height: 8, borderRadius: 999 }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
                          <Typography variant="caption" color="text.secondary">
                            {b}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(bScore)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={bPct}
                          sx={{ height: 8, borderRadius: 999 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : null}

        {summary ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
              {locale === "kk" ? "Қорытынды" : locale === "en" ? "Summary" : "Краткий вывод"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {summary}
            </Typography>
          </Box>
        ) : null}

        {detailedReport && detailedReport !== summary ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
              {locale === "kk" ? "Толық есеп" : locale === "en" ? "Detailed Report" : "Подробный отчёт"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {detailedReport}
            </Typography>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          {locale === "en" ? "Close" : locale === "kk" ? "Жабу" : "Закрыть"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

