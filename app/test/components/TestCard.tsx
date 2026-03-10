"use client";

import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { TestItem } from "@/app/test/constants";
import { useRouter } from "next/navigation";
import { useTestsStore } from "@/lib/store/testsStore";
import type { ReactNode } from "react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';

const CARD_ACCENTS = [
  { border: "#7f7fd5", bg: "rgba(127, 127, 213, 0.06)", titleColor: "#7f7fd5" },
  { border: "#86a8e7", bg: "rgba(134, 168, 231, 0.06)", titleColor: "#86a8e7" },
  { border: "#91eae4", bg: "rgba(145, 234, 228, 0.08)", titleColor: "#91eae4" },
  { border: "#6366F1", bg: "rgba(99, 102, 241, 0.06)", titleColor: "#6366F1" },
  { border: "#8b5cf6", bg: "rgba(139, 92, 246, 0.06)", titleColor: "#8b5cf6" },
  { border: "#06b6d4", bg: "rgba(6, 182, 212, 0.06)", titleColor: "#06b6d4" },
  { border: "#ec4899", bg: "rgba(236, 72, 153, 0.06)", titleColor: "#ec4899" },
  { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.06)", titleColor: "#f59e0b" },
  { border: "#10b981", bg: "rgba(16, 185, 129, 0.06)", titleColor: "#10b981" },
  { border: "#64748B", bg: "rgba(100, 116, 139, 0.06)", titleColor: "#64748B" },
];

const getBadgeLabel = (
  test: TestItem,
  t: ReturnType<typeof useTranslations>
): ReactNode => {
  if (test.required) return <><LockResetIcon sx={{ fontSize: 14, mr: 0.5 }} /> {t("tests_badge_required")}</>;
  return t("tests_badge_optional");
};

const getBadgeStyle = (test: TestItem): { bg: string; color: string } => {
  if (test.required) return { bg: "rgba(99, 102, 241, 0.15)", color: "#6366F1" };
  return { bg: "rgba(59, 59, 59, 0.15)", color: "#3B3B3B" };
};

