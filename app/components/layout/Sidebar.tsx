"use client";

import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BANNER_PLACEHOLDER_IMAGE } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";

const NAV_ITEMS = [
  { labelKey: "sidebar_dashboard", href: "/client", icon: DashboardOutlinedIcon },
  { labelKey: "sidebar_tests", href: "/client/tests", icon: QueryStatsOutlinedIcon },
  { labelKey: "sidebar_ai_chat", href: "/client/ai-chat", icon: ChatBubbleOutlineOutlinedIcon },
  { labelKey: "sidebar_careers", href: "/client/careers", icon: WorkOutlineOutlinedIcon },
  { labelKey: "sidebar_education", href: "/client/education", icon: SchoolOutlinedIcon },
] as const;

export const Sidebar = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { logout, loading } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== "/client" && pathname.startsWith(href));

  const handleLogout = async () => {
    if (loading) return;
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <Box sx={styles.sidebar}>
      <Box>
        <Box component={Link} href="/">
          <Image src={BANNER_PLACEHOLDER_IMAGE} alt="Logo" width={100} height={48} />
        </Box>

        <List sx={{ my: 5 }}>
          {NAV_ITEMS.map(({ labelKey, href, icon: Icon }) => {
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
                  primary={t(labelKey)}
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
          <ListItemButton
            component={Link}
            href="/client/settings"
            sx={styles.bottomItem}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t("sidebar_settings")}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
          </ListItemButton>
          <ListItemButton
            onClick={handleLogout}
            sx={styles.bottomItem}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t("sidebar_logout")}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
          </ListItemButton>
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
