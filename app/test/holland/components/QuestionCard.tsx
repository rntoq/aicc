"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { HollandQuestion } from "../questions";

export interface QuestionCardProps {
  question: HollandQuestion;
  value: number | null;
  onChange: (value: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const LIKERT_VALUES = [1, 2, 3, 4, 5] as const;

export function QuestionCard({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const t = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={styles.card}>
        <CardContent sx={styles.content}>
          <Typography variant="caption" color="text.secondary" sx={styles.questionNumber}>
            {t("holland_questionNumber", { current: questionNumber, total: totalQuestions })}
          </Typography>
          <Typography variant="h3" sx={styles.questionText}>
            {question.text}
          </Typography>
          <FormControl component="fieldset" sx={styles.radioGroup}>
            <RadioGroup
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              sx={styles.radioGroupInner}
            >
              {LIKERT_VALUES.map((optionValue) => (
                <FormControlLabel
                  key={optionValue}
                  value={optionValue.toString()}
                  control={<Radio />}
                  label={
                    <Box sx={styles.labelBox}>
                      <Typography variant="body2" fontWeight={value === optionValue ? 600 : 400}>
                        {t(`likert_${optionValue}`)}
                      </Typography>
                    </Box>
                  }
                  sx={[
                    styles.radioLabel,
                    value === optionValue && styles.radioLabelSelected,
                  ]}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const styles = {
  card: {
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    maxWidth: 720,
    mx: "auto",
  },
  content: {
    p: 3,
  },
  questionNumber: {
    display: "block",
    mb: 1,
    fontSize: "0.8125rem",
  },
  questionText: {
    fontSize: "1.125rem",
    fontWeight: 600,
    mb: 3,
    lineHeight: 1.5,
  },
  radioGroup: {
    width: "100%",
  },
  radioGroupInner: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  radioLabel: {
    m: 0,
    p: 1.5,
    borderRadius: 2,
    border: "2px solid transparent",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "action.hover",
    },
  },
  radioLabelSelected: {
    bgcolor: "primary.light",
    borderColor: "primary.main",
    "& .MuiFormControlLabel-label": {
      color: "primary.dark",
    },
  },
  labelBox: {
    ml: 1,
  },
};
