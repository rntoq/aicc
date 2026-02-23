"use client";

import { useState } from "react";
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import {useRouter} from "next/navigation";
import {LanguageDropdown} from "@/app/components/layout/LanguageDropdown";

type TopbarProps = {
  title?: string;
  onMenuClick?: () => void;
};

export const Topbar = ({ title, onMenuClick }: TopbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={styles.appBar}
    >
      <Toolbar
        sx={styles.toolbar}
      >
        <Box sx={styles.leftSection}>
          {isMobile && onMenuClick && (
            <IconButton edge="start" onClick={onMenuClick} sx={styles.menuButton} aria-label="Open navigation">
              <MenuIcon />
            </IconButton>
          )}
          {title && (
            <Typography
              variant="h6"
              noWrap
              sx={styles.title}
            >
              {title}
            </Typography>
          )}
        </Box>

        <Box sx={styles.rightSection}>
          <LanguageDropdown />
          <IconButton
            onClick={handleAvatarClick}
            sx={styles.avatarButton}
          >
            <Avatar sx={styles.avatar}>U</Avatar>
            <ExpandMoreIcon fontSize="small" sx={styles.avatarIcon} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => router.push("/app/settings")} >Settings</MenuItem>
            <MenuItem onClick={() => router.push("/logout")} >Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const styles = {
  appBar: {
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    zIndex: (theme: any) => theme.zIndex.appBar,
  },
  toolbar: {
    minHeight: 56,
    px: { xs: 1.5, md: 3 },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    minWidth: 0,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  menuButton: {
    mr: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  avatarButton: {
    p: 0.5,
    borderRadius: 999,
    border: "1px solid",
    borderColor: "divider",
  },
  avatar: {
    width: 32,
    height: 32,
  },
  avatarIcon: {
    ml: 0.5,
  },
};

