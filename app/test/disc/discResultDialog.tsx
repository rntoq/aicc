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

type DiscLetter = "D" | "I" | "S" | "C";

type DiscLocalResult = QuizResult & {
  disc_code?: string;
  disc_primary?: DiscLetter;
};

export interface DiscResultDialogProps {
  open: boolean;
  onClose: () => void;
  result: DiscLocalResult | null;
  loading?: boolean;
}

const TYPE_LABELS: Record<DiscLetter, { ru: string; kk: string; en: string; tagline: string }> = {
  D: { ru: "Доминирование (D)", kk: "Басымдық (D)", en: "Drive (D)", tagline: "Drive — про результаты и решения" },
  I: { ru: "Влияние (I)", kk: "Ықпал (I)", en: "Influence (I)", tagline: "Influence — про коммуникацию и вдохновение" },
  S: { ru: "Стабильность (S)", kk: "Тұрақтылық (S)", en: "Support (S)", tagline: "Support — про команду и терпение" },
  C: { ru: "Соответствие (C)", kk: "Сәйкестік (C)", en: "Clarity (C)", tagline: "Clarity — про точность и качество" },
};

const formatPercent = (v: unknown): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

export default function DiscResultDialog({
  open,
  onClose,
  result,
  loading = false,
}: DiscResultDialogProps) {
  const locale = useLocale() as "ru" | "kk" | "en";

  if (loading || !result) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle>DISC</DialogTitle>
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

  const scores = (result.scores ?? {}) as Partial<Record<DiscLetter, number>>;
  const primary = (result.disc_primary ?? result.primary_type ?? "") as DiscLetter;
  const code = result.disc_code ?? "";

  const primaryType = primary && TYPE_LABELS[primary] ? TYPE_LABELS[primary] : null;

  const order: DiscLetter[] = ["D", "I", "S", "C"];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {result.test_title ?? "DISC Assessment"}
          </Typography>
          {code ? (
            <Chip
              label={code}
              color="primary"
              size="small"
              sx={{ fontWeight: 900, letterSpacing: 1 }}
            />
          ) : null}
        </Box>
        {primaryType ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {primaryType[locale]} — {primaryType.tagline}
          </Typography>
        ) : null}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {order.map((k) => {
            const v = formatPercent(scores[k] ?? 0);
            return (
              <Box key={k}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {TYPE_LABELS[k][locale]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 900 }}>
                    {v}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={v}
                  sx={{
                    height: 8,
                    borderRadius: 2,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 2,
                      background: "linear-gradient(90deg, #7C3AED, #10B981)",
                    },
                  }}
                />
              </Box>
            );
          })}

          {result.summary ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
                {locale === "en" ? "Interpretation" : locale === "kk" ? "Түсіндірме" : "Интерпретация"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {result.summary}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {locale === "en" ? "Close" : locale === "kk" ? "Жабу" : "Закрыть"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

