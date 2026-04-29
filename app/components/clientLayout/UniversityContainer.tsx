"use client";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Box, Button, Chip, Link as MuiLink, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SwipeReportCarousel } from "./SwipeCarousel";

type UniversityItem = {
  name?: string;
  city?: string;
  reason?: string;
  programs?: string[];
};

export const UniversityReportCart = ({ items }: { items: UniversityItem[] }) => {
  const t = useTranslations();
  return (
    <Paper sx={styles.container}>
      <Box sx={styles.titleRow}>
        <Typography sx={styles.sectionTitle}>{t("dashboard_university_title")}</Typography>
        <MuiLink component={Link} href="/client/education" sx={styles.moreLink}>
          {t("dashboard_more")} <NorthEastIcon sx={styles.moreLinkIcon} />
        </MuiLink>
      </Box>

      {items.length === 0 ? (
        <Box sx={styles.emptyState}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {t("report_no_data")}
          </Typography>
          <Button component={Link} href="/client/tests" size="small" variant="outlined">
            {t("report_go_tests")}
          </Button>
        </Box>
      ) : (
        <SwipeReportCarousel>
          {items.map((item, i) => (
            <Box key={`${item?.name ?? i}`} sx={styles.slideItem}>
              <Box sx={styles.universityCart}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.8 }}>
                  {item?.name}
                </Typography>
                {item?.city && (
                  <Box sx={styles.cityRow}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 16, color: "#2563eb" }} />
                    <Typography variant="body2">{item.city}</Typography>
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
                  {item?.reason}
                </Typography>
              </Box>

              {!!item?.programs?.length && (
                <Box sx={styles.programsRow}>
                  <Box sx={styles.programsLabel}>
                    <SchoolRoundedIcon sx={styles.programsIcon} />
                    <Typography variant="caption" sx={styles.programsLabelText}>
                      {t("dashboard_university_programs")}:
                    </Typography>
                  </Box>
                  <Box sx={styles.chips}>
                    {item.programs.map((prog) => (
                      <Chip key={prog} label={prog} size="small" variant="outlined" sx={styles.chip} />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </SwipeReportCarousel>
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
  sectionTitle: { fontWeight: 700, fontSize: "0.95rem" },
  titleRow: {
    mb: 1.5,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 1,
  },
  moreLink: {
    display: "flex",
    alignItems: "center",
    gap: 0.3,
    fontSize: "0.82rem",
    fontWeight: 600,
    textDecoration: "none",
    color: "primary.main",
    flexShrink: 0,
  },
  moreLinkIcon: { fontSize: 14 },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    p: 2,
  },
  slideItem: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
    overflow: "hidden",
  },
  universityCart: {
    p: 1.5,
    borderRadius: 2.5,
    border: "1px solid rgba(37,99,235,0.2)",
    background: "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(255,255,255,1) 100%)",
    flex: 1,
    overflow: "hidden",
    wordBreak: "break-word" as const,
  },
  cityRow: { display: "flex", alignItems: "center", gap: 0.5 },
  programsRow: { px: 0.5, display: "flex", flexDirection: "column" as const, gap: 0.5 },
  programsLabel: { display: "flex", alignItems: "center", gap: 0.5 },
  programsIcon: { fontSize: 13, color: "text.disabled" },
  programsLabelText: {
    color: "text.disabled",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  chips: { display: "flex", flexWrap: "wrap" as const, gap: 0.5 },
  chip: { fontSize: "0.68rem", borderColor: "rgba(37,99,235,0.3)", color: "#1d4ed8" },
};
