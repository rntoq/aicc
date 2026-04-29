"use client";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

type ReportDownloadCartProps = {
  title: string;
  summary?: string;
  onDownload: () => Promise<void>;
  downloading: boolean;
};

export const ReportDownloadCart = ({ title, summary, onDownload, downloading }: ReportDownloadCartProps) => {
  const t = useTranslations();
  return (
    <Box sx={styles.breathWrapper}>
    <Paper sx={styles.card}>
      <Box sx={styles.orb1} />
      <Box sx={styles.orb2} />
      <Box sx={styles.orb3} />
      <Box sx={styles.shimmer} />

      <Box sx={styles.content}>
        <Box sx={styles.badge}>
          <AutoAwesomeIcon sx={{ fontSize: 13, color: "#fff" }} />
          <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700, letterSpacing: "0.06em" }}>
            AI REPORT
          </Typography>
        </Box>

        {title && (
          <Typography variant="subtitle2" sx={styles.title}>
            {title}
          </Typography>
        )}

        {summary && (
          <>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 1 }} />
            <Typography variant="body2" sx={styles.summary}>
              {summary}
            </Typography>
          </>
        )}

        <Box sx={styles.spacer} />

        <Typography variant="caption" sx={styles.hint}>
          {t("dashboard_report_pdf_hint")}
        </Typography>

        <Box sx={styles.buttonsRow}>
          <Button
            variant="outlined"
            component={Link}
            fullWidth
            href="/client/ai-chat"
            startIcon={<ForumRoundedIcon />}
            size="small"
            sx={styles.btnOutlined}
          >
            {t("dashboard_report_consult")}
          </Button>
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={() => void onDownload()}
            disabled={downloading}
            startIcon={downloading ? <CircularProgress size={14} color="inherit" /> : <DownloadRoundedIcon />}
            sx={styles.btnContained}
          >
            {downloading ? t("dashboard_report_downloading") : t("dashboard_report_download")}
          </Button>
        </Box>
      </Box>
    </Paper>
    </Box>
  );
};

const styles = {
  breathWrapper: {
    height: "100%",
    animation: "cardBreath 3s ease-in-out infinite",
    transformOrigin: "center center",
    willChange: "transform",
    background: "none",
    backgroundColor: "transparent",
    "@keyframes cardBreath": {
      "0%,100%": { transform: "scale(1)" },
      "50%": { transform: "scale(1.018)" },
    },
  },
  card: {
    height: "100%",
    borderRadius: 3,
    border: "1px solid rgba(139,92,246,0.35)",
    background: "linear-gradient(145deg, #3b1d8a 0%, #5b21b6 45%, #1e40af 100%)",
    position: "relative" as const,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(124,58,237,0.3), 0 2px 8px rgba(0,0,0,0.2)",
  },
  orb1: {
    position: "absolute" as const,
    width: 120, height: 120, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(167,139,250,0.75) 0%, transparent 70%)",
    top: -30, right: -20,
    animation: "pulse1 4s ease-in-out infinite",
    "@keyframes pulse1": {
      "0%,100%": { transform: "scale(1)", opacity: 0.6 },
      "50%": { transform: "scale(1.25)", opacity: 1 },
    },
  },
  orb2: {
    position: "absolute" as const,
    width: 80, height: 80, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(96,165,250,0.65) 0%, transparent 70%)",
    bottom: 40, right: 10,
    animation: "pulse2 5s ease-in-out infinite",
    "@keyframes pulse2": {
      "0%,100%": { transform: "scale(1)", opacity: 0.5 },
      "50%": { transform: "scale(1.3)", opacity: 0.9 },
    },
  },
  orb3: {
    position: "absolute" as const,
    width: 60, height: 60, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(52,211,153,0.55) 0%, transparent 70%)",
    bottom: -10, left: 20,
    animation: "pulse3 6s ease-in-out infinite",
    "@keyframes pulse3": {
      "0%,100%": { transform: "scale(1)", opacity: 0.4 },
      "50%": { transform: "scale(1.4)", opacity: 0.8 },
    },
  },
  shimmer: {
    position: "absolute" as const,
    top: 0, left: "-100%", width: "60%", height: "100%",
    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
    animation: "shimmer 3.5s ease-in-out infinite",
    "@keyframes shimmer": {
      "0%": { left: "-60%" },
      "100%": { left: "160%" },
    },
  },
  content: {
    position: "relative" as const,
    p: 2, height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    zIndex: 1,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5, px: 1, py: 0.3, mb: 1.2,
    borderRadius: 999,
    background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
    boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
    alignSelf: "flex-start",
    animation: "badgePop 0.4s ease-out",
    "@keyframes badgePop": {
      "0%": { transform: "scale(0.85)", opacity: 0 },
      "100%": { transform: "scale(1)", opacity: 1 },
    },
  },
  title: { color: "rgba(255,255,255,0.9)", fontWeight: 500, fontSize: "0.8rem", lineHeight: 1.4 },
  summary: {
    color: "#fff",
    lineHeight: 1.6,
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  spacer: { flex: 1, minHeight: 8 },
  hint: { color: "rgba(255,255,255,0.65)", display: "block", mb: 1 },
  buttonsRow: { display: "flex", flexDirection: "column" as const, gap: 0.8 },
  btnOutlined: {
    borderColor: "rgba(255,255,255,0.3)",
    color: "#fff",
    "&:hover": { borderColor: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)" },
  },
  btnContained: {
    background: "linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%)",
    boxShadow: "0 2px 12px rgba(124,58,237,0.4)",
    "&:hover": { background: "linear-gradient(90deg, #6d28d9 0%, #2563eb 100%)", boxShadow: "0 4px 16px rgba(124,58,237,0.55)" },
    "&:disabled": { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" },
  },
};
