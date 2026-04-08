"use client";

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { LocalizedText } from "@/lib/types";

export type LikertWordQuestionCardProps = {
  /** Локализованный заголовок утверждения */
  title: LocalizedText | string;
  /** Текущее значение шкалы 1–5, либо null */
  value: number | null;
  /** Колбэк при изменении значения */
  onChange: (value: number) => void;
  /** Подпись слева от шкалы (по умолчанию “Не про меня”) */
  leftLabel?: LocalizedText | string;
  /** Подпись справа от шкалы (по умолчанию “Про меня”) */
  rightLabel?: LocalizedText | string;
  /**
   * Подписи для N градаций шкалы (обычно 3 или 5).
   * Если не заданы, используются дефолтные 5 фраз.
   */
  options?: Array<LocalizedText | string>;
};

export const LikertWordQuestionCard = ({
  title,
  value,
  onChange,
  leftLabel,
  rightLabel,
  options,
}: LikertWordQuestionCardProps) => {
  const locale = useLocale();
  const t = useTranslations();

  const pick = (text: LocalizedText | string | undefined): string => {
    if (typeof text === "string") return text;
    return (
      (text?.[locale as keyof LocalizedText] as string | undefined) ??
      (text?.ru as string | undefined) ??
      (text?.en as string | undefined) ??
      ""
    );
  };

  const titleText = pick(title);
  const leftText = pick(leftLabel) || t("likert_left");
  const rightText = pick(rightLabel) || t("likert_right");
  const scaleOptions =
    options && options.length > 0
      ? options
      : [
          t("likert_option_1"),
          t("likert_option_2"),
          t("likert_option_3"),
          t("likert_option_4"),
          t("likert_option_5"),
        ];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={styles.title}
      >
        {titleText}
      </Typography>

      <Box
        sx={styles.content}
      >
        <Typography
          sx={{...styles.label, textAlign: "right"}}
        >
          {leftText}
        </Typography>

        <RadioGroup
          row
          sx={styles.radioGroup}
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
                sx={styles.radioLabel}
              />
            );
          })}
        </RadioGroup>

        <Typography
          sx={{...styles.label, textAlign: "left"}}
        >
          {rightText}
        </Typography>
      </Box>
    </Box>
  );
};

const styles = {
  title: {
    fontWeight: 600,
    fontSize: "1rem",
    textAlign: "center",
    maxWidth: 420,
    mx: "auto",
  },
  label: {
    fontWeight: 600,
    fontSize: { xs: "0.8rem", md: "0.9rem" },
    color: "text.secondary",
  },
  content: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr auto 1fr", md: "1fr auto 1fr" },
    alignItems: "center",
    gap: { xs: 1.5, md: 2 },
    p: 0
  },
  radioLabel: {
    m: 0,
    flexDirection: "column",
    alignItems: "center",
    ".MuiTypography-root": {
      fontSize: 12,
    },
  },
  radioGroup: {
    justifyContent: "center",
    gap: { xs: 0, md: 1 },
  },
};