"use client";

import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Box, Button, Chip, Link as MuiLink, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SwipeReportCarousel } from "./SwipeReportCarousel";

type IndustryItem = {
  industry?: string;
  fitScore?: number;
  reason?: string;
  growthOutlook?: string;
};

export const IndustryReportCart = ({ items }: { items: IndustryItem[] }) => {
  const t = useTranslations();
  return (
    <Paper sx={styles.container}>
      <Box sx={styles.titleRow}>
        <Typography sx={styles.sectionTitle}>{t("dashboard_industry_title")}</Typography>
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
            <Box key={`${item?.industry ?? i}`} sx={styles.slideItem}>
              <Box sx={styles.industryCart}>
                <Box sx={styles.row}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    <ApartmentRoundedIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }} />
                    {item?.industry}
                  </Typography>
                  {typeof item?.fitScore === "number" && (
                    <Chip label={`${item.fitScore}%`} color="primary" size="small" sx={{ flexShrink: 0 }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item?.reason}
                </Typography>
              </Box>

              {item?.growthOutlook && (
                <Box sx={styles.outlookBox}>
                  <Box sx={styles.outlookLabel}>
                    <BarChartRoundedIcon sx={styles.outlookIcon} />
                    <Typography variant="caption" sx={styles.outlookLabelText}>
                      {t("dashboard_industry_outlook")}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={styles.outlookText}>
                    {item.growthOutlook}
                  </Typography>
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
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
  },
  industryCart: {
    p: 1.5,
    borderRadius: 2.5,
    border: "1px solid rgba(251,146,60,0.25)",
    background: "linear-gradient(135deg, rgba(255,247,237,1) 0%, rgba(255,255,255,1) 100%)",
    flex: 1,
    overflow: "auto",
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, gap: 1 },
  outlookBox: { px: 0.5, display: "flex", flexDirection: "column" as const, gap: 0.3 },
  outlookLabel: { display: "flex", alignItems: "center", gap: 0.5 },
  outlookIcon: { fontSize: 13, color: "rgba(251,146,60,0.8)" },
  outlookLabelText: {
    fontWeight: 600,
    color: "rgba(251,146,60,0.9)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  outlookText: { color: "text.secondary", lineHeight: 1.5 },
};
