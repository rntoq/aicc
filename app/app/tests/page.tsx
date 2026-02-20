"use client";

import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { AppLayout } from "@/app/components/layout/AppLayout";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Link from "next/link";

const TEST_ITEMS = [
  { id: "holland", name: "Holland Code", status: "completed", score: 85 },
  { id: "disc", name: "DiSC Assessment", status: "completed", score: 78 },
  { id: "big-five", name: "Big Five", status: "in-progress", score: null },
  { id: "values", name: "Career Values", status: "pending", score: null },
  { id: "photo-career", name: "Photo Career", status: "pending", score: null },
];

const styles = {
  card: {
    borderRadius: 2,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    textDecoration: "none",
    display: "block",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    px: 1.5,
    py: 0.5,
    borderRadius: 1,
    fontSize: "0.75rem",
    fontWeight: 600,
  },
};

const TestsPage = () => {
  return (
    <AppLayout title="Tests & Results">
      <Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          View your test results and track your progress.
        </Typography>

        <Grid container spacing={2}>
          {TEST_ITEMS.map((test) => (
            <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                component={Link}
                href={`/test/${test.id}`}
                sx={styles.card}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
                      {test.name}
                    </Typography>
                    {test.status === "completed" ? (
                      <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 20 }} />
                    ) : test.status === "in-progress" ? (
                      <RadioButtonUncheckedIcon sx={{ color: "warning.main", fontSize: 20 }} />
                    ) : null}
                  </Box>

                  {test.status === "completed" && test.score !== null && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                        Score
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {test.score}%
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      ...styles.statusBadge,
                      bgcolor:
                        test.status === "completed"
                          ? "success.light"
                          : test.status === "in-progress"
                          ? "warning.light"
                          : "grey.100",
                      color:
                        test.status === "completed"
                          ? "success.dark"
                          : test.status === "in-progress"
                          ? "warning.dark"
                          : "text.secondary",
                    }}
                  >
                    {test.status === "completed"
                      ? "Completed"
                      : test.status === "in-progress"
                      ? "In Progress"
                      : "Not Started"}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            component={Link}
            href="/test"
            variant="contained"
            size="large"
          >
            Take New Test
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default TestsPage;
