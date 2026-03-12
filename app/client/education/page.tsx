"use client";

import { useMemo, useState } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { SpecialityCard } from "@/app/components/clientLayout";
import type { PublicSpeciality } from "@/lib/types";
import SPECIALITIES_JSON from "@/public/specialities.json";

const EducationPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [q, setQ] = useState("");

  const specialities = useMemo(() => SPECIALITIES_JSON as PublicSpeciality[], []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return specialities;

    return specialities.filter((s) => {
      const name =
        s.name?.[locale as keyof PublicSpeciality["name"]] ??
        s.name?.ru ??
        s.name?.en ??
        "";
      return (
        s.code.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query)
      );
    });
  }, [q, specialities, locale]);

  return (
    <AppLayout title={t("education")}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {t("education_specialities_subtitle", { defaultValue: "Choose a speciality to see universities." } as any)}
          </Typography>
        </Box>

        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search", { defaultValue: "Search" } as any)}
          fullWidth
        />

        <Grid container spacing={10}  sx={{ rowGap: 3}}>
          {filtered.map((s) => (
            <Grid key={s.code} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <SpecialityCard speciality={s} href={`/client/education/${encodeURIComponent(s.code)}`} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default EducationPage;

