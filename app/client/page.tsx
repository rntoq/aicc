"use client";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";

const DashboardPage = () => {
  return (
    <AppLayout title="Dashboard">
      <Box>
        <Box sx={styles.welcomeCard}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              Welcome back!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              Here's your career journey overview.
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default DashboardPage;

const styles = {
  welcomeCard: {
    mb: 3,
    p: 3,
    borderRadius: 2,
    background: "linear-gradient(45deg, #86a8e7 0%, #91eae4 100%)",
    color: "white",
  },
  card: {
    height: "100%",
    borderRadius: 2,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    textDecoration: "none",
    display: "block",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
  },
};
