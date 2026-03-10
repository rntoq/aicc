"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import type { HollandSessionFinishResponse, HollandScores } from "@/lib/types";

export type HollandResultDialogProps = {
  open: boolean;
  onClose: () => void;
  /**
   * Результат, вернувшийся с бэкенда после
   * POST /api/v1/quizzes/sessions/finish/
   */
  result: HollandSessionFinishResponse | null;
};

const CATEGORY_LABELS: Record<keyof HollandScores, string> = {
  R: "Реалистичный (R)",
  I: "Исследовательский (I)",
  A: "Артистичный (A)",
  S: "Социальный (S)",
  E: "Предприимчивый (E)",
  C: "Конвенциональный (C)",
};

export const HollandResultDialog = ({
  open,
  onClose,
  result,
}: HollandResultDialogProps) => {
  if (!result) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Результат Holland ещё недоступен</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Пройдите тест Holland, чтобы увидеть ваш RIASEC‑профиль.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const scores: HollandScores = result.scores;
  const entries = Object.entries(scores) as [keyof HollandScores, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const codeLetters = sorted.slice(0, 3).map(([k]) => k).join("");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{result.test_title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Ваш Holland‑код: {codeLetters}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {result.primary_type}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gap: 1.5 }}>
          {sorted.map(([key, value]) => (
            <Box key={key}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {CATEGORY_LABELS[key]} — {value}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, value)}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {result.summary && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Краткий вывод
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {result.summary}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

