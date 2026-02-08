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
import { LanguageDropdown } from "./LanguageDropdown";
import Link from "next/link";

const navItems: { label: string; href: string }[] = [
  { label: "Как это работает", href: "/#how-it-works" },
  { label: "Сдать тест", href: "/test" },
  { label: "Профессий", href: "/professions" },
];

export function Header() {
  return (
    <AppBar position="sticky" elevation={0} sx={styles.appBar}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={styles.toolbar}>
          <Typography
            component={Link}
            href="/#"
            variant="h3"
            sx={styles.logo}
          >
            КарьераПро
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
              Войти
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              color="primary"
              startIcon={<PersonAddOutlinedIcon />}
              sx={styles.registerButton}
            >
              Регистрация
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const styles = {
  appBar: {
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
