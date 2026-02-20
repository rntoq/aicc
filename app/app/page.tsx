"use client";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Link from "next/link";

const QUICK_LINKS = [
  {
    title: "Tests & Results",
    description: "View your test results and progress",
    href: "/app/tests",
    icon: QueryStatsOutlinedIcon,
    color: "#7f7fd5",
  },
  {
    title: "AI Chat",
    description: "Chat with AI about your career",
    href: "/app/ai-chat",
    icon: ChatBubbleOutlineOutlinedIcon,
    color: "#86a8e7",
  },
  {
    title: "Careers",
    description: "Explore career recommendations",
    href: "/app/careers",
    icon: WorkOutlineOutlinedIcon,
    color: "#91eae4",
  },
];

const styles = {
  welcomeCard: {
    mb: 3,
    p: 3,
    borderRadius: 2,
    background: "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
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

const DashboardPage = () => {
  return (
    <AppLayout title="Dashboard">
      <Box>
        <Card sx={styles.welcomeCard}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              Welcome back!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              Here's your career journey overview.
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {QUICK_LINKS.map(({ title, description, href, icon: Icon, color }) => (
            <Grid key={href} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                component={Link}
                href={href}
                sx={styles.card}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ ...styles.iconBox, bgcolor: `${color}20`, color }}>
                    <Icon />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default DashboardPage;
