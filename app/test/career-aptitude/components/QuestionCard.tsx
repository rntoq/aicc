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
import { useLocale } from "next-intl";

export type CareerAptitudeQuestion = {
  id: string;
  question_number: number;
  part: 1 | 2;
  text: { ru: string; kk: string; en: string };
  weight: number;
  scale_max: 3 | 5;
  // Part 1
  category?: "R" | "I" | "A" | "S" | "E" | "C";
  interest_area?: string;
  // Part 2
  dimension?: "O" | "C" | "E" | "A" | "N";
  trait?: string;
  reverse_scored?: boolean;
};

export interface QuestionCardProps {
  question: CareerAptitudeQuestion;
  value: number | null;
  onChange: (value: number) => void;
  total: number;
}

const THREE_POINT = [
  { value: 1, label: { ru: "Не нравится", kk: "Ұнамайды", en: "Dislike" } },
  { value: 2, label: { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" } },
  { value: 3, label: { ru: "Нравится", kk: "Ұнайды", en: "Like" } },
] as const;

const FIVE_POINT = [
  { value: 1, label: { ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" } },
  { value: 2, label: { ru: "Скорее неточно", kk: "Дәлірек емес", en: "Somewhat inaccurate" } },
  { value: 3, label: { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" } },
  { value: 4, label: { ru: "Скорее точно", kk: "Дәлірек", en: "Somewhat accurate" } },
  { value: 5, label: { ru: "Точно", kk: "Дәл", en: "Accurate" } },
] as const;

export const QuestionCard = ({ question, value, onChange, total }: QuestionCardProps) => {
  const locale = useLocale();
  const label = (question.text as any)[locale] ?? question.text.ru ?? question.text.en;
  const options = question.scale_max === 3 ? THREE_POINT : FIVE_POINT;

  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.content}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          {question.question_number} / {total}
        </Typography>
        <Typography variant="h6" sx={styles.question}>
          {label}
        </Typography>

        <FormControl sx={{ mt: 2, width: "100%" }}>
          <RadioGroup
            value={value?.toString() ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            sx={styles.group}
          >
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value.toString()}
                control={<Radio />}
                label={
                  <Box sx={{ ml: 1 }}>
                    {(opt.label as any)[locale] ?? opt.label.ru}
                  </Box>
                }
                sx={[
                  styles.option,
                  value === opt.value && styles.optionSelected,
                ]}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};

const styles = {
  card: {
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
  },
  content: {
    p: { xs: 2, md: 3 },
  },
  question: {
    fontWeight: 700,
    fontSize: { xs: "1.05rem", md: "1.15rem" },
    lineHeight: 1.5,
  },
  group: {
    gap: 1,
  },
  option: {
    m: 0,
    p: 0.75,
    borderRadius: 1.5,
    border: "2px solid transparent",
    transition: "all 0.15s ease",
    "&:hover": { bgcolor: "action.hover" },
  },
  optionSelected: {
    bgcolor: "rgba(127,127,213,0.10)",
    borderColor: "primary.main",
  },
};
