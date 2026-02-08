"use client";

import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/landingConstants";

const cards = [
  {
    type: "image-stat" as const,
    image: BANNER_PLACEHOLDER_IMAGE,
    stat: "4",
    description: "теста по интересам, личности, ценностям и навыкам",
  },
  {
    type: "blue-banner-breakdown" as const,
    bannerTitle: "AI-анализ",
    bannerSubtitle: "объединяем результаты и находим паттерны",
    breakdown: [
      { label: "Интересы", value: "95%" },
      { label: "Личность", value: "88%" },
      { label: "Ценности", value: "92%" },
      { label: "Навыки", value: "85%" },
    ],
  },
  {
    type: "avatars-stat" as const,
    stat: "Топ-5",
    description: "профессий по совпадению с профилем",
    avatarCount: 9,
    image: BANNER_PLACEHOLDER_IMAGE,
  },
];

export function HowItWorks() {
  const theme = useTheme();
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.paper" }}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h2"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          <Box
            component="span"
            sx={{
              background: theme.landing.titleKeywordGradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontWeight: 700,
            }}
          >
            Как это
          </Box>
          <Box
            component="span"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            {" "}
            работает
          </Box>
        </Typography>
        <Typography variant="body2" textAlign="center" sx={styles.subtitle}>
          Три простых шага к осознанному выбору профессии
        </Typography>

        <Box sx={styles.grid}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card sx={styles.card}>
                {card.type === "image-stat" && (
                  <>
                    <Box sx={styles.imageBox}>
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="h3" sx={styles.statTitle}>
                        {card.stat}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </>
                )}

                {card.type === "blue-banner-breakdown" && (
                  <>
                    <Box sx={styles.bannerBox}>
                      <Typography variant="h3" sx={styles.bannerTitle}>
                        {card.bannerTitle}
                      </Typography>
                      <Typography variant="body2" sx={styles.bannerSubtitle}>
                        {card.bannerSubtitle}
                      </Typography>
                    </Box>
                    <Box sx={styles.nestedPanel}>
                      {card.breakdown.map((row, j) => (
                        <Box
                          key={row.label}
                          sx={[
                            styles.breakdownRow,
                            j < card.breakdown.length - 1
                              ? styles.breakdownRowBorder
                              : {},
                          ]}
                        >
                          <Typography variant="body2" sx={styles.breakdownLabel}>
                            {row.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={styles.breakdownLabel}>
                            {row.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ height: 16 }} />
                  </>
                )}

                {card.type === "avatars-stat" && (
                  <>
                    <CardContent sx={{ p: 2.5, pb: 0 }}>
                      <Box sx={styles.avatarGrid}>
                        {Array.from({ length: card.avatarCount }).map((_, j) => (
                          <Box key={j} sx={styles.avatarCircle}>
                            <Image
                              src={card.image}
                              alt=""
                              fill
                              sizes="80px"
                              style={{ objectFit: "cover" }}
                            />
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="h3" sx={styles.statTitle}>
                        {card.stat}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

const styles = {
  subtitle: {
    mb: 4,
    maxWidth: 480,
    mx: "auto",
    color: "text.secondary",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
    gap: 3,
  },
  card: {
    height: "100%",
    overflow: "hidden",
    borderRadius: 2.5,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
      transform: "translateY(-2px)",
    },
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
  },
  imageBox: {
    position: "relative",
    width: "100%",
    pt: "56.25%",
    bgcolor: "grey.100",
    overflow: "hidden",
  },
  statTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "text.primary",
    mb: 0.5,
  },
  bannerBox: {
    bgcolor: "primary.main",
    color: "white",
    py: 2.5,
    px: 2,
    textAlign: "center",
  },
  bannerTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "inherit",
  },
  bannerSubtitle: {
    opacity: 0.95,
    fontSize: "0.875rem",
    mt: 0.5,
  },
  nestedPanel: {
    mx: 1.5,
    mt: -1.5,
    position: "relative",
    zIndex: 1,
    bgcolor: "primary.light",
    color: "white",
    borderRadius: 2,
    p: 2,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
  },
  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    py: 0.75,
  },
  breakdownRowBorder: {
    borderBottom: "1px solid rgba(255,255,255,0.2)",
  },
  breakdownLabel: {
    fontSize: "0.8125rem",
  },
  avatarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 1,
    mb: 2,
  },
  avatarCircle: {
    position: "relative",
    width: "100%",
    pt: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    bgcolor: "grey.200",
    border: "2px solid",
    borderColor: "primary.light",
  },
};
