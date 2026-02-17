"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BANNER_PLACEHOLDER_IMAGE } from "@/ui/styles/global";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45 },
};

const motionWrapperSx = { width: "100%", height: "100%", display: "flex" };

export function HowItWorks() {
  const t = useTranslations();

  return (
    <Box component="section" id="how-it-works" sx={styles.section}>
      <Container maxWidth="lg">
        <Typography component="h2" variant="h2" textAlign="center" sx={styles.title}>
            <Box component="span" className="text_gradient" sx={{mr: 1}}>
              {t("how_title_part1")}
            </Box>
              {t("how_title_part2")}?
        </Typography>
        <Typography variant="body1" textAlign="center" sx={styles.subtitle}>
          {t("how_subtitle_part1")} {t("how_subtitle_part2")}
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: 1200,
            margin: "0 auto",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 2, md: 1 }, display: "flex" }}>
            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }} style={motionWrapperSx}>
              <Box sx={styles.card}>
                <Box sx={styles.stackedCards}>
                  <Box />
                  <Box />
                  <Box />
                  <Box />
                  <Box />
                </Box>
                <Typography sx={styles.step1Value}>{t("how_step1_value").toUpperCase()}</Typography>
                <Typography variant="body2" sx={{ mb: 1.5 }} className="text_gradient">
                  {t("how_step1_desc")}
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 1, md: 2 }, display: "flex" }}>
            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }} style={motionWrapperSx}>
              <Box sx={styles.centerCard}>
                <Typography sx={styles.centerCardTitle}>{t("how_step2_title")}</Typography>
                <Typography sx={styles.centerCardValue}>{t("how_step2_value")}</Typography>
                <Typography variant="body2">{t("how_step2_desc")}</Typography>
                <Box sx={styles.centerBannerWrap}>
                  <Image
                    src={BANNER_PLACEHOLDER_IMAGE}
                    alt=""
                    width={200}
                    height={120}
                    style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: 12 }}
                  />
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 3, md: 3 }, display: "flex" }}>
            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.3 }} style={motionWrapperSx}>
              <Box sx={styles.resultCard}>
                <Box sx={styles.resultBannerWrap}>
                  <Image
                    src={BANNER_PLACEHOLDER_IMAGE}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <Box sx={styles.resultBannerFade} />
                </Box>
                <Box sx={styles.resultContent}>
                  <Typography sx={styles.resultTitle}>{t("how_step3_title").toUpperCase()}</Typography>
                  <Typography sx={styles.resultValue}>{t("how_step3_value")}</Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const styles = {
  section: {
    py: { xs: 6, md: 8 },
  },
  title: {
    mb: 1,
    fontWeight: 700,
    color: "text.primary.dark",
  },
  subtitle: {
    mb: 4,
    color: "text.secondary",
  },
  card: {
    borderRadius: 3,
    p: "28px",
    boxShadow: "0 8px 32px rgba(15, 23, 42, 0.08)",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition:
      "transform 300ms cubic-bezier(0.33, 1, 0.68, 1), box-shadow 300ms cubic-bezier(0.33, 1, 0.68, 1)",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 16px 48px rgba(15, 23, 42, 0.14)",
    },
  },
  stackedCards: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    mt: 10,
    "& > div": {
      borderRadius: 1.5,
      bgcolor: "primary.main",
      opacity: 0.15,
    },
    "& > div:nth-of-type(1)": { width: 56, height: 72, transform: "rotate(-6deg)" },
    "& > div:nth-of-type(2)": { width: 56, height: 72, transform: "rotate(-2deg) translateY(-14px)", opacity: 0.18 },
    "& > div:nth-of-type(3)": { width: 56, height: 72, transform: "rotate(2deg) translateY(-24px)", opacity: 0.22 },
    "& > div:nth-of-type(4)": { width: 56, height: 72, transform: "rotate(5deg) translateY(-14px)", opacity: 0.26 },
    "& > div:nth-of-type(5)": { width: 56, height: 72, transform: "rotate(8deg)", opacity: 0.3 },
  },
  step1Value: {
    fontSize: 40,
    fontWeight: 700,
    color: "primary.main",
    mt: "auto",
  },
  centerCard: {
    borderRadius: 3,
    p: "28px",
    pb: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, rgba(127, 127, 213, 0.38) 0%, rgba(134, 168, 231, 0.42) 100%)",
    color: "text.primary",
    boxShadow: "0 12px 40px rgba(91, 111, 214, 0.35)",
    transition:
      "transform 300ms cubic-bezier(0.33, 1, 0.68, 1), box-shadow 300ms cubic-bezier(0.33, 1, 0.68, 1)",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 20px 56px rgba(91, 111, 214, 0.4)",
    },
  },
  centerCardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "inherit",
    mb: 0.5,
  },
  centerCardValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "text.primary.dark",
    mb: 1,
  },
  centerBannerWrap: {
    position: "relative",
    mt: 2,
    ml: -1,
    mr: -1,
    transform: "translateY(15px)",
    borderRadius: 2.25,
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
    overflow: "hidden",
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  resultCard: {
    borderRadius: 3,
    p: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
    boxShadow: "0 8px 32px rgba(15, 23, 42, 0.08)",
    transition:
      "transform 300ms cubic-bezier(0.33, 1, 0.68, 1), box-shadow 300ms cubic-bezier(0.33, 1, 0.68, 1)",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 16px 48px rgba(15, 23, 42, 0.14)",
    },
  },
  resultBannerWrap: {
    position: "relative",
    width: "100%",
    paddingTop: "100%",
    flexShrink: 0,
    overflow: "hidden",
    minHeight: 0,
    "& img": { objectFit: "cover" },
  },
  resultBannerFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    background: "linear-gradient(to bottom, transparent 0%, #FFFFFF 100%)",
    pointerEvents: "none",
  },
  resultContent: {
    px: 3.5,
    py: 2.5,
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  resultTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "primary.main",
    mb: 0.5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 500,
    color: "#182453",
    mb: 1,
  },
};
