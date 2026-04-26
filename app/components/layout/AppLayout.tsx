"use client";

import { useState } from "react";
import { Box, Drawer } from "@mui/material";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const SIDEBAR_WIDTH = 240;

type AppLayoutProps = {
  title?: string;
  children: ReactNode;
};

export const AppLayout = ({ title, children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Desktop sidebar (always mounted, responsive display to avoid refresh flicker) */}
      <Box
        sx={{
          width: { xs: 0, md: SIDEBAR_WIDTH },
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "fixed",
            top: 0,
            left: 0,
            width: SIDEBAR_WIDTH,
            height: "100vh",
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            overflowY: "auto",
          }}
        >
          <Sidebar />
        </Box>
      </Box>

      {/* Mobile sidebar as Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleMobileSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Topbar title={title} onMenuClick={toggleMobileSidebar} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, md: 3 },
            pt: 1,
            pb: 5,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

