"use client";

import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { BANNER_PLACEHOLDER_IMAGE } from "@/ui/styles/global";
import { LanguageDropdown } from "./LanguageDropdown";

const NAV_ITEMS: { labelKey: string; href: string }[] = [
  { labelKey: "hero_cta2", href: "/#how-it-works" },
  { labelKey: "header_takeTest", href: "/test" },
  { labelKey: "header_professions", href: "/professions" },
];

export function Header() {
  const t = useTranslations();
  const navItems = NAV_ITEMS.map((item) => ({ label: t(item.labelKey), href: item.href }));
  return (
    <AppBar position="fixed" elevation={0} sx={styles.appBar}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={styles.toolbar}>
          <Button component={Link} href="/" sx={styles.logoButton} disableRipple>
            <Image src={BANNER_PLACEHOLDER_IMAGE} alt="Logo" width={100} height={48} />
          </Button>

          <Box component="nav" sx={styles.nav}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                sx={styles.navButton}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={styles.actions}>
            <LanguageDropdown />
            <Button
              component={Link}
              href="/login"
              startIcon={<LoginOutlinedIcon />}
              sx={styles.loginButton}
            >
              {t("login")}
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              color="primary"
              startIcon={<PersonAddOutlinedIcon />}
              sx={styles.registerButton}
            >
              {t("register")}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const styles = {
  appBar: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    bgcolor: "background.paper",
    color: "text.primary",
    borderBottom: "1px solid",
    borderColor: "divider",
  },
  toolbar: {
    minHeight: { xs: 56, sm: 64 },
    gap: 1,
  },
  logoButton: {
    p: 0,
    minWidth: 0,
    flexShrink: 0,
    "&:hover": { bgcolor: "action.hover" },
  },
  nav: {
    display: { xs: "none", md: "flex" },
    mx: "auto",
    alignItems: "center",
  },
  navButton: {
    color: "text.secondary",
    textTransform: "none",
    fontSize: "0.9375rem",
    px: 1.5,
    "&:hover": {
      color: "primary.main",
      bgcolor: "action.hover",
    },
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },
  loginButton: {
    color: "text.primary",
    textTransform: "none",
    display: { xs: "none", sm: "inline-flex" },
    "&:hover": { bgcolor: "action.hover" },
  },
  registerButton: {
    textTransform: "none",
    borderRadius: 2,
    px: 2,
  },
};
