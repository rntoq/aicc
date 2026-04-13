"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export interface StepsHeaderProps {
  step: number;
  total: number;
  title?: string;
  subtitle?: string;
  stepLabel?: string;
}

export const StepsHeader = ({ step, total, title, subtitle, stepLabel }: StepsHeaderProps) => {
  const t = useTranslations();
  const safeStep = Math.min(Math.max(step, 1), total);
  const defaultLabel = t("step_x_of_y", { step: safeStep, total });

  return (
    <Box sx={styles.wrap}>
      {title ? (
        <Typography component="h2" variant="h2" sx={styles.title}>
          {title}
        </Typography>
      ) : null}
      {subtitle ? (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {stepLabel ?? defaultLabel}
        </Typography>
        <Box sx={styles.segmentsRow}>
          {Array.from({ length: total }).map((_, i) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              sx={[
                styles.segment,
                i < safeStep ? styles.segmentActive : styles.segmentInactive,
              ]}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  wrap: {
    textAlign: "center" as const,
  },
  title: {
    mb: 0.5,
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  segmentsRow: {
    mt: 1,
    display: "flex",
    gap: 0.75,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },
  segmentActive: {
    bgcolor: "primary.main",
    opacity: 1,
  },
  segmentInactive: {
    bgcolor: "grey.300",
    opacity: 0.6,
  },
};
