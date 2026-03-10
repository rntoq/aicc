"use client";

import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

export interface BigFiveQuestion {
  id: string;
  text: {
    ru: string;
    kk: string;
    en: string;
  };
}

interface QuestionRowProps {
  question: BigFiveQuestion;
  index: number;
  total: number;
  value: number | null;
  onChange: (value: number) => void;
}

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;

export const QuestionRow = ({
  question,
  index,
  total,
  value,
  onChange,
}: QuestionRowProps) => {
  const locale = useLocale();
  const t = useTranslations();

  const label =
    (question.text as any)[locale] ??
    question.text.ru ??
    question.text.en;

  return (
    <Box sx={styles.row}>
      <Typography variant="caption" color="text.secondary" sx={styles.number}>
        {index + 1} / {total}
      </Typography>

      <Typography variant="body1" sx={styles.question}>
        {label}
      </Typography>

      <FormControl sx={styles.control}>
        <Box sx={styles.scaleHeader}>
          <Typography variant="caption" color="text.secondary">
            {t("likert_1")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("likert_5")}
          </Typography>
        </Box>

        <RadioGroup
          row
          value={value?.toString() ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          sx={styles.radioGroup}
        >
          {SCALE_VALUES.map((v) => (
            <FormControlLabel
              key={v}
              value={v.toString()}
              control={<Radio size="small" />}
              label=""
              sx={styles.radioLabel}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

const styles = {
  row: {
    p: { xs: 1.5, md: 2 },
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
  },
  number: {
    fontWeight: 500,
  },
  question: {
    fontWeight: 500,
  },
  control: {
    mt: 0.5,
  },
  scaleHeader: {
    display: "flex",
    justifyContent: "space-between",
    mb: 0.5,
  },
  radioGroup: {
    justifyContent: "space-between",
  },
  radioLabel: {
    m: 0,
    flex: 1,
    justifyContent: "center",
  },
};

