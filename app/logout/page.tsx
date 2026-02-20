"use client";

import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // TODO: call logout API endpoint
    // Clear auth tokens, session, etc.
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Logging out...
      </Typography>
    </Box>
  );
};

export default LogoutPage;
