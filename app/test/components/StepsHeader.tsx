"use client";

import { Box, Typography } from "@mui/material";

export interface StepsHeaderProps {
  /** Текущий шаг (1‑based) */
  step: number;
  /** Общее количество шагов */
  total: number;
  /** Заголовок блока (опционально) */
  title?: string;
  /** Подзаголовок / описание (опционально) */
  subtitle?: string;
  /** Переопределяет подпись «Шаг X из Y» (уже локализованная строка) */
  stepLabel?: string;
}

export const StepsHeader = ({
  step,
  total,
  title,
  subtitle,
  stepLabel,
}: StepsHeaderProps) => {
  const safeStep = Math.min(Math.max(step, 1), total);

  return (
    <Box sx={{textAlign: "center" }}>
      {title && (
        <Typography component="h2" variant="h2" sx={{ mb: 0.5, fontSize: "1.25rem", fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}

      <Box >
        <Typography variant="caption" color="text.secondary">
          {stepLabel ?? `Шаг ${safeStep} из ${total}`}
        </Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 0.75 }}>
          {Array.from({ length: total }).map((_, i) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                bgcolor: i < safeStep ? "primary.main" : "grey.300",
                opacity: i < safeStep ? 1 : 0.6,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

