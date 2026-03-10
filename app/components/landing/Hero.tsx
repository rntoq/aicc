"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/constants";

const imageStyle = { objectFit: "cover" as const };

export const Hero = () => {
  const t = useTranslations();

  return (
    <Box component="section" sx={styles.sectionRoot}>
      <Box sx={styles.bannerWrap}>
        <Box sx={styles.bannerImage}>
          <Box sx={styles.bannerImageInner}>
            <Image
              src={BANNER_PLACEHOLDER_IMAGE}
              alt=""
              fill
              sizes="100vw"
              style={imageStyle}
              priority
            />
          </Box>
        </Box>
        <Box sx={styles.bannerOverlay} />
        <Box sx={styles.heroContent} component="div">
          <Container maxWidth="lg">
            <Box sx={styles.contentInner}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography component="h1" variant="h1" sx={styles.title} textAlign="center">
                  <Box component="span" sx={{ color: "white", fontWeight: 700 }}>
                    {t("hero_title1")}
                  </Box>
                  <Box component="span" sx={{ ml: 1 }} className="text_gradient">
                    {t("hero_title2")}
                  </Box>
                </Typography>
                <Typography variant="body1" sx={styles.subtitle}>
                  {t("hero_subtitle")}
                </Typography>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={styles.heroVisual}>
            <Box sx={styles.bannerImageSmall}>
              <Image
                src={BANNER_PLACEHOLDER_IMAGE}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                style={imageStyle}
              />
            </Box>
            <Box sx={styles.ctaWrap}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PsychologyOutlinedIcon />}
                href="test"
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
            </Box>
          </Box>
        </motion.div>
      </Container>
      <Box sx={styles.sectionBottom} />
    </Box>
  );
};

const styles = {
  sectionRoot: {
    pb: 2,
  },
  bannerWrap: {
    position: "relative",
    width: "100%",
    minHeight: "min(70vh, 640px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bannerImage: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  bannerImageInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    "& img": { objectFit: "cover" },
  },
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 58, 138, 0.6) 50%, rgba(15, 23, 42, 0.75) 100%)",
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
  heroVisual: {
    position: "relative",
    height: 200,
    mt: -10,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    zIndex: 2,
  },
  bannerImageSmall: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  ctaWrap: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    justifyContent: "center",
    p: 2,
    position: "relative",
    zIndex: 1,
  },
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
  sectionBottom: {
    height: { xs: 6, md: 8 },
    bgcolor: "background.default",
  },
};
