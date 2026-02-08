"use client";

import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Image from "next/image";
import { useState } from "react";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/landingConstants";

const CARDS_VISIBLE_DESKTOP = 4;
const CARDS_VISIBLE_MOBILE = 1;

const cards = [
  {
    icon: PersonOutlineOutlinedIcon,
    title: "Карьерный профиль",
    text: "Сводка по интересам, ценностям и сильным сторонам",
  },
  {
    icon: WorkOutlineOutlinedIcon,
    title: "Топ-5 профессий",
    text: "Подборка профессий с учётом вашего профиля",
  },
  {
    icon: PercentOutlinedIcon,
    title: "Совпадение в процентах",
    text: "Понятные показатели соответствия каждой профессии",
  },
  {
    icon: TrendingUpOutlinedIcon,
    title: "Навыки для развития",
    text: "Что прокачать, чтобы быть конкурентоспособным",
  },
  {
    icon: SchoolOutlinedIcon,
    title: "Где учиться в Казахстане",
    text: "Вузы и программы под выбранное направление",
  },
];

export function WhatYouGet() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const cardsVisible = isDesktop ? CARDS_VISIBLE_DESKTOP : CARDS_VISIBLE_MOBILE;

  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, cards.length - cardsVisible);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const trackWidthPercent = (cards.length / cardsVisible) * 100;
  const slidePercent = 100 / cards.length;
  const transformPercent = index * slidePercent;

  return (
    <Box
      component="section"
      id="what-you-get"
      sx={styles.section}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h2"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          Что ты получишь
        </Typography>
        <Typography variant="body2" textAlign="center" sx={styles.subtitle}>
          Полный карьерный отчёт после прохождения тестов
        </Typography>

        <Box sx={styles.carouselWrap}>
          <Box
            sx={[styles.track, { width: `${trackWidthPercent}%` }]}
            style={{
              transform: `translateX(-${transformPercent}%)`,
            }}
          >
            {cards.map((card) => (
              <Box key={card.title} sx={styles.slide}>
                <Card sx={styles.card}>
                  <Box sx={styles.cardBanner}>
                    <Image
                      src={BANNER_PLACEHOLDER_IMAGE}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={styles.iconContainer}>
                      <card.icon sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          <Box sx={styles.navWrap}>
            <IconButton
              aria-label="Предыдущий"
              onClick={goPrev}
              disabled={index === 0}
              sx={styles.navButton}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
            <IconButton
              aria-label="Следующий"
              onClick={goNext}
              disabled={index >= maxIndex}
              sx={styles.navButton}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const styles = {
  section: {
    py: { xs: 6, md: 8 },
    bgcolor: "background.paper",
  },
  subtitle: {
    mb: 4,
    maxWidth: 480,
    mx: "auto",
  },
  carouselWrap: {
    position: "relative",
    overflow: "hidden",
  },
  track: {
    display: "flex",
    transition: "transform 0.35s ease-out",
  },
  slide: {
    flex: `0 0 ${100 / cards.length}%`,
    px: 1,
    boxSizing: "border-box",
  },
  card: {
    height: "100%",
    borderRadius: 2.5,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
    },
    transition: "box-shadow 0.2s ease",
  },
  cardBanner: {
    position: "relative",
    width: "100%",
    pt: "40%",
    bgcolor: "grey.100",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 2,
    bgcolor: "primary.main",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 1.5,
  },
  navWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
    mt: 3,
  },
  navButton: {
    bgcolor: "grey.100",
    color: "text.secondary",
    "&:hover": {
      bgcolor: "grey.200",
      color: "primary.main",
    },
    "&:disabled": {
      bgcolor: "grey.50",
      color: "grey.400",
    },
  },
};
