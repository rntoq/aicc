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
import type { BigFiveScores, BigFiveSessionFinishResponse } from "@/lib/types";

export type BigFiveResultDialogProps = {
  open: boolean;
  onClose: () => void;
  result: BigFiveSessionFinishResponse | null;
  loading?: boolean;
};

const DIMENSIONS: { key: keyof BigFiveScores; label: string; color: string }[] = [
  { key: "O", label: "Открытость (O)", color: "#6366f1" },
  { key: "C", label: "Добросовестность (C)", color: "#22c55e" },
  { key: "E", label: "Экстраверсия (E)", color: "#f59e0b" },
  { key: "A", label: "Доброжелательность (A)", color: "#06b6d4" },
  { key: "N", label: "Нейротизм (N)", color: "#ef4444" },
];

export const BigFiveResultDialog = ({
  open,
  onClose,
  result,
  loading = false,
}: BigFiveResultDialogProps) => {
  if (loading || !result) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Big Five (OCEAN)</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Пройдите тест Big Five, чтобы увидеть ваш OCEAN‑профиль.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const scores = result.scores;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {result.test_title}
        </Typography>
        {result.primary_type && (
          <Chip
            label={result.primary_type}
            size="small"
            color="primary"
            sx={{ mt: 0.75, fontWeight: 600 }}
          />
        )}
      </DialogTitle>

      <DialogContent dividers>
        {/* OCEAN score bars */}
        <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
          {DIMENSIONS.map(({ key, label, color }) => {
            const value = scores[key] ?? 0;
            return (
              <Box key={key}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {value}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(value, 100)}
                  sx={{
                    height: 10,
                    borderRadius: 2,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 2,
                      bgcolor: color,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Summary */}
        {result.summary && (
          <Box
            sx={{
              bgcolor: "grey.50",
              borderRadius: 2,
              p: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Ваш профиль
            </Typography>
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};
