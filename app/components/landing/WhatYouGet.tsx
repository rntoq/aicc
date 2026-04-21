"use client";

import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import BANNER_IMAGE_2 from "../../../public/images/whatyouget_card2.png";
import BANNER_IMAGE_3 from "../../../public/images/whatyouget_card3.png";
import BANNER_IMAGE_4 from "../../../public/images/whatyouget_card4.png";
import BANNER_IMAGE_5 from "../../../public/images/whatyouget_card5.png";
import BANNER_IMAGE_6 from "../../../public/images/whatyouget_card6.png";

const FADE_IN = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45 },
};

const CARDS = [
  { title1Key: "whatyouget_card1_title", textKey: "whatyouget_card1_text", title2Key: "whatyouget_card1_title2", image: BANNER_IMAGE_2 },
  { title1Key: "whatyouget_card2_title", textKey: "whatyouget_card2_text", title2Key: "whatyouget_card2_title2", image: BANNER_IMAGE_3 },
  { title1Key: "whatyouget_card3_title", textKey: "whatyouget_card3_text", title2Key: "whatyouget_card3_title2", image: BANNER_IMAGE_4 },
  { title1Key: "whatyouget_card4_title", textKey: "whatyouget_card4_text", title2Key: "whatyouget_card4_title2", image: BANNER_IMAGE_5 },
  { title1Key: "whatyouget_card5_title", textKey: "whatyouget_card5_text", title2Key: "whatyouget_card5_title2", image: BANNER_IMAGE_6 },
] as const;

type CardConfig = (typeof CARDS)[number];

const FeatureCard = ({
  card,
  index,
  t,
  styles,
}: {
  card: CardConfig;
  index: number;
  t: ReturnType<typeof useTranslations>;
  styles: typeof sectionStyles;
}) => {
  const title1 = t(card.title1Key);
  const text = t(card.textKey);
  const title2 = t(card.title2Key);

  return (
    <motion.div
      {...FADE_IN}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: 0.08 * (index + 1) }}
      style={{ height: "100%", minHeight: 0 }}
    >
      <Box sx={styles.infoCard}>
        <Box sx={styles.textCol}>
          {title1 && (
            <Typography component="h3" variant="h4" sx={styles.cardTitle}>
              {title1.toUpperCase()}
            </Typography>
          )}
          {text && (
            <Typography component="h2" variant="h3" className="whatyouget-cardText" sx={styles.cardText}>
              {text.toUpperCase()}
            </Typography>
          )}
          {title2 && (
            <Typography component="h3" variant="h4" sx={styles.cardTitle}>
              {title2.toUpperCase()}
            </Typography>
          )}
        </Box>
        <Box sx={styles.imageWrap}>
          <Image
            src={card.image}
            width={200}
            height={150}
            alt={card.title1Key}
            className="whatyouget-image"
          />
        </Box>
      </Box>
    </motion.div>
  );
};

export const WhatYouGet = () => {
  const t = useTranslations();
  const styles = sectionStyles;

  return (
    <Box component="section" id="what-you-get" sx={styles.section}>
      <Container maxWidth="lg">
        <Box sx={styles.grid}>
          <motion.div {...FADE_IN} transition={{ ...FADE_IN.transition, delay: 0 }}>
            <Box sx={styles.heroCard}>
              <Typography variant="h2" sx={styles.heroTitle1} className="text_gradient">
                {t("whatyouget_title_part1").toUpperCase()}
              </Typography>
              <Typography variant="h1" sx={styles.heroTitle2}>
                {t("whatyouget_title_part2").toUpperCase()}?
              </Typography>
            </Box>
          </motion.div>

          {CARDS.map((card, idx) => (
            <FeatureCard key={card.title1Key} card={card} index={idx} t={t} styles={styles} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

const sectionStyles = {
  section: {
    py: { xs: 6, md: 8 },
    bgcolor: "background.paper",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
    },
    gridAutoRows: { xs: "auto", md: "minmax(240px, 1fr)" },
    alignItems: "stretch",
    gap: { xs: 2, md: 2.5 },
  },
  heroCard: {
    gridColumn: { xs: "1 / -1", md: "1 / 2" },
    gridRow: { xs: "1 / 2" },
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heroTitle1: {
    fontSize: { xs: "2rem", md: "5.2rem" },
    fontWeight: 800,
    lineHeight: 1,
  },
  heroTitle2: {
    fontSize: { xs: "2rem", md: "3.5rem" },
    fontWeight: 800,
    color: "text.secondary",
    lineHeight: 1.4,
  },
  infoCard: {
    borderRadius: 2,
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    border: "1px solid #E2E8F0",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    boxSizing: "border-box",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
    height: "100%",
    minHeight: { xs: "auto", md: 240 },
    px: { xs: 2.5, md: 3 },
    py: 2.5,
    bgcolor: "white",
    transition: "box-shadow 300ms cubic-bezier(0.33, 1, 0.68, 1), transform 300ms cubic-bezier(0.33, 1, 0.68, 1), background-color 300ms cubic-bezier(0.33, 1, 0.68, 1)",
    "&:hover": {
      boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
      backgroundImage: "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
      "& .whatyouget-image": {
        transform: "scale(1.1)",
      },
      "& .whatyouget-cardText": {
        background: "none !important",
        backgroundImage: "none !important",
        WebkitBackgroundClip: "initial !important",
        WebkitTextFillColor: "white !important",
        color: "white !important",
      },
    },
  },
  textCol: {
    flex: 1,
    alignItems: "start",
  },
  imageWrap: {
    position: "absolute",
    bottom: "-10px",
    right: "-10px",
    "& .whatyouget-image": {
      transition: "transform 300ms cubic-bezier(0.33, 1, 0.68, 1)",
    },
    "@media (max-width: 600px)": {
      "& .whatyouget-image": {
        width: "150px",
        height: "100px",
        bottom: "0",
        right: "0",
      },
    },
  },
  cardTitle: {
    fontWeight: 700,
    color: "text.primary.dark",
  },
  cardText: {
    fontWeight: 700,
    backgroundImage: "linear-gradient(90deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
};
