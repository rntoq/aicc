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

export interface CareerResultDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CareerResultDialog = ({ open, onClose }: CareerResultDialogProps) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("tests_career-aptitude_name")}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            Спасибо, что прошли тест.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            По документации этот тест состоит из 2 частей: интересы (54 вопроса, шкала 1–3)
            и личность (20 вопросов в нашем JSON, шкала 1–5). Позже мы добавим расчёт
            RIASEC + Big Five и покажем топ‑профессии.
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
