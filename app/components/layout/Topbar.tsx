"use client";

import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";

type TopbarProps = {
  title?: string;
  onMenuClick?: () => void;
};

export const Topbar = ({ title, onMenuClick }: TopbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        zIndex: (t) => t.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          px: { xs: 1.5, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          {isMobile && onMenuClick && (
            <IconButton
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 0.5 }}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>
          )}
          {title && (
            <Typography
              variant="h6"
              noWrap
              sx={{ fontSize: 18, fontWeight: 600 }}
            >
              {title}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              p: 0.5,
              borderRadius: 999,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
            <ExpandMoreIcon fontSize="small" sx={{ ml: 0.5 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

