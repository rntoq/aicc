"use client";

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useLocale } from "next-intl";
import type { LocalizedText } from "@/lib/types";

export type LikertWordQuestionCardProps = {
  /** Локализованный заголовок утверждения */
  title: LocalizedText;
  /** Текущее значение шкалы 1–5, либо null */
  value: number | null;
  /** Колбэк при изменении значения */
  onChange: (value: number) => void;
  /** Подпись слева от шкалы (по умолчанию “Не про меня”) */
  leftLabel?: LocalizedText;
  /** Подпись справа от шкалы (по умолчанию “Про меня”) */
  rightLabel?: LocalizedText;
  /**
   * Подписи для N градаций шкалы (обычно 3 или 5).
   * Если не заданы, используются дефолтные 5 фраз.
   */
  options?: LocalizedText[];
};

const DEFAULT_LEFT: LocalizedText = {
  ru: "Не про меня",
  kk: "Маған тән емес",
  en: "Not like me",
};
const DEFAULT_RIGHT: LocalizedText = {
  ru: "Про меня",
  kk: "Маған тән",
  en: "Like me",
};

const DEFAULT_OPTIONS: LocalizedText[] = [
  { ru: "Совсем не про меня", kk: "Мүлдем маған тән емес", en: "Not like me" },
  {
    ru: "Скорее не про меня",
    kk: "Көбіне маған тән емес",
    en: "Somewhat not like me",
  },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  {
    ru: "Скорее про меня",
    kk: "Көбіне маған тән",
    en: "Somewhat like me",
  },
  {
    ru: "Полностью про меня",
    kk: "Толығымен маған тән",
    en: "Very much like me",
  },
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
  const pick = (text: LocalizedText | undefined): string =>
    (text?.[locale as keyof LocalizedText] as string | undefined) ??
    text?.ru ??
    text?.en ??
    "";

  const titleText = pick(title);
  const leftText = pick(leftLabel);
  const rightText = pick(rightLabel);
  const scaleOptions = options && options.length > 0 ? options : DEFAULT_OPTIONS;

  return (
    <Box>
      <Typography
        sx={{ fontWeight: 600, fontSize: "1rem", textAlign: "center", mb: 1 }}
      >
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
        <Typography
          sx={{ fontWeight: 600, fontSize: "0.9rem", textAlign: "right" }}
        >
          {leftText}
        </Typography>

        <RadioGroup
          row
          sx={{ justifyContent: "center", gap: { xs: 0.5, md: 1 } }}
          value={value?.toString() ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {scaleOptions.map((_, index) => {
            const v = index + 1;
            return (
              <FormControlLabel
                key={v}
                value={v.toString()}
                control={<Radio size="small" />}
                label
                sx={{
                  m: 0,
                  flexDirection: "column",
                  alignItems: "center",
                  ".MuiTypography-root": {
                    fontSize: 12,
                  },
                }}
              />
            );
          })}
        </RadioGroup>

        <Typography
          sx={{ fontWeight: 600, fontSize: "0.9rem", textAlign: "left" }}
        >
          {rightText}
        </Typography>
      </Box>
    </Box>
  );
};

