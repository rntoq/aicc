"use client";

import { Box, Button, Container, Tooltip, Typography } from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/landingConstants";

const BannerWrap = styled(Box)`
  position: relative;
  width: 100%;
  min-height: 70vh;
  min-height: min(70vh, 640px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BannerImage = styled(Box)`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const BannerImageInner = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  & img {
    object-fit: cover;
  }
`;

const BannerOverlay = styled(Box)`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.5) 0%,
    rgba(30, 58, 138, 0.6) 50%,
    rgba(15, 23, 42, 0.75) 100%
  );
`;

const HeroVisual = styled(Box)`
  position: relative;
  height: 200px;
  margin-top: -80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 2;
`;

const CardMock = styled(motion.div)`
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.03);
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

const MatchBadge = styled.span`
  background: linear-gradient(90deg, #1E3A8A, #10B981);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
`;

const PROFESSION_KEYS = [
  { titleKey: "hero_prof1_title", descKey: "hero_prof1_desc", percent: 92 },
  { titleKey: "hero_prof2_title", descKey: "hero_prof2_desc", percent: 88 },
  { titleKey: "hero_prof3_title", descKey: "hero_prof3_desc", percent: 84 },
];

export function Hero() {
  const t = useTranslations();
  const theme = useTheme();
  const professionCards = PROFESSION_KEYS.map((k) => ({
    title: t(k.titleKey),
    description: t(k.descKey),
    percent: k.percent,
  }));
  return (
    <Box component="section" sx={styles.sectionRoot}>
      <BannerWrap>
        <BannerImage>
          <BannerImageInner>
            <Image
              src={BANNER_PLACEHOLDER_IMAGE}
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </BannerImageInner>
        </BannerImage>
        <BannerOverlay />
        <Box sx={styles.heroContent} component="div">
          <Container maxWidth="lg">
            <Box sx={styles.contentInner}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography component="h1" variant="h1" sx={styles.title} textAlign="center">
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
                    {t("hero_title1")}
                  </Box>
                  <Box component="span" sx={{ color: "white", fontWeight: 700 }}>
                    {t("hero_title2")}
                  </Box>
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
                    {t("hero_title3")}
                  </Box>
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography variant="body1" sx={styles.subtitle}>
                  {t("hero_subtitle")}
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
                  size="large"
                  startIcon={<PsychologyOutlinedIcon />}
                  href="#test"
                  sx={styles.ctaButton}
                >
                  {t("hero_cta1")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<InfoOutlinedIcon />}
                  href="#how-it-works"
                  sx={styles.ctaButtonOutlined}
                >
                  {t("hero_cta2")}
                </Button>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </BannerWrap>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <HeroVisual>
            <Box sx={styles.bannerImageSmall}>
              <Image
                src={BANNER_PLACEHOLDER_IMAGE}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box sx={styles.cardWrap}>
              {professionCards.map((item, i) => (
                <Tooltip
                  key={item.title}
                  title={
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{item.title}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.95 }}>{item.description}</Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                  slotProps={{ tooltip: { sx: { maxWidth: 260 } } }}
                >
                  <CardMock
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <MatchBadge>{item.percent}%</MatchBadge>
                    <Typography variant="body2" fontWeight={600}>
                      {item.title}
                    </Typography>
                  </CardMock>
                </Tooltip>
              ))}
            </Box>
          </HeroVisual>
        </motion.div>
      </Container>
      <Box sx={styles.sectionBottom} />
    </Box>
  );
}

const styles = {
  sectionRoot: {
    pb: 2,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 720,
    mx: "auto",
    textAlign: "center",
    py: { xs: 8, md: 12 },
  },
  contentInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    mb: 2,
    fontWeight: 700,
    lineHeight: 1.2,
    color: "white",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "rgba(255,255,255,0.9)",
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
    bgcolor: "#1E3A8A",
    color: "white",
    "&:hover": { bgcolor: "#172554", color: "white" },
  },
  ctaButtonOutlined: {
    borderRadius: 2,
    py: 1.5,
    px: 3,
    borderColor: "rgba(255,255,255,0.8)",
    color: "white",
    "&:hover": {
      borderColor: "white",
      bgcolor: "rgba(255,255,255,0.1)",
      color: "white",
    },
  },
  bannerImageSmall: {
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
    position: "relative",
    zIndex: 1,
  },
  sectionBottom: {
    height: { xs: 6, md: 8 },
    bgcolor: "background.default",
  },
};
