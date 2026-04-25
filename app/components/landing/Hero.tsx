"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import HERO_IMAGE from "../../../public/images/hero_ref_design.png";

export const Hero = () => {
  const t = useTranslations();

  return (
    <Box component="section" sx={styles.sectionRoot}>
      <Container maxWidth="lg">
        <Box sx={styles.contentWrap}>
          <Box sx={styles.textItem}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Box sx={styles.textColumn}>
                <Typography component="h1" sx={styles.title}>
                  <Box component="span" sx={styles.titleLine}>
                    {t("hero_title1")}
                  </Box>
                  <Box component="span" sx={{ ...styles.titleLine, ...styles.titleAccent }}>
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
                    {t("hero_cta1")}
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
          <Box sx={styles.imageItem}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={styles.imageColumn}>
                <Image
                  src={HERO_IMAGE}
                  alt="Career guidance illustration"
                  priority
                  sizes="(max-width: 900px) 92vw, 52vw"
                  style={styles.image}
                />
              </Box>
            </motion.div>
          </Box>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: { xs: 4, md: 6 },
    flexDirection: { xs: "column", md: "row" },
  },
  textItem: {
    width: { xs: "100%", md: "45%" },
    flexShrink: 0,
  },
  textColumn: {
    width: "100%",
    maxWidth: 520,
  },
  title: {
    color: "#4f4a80",
    fontFamily: "'Times New Roman', serif",
    fontSize: { xs: "2.4rem", sm: "3rem", md: "4rem" },
    fontWeight: 700,
    lineHeight: 1.08,
    mb: 2.5,
  },
  titleLine: {
    display: "block",
  },
  titleAccent: {
    color: "#3f3a75",
  },
  subtitle: {
    color: "#5f6372",
    fontSize: { xs: "1.2rem", md: "1.8rem" },
    lineHeight: 1.25,
    maxWidth: 520,
    mb: 4,
  },
  ctaWrap: {
    display: "flex",
    gap: 2.25,
    flexWrap: "wrap",
    alignItems: "center",
  },
  ctaButton: {
    borderRadius: 2.5,
    py: 1.35,
    px: 4,
    minWidth: 210,
    bgcolor: "#7b78d4",
    color: "white",
    borderWidth: 1,
    borderColor: "#7b78d4",
    textTransform: "none",
    fontWeight: 700,
    fontSize: { xs: "1.1rem", md: "1.25rem" },
    "&:hover": { bgcolor: "#6e69c8", color: "white", borderColor: "#6e69c8" },
  },
  ctaButtonOutlined: {
    borderRadius: 2.5,
    py: 1.35,
    px: 4,
    minWidth: 210,
    borderColor: "#c6cae8",
    color: "#6a6f8d",
    textTransform: "none",
    fontWeight: 700,
    fontSize: { xs: "1.1rem", md: "1.25rem" },
    "&:hover": {
      borderColor: "#aeb4dd",
      bgcolor: "#eceefb",
      color: "#61688d",
    },
  },
  imageItem: {
    width: { xs: "100%", md: "55%" },
    flexShrink: 0,
  },
  imageColumn: {
    width: "100%",
    display: "flex",
    justifyContent: { xs: "center", md: "flex-end" },
  },
  image: {
    width: "100%",
    maxWidth: 640,
    height: "auto",
  },
};
