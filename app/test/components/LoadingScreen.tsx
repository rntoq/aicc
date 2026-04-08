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
        color: "white",
        bgcolor: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <CircularProgress color="inherit" />
        {text ? (
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
            {text}
          </Typography>
        ) : null}
      </Box>
    </Backdrop>
  );
}

