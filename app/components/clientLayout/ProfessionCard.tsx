"use client";

import { Box, CardContent, Chip, Divider, Link, Typography } from "@mui/material";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { useLocale } from "next-intl";
import type { PublicProfession, PublicSpeciality } from "@/lib/types";
import SPECIALITIES_JSON from "@/public/specialities.json";

export type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type ProfessionCardProps = {
  profession: PublicProfession;
  t: TranslateFn;
  /** Constrain width for horizontal scroll layouts */
  compact?: boolean;
};

const SPECIALITIES = SPECIALITIES_JSON as PublicSpeciality[];
const CODE_TO_ID = new Map<string, number>(
  SPECIALITIES.map((s) => [s.code, s.id])
);

export function ProfessionCard({ profession, t, compact = false }: ProfessionCardProps) {
  const locale = useLocale();
  const localeKey = locale as keyof PublicProfession["name"];

  const salary = profession.salary_kzt;
  const salaryLabel =
    salary && salary.min != null && salary.max != null
      ? `${salary.min.toLocaleString("ru-RU")}–${salary.max.toLocaleString("ru-RU")} ₸`
      : salary && salary.average != null
      ? `${salary.average.toLocaleString("ru-RU")} ₸`
      : "";
  const demandLabel = t(`careers_demand_${profession.demand_level}`);


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
        <Typography variant="h6" sx={styles.title}>
          {profession.name[localeKey]}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {t(profession.industry)}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <Box>
          <Typography variant="caption" fontWeight={500} color="black">
            {t("description")}:
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mb: 0.5, fontSize: "0.8rem" }}>
            {profession.description?.[localeKey]}
          </Typography>
        </Box>
        <Box sx={{mt: "auto"}}>
            <Typography
              variant="caption"
              sx={{ display: "block", mb: 0.5 , color: "black" }}
            >
              {t("specialities")}: 
              {profession.specialities.map((item) => {
                const code = typeof item === "string" ? item : (item as { code: string }).code;
                const objId = typeof item === "object" && item !== null ? (item as { id?: number }).id : undefined;
                const resolvedId = objId ?? CODE_TO_ID.get(code);
                const hrefId = resolvedId != null ? String(resolvedId) : code;
                return (
                  <Link
                    href={`/client/education?speciality=${encodeURIComponent(hrefId)}`}
                    key={objId}
                    style={{ color: "blue", marginRight: "5px" }}
                  >
                    {code}
                  </Link>
                );
              })}
            </Typography>
            <Typography variant="caption" fontWeight={500} color={demandColor}>{demandLabel}</Typography>
            {salaryLabel && (
              <Chip
                  size="medium"
                  icon={<AttachMoneyOutlinedIcon sx={styles.chipIcon} />}
                  label={salaryLabel}
                  variant="filled"
                  sx={{ width: "100%", marginTop: 1, fontWeight: 500, fontSize: "16px"}}
              />
            )}
        </Box>
    </Box>
  );
}

const styles = {
  card: {
    height: "100%",
    borderRadius: 1,
    display: "flex",
    flexDirection: "column",
    p: 2,
    border: "1px solid #9f9fc0",
    transition: "box-shadow 0.2s, border-color 0.2s",
    "&:hover": {
      boxShadow: 2,
    },
  },
  cardCompact: {
    minWidth: 280,
    maxWidth: 320,
    flexShrink: 0,
  },
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
  chipIcon: { fontSize: 24},
  specialitiesRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.5,
  },
};
