"use client";

import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { CareerValueQuestion } from "../questions";

export interface ValuesQuestionRowProps {
  question: CareerValueQuestion;
  value: number | null;
  onChange: (value: number) => void;
}

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;

export function ValuesQuestionRow({
  question,
  value,
  onChange,
}: ValuesQuestionRowProps) {
  const t = useTranslations();

  return (
    <Box sx={styles.row}>
      <Box sx={styles.textCol}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          Вопрос {question.index} из 36
        </Typography>
        <Typography variant="body1" sx={styles.text}>
          {question.text}
        </Typography>
      </Box>
      <RadioGroup
        row
        sx={styles.scale}
        value={value?.toString() || ""}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {SCALE_VALUES.map((v) => (
          <FormControlLabel
            key={v}
            value={v.toString()}
            control={<Radio size="small" />}
            label={
              <Typography variant="caption">
                {t(`likert_${v}`)}
              </Typography>
            }
            sx={styles.option}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

const styles = {
  row: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { xs: "flex-start", md: "center" },
    justifyContent: "space-between",
    gap: 2,
    p: 2,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  textCol: {
    flex: 1,
  },
  text: {
    fontSize: "0.95rem",
  },
  scale: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.5,
    justifyContent: { xs: "flex-start", md: "flex-end" },
    minWidth: { md: 320 },
  },
  option: {
    m: 0,
  },
};

