"use client";

import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import Link from "next/link";
import { useTranslations } from "next-intl";

type SkillReportCartProps = {
  strengths: string[];
  topSkills: string[];
  weaknesses: string[];
};

export const SkillReportCart = ({ strengths, topSkills, weaknesses }: SkillReportCartProps) => {
  const t = useTranslations();
  const hasData = strengths.length > 0 || topSkills.length > 0 || weaknesses.length > 0;

  type ColDef = { key: string; label: string; emoji: string; border: string; bg: string; Icon: SvgIconComponent; iconColor: string; items: string[] };
  const columns: ColDef[] = [
    { key: "s", label: t("dashboard_strengths"), emoji: "✅", border: "rgba(34,197,94,0.25)", bg: "rgba(240,253,244,1)", Icon: EmojiEventsRoundedIcon, iconColor: "rgba(34,197,94,0.12)", items: strengths },
    { key: "t", label: t("dashboard_top_skills"), emoji: "🚀", border: "rgba(59,130,246,0.25)", bg: "rgba(239,246,255,1)", Icon: RocketLaunchRoundedIcon, iconColor: "rgba(59,130,246,0.12)", items: topSkills },
    { key: "w", label: t("dashboard_weaknesses"), emoji: "⚠️", border: "rgba(239,68,68,0.25)", bg: "rgba(254,242,242,1)", Icon: WarningAmberRoundedIcon, iconColor: "rgba(239,68,68,0.12)", items: weaknesses },
  ];

  return (
    <Paper sx={styles.container}>
      <Typography sx={styles.sectionTitle}>{t("dashboard_skills_title")}</Typography>

      {!hasData ? (
        <Box sx={styles.emptyState}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {t("report_no_data")}
          </Typography>
          <Button component={Link} href="/client/tests" size="small" variant="outlined">
            {t("report_go_tests")}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={1.5} alignItems="stretch" sx={styles.grid}>
          {columns.map(({ key, label, emoji, border, bg, Icon, iconColor, items }) => (
            <Grid key={key} size={{ xs: 12, sm: 4 }} sx={styles.gridItem}>
              <Box sx={{ ...styles.skillCart, borderColor: border, background: bg }}>
                <Icon sx={{ ...styles.bgIcon, color: iconColor }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, position: "relative" }}>
                  {emoji} {label}
                </Typography>
                <Box component="ul" sx={styles.list}>
                  {items.slice(0, 5).map((item, idx) => (
                    <Typography component="li" key={idx} variant="body2" color="text.secondary" sx={{ position: "relative" }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

const styles = {
  container: {
    p: { xs: 1.5, md: 2.5 },
    borderRadius: { xs: 1.5, md: 3 },
    border: "1px solid rgba(148,163,184,0.2)",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  sectionTitle: { mb: 1.5, fontWeight: 700, fontSize: "0.95rem" },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    p: 2,
  },
  grid: { flex: 1, minHeight: 0 },
  gridItem: { display: "flex" },
  skillCart: {
    p: 1.5,
    borderRadius: 2.5,
    border: "1px solid",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    position: "relative" as const,
    overflow: "hidden",
  },
  bgIcon: {
    position: "absolute" as const,
    bottom: -10,
    right: -10,
    fontSize: 90,
    pointerEvents: "none",
  },
  list: { m: 0, pl: 2, display: "grid", gap: 0.7, position: "relative" as const },
};
