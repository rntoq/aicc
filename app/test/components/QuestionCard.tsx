"use client";

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useLocale } from "next-intl";

type Dict = { ru: string; kk: string; en: string };

export type LikertWordQuestionCardProps = {
  title: Dict;
  value: number | null;
  onChange: (value: number) => void;
  leftLabel?: Dict;
  rightLabel?: Dict;
  /** Опциональные подписи для 5 градаций шкалы (1–5). Если не заданы — используются дефолтные. */
  options?: Dict[];
};

const DEFAULT_LEFT: Dict = { ru: "Не про меня", kk: "Маған тән емес", en: "Not like me" };
const DEFAULT_RIGHT: Dict = { ru: "Про меня", kk: "Маған тән", en: "Like me" };

const DEFAULT_OPTIONS: Dict[] = [
  { ru: "Совсем не про меня", kk: "Мүлдем маған тән емес", en: "Not like me" },
  { ru: "Скорее не про меня", kk: "Көбіне маған тән емес", en: "Somewhat not like me" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Скорее про меня", kk: "Көбіне маған тән", en: "Somewhat like me" },
  { ru: "Полностью про меня", kk: "Толығымен маған тән", en: "Very much like me" },
];

export const LikertWordQuestionCard = ({
  title,
  value,
  onChange,
  leftLabel = DEFAULT_LEFT,
  rightLabel = DEFAULT_RIGHT,
  options,
}: LikertWordQuestionCardProps) => {
  const locale = useLocale();
  const titleText = (title as any)[locale] ?? title.ru ?? title.en;
  const leftText = (leftLabel as any)[locale] ?? leftLabel.ru ?? leftLabel.en;
  const rightText = (rightLabel as any)[locale] ?? rightLabel.ru ?? rightLabel.en;
  const scaleOptions = options && options.length === 5 ? options : DEFAULT_OPTIONS;

  return (
    <Box>
      <Typography sx={{ fontWeight: 600, fontSize: "1rem", textAlign: "center" }}>
        {titleText}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          alignItems: "center",
          gap: { xs: 1.5, md: 2 },
          p: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "1rem", textAlign: "right" }}>
          {leftText}
        </Typography>

        <RadioGroup
          row
          sx={{ justifyContent: "center", gap: { xs: 0.5, md: 1 } }}
          value={value?.toString() ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {scaleOptions.map((opt, index) => {
            const v = index + 1;
            const text = (opt as any)[locale] ?? opt.ru ?? opt.en;
            return (
              <FormControlLabel
                key={v}
                value={v.toString()}
                control={<Radio size="small" />}
                label=""
                sx={{ m: 0, flex: 1, justifyContent: "center" }}
              />
            );
          })}
        </RadioGroup>

        <Typography sx={{ fontWeight: 600, fontSize: "1rem", textAlign: "left" }}>
          {rightText}
        </Typography>
      </Box>
    </Box>
  );
};