export const TestCard = ({ test, index, variant, disabled }: { test: TestItem, index: number, variant: String, disabled?: boolean }) => {
  const t = useTranslations();
  const router = useRouter();
  const { isCompleted, setOpenResultModalId } = useTestsStore();
  const completed = isCompleted(test.id);
  const nameKey = `tests_${test.id}_name` as keyof typeof t;
  const featuresKey = `tests_${test.id}_features` as keyof typeof t;
  const categoryKey = `tests_${test.id}_category` as keyof typeof t;
  const name = (t(nameKey) as string) || test.name;
  const featuresRaw = (t(featuresKey) as string) || "";
  const features = featuresRaw
    ? featuresRaw
        .split("\n")
        .filter(Boolean)
        .slice(0, 3)
    : [];
  const category = (t(categoryKey) as string) || "";
  const time =
        test.duration != null ? `${test.duration} мин` : "";
      const questions = test.questions ?? 0;
      const badgeLabel = getBadgeLabel(test, t);
      const badgeStyle = getBadgeStyle(test);
      const accentIndex = index % CARD_ACCENTS.length;
      const accent = CARD_ACCENTS[accentIndex];

      const handleStart = () => {
        if (test.id === "holland") {
          router.push("/test/holland");
        } else if (test.id === "photo-career") {
          router.push("/test/photo-career");
        } else if (test.id === "disc") {
          router.push("/test/disc");
        } else if (test.id === "career-aptitude") {
          router.push("/test/career-aptitude");
        } else if (test.id === "big-five") {
          router.push("/test/bigfive");
        } else {
          // For other tests: demo behavior
          useTestsStore.getState().setCompleted(test.id);
          setOpenResultModalId(test.id);
        }
      };
    
      const handleShowResult = () => {
        if (test.id === "holland") {
          router.push("/test/holland/result");
        } else if (test.id === "photo-career") {
          router.push("/test/photo-career/result");
        } else if (test.id === "disc") {
          router.push("/test/disc/result");
        } else if (test.id === "career-aptitude") {
          router.push("/test/career-aptitude/result");
        } else if (test.id === "big-five") {
          router.push("/test/bigfive/result");
        } else {
          setOpenResultModalId(test.id);
        }
      };
  return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
                    <Box
                      sx={{
                        ...styles.item,
                        borderColor: accent.border,
                        backgroundColor: accent.bg,
                        "&:hover": {
                          transform: "translateY(-6px) scale(1.02)",
                          boxShadow: "0 20px 50px rgba(127,127,213,0.18)",
                          borderColor: accent.border,
                          backgroundImage: `linear-gradient(180deg, #ffffff 0%, ${accent.bg} 100%)`,
                        },
                      }}
                    >
                      <Box sx={styles.itemBgIcon} aria-hidden>
                          {test.icon}
                      </Box>
                      <Box sx={styles.itemContent}>
                        {variant === "recommended" && <Box
                          sx={{
                            ...styles.badge,
                            background: badgeStyle.bg,
                            color: badgeStyle.color,
                          }}
                        >
                          {badgeLabel}
                        </Box>}
                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        {category && (
                          <Typography sx={styles.category}>
                            {category}
                          </Typography>
                        )}
                        </Box>
                        <Typography variant="subtitle1" sx={{ ...styles.itemTitle, color: accent.titleColor }}>
                          {name}
                        </Typography>
                        <Typography sx={styles.meta}>
                          {time}
                          {questions ? ` • ${questions} ${t("tests_questions_suffix")}` : ""}
                        </Typography>
                        <Box component="ul" sx={styles.featureList}>
                          {features.map((line, j) => (
                            <Box key={j} component="li" sx={styles.featureItem}>
                              <Typography variant="body2" sx={styles.featureText}>
                                • {line}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        {completed ? (
                          <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            fullWidth
                            onClick={handleShowResult}
                            sx={{ ...styles.cta }}
                          >
                            {t("showResult")}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="medium"
                            fullWidth
                            onClick={handleStart}
                            sx={{ ...styles.cta }}
                            disabled={disabled}
                          >
                            {t("start")}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  
        </motion.div>
  );
};

const styles = {
  section: {
    py: { xs: 6, md: 8 },
    bgcolor: "background.default",
  },
  title: {
    mb: 1,
    fontWeight: 700,
    backgroundImage: "linear-gradient(90deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "text.primary.dark",
  },
  subtitle: {
    mb: 3,
    maxWidth: 560,
    mx: "auto",
    color: "text.secondary",
  },
  wrap: {
    overflow: "hidden",
    mx: -2,
    py: 1,
  },
  trackWrap: {
    overflow: "hidden",
  },
  item: {
    flexShrink: 0,
    height: 350,
    maxWidth: 300,
    mx: "auto",
    minHeight: 280,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    px: 2.5,
    py: 2.5,
    borderRadius: 2,
    bgcolor: "#ffffff",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 6px 24px rgba(15, 23, 42, 0.06)",
    cursor: "pointer",
    transition: "all 300ms cubic-bezier(0.33, 1, 0.68, 1)",
    "&:hover > div:first-of-type": {
      opacity: 0.15,
      transform: "scale(1.1)",
    },
  },
  badge: {
    display: "flex",
    alignSelf: "flex-start",
    px: 1.5,
    py: 0.5,
    alignItems: "center",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    mb: 0.75,
  },
  itemBgIcon: {
    position: "absolute",
    right: -8,
    bottom: -8,
    width: 120,
    height: 120,
    opacity: 0.08,
    color: "primary.main",
    transition: "opacity 300ms cubic-bezier(0.33, 1, 0.68, 1), transform 300ms cubic-bezier(0.33, 1, 0.68, 1)",
    "& svg": { width: "100%", height: "100%" },
  },
  itemContent: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
  },
  category: {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#94A3B8",
    textTransform: "uppercase" as const,
    mb: 0.5,
  },
  itemTitle: {
    fontWeight: 700,
    mb: 1,
    lineHeight: 1.3,
    flexShrink: 0,
  },
  meta: {
    fontSize: "0.75rem",
    color: "#64748B",
    mb: 1,
  },
  featureList: {
    listStyle: "none",
    m: 0,
    p: 0,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  featureItem: {
    "&::marker": { content: "none" },
    mb: 0.5,
    "&:last-child": { mb: 0 },
  },
  featureText: {
    color: "text.secondary",
    fontSize: "0.8125rem",
    lineHeight: 1.4,
  },
  cta: {
    marginTop: "auto",
    flexShrink: 0,
    display: "block",
    textAlign: "center",
    py: 1,
    px: 2,
    borderRadius: 999,
    fontSize: "0.85rem",
    fontWeight: 600,
  },
};
