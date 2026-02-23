"use client";

import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { BANNER_PLACEHOLDER_IMAGE } from "@/ui/styles/global";

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
    <Box sx={styles.sidebar}>
      <Box>
        <Box component={Link} href="/">
          <Image src={BANNER_PLACEHOLDER_IMAGE} alt="Logo" width={100} height={48} />
        </Box>

        <List sx={{ my: 5 }}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                sx={styles.navItem}>
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
                  primaryTypographyProps={{ fontSize: 14, color: active ? "primary.main" : "text.secondary", fontWeight: 600 }}
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
              sx={styles.bottomItem}
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

const styles = {
  sidebar: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    px: 3,
    py: 5,
  },
  navItem: {
    mb: 0.5,
    borderRadius: 1.5,
    px: 1,
    py: 0.75,
    color: "text.secondary",
    "&:hover": {
      bgcolor: "action.hover",
      color: "text.primary",
    },
  },
  bottomItem: {
    mb: 0.5,
    borderRadius: 1.5,
    px: 1,
    py: 0.75,
    color: "text.secondary",
    "&:hover": {
      bgcolor: "action.hover",
      color: "text.primary",
    },
  },
};
