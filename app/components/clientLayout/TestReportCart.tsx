"use client";

import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Box, Button, Link as MuiLink, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SwipeReportCarousel } from "./SwipeReportCarousel";

type TestItem = {
  testName?: string;
  primaryType?: string;
  summary?: string;
  scores?: Array<{ key: string; value: number }>;
  insight?: string;
};

export const TestReportCart = ({ items }: { items: TestItem[] }) => {
  const t = useTranslations();
  return (
    <Paper sx={styles.container}>
      <Box sx={styles.titleRow}>
        <Typography sx={styles.sectionTitle}>{t("dashboard_test_title")}</Typography>
        <MuiLink component={Link} href="/client/tests" sx={styles.moreLink}>
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
          {items.map((item, idx) => (
            <Box key={`${item?.testName ?? idx}`} sx={styles.slideItem}>
              <Box sx={styles.testCart}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item?.testName}
                </Typography>
                {item?.primaryType && (
                  <Typography variant="body2" sx={{ mt: 0.4, mb: 0.8, color: "#7c3aed", fontWeight: 600 }}>
                    {item.primaryType}
                  </Typography>
                )}
                <Box sx={styles.scoreWrap}>
                  {(item?.scores ?? []).slice(0, 6).map((s) => (
                    <Typography key={s.key} variant="caption" sx={styles.scoreItem}>
                      {s.key}: {s.value}
                    </Typography>
                  ))}
                </Box>
                {item?.summary && (
                  <Typography variant="body2" color="text.secondary" sx={styles.summary}>
                    {item.summary}
                  </Typography>
                )}
              </Box>

              {item?.insight && (
                <Box sx={styles.insightBox}>
                  <Box sx={styles.insightLabel}>
                    <LightbulbRoundedIcon sx={styles.insightIcon} />
                    <Typography variant="caption" sx={styles.insightLabelText}>
                      {t("dashboard_test_insight")}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={styles.insightText}>
                    {item.insight}
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
  testCart: {
    p: 1.5,
    borderRadius: 2.5,
    border: "1px solid rgba(168,85,247,0.25)",
    background: "linear-gradient(135deg, rgba(250,245,255,1) 0%, rgba(255,255,255,1) 100%)",
    flex: 1,
    overflow: "auto",
  },
  scoreWrap: { display: "flex", flexWrap: "wrap" as const, gap: 0.6, mb: 0.5 },
  scoreItem: {
    px: 0.8,
    py: 0.3,
    borderRadius: 999,
    bgcolor: "rgba(139,92,246,0.1)",
    fontWeight: 600,
  },
  summary: {
    mt: 0.8,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  insightBox: { px: 0.5, display: "flex", flexDirection: "column" as const, gap: 0.3 },
  insightLabel: { display: "flex", alignItems: "center", gap: 0.5 },
  insightIcon: { fontSize: 13, color: "#7c3aed" },
  insightLabelText: {
    fontWeight: 600,
    color: "#7c3aed",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  insightText: { color: "text.secondary", lineHeight: 1.5 },
};
