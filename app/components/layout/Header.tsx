"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useTranslations } from "next-intl";
import { LanguageDropdown } from "./LanguageDropdown";
import Link from "next/link";

const NAV_ITEMS: { labelKey: string; href: string }[] = [
  { labelKey: "header_howItWorks", href: "/#how-it-works" },
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
          <Typography
            component={Link}
            href="/#"
            variant="h3"
            sx={styles.logo}
          >
            {t("header_logo")}
          </Typography>

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
  logo: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "primary.main",
    textDecoration: "none",
    mr: { xs: 1, md: 3 },
    flexShrink: 0,
  },
  nav: {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    gap: 0.5,
    flex: 1,
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
    ml: "auto",
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
