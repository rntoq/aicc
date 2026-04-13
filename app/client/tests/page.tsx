"use client";

import { Box, Button, ButtonGroup, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ALL_TESTS, getRecommendedTests } from "@/utils/constants";
import { TestCard } from "@/app/components/tests/TestCard";
import { useState } from "react";
import { AiAnalysisCta } from "@/app/components/layout/AiAnalysisCta";

const TestsPage = () => {
  const t = useTranslations();
  const recommended = getRecommendedTests();
  const [mode, setMode] = useState<"recommended" | "all">("recommended");

  return (
    <AppLayout title={t("tests_title")}>
      <Box>
        <Box sx={{mb: 2 }}>
          <Box>
            <Typography variant="body1" color="text.secondary">
              {t("tests_carousel_subtitle")}
            </Typography>
          </Box>

          <ButtonGroup sx={{ flexWrap: "wrap", mt: 5 }}>
            <Button
              variant="text"
              onClick={() => setMode("recommended")}
              sx={styles.button(mode === "recommended" ? "active" : "inactive")}
            >
              {t("test_recommended_title")}
            </Button>
            <Button
              variant="text"
              onClick={() => setMode("all")}
              sx={styles.button(mode === "all" ? "active" : "inactive")}
            >
              {t("test_showAllTests")}
            </Button>
          </ButtonGroup>
        </Box>

        {/* AI analysis CTA */}
        <AiAnalysisCta isRecommended={mode === "recommended"} />

        <Grid container spacing={3}>
          {(mode === "recommended" ? recommended : ALL_TESTS).map((test, index) => (
            <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TestCard test={test} index={index} variant={mode === "recommended" ? "recommended" : "custom"} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default TestsPage;

const styles = {
  button: (mode: "active" | "inactive") => ({
    px: 2.5,
    borderRadius: 0,
    color: mode === "active" ? "primary.light" : "text.secondary",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: mode === "active" ? "primary.light" : "transparent",
  }),
};
