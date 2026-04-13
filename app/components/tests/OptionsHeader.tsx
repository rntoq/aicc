"use client";

import { Box, Typography } from "@mui/material";
import { useLocale } from "next-intl";
import { pickLocalizedString, type LikertWordScaleOptions } from "@/app/components/tests/RadioQuestionCard";

export interface OptionsHeaderProps {
  options: LikertWordScaleOptions;
}

export const OptionsHeader = ({ options }: OptionsHeaderProps) => {
  const locale = useLocale();
  const labels = options.map((o) => pickLocalizedString(String(locale), o));
  const last = labels.length - 1;

  return (
    <Box sx={styles.row}>
      {labels.map((label, idx) => (
        <Typography
          key={idx}
          variant="caption"
          sx={[
            styles.caption,
            idx === 0 ? styles.alignLeft : idx === last ? styles.alignRight : styles.alignCenter,
          ]}
        >
          {label}
        </Typography>
      ))}
    </Box>
  );
};

const styles = {
  alignLeft: { textAlign: "left" as const },
  alignCenter: { textAlign: "center" as const },
  alignRight: { textAlign: "right" as const },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    mx: 10,
    mt: 2,
    px: 1,
    py: 0.5,
    border: "1px solid",
    borderColor: "primary.main",
    borderRadius: 2,
  },
  caption: {
    color: "primary.light",
    fontWeight: 700,
    flex: 1,
    whiteSpace: "nowrap",
  },
};
