"use client";

import { useMemo, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { UniversityCard } from "@/app/components/clientLayout";
import type { PublicSpeciality, PublicUniversity } from "@/lib/types";
import SPECIALITIES_JSON from "@/public/specialities.json";
import UNIVERSITIES_JSON from "@/public/universities.json";

const SpecialityUniversitiesPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const code = typeof params.code === "string" ? decodeURIComponent(params.code) : "";

  const specialities = useMemo(() => SPECIALITIES_JSON as PublicSpeciality[], []);
  const speciality = useMemo(
    () => specialities.find((s) => s.code === code) ?? null,
    [specialities, code]
  );

  const specialityTitle =
    speciality?.name?.[locale as keyof PublicSpeciality["name"]] ??
    speciality?.name?.ru ??
    speciality?.name?.en ??
    code;

  const [q, setQ] = useState("");
  const universities = useMemo(() => UNIVERSITIES_JSON as PublicUniversity[], []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return universities;
    return universities.filter((u) => {
      const name =
        u.name?.[locale as keyof PublicUniversity["name"]] ??
        u.name?.ru ??
        u.name?.en ??
        "";
      const shortName =
        u.short_name?.[locale as keyof PublicUniversity["short_name"]] ??
        u.short_name?.ru ??
        u.short_name?.en ??
        "";
      return (
        u.code.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        shortName.toLowerCase().includes(query)
      );
    });
  }, [q, universities, locale]);

  return (
    <AppLayout title={specialityTitle}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          component={Link}
          href="/client/education"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ alignSelf: "flex-start" }}
        >
          {t("back", { defaultValue: "Back" } as any)}
        </Button>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            {specialityTitle}
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {filtered.map((u, index: number) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
              <UniversityCard university={u} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default SpecialityUniversitiesPage;

