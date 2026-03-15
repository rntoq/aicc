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
  /** 1-based question index to show before the text */
  questionNumber?: number;
  /** Полный текст вопроса (уже локализованный) */
  questionText: string;
  /** Варианты ответа, упорядоченный список сверху вниз */
  options: string[];
  /** Текущее значение шкалы: 1..options.length, либо null, если ничего не выбрано */
  value: number | null;
  /** Вызывается при выборе варианта (1..options.length) */
  onChange: (value: number) => void;
}

export const OptionQuestionCard = ({
  questionNumber,
  questionText,
  options,
  value,
  onChange,
}: OptionQuestionCardProps) => {
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
            {questionNumber != null ? `${questionNumber}. ${questionText}` : questionText}
          </Typography>
          <FormControl component="fieldset" sx={styles.radioGroup}>
            <RadioGroup
              value={value?.toString() || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              sx={styles.radioGroupInner}
            >
              {options.map((label, index) => {
                const optionValue = index + 1;
                return (
                <FormControlLabel
                  key={optionValue}
                  value={optionValue.toString()}
                  control={<Radio />}
                  label={
                    <Box sx={styles.labelBox}>
                      <Typography variant="body2" fontWeight={value === optionValue ? 600 : 400}>
                        {label}
                      </Typography>
                    </Box>
                  }
                  sx={[
                    styles.radioLabel,
                    value === optionValue && styles.radioLabelSelected,
                  ]}
                />
              );})}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </motion.div>
  );
};;

const styles = {
  card: {
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    maxWidth: 720,
    mx: "auto",
    "&:hover": {
      transform: "none",
    },
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
      color: "text.primary.dark",
    },
  },
  labelBox: {
    ml: 1,
  },
};
