"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ALL_TESTS } from "@/app/test/constants";
import { TestCard } from "@/app/test/components/TestCard";

export default function TestsPage() {
  const t = useTranslations();

  return (
    <AppLayout title={t("tests_title")}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {t("tests_title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t("tests_carousel_subtitle")}
        </Typography>
        <Grid container spacing={3}>
          {ALL_TESTS.map((test, index) => (
            <Grid key={test.id} sx={{ mx: "auto" }}>
              <TestCard test={test} index={index} variant="custom" />
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
}
