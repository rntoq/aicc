"use client";

import { Box, Typography } from "@mui/material";

export interface OptionsHeaderProps {
  /** Подписи для шкалы (слева направо). Уже локализованные строки (обычно 3 или 5). */
  options: string[];
}

export const OptionsHeader = ({ options }: OptionsHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        gap: 2,
        py: 1,
        mx: "auto",
      }}
    >
      {options.map((label, idx) => (
        <Typography
          key={idx}
          variant="caption"
          sx={{
            flex: 1,
            textAlign: idx === 0 ? "left" : idx === options.length - 1 ? "right" : "center",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      ))}
    </Box>
  );
};

