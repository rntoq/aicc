"use client";

import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

export function LoadingScreen({
  open,
  text,
}: {
  open: boolean;
  text?: string;
}) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: "common.white",
        bgcolor: "rgba(2, 6, 23, 0.72)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2.25, px: 2 }}>
        <CircularProgress
          color="inherit"
          size={48}
          thickness={4.2}
          sx={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35))" }}
        />
        {text ? (
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
              maxWidth: 520,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.2,
                textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                color: "common.white",
              }}
            >
              {text}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Backdrop>
  );
}

