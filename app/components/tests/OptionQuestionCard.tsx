"use client";

import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

export interface OptionQuestionCardProps {
  questionNumber?: number;
  questionText: string;
  options: string[];
  value: number | null;
  onChange: (value: number) => void;
}

function formatQuestionHeading(questionNumber: number | undefined, questionText: string) {
  if (questionNumber == null) return questionText;
  const trimmed = questionText.trim();
  return trimmed.length > 0 ? `${questionNumber}. ${trimmed}` : `${questionNumber}.`;
}

export const OptionQuestionCard = ({
  questionNumber,
  questionText,
  options,
  value,
  onChange,
}: OptionQuestionCardProps) => {
  const heading = formatQuestionHeading(questionNumber, questionText);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={styles.card}>
        <CardContent sx={styles.content}>
          <Typography variant="h3" sx={styles.questionText}>
            {heading}
          </Typography>
          <FormControl component="fieldset" sx={styles.formControl}>
            <RadioGroup
              value={value?.toString() ?? ""}
              onChange={(e) => onChange(Number(e.target.value))}
              sx={styles.radioGroup}
            >
              {options.map((label, index) => {
                const optionValue = index + 1;
                const selected = value === optionValue;
                return (
                  <FormControlLabel
                    key={optionValue}
                    value={String(optionValue)}
                    control={<Radio />}
                    label={
                      <Box sx={styles.labelBox}>
                        <Typography variant="body2" fontWeight={selected ? 600 : 400}>
                          {label}
                        </Typography>
                      </Box>
                    }
                    sx={[styles.radioLabel, selected && styles.radioLabelSelected]}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
  questionText: {
    fontSize: "1.125rem",
    fontWeight: 600,
    mb: 3,
    lineHeight: 1.5,
  },
  formControl: {
    width: "100%",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  radioLabel: {
    m: 0,
    p: 0,
    borderRadius: 1,
    border: "2px solid transparent",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "action.hover",
    },
  },
  radioLabelSelected: {
    bgcolor: "#d6e3fb",
    borderColor: "primary.main",
    "& .MuiFormControlLabel-label": {
      color: "text.primary",
    },
  },
  labelBox: {
    ml: 1,
  },
};
