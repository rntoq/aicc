"use client";

import { Box, Container, Typography } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { motion } from "framer-motion";

const stats = [
  {
    icon: SchoolOutlinedIcon,
    value: "150+",
    label: "университетов",
    description: "вузов Казахстана в базе",
  },
  {
    icon: WorkOutlineOutlinedIcon,
    value: "200+",
    label: "профессий",
    description: "актуальных специальностей",
  },
  {
    icon: AssignmentOutlinedIcon,
    value: "8",
    label: "тестов",
    description: "научно обоснованных методик",
  },
];

export function StatsBlock() {
  return (
    <Box
      component="section"
      id="stats"
      sx={styles.section}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h2"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          Что мы интегрировали
        </Typography>
        <Typography variant="body2" textAlign="center" sx={styles.subtitle}>
          Актуальные данные по рынку труда и образованию Казахстана
        </Typography>

        <Box sx={styles.grid}>
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Box sx={styles.card}>
                <Box sx={styles.iconWrap}>
                  <item.icon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h3" sx={styles.value}>
                  {item.value}
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
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
    maxWidth: 520,
    mx: "auto",
    color: "text.secondary",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
    gap: 3,
  },
  card: {
    p: 3,
    borderRadius: 2.5,
    bgcolor: "background.default",
    border: "1px solid",
    borderColor: "divider",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(127, 127, 213, 0.1)",
      borderColor: "primary.light",
    },
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 2,
    bgcolor: "primary.main",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
  },
  value: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "primary.main",
    lineHeight: 1.2,
    mb: 0.5,
  },
};
