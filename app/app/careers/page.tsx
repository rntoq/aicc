"use client";

import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const CAREER_RECOMMENDATIONS = [
  {
    title: "Data Analyst",
    match: 92,
    description: "Analyze data to help businesses make decisions",
    skills: ["SQL", "Python", "Statistics"],
  },
  {
    title: "UX Designer",
    match: 88,
    description: "Design user-friendly interfaces and experiences",
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    title: "Software Developer",
    match: 85,
    description: "Build and maintain software applications",
    skills: ["JavaScript", "React", "Node.js"],
  },
  {
    title: "Product Manager",
    match: 82,
    description: "Lead product development and strategy",
    skills: ["Strategy", "Communication", "Analytics"],
  },
  {
    title: "Marketing Manager",
    match: 78,
    description: "Plan and execute marketing campaigns",
    skills: ["SEO", "Content", "Analytics"],
  },
];

const styles = {
  card: {
    borderRadius: 2,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  matchBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    bgcolor: "success.main",
    color: "white",
    fontWeight: 700,
  },
};

const CareersPage = () => {
  return (
    <AppLayout title="Careers">
      <Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Career recommendations based on your test results.
        </Typography>

        <Grid container spacing={3}>
          {CAREER_RECOMMENDATIONS.map((career, idx) => (
            <Grid key={career.title} size={{ xs: 12, md: 6 }}>
              <Card sx={{ ...styles.card, position: "relative" }}>
                <CardContent sx={{ p: 3 }}>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`${career.match}% Match`}
                    sx={styles.matchBadge}
                    size="small"
                  />

                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, pr: 8 }}>
                    {career.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {career.description}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {career.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default CareersPage;
