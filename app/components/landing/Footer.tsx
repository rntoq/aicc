"use client";

import { Box, Container, Link, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const footerLinks = [
  { label: "О проекте", href: "/about" },
  { label: "Методология", href: "/methodology" },
  { label: "Контакты", href: "/contacts" },
  { label: "Политика конфиденциальности", href: "/privacy" },
];

export function Footer() {
  return (
    <Box component="footer" sx={styles.footer}>
      <Container maxWidth="lg">
        <Box sx={styles.topRow}>
          <Box>
            <Typography variant="h3" sx={styles.logoTitle}>
              КарьераПро
            </Typography>
            <Typography variant="caption" sx={styles.logoSubtitle}>
              Навигация по будущему
            </Typography>
          </Box>

          <Box sx={styles.linksWrap}>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                color="inherit"
                underline="hover"
                sx={styles.link}
              >
                {link.label}
              </Link>
            ))}
            <Box sx={styles.langWrap}>
              <LanguageIcon sx={styles.langIcon} />
              <Link href="#" color="inherit" underline="hover" sx={styles.link}>
                RU
              </Link>
              <Typography component="span" sx={styles.langDivider}> / </Typography>
              <Link href="#" color="inherit" underline="hover" sx={styles.link}>
                KK
              </Link>
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" sx={styles.copyright}>
          © {new Date().getFullYear()} КарьераПро. Профориентация для школьников и студентов в Казахстане.
        </Typography>
      </Container>
    </Box>
  );
}

const styles = {
  footer: {
    py: 4,
    bgcolor: "primary.main",
    color: "white",
  },
  topRow: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { xs: "flex-start", md: "center" },
    justifyContent: "space-between",
    gap: 3,
  },
  logoTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "inherit",
  },
  logoSubtitle: {
    opacity: 0.9,
  },
  linksWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: { xs: 2, md: 3 },
    alignItems: "center",
  },
  link: {
    fontSize: "0.875rem",
    opacity: 0.95,
  },
  langWrap: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    ml: { md: 1 },
  },
  langIcon: {
    fontSize: 18,
    opacity: 0.9,
  },
  langDivider: {
    opacity: 0.6,
  },
  copyright: {
    display: "block",
    mt: 3,
    pt: 2,
    borderTop: "1px solid rgba(255,255,255,0.2)",
    opacity: 0.8,
  },
};
