"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL_TESTS } from "@/app/test/constants";
import type { TestItem } from "@/app/test/constants";

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

function getBadgeLabel(
  test: TestItem,
  t: ReturnType<typeof useTranslations>
): string {
  if (test.required) return t("tests_badge_recommended");
  if (test.status === "paid" && test.price) return `${test.price}₸`;
  if (test.status === "premium" && test.price) return `${test.price}₸`;
  if (!test.required && test.status === "free") return t("tests_badge_optional");
  return t("tests_badge_free");
}

function getBadgeStyle(test: TestItem): { bg: string; color: string } {
  if (test.required) return { bg: "rgba(99, 102, 241, 0.15)", color: "#6366F1" };
  if (test.status === "paid" || test.status === "premium")
    return { bg: "rgba(2, 255, 36, 0.15)", color: "#10b981" };
  if (test.status === "free" && !test.required)
    return { bg: "rgba(100, 116, 139, 0.15)", color: "#64748B" };
  return { bg: "rgba(34, 197, 94, 0.15)", color: "#22C55E" };
}

export function TestsCarousel() {
  const t = useTranslations();
  const [isPaused, setIsPaused] = useState(false);

  const { items: TESTS, trackWidth } = useMemo(() => {
    const items = ALL_TESTS.map((test) => {
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
      const accentIndex = ALL_TESTS.indexOf(test) % CARD_ACCENTS.length;
      const accent = CARD_ACCENTS[accentIndex];
      return {
        id: test.id,
        name,
        category,
        time,
        questions,
        features,
        icon: test.icon,
        badgeLabel,
        badgeStyle,
        accentBorder: accent.border,
        accentBg: accent.bg,
        accentTitleColor: accent.titleColor,
      };
    });
    const width = items.length * (300 + 2) - 2;
    return { items, trackWidth: width };
  }, [t]);

  const trackSx = useMemo(
    () => ({
      display: "flex",
      my: 4,
      gap: 2,
      width: "max-content",
      animation: `testsCarouselFloat ${90}s linear infinite`,
      animationPlayState: isPaused ? "paused" : "running",
      "@keyframes testsCarouselFloat": {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: `translateX(-${trackWidth}px)` },
      },
    }),
    [isPaused, trackWidth]
  );

  const headingMotion = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45 },
  };

  return (
    <Box
      component="section"
      id="tests-carousel"
      sx={styles.section}
    >
      <Container maxWidth="lg">
        <motion.div {...headingMotion}>
          <Typography
            component="h2"
            variant="h2"
            textAlign="center"
            sx={styles.title}
          >
            {t("tests_carousel_heading_part1")}
            <Box component="span" sx={{ fontWeight: 700, ml: 1 }} className="text_gradient">
              {t("tests_carousel_heading_part2")}
            </Box>
          </Typography>
          <Typography variant="body1" textAlign="center" sx={styles.subtitle}>
            {t("tests_carousel_subtitle")}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Box
            sx={styles.wrap}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Box sx={styles.trackWrap}>
            <Box sx={trackSx}>
              {Array.from({ length: 2 }).map((_, dupe) =>
                TESTS.map((item) => (
                  <Link
                    key={`${dupe}-${item.id}`}
                    href="/test"
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        ...styles.item,
                        borderColor: item.accentBorder,
                        backgroundColor: item.accentBg,
                        "&:hover": {
                          transform: "translateY(-6px) scale(1.02)",
                          boxShadow: "0 20px 50px rgba(127,127,213,0.18)",
                          borderColor: item.accentBorder,
                          backgroundImage: `linear-gradient(180deg, #ffffff 0%, ${item.accentBg} 100%)`,
                        },
                      }}
                    >
                      <Box sx={styles.itemBgIcon} aria-hidden>
                        {item.icon}
                      </Box>
                      <Box sx={styles.itemContent}>
                        <Box
                          sx={{
                            ...styles.badge,
                            background: item.badgeStyle.bg,
                            color: item.badgeStyle.color,
                          }}
                        >
                          {item.badgeLabel}
                        </Box>
                        {item.category && (
                          <Typography sx={styles.category}>
                            {item.category}
                          </Typography>
                        )}
                        <Typography variant="subtitle1" sx={{ ...styles.itemTitle, color: item.accentTitleColor }}>
                          {item.name}
                        </Typography>
                        <Typography sx={styles.meta}>
                          {item.time}
                          {item.questions ? ` • ${item.questions} ${t("tests_questions_suffix")}` : ""}
                        </Typography>
                        <Box component="ul" sx={styles.featureList}>
                          {item.features.map((line, j) => (
                            <Box key={j} component="li" sx={styles.featureItem}>
                              <Typography variant="body2" sx={styles.featureText}>
                                • {line}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Typography className="cta" sx={styles.cta}>
                          {t("tests_cta_take")} →
                        </Typography>
                      </Box>
                    </Box>
                  </Link>
                ))
              )}
            </Box>
          </Box>
        </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

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
    width: 300,
    height: 350,
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
    "&:hover .cta": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&:hover > div:first-of-type": {
      opacity: 0.15,
      transform: "scale(1.1)",
    },
  },
  badge: {
    display: "inline-block",
    alignSelf: "flex-start",
    px: 1.5,
    py: 0.5,
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
    border: "1px solid",
    borderColor: "primary.main",
    backgroundColor: "transparent",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "primary.main",
    opacity: 0,
    transform: "translateY(6px)",
    transition: "all 300ms ease",
    "&:hover": {
      backgroundColor: "primary.main",
      color: "#fff",
    },
  },
};
