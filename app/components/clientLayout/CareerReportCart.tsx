"use client";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Box, Button, Chip, Link as MuiLink, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SwipeReportCarousel } from "./SwipeReportCarousel";

type CareerItem = {
  name?: string;
  reason?: string;
  matchScore?: number;
  growthPath?: string;
  salaryRange?: string;
};

export const CareerReportCart = ({ items }: { items: CareerItem[] }) => {
  const t = useTranslations();
  return (
    <Paper sx={styles.container}>
      <Box sx={styles.titleRow}>
        <Typography sx={styles.sectionTitle}>{t("dashboard_career_title")}</Typography>
        <MuiLink component={Link} href="/client/careers" sx={styles.moreLink}>
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
              <Box sx={styles.careerCart}>
                <Box sx={styles.top}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {item?.name}
                  </Typography>
                  {typeof item?.matchScore === "number" && (
                    <Chip
                      icon={<TrendingUpRoundedIcon />}
                      label={`${item.matchScore}%`}
                      color="success"
                      size="small"
                      sx={{ fontWeight: 700, flexShrink: 0 }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item?.reason}
                </Typography>
              </Box>

              {(item?.growthPath || item?.salaryRange) && (
                <Box sx={styles.metaRow}>
                  {item?.growthPath && (
                    <Box>
                      <Box sx={styles.metaLabel}>
                        <StackedLineChartIcon sx={styles.metaIcon} />
                        <Typography variant="caption" sx={styles.metaLabelText}>
                          {t("dashboard_career_growth_label")}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.growthPath}
                      </Typography>
                    </Box>
                  )}
                  {item?.salaryRange && (
                    <Box sx={styles.salaryBadge}>
                      <AttachMoneyRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.salaryRange}
                      </Typography>
                    </Box>
                  )}
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
    p: 2,
    borderRadius: 3,
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
  careerCart: {
    p: 1.5,
    borderRadius: 2.5,
    border: "1px solid rgba(16,185,129,0.25)",
    background: "linear-gradient(135deg, rgba(240,253,250,1) 0%, rgba(255,255,255,1) 100%)",
    flex: 1,
    overflow: "hidden",
    wordBreak: "break-word" as const,
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 1,
    mb: 1,
  },
  metaRow: { display: "flex", flexDirection: "column" as const, gap: 0.5, px: 0.5 },
  metaLabel: { display: "flex", alignItems: "center", gap: 0.5, mb: 0.2 },
  metaIcon: { fontSize: 13, color: "text.disabled", flexShrink: 0 },
  metaLabelText: { fontWeight: 600, color: "text.secondary" },
  salaryBadge: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    px: 1,
    py: 0.4,
    borderRadius: 1.5,
    background: "rgba(193,254,211,0.8)",
    border: "1px solid rgba(16,185,129,0.2)",
    alignSelf: "flex-start",
  },
};
