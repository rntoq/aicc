"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from "next/image";
import { motion } from "framer-motion";
import styled from "styled-components";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/landingConstants";

const HeroVisual = styled(Box)`
  position: relative;
  height: 280px;
  margin-top: 2rem;
  background: linear-gradient(135deg, rgba(127, 127, 213, 0.08) 0%, rgba(145, 234, 228, 0.08) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const DotGrid = styled(Box)`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(127, 127, 213, 0.14) 1px, transparent 0);
  background-size: 24px 24px;
`;

const CardMock = styled(motion.div)`
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
`;

const MatchBadge = styled.span`
  background: linear-gradient(135deg, #91eae4 0%, #6dd4ce 100%);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
`;

export function Hero() {
  return (
    <Box component="section" sx={styles.sectionRoot}>
      <Container maxWidth="lg">
        <Box sx={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography component="h1" variant="h1" sx={styles.title}>
              Найди профессию, которая подходит именно тебе
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="body1" sx={styles.subtitle}>
              Пройди несколько научно-обоснованных тестов и получи персональный
              карьерный анализ с помощью AI
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={styles.ctaWrap}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PsychologyOutlinedIcon />}
              href="#test"
              sx={styles.ctaButton}
            >
              Пройти тест бесплатно
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<InfoOutlinedIcon />}
              href="#how-it-works"
              sx={styles.ctaButton}
            >
              Как это работает
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <HeroVisual>
              <Box sx={styles.bannerImage}>
                <Image
                  src={BANNER_PLACEHOLDER_IMAGE}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <DotGrid />
              <Box sx={styles.cardWrap}>
                {["Аналитика данных", "UX-дизайн", "Разработка"].map((title, i) => (
                  <CardMock
                    key={title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <MatchBadge>{92 - i * 4}%</MatchBadge>
                    <Typography variant="body2" fontWeight={600}>
                      {title}
                    </Typography>
                  </CardMock>
                ))}
              </Box>
            </HeroVisual>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

const styles = {
  sectionRoot: {
    pt: { xs: 6, md: 10 },
    pb: { xs: 6, md: 8 },
    background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
  },
  heroContent: {
    maxWidth: 720,
    mx: "auto",
    textAlign: "center",
  },
  title: {
    mb: 2,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "text.secondary",
    mb: 3,
  },
  ctaWrap: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  } as React.CSSProperties,
  ctaButton: {
    borderRadius: 2,
    py: 1.5,
    px: 3,
  },
  bannerImage: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  cardWrap: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    justifyContent: "center",
    p: 2,
  },
};
