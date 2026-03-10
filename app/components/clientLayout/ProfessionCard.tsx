"use client";

import { Box, CardContent, Chip, Divider, Typography } from "@mui/material";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { useLocale } from "next-intl";
import type { PublicProfession } from "@/lib/types";

export type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type ProfessionCardProps = {
  profession: PublicProfession;
  t: TranslateFn;
  /** Optional industry name shown above title (e.g. on careers list) */
  industryName?: string;
  /** Constrain width for horizontal scroll layouts */
  compact?: boolean;
};

export function ProfessionCard({ profession, t, industryName, compact = false }: ProfessionCardProps) {
  const locale = useLocale();
  const localeKey = locale as keyof PublicProfession["name"];

  const title =
    profession.name[localeKey] ??
    profession.name.ru ??
    profession.name.en ??
    "";

  const description =
    profession.description?.[localeKey] ??
    profession.description?.ru ??
    profession.description?.en ??
    "";

  const salary = profession.salary_kzt;
  const salaryLabel =
    salary && salary.min != null && salary.max != null
      ? `${salary.min.toLocaleString("ru-RU")}–${salary.max.toLocaleString("ru-RU")} ₸`
      : salary && salary.average != null
      ? `${salary.average.toLocaleString("ru-RU")} ₸`
      : "";
  let demandLabel: string;
  const demandKey = `careers_demand_${profession.demand_level}`;
  try {
    demandLabel = t(demandKey);
  } catch {
    // fallback, если в переводах нет конкретного ключа
    demandLabel = t("careers_demand_low");
  }

  const demandColor: "default" | "success" | "warning" | "error" = (() => {
    switch (profession.demand_level) {
      case "very_high":
      case "high":
        return "success";
      case "medium":
        return "warning";
      case "low":
      default:
        return "default";
    }
  })();

  return (
    <Box
      sx={compact ? { ...styles.card, ...styles.cardCompact } : styles.card}
    >
      <CardContent sx={styles.cardContent}>
        {industryName != null && (
          <Typography variant="subtitle2" color="text.secondary" sx={styles.industryName}>
            {industryName}
          </Typography>
        )}
        <Typography variant="h6" sx={styles.title}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={styles.description}>
            {description}
          </Typography>
        )}
        <Divider sx={{ my: 1.5 }} />

        <Box sx={styles.chipsRow}>
          {salaryLabel && (
            <Chip
              size="small"
              icon={<AttachMoneyOutlinedIcon sx={styles.chipIcon} />}
              label={salaryLabel}
              variant="outlined"
            />
          )}
          <Chip size="small" label={demandLabel} variant="outlined" color={demandColor} />
        </Box>

        {salary && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.75, display: "block" }}
          >
            min: {salary.min ?? "—"} / max: {salary.max ?? "—"} / avg:{" "}
            {salary.average ?? "—"} ₸
          </Typography>
        )}

        <Box sx={{ mt: 1.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            specialties:
          </Typography>
          <Box sx={styles.specialtiesRow}>
            {profession.specialties.map((code) => (
              <Chip key={code} size="small" label={code} variant="outlined" />
            ))}
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.5, display: "block" }}
        >
          industry: {profession.industry}
        </Typography>
      </CardContent>
    </Box>
  );
}

const styles = {
  card: {
    height: "100%",
    borderRadius: 2,
    border: "1px solid #9f9fc0",
    transition: "box-shadow 0.2s, border-color 0.2s",
    "&:hover": {
      boxShadow: 2,
    },
  },
  cardCompact: {
    minWidth: 280,
    maxWidth: 320,
  },
  cardContent: { p: 2 },
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    mb: 1.5,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 1.5,
    bgcolor: "primary.main",
    color: "primary.contrastText",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  matchChip: {
    fontWeight: 600,
    bgcolor: "primary.light",
    color: "primary.dark",
  },
  industryName: { mb: 0.5 },
  title: { fontWeight: 600, mb: 0.5 },
  description: { mb: 1.5 },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    alignItems: "center",
  },
  chipIcon: { fontSize: 14 },
  specialtiesRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.5,
  },
};
