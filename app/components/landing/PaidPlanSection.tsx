"use client";

import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SupportOutlinedIcon from "@mui/icons-material/SupportOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BANNER_PLACEHOLDER_IMAGE } from "@/ui/styles/global";

const SECTIONS = [
  {
    btnKey: "section1_btn" as const,
    chips: [
      { key: "section1_chip1" as const, Icon: ChatBubbleOutlineOutlinedIcon },
      { key: "section1_chip2" as const, Icon: LightbulbOutlinedIcon },
      { key: "section1_chip3" as const, Icon: PsychologyOutlinedIcon },
      { key: "section1_chip4" as const, Icon: SupportOutlinedIcon },
    ],
  },
  {
    btnKey: "section2_btn" as const,
    chips: [
      { key: "paidplan_feature1" as const, Icon: MenuBookOutlinedIcon },
      { key: "paidplan_feature2" as const, Icon: ScheduleOutlinedIcon },
      { key: "paidplan_feature3" as const, Icon: PsychologyOutlinedIcon },
      { key: "paidplan_feature4" as const, Icon: DevicesOutlinedIcon },
    ],
  },
  {
    btnKey: "section3_btn" as const,
    chips: [
      { key: "section3_chip1" as const, Icon: WorkOutlineOutlinedIcon },
      { key: "section3_chip2" as const, Icon: SchoolOutlinedIcon },
      { key: "section3_chip3" as const, Icon: StarOutlineOutlinedIcon },
      { key: "section3_chip4" as const, Icon: AssignmentOutlinedIcon },
    ],
  },
];

const motionWrapperStyle = { maxWidth: 960, margin: "0 auto" };

export function PaidPlanSection() {
  const t = useTranslations();
  const [activeSection, setActiveSection] = useState(0);
  const currentSection = SECTIONS[activeSection];

  return (
    <Box component="section" id="paid-plan" sx={styles.section}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          style={motionWrapperStyle}
        >
          <Box sx={styles.bannerBlock}>
            <Image
              src={BANNER_PLACEHOLDER_IMAGE}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 960px"
              style={{ objectFit: "cover" }}
            />

            <Box sx={styles.tabsWrap}>
              {SECTIONS.map((section, idx) => (
                <Box
                  key={section.btnKey}
                  component="button"
                  type="button"
                  onClick={() => setActiveSection(idx)}
                  sx={[styles.tabButton, activeSection === idx && styles.tabButtonActive]}
                >
                  {t(section.btnKey)}
                </Box>
              ))}
            </Box>

            <Box sx={styles.chipsWrap}>
              {currentSection.chips.map((item) => (
                <Box key={item.key} sx={styles.featureChip}>
                  <Box sx={styles.iconWrap}>
                    <item.Icon />
                  </Box>
                  <Typography variant="body2" fontWeight={500} color="text.primary">
                    {t(item.key)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

const styles = {
  section: {
    py: { xs: 6, md: 20 },
    bgcolor: "background.default",
  },
  bannerBlock: {
    position: "relative",
    width: "100%",
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0 16px 48px rgba(15, 23, 42, 0.14)",
    aspectRatio: "16/12",
    maxWidth: "90vw",
    mx: "auto",
    "& img": { objectFit: "cover" },
  },
  tabsWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    display: "flex",
    gap: 1.5,
    justifyContent: "center",
    pt: 2,
    px: 2,
    flexWrap: "wrap",
  },
  tabButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    py: 1.5,
    px: 3,
    borderRadius: 1.5,
    fontWeight: 600,
    fontSize: "0.9375rem",
    cursor: "pointer",
    border: "1px solid #06b6d4",
    bgcolor: "rgba(6, 182, 212, 0.06)",
    color: "#06b6d4",
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      bgcolor: "rgba(6, 182, 212, 0.12)",
    },
  },
  tabButtonActive: {
    bgcolor: "#06b6d4",
    color: "#fff",
    border: "none",
    "&:hover": {
      bgcolor: "#50b2c3",
    },
  },
  chipsWrap: {
    position: "absolute",
    right: 1.5,
    left: 1.5,
    bottom: 1.5,
    top: "auto",
    transform: "none",
    width: "auto",
    maxHeight: "50%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 1,
    "@media (min-width: 900px)": {
      right: 2,
      left: "auto",
      top: "50%",
      bottom: "auto",
      transform: "translateY(-50%)",
      width: "min(280px, 42%)",
      maxHeight: "85%",
    },
  },
  featureChip: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    py: 1.25,
    px: 1.5,
    borderRadius: 1.75,
    bgcolor: "background.paper",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
    border: "1px solid",
    borderColor: "divider",
    mb: 1.25,
    "&:last-of-type": { mb: 0 },
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 1.25,
    bgcolor: "#06b6d4",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    "& svg": { fontSize: 22 },
  },
};
