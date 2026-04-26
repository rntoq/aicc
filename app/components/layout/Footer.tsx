"use client";

import { Box, Container, Link, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "@/app/context/LocaleContext";

const FOOTER_LINK_KEYS = [
  { key: "footer_about", href: "/about" },
  { key: "footer_methodology", href: "/methodology" },
  { key: "footer_contacts", href: "/contacts" },
  { key: "footer_privacy", href: "/privacy" },
];

export const Footer = () => {
  const t = useTranslations();
  const { locale, setLocale } = useLocale();
  const footerLinks = FOOTER_LINK_KEYS.map(({ key, href }) => ({ label: t(key), href }));
  const langButtonSx = (isActive: boolean) => [styles.link, styles.langButton, isActive && styles.langButtonActive];
  return (
    <Box component="footer" sx={styles.footer}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <Container maxWidth="lg">
        <Box sx={styles.topRow}>
          <Box>
            <Typography variant="h3" sx={styles.logoTitle}>
              {t("footer_logo")}
            </Typography>
            <Typography variant="caption" sx={styles.logoSubtitle}>
              {t("footer_tagline")}
            </Typography>
          </Box>

          <Box sx={styles.linksWrap}>
            {/* {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                underline="hover"
                sx={styles.link}
              >
                {link.label}
              </Link>
            ))} */}
            <Box sx={styles.langWrap}>
              <LanguageIcon sx={styles.langIcon} />
              <Typography
                component="button"
                type="button"
                onClick={() => setLocale("ru")}
                sx={langButtonSx(locale === "ru")}
              >
                RU
              </Typography>
              <Typography component="span" sx={styles.langDivider}> / </Typography>
              <Typography
                component="button"
                type="button"
                onClick={() => setLocale("kk")}
                sx={langButtonSx(locale === "kk")}
              >
                KK
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" sx={styles.copyright}>
          {t("footer_copyright", { year: new Date().getFullYear() })}
        </Typography>
        </Container>
      </motion.div>
    </Box>
  );
};

const styles = {
  footer: {
    display: "block",
    py: 4,
    bgcolor: "#1e1e2f",
    color: "#fff",
    borderTop: "none",
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
    color: "rgba(255,255,255,0.85)",
  },
  linksWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: { xs: 2, md: 3 },
    alignItems: "center",
  },
  link: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.9)",
    "&:hover": { color: "white" },
  },
  langButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    font: "inherit",
  },
  langButtonActive: {
    color: "white",
    fontWeight: 600,
  },
  langWrap: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    ml: { md: 1 },
  },
  langIcon: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
  },
  langDivider: {
    color: "rgba(255,255,255,0.6)",
  },
  copyright: {
    display: "block",
    mt: 3,
    pt: 2,
    borderTop: "1px solid rgba(255,255,255,0.2)",
    color: "rgba(255,255,255,0.8)",
    fontSize: "0.8125rem",
  },
};
