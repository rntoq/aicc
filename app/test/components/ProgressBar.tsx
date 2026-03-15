"use client";

import { Box, LinearProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export interface ProgressBarProps {
  progress: number; // 0-100
  current: number;
  total: number;
}

export const ProgressBar = ({ progress, current, total }: ProgressBarProps) => {
  const t = useTranslations();
  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="body2" color="text.secondary">
          {t("progress")}: {current} / {total}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {progress}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={styles.progress}
      />
    </Box>
  );
};

const styles = {
  container: {
    mb: 3,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1,
  },
  progress: {
    height: 8,
    borderRadius: 1,
    bgcolor: "grey.200",
    "& .MuiLinearProgress-bar": {
      borderRadius: 1,
      background: "linear-gradient(90deg, #1E3A8A, #10B981)",
    },
  },
};
