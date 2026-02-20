"use client";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/app", icon: DashboardOutlinedIcon },
  { label: "Tests & Results", href: "/app/tests", icon: QueryStatsOutlinedIcon },
  { label: "AI Chat", href: "/app/ai-chat", icon: ChatBubbleOutlineOutlinedIcon },
  { label: "Careers", href: "/app/careers", icon: WorkOutlineOutlinedIcon },
] as const;

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/app/settings", icon: SettingsOutlinedIcon },
  { label: "Logout", href: "/logout", icon: LogoutOutlinedIcon },
] as const;

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/app" && pathname.startsWith(href));

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 1.5,
      }}
    >
      {/* Top: logo + nav */}
      <Box sx={{ mb: 1.5 }}>
        <Box
          component={Link}
          href="/app"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1,
            py: 1,
            borderRadius: 1.5,
            textDecoration: "none",
            color: "text.primary",
            mb: 1,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              bgcolor: "primary.main",
            }}
          />
          <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700 }}>
            KarieraPro
          </Typography>
        </Box>

        <List sx={{ mb: 1 }}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                sx={{
                  mb: 0.5,
                  borderRadius: 1.5,
                  px: 1,
                  py: 0.75,
                  color: active ? "primary.main" : "text.secondary",
                  bgcolor: active ? "action.selected" : "transparent",
                  borderLeft: active ? 3 : 3,
                  borderLeftColor: active ? "primary.main" : "transparent",
                  transition: "background-color 0.2s ease, color 0.2s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? "primary.main" : "text.secondary",
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1.5 }} />
        <List>
          {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              sx={{
                mb: 0.5,
                borderRadius: 1.5,
                px: 1,
                py: 0.75,
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "text.primary",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

