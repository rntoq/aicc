"use client";

import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import type { Profession } from "@/lib/careers/constants";

export type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type ProfessionCardProps = {
  profession: Profession;
  t: TranslateFn;
  /** Optional industry name shown above title (e.g. on careers list) */
  industryName?: string;
  /** Constrain width for horizontal scroll layouts */
  compact?: boolean;
};

export function ProfessionCard({ profession, t, industryName, compact = false }: ProfessionCardProps) {
  return (
    <Box
      sx={compact ? { ...styles.card, ...styles.cardCompact } : styles.card}
    >
      <CardContent sx={styles.cardContent}>
        <Box sx={styles.headerRow}>
          <Box sx={styles.iconBox}>
            <CodeOutlinedIcon fontSize="small" />
          </Box>
          {profession.matchPercent != null && (
            <Chip
              size="small"
              label={t("careers_match", { percent: profession.matchPercent })}
              sx={styles.matchChip}
            />
          )}
        </Box>
        {industryName != null && (
          <Typography variant="subtitle2" color="text.secondary" sx={styles.industryName}>
            {industryName}
          </Typography>
        )}
        <Typography variant="h6" sx={styles.title}>
          {t(profession.titleKey)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={styles.description}>
          {t(profession.shortDescKey)}
        </Typography>
        <Box sx={styles.chipsRow}>
          <Chip
            size="small"
            icon={<AttachMoneyOutlinedIcon sx={styles.chipIcon} />}
            label={profession.salaryRange}
            variant="outlined"
          />
          <Chip size="small" label={t(profession.demandKey)} variant="outlined" color="success" />
        </Box>
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
};
