"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/landingConstants";
import type { Theme } from "@mui/material/styles";

const STAT_KEYS = [
  { icon: SchoolOutlinedIcon, value: 150, suffix: "+", labelKey: "stats_unis", descKey: "stats_unis_desc" },
  { icon: WorkOutlineOutlinedIcon, value: 200, suffix: "+", labelKey: "stats_profs", descKey: "stats_profs_desc" },
  { icon: AssignmentOutlinedIcon, value: 8, suffix: "", labelKey: "stats_tests", descKey: "stats_tests_desc" },
];

const gradientSpanSx = (theme: Theme) => ({
  background: theme.landing.titleKeywordGradient,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "#182453",
  fontWeight: 700,
});

function CountUp({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const step = Math.max(1, Math.floor(value / 40));
    const timer = setInterval(() => {
      setCount((c) => {
        if (c >= value) {
          clearInterval(timer);
          return value;
        }
        return Math.min(c + step, value);
      });
    }, 30);
    return () => clearInterval(timer);
  }, [inView, value]);
  return (
    <Typography variant="h3" sx={styles.value} component="span" display="block">
      {count}
      {suffix}
    </Typography>
  );
}

export function StatsBlock() {
  const t = useTranslations();
  const theme = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const stats = STAT_KEYS.map((s) => ({ ...s, label: t(s.labelKey), description: t(s.descKey) }));
  return (
    <Box component="section" id="stats" sx={styles.section} ref={ref}>
      <Container maxWidth="lg">
        <Typography component="h2" variant="h2" textAlign="center" sx={styles.title}>
          <Box component="span" sx={gradientSpanSx(theme)}>
            {t("stats_title_part1")}
            <Box component="span" sx={styles.titlePart2}>
              {t("stats_title_part2")}
            </Box>
          </Box>
        </Typography>
        <Typography variant="body2" textAlign="center" sx={styles.subtitle}>
          {t("stats_subtitle")}
        </Typography>

        <Box sx={styles.grid}>
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Box sx={styles.card}>
                <Box sx={styles.iconWrap}>
                  <item.icon sx={{ fontSize: 32 }} />
                </Box>
                <CountUp value={item.value} suffix={item.suffix} inView={inView} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

const styles = {
  section: {
    py: { xs: 6, md: 8 },
    bgcolor: "background.paper",
    backgroundImage: `url(${BANNER_PLACEHOLDER_IMAGE})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  title: {
    mb: 1,
  },
  titlePart2: {
    color: "primary.main",
    fontWeight: 700,
    ml: 1,
  },
  subtitle: {
    mb: 4,
    maxWidth: 520,
    mx: "auto",
    color: "text.secondary",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
    gap: 3,
  },
  card: {
    p: 3,
    borderRadius: 2,
    bgcolor: "background.default",
    border: "1px solid",
    borderColor: "divider",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      borderColor: "primary.light",
      transform: "scale(1.03)",
    },
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 2,
    bgcolor: "primary.main",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
  },
  value: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "primary.main",
    lineHeight: 1.2,
    mb: 0.5,
  },
};
