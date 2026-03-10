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
import { useTranslations } from "next-intl";

export interface BigFiveResultDialogProps {
  open: boolean;
  onClose: () => void;
}

export const BigFiveResultDialog = ({
  open,
  onClose,
}: BigFiveResultDialogProps) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("tests_big-five_name")}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Big Five результат пока считается только на фронтенде.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Позже здесь будет полноценный отчёт по пяти шкалам OCEAN
            (Открытость, Добросовестность, Экстраверсия, Доброжелательность,
            Нейротизм) и карьерные рекомендации после интеграции с backend.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

