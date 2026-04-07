"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/constants";
import { LanguageDropdown } from "./LanguageDropdown";
import { useAuth, useUserLabel } from "@/lib/store/useAuthStore";

const NAV_ITEMS: { labelKey: string; href: string }[] = [
  { labelKey: "hero_cta2", href: "/#how-it-works" },
  { labelKey: "header_takeTest", href: "/test" },
];

export const Header = ({ onLanding = false }: { onLanding?: boolean }) => {
  const t = useTranslations();
  const { user, isAuthenticated, hydrated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => NAV_ITEMS.map((item) => ({ label: t(item.labelKey), href: item.href })),
    [t]
  );

  const userLabel = useUserLabel();

  const closeMobile = () => setMobileOpen(false);
  return (
    <AppBar position="fixed" elevation={0} sx={styles.appBar}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={styles.toolbar}>
          <Button component={Link} href="/" sx={styles.logoButton} disableRipple>
            <Image src={BANNER_PLACEHOLDER_IMAGE} alt="Logo" width={100} height={48} />
          </Button>

          <Box component="nav" sx={styles.nav}>
            {onLanding && navItems.map((item) => (
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

          <Box sx={styles.actionsDesktop}>
            <LanguageDropdown />
            {hydrated && (
              <>
                {isAuthenticated && user ? (
                  <Button
                    component={Link}
                    href="/client"
                    variant="outlined"
                    sx={styles.userButton}
                  >
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {userLabel}
                    </Typography>
                  </Button>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href="/login"
                      variant="outlined"
                      sx={styles.loginButton}
                    >
                      {t("login")}
                    </Button>
                    <Button
                      component={Link}
                      href="/register"
                      variant="contained"
                      color="primary"
                      sx={styles.registerButton}
                    >
                      {t("register")}
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>

          <IconButton
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            sx={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{ sx: styles.drawerPaper }}
      >
        <Box sx={styles.drawerHeader}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t("header_logo")}
          </Typography>
          <IconButton aria-label="Close menu" onClick={closeMobile}>
            ✕
          </IconButton>
        </Box>
        <Divider />

        <Stack sx={styles.drawerContent} spacing={2}>
          {onLanding && (
            <Stack spacing={1}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={closeMobile}
                  sx={styles.drawerNavButton}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}

          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <LanguageDropdown />
          </Box>

          {hydrated && (
            <>
              {isAuthenticated && user ? (
                <Button
                  component={Link}
                  href="/client"
                  variant="outlined"
                  onClick={closeMobile}
                  sx={styles.drawerPrimaryButton}
                >
                  {userLabel}
                </Button>
              ) : (
                <Stack spacing={1}>
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    onClick={closeMobile}
                    sx={styles.drawerPrimaryButton}
                  >
                    {t("login")}
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    onClick={closeMobile}
                    sx={styles.drawerPrimaryButton}
                  >
                    {t("register")}
                  </Button>
                </Stack>
              )}
            </>
          )}
        </Stack>
      </Drawer>
    </AppBar>
  );
};

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
    borderRadius: "0 0 20px 20px",
  },
  toolbar: {
    minHeight: { xs: 56, sm: 64 },
    justifyContent: "space-between",
    alignItems: "center",
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
      bgcolor: "transparent",
    },
  },
  actionsDesktop: {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    gap: 0.5,
  },
  userButton: {
    color: "primary.main",
    padding: "4px 12px",
    maxWidth: 180,
  },
  loginButton: {
    color: "primary.main",
    padding: "4px 12px",
  },
  registerButton: {
    padding: "4px 12px",
    border: "2px solid #7f7fd5",
  },

  menuButton: {
    display: { xs: "inline-flex", md: "none" },
    ml: 1,
  },
  drawerPaper: {
    width: 250,
    maxWidth: "85vw",
    borderRadius: "20px 0 0 20px",
    p: 0,
  },
  drawerHeader: {
    px: 2,
    py: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerContent: {
    px: 2,
    py: 2,
  },
  drawerNavButton: {
    justifyContent: "flex-start",
    textTransform: "none",
    color: "text.primary",
    px: 1,
  },
  drawerPrimaryButton: {
    textTransform: "none",
  },
};
