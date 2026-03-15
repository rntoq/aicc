"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export interface PhotoResultDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PhotoResultDialog = ({ open, onClose }: PhotoResultDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Результат фото‑теста</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Спасибо, что прошли тест.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Здесь позже появится подробная интерпретация ваших ответов после интеграции с
            backend. Сейчас это базовый шаблон результата без расчёта.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

