"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import HERO_IMAGE from "../../../public/images/hero_ref_design.png";

const ctaButtonBase = {
  borderRadius: 2.5,
  py: 1.35,
  px: 4,
  minWidth: 210,
  textTransform: "none",
  fontWeight: 700,
  fontSize: { xs: "1.1rem", md: "1.25rem" },
};

export const Hero = () => {
  const t = useTranslations();

  return (
    <Box component="section" sx={styles.sectionRoot}>
      <Container maxWidth="lg">
        <Box sx={styles.contentWrap}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ width: "100%" }}
          >
            <Box sx={styles.textColumn}>
              <Typography component="h1" sx={styles.title}>
                  {t("hero_title1")}
                <Box component="span" sx={{ display: "block", fontWeight: 700, color: "#3f3a75" }}>
                  {t("hero_title2")}
                </Box>
              </Typography>
              <Typography variant="body1" sx={styles.subtitle}>
                {t("hero_subtitle")}
              </Typography>
              <Box sx={styles.ctaWrap}>
                <Button
                  variant="contained"
                  size="large"
                  href="/test"
                  sx={styles.ctaButton}
                >
                  {t("take_test")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="#how-it-works"
                  sx={styles.ctaButtonOutlined}
                >
                  {t("hero_cta2")}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

const styles = {
  sectionRoot: {
    backgroundColor: "#f5f5f8",
    py: { xs: 5, md: 8 },
  },
  contentWrap: {
    minHeight: { xs: "auto", md: 560 },
    borderRadius: 2.5,
    backgroundImage: `url(${HERO_IMAGE.src})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: { xs: "center up", md: "right center" },
    backgroundSize: { xs: "min(92vw, 420px) auto", sm: "min(76vw, 460px) auto", md: "50%" },
    py: { xs: 2.5, md: 4 },
    px: { xs: 0, md: 1 },
    pb: { xs: "min(96vw, 430px)", sm: "min(76vw, 360px)", md: 4 },
  },
  textColumn: {
    width: { xs: "100%", md: "54%" },
    maxWidth: 620,
    pr: { xs: 0, md: 3 },
    mt: { xs: "350px", md: 0 },
    mx: { xs: "auto", md: 0 },
    textAlign: { xs: "center", md: "left" },
  },
  title: {
    color: "#4f4a80",
    fontSize: { xs: "2.25rem", sm: "2.8rem", md: "3.65rem" },
    fontWeight: 400,
    lineHeight: { xs: 1.05, md: 1.08 },
    mb: { xs: 1.75, md: 2.5 },
  },
  subtitle: {
    color: "#5f6372",
    fontSize: { xs: "1rem", sm: "1.12rem", md: "1.05rem", lg: "1.2rem" },
    lineHeight: 1.35,
    maxWidth: 520,
    mx: { xs: "auto", md: 0 },
    mb: { xs: 2.5, md: 4 },
  },
  ctaWrap: {
    display: "flex",
    gap: 2.25,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: { xs: "center", md: "flex-start" },
  },
  ctaButton: {
    ...ctaButtonBase,
    bgcolor: "#7b78d4",
    color: "white",
    borderWidth: 1,
    borderColor: "#7b78d4",
    width: { xs: "100%", sm: "auto" },
    maxWidth: { xs: 320, sm: "none" },
    "&:hover": { bgcolor: "#6e69c8", color: "white", borderColor: "#6e69c8" },
  },
  ctaButtonOutlined: {
    ...ctaButtonBase,
    borderColor: "#c6cae8",
    color: "#6a6f8d",
    width: { xs: "100%", sm: "auto" },
    maxWidth: { xs: 320, sm: "none" },
    "&:hover": {
      borderColor: "#aeb4dd",
      bgcolor: "#eceefb",
      color: "#61688d",
    },
  },
};
