"use client";

import { Box, Container, Typography } from "@mui/material";
import type { SvgIconProps } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { BANNER_PLACEHOLDER_IMAGE } from "@/utils/constants";

const STATS = [
  { icon: SchoolOutlinedIcon, value: 150, suffix: "+", labelKey: "stats_unis", descKey: "stats_unis_desc" },
  { icon: WorkOutlineOutlinedIcon, value: 200, suffix: "+", labelKey: "stats_profs", descKey: "stats_profs_desc" },
  { icon: AssignmentOutlinedIcon, value: 8, suffix: "", labelKey: "stats_tests", descKey: "stats_tests_desc" },
] as const;

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4 },
};

const CountUp = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const step = Math.max(1, Math.floor(value / 40));
    const timer = setInterval(() => {
      setCount((c) => {
        const next = Math.min(c + step, value);
        if (next >= value) {
          clearInterval(timer);
          return value;
        }
        return next;
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
};

const StatCard = ({
  icon: Icon,
  value,
  suffix,
  label,
  description,
  index,
  inView,
}: {
  icon: React.ComponentType<SvgIconProps>;
  value: number;
  suffix: string;
  label: string;
  description: string;
  index: number;
  inView: boolean;
}) => (
  <motion.div {...CARD_ANIMATION} transition={{ ...CARD_ANIMATION.transition, delay: index * 0.1 }}>
    <Box sx={styles.card}>
      <Box sx={styles.iconWrap}>
        <Icon sx={{ fontSize: 32 }} />
      </Box>
      <CountUp value={value} suffix={suffix} inView={inView} />
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </motion.div>
);

export const StatsBlock = () => {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Box component="section" id="stats" sx={styles.section} ref={ref}>
      <Container maxWidth="lg">
        <Typography component="h2" variant="h2" textAlign="center" sx={styles.title}>
          <Box component="span" color="text.primary">
            {t("stats_title_part1")}
            <Box component="span" className="text_gradient" sx={{ ml: 1 }}>
              {t("stats_title_part2")}
            </Box>
          </Box>
        </Typography>
        <Typography variant="body2" textAlign="center" sx={styles.subtitle}>
          {t("stats_subtitle")}
        </Typography>

        <Box sx={styles.grid}>
          {STATS.map((stat, index) => (
            <StatCard
              key={stat.labelKey}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={t(stat.labelKey)}
              description={t(stat.descKey)}
              index={index}
              inView={inView}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

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
