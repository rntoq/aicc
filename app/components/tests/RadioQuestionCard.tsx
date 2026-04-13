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

export function pickLocalizedString(
  locale: string,
  text: LocalizedText | string | undefined | null,
): string {
  if (text == null) return "";
  if (typeof text === "string") return text;
  return (
    (text[locale as keyof LocalizedText] as string | undefined) ??
    text.ru ??
    text.en ??
    ""
  );
}

export type LikertWordScaleOptions = Array<LocalizedText | string>;

export type LikertWordQuestionCardProps = {
  title: LocalizedText | string;
  value: number | null;
  onChange: (value: number) => void;
  leftLabel?: LocalizedText | string;
  rightLabel?: LocalizedText | string;
  options?: LikertWordScaleOptions;
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

  const titleText = pickLocalizedString(locale, title);
  const leftText = pickLocalizedString(locale, leftLabel) || t("not_like_me");
  const rightText = pickLocalizedString(locale, rightLabel) || t("like_me");
  const scaleOptions =
    options && options.length > 0
      ? options
      : [
          t("not_like_me"),
          t("somewhat_not_like_me"),
          t("neutral"),
          t("somewhat_like_me"),
          t("like_me"),
        ];

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.title}>{titleText}</Typography>
      <Box sx={styles.content}>
        <Typography sx={styles.labelRight}>{leftText}</Typography>
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
                value={String(v)}
                control={<Radio size="small" />}
                label
                sx={styles.radioLabel}
              />
            );
          })}
        </RadioGroup>
        <Typography sx={styles.labelLeft}>{rightText}</Typography>
      </Box>
    </Box>
  );
};

const styles = {
  root: { mb: 2 },
  title: {
    fontWeight: 600,
    fontSize: "1rem",
    textAlign: "center",
    maxWidth: 420,
    mx: "auto",
  },
  labelRight: {
    fontWeight: 600,
    fontSize: { xs: "0.8rem", md: "0.9rem" },
    color: "text.secondary",
    textAlign: "right",
  },
  labelLeft: {
    fontWeight: 600,
    fontSize: { xs: "0.8rem", md: "0.9rem" },
    color: "text.secondary",
    textAlign: "left",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: { xs: 1.5, md: 2 },
    p: 0,
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
