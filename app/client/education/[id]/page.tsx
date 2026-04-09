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
import { useInstitutions } from "@/lib/services/careerServices";

const normalizeName = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[«»\"“”]/g, "");

const SpecialityUniversitiesPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const idParam = typeof params.id === "string" ? params.id : "";
  const id = Number.parseInt(idParam, 10);

  // Backend institutions list (used for future UI; keep JSON data as-is).
  useInstitutions();

  const specialities = useMemo(() => SPECIALITIES_JSON as PublicSpeciality[], []);
  const speciality = useMemo(
    () => specialities.find((s) => s.id === id) ?? null,
    [specialities, id]
  );

  const specialityTitle =
    speciality?.name?.[locale as keyof PublicSpeciality["name"]] ?? idParam;

  const [q, setQ] = useState("");
  const universities = useMemo(() => UNIVERSITIES_JSON as PublicUniversity[], []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const specialityUniNames = new Set(
      (speciality?.Universities ?? []).map((n) => n.trim()).filter(Boolean)
    );

    const scoped = universities.filter((u) => {
      const shortEn = u.short_name?.en ?? "";
      return specialityUniNames.has(shortEn);
    });

    const byNormName = new Map<string, PublicUniversity>();
    for (const u of scoped) {
      const keys = [
        u.short_name?.en,
        u.short_name?.ru,
        u.short_name?.kk,
        u.name?.en,
        u.name?.ru,
        u.name?.kk,
      ]
        .filter(Boolean)
        .map((x) => normalizeName(x as string));
      for (const k of keys) {
        if (!byNormName.has(k)) byNormName.set(k, u);
      }
    }

    const ordered = (speciality?.Universities ?? [])
      .map((su) => {
        const key = normalizeName(su);
        return byNormName.get(key);
      })
      .filter(Boolean) as PublicUniversity[];

    // `speciality.Universities` может содержать дубликаты строк, которые мапятся
    // на один и тот же университет → дубли по `id` ломают React keys.
    const seenIds = new Set<number>();
    const uniqueOrdered = ordered.filter((u) => {
      if (seenIds.has(u.id)) return false;
      seenIds.add(u.id);
      return true;
    });

    if (!query) return uniqueOrdered;

    return uniqueOrdered.filter((u) => {
      const name = u.name?.[locale as keyof PublicUniversity["name"]] ?? "";
      return u.code.toLowerCase().includes(query) || name.toLowerCase().includes(query);
    });
  }, [q, universities, locale, speciality]);

  return (
    <AppLayout title={specialityTitle}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          component={Link}
          href="/client/education"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ alignSelf: "flex-start" }}
        >
          {t("back", { defaultValue: "Back" } as never)}
        </Button>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            {specialityTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("education_universities_subtitle", {
              defaultValue: "Universities for this speciality.",
            } as never)}
          </Typography>
        </Box>

        {speciality && (speciality.Universities?.length ?? 0) === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("education_no_universities", {
              defaultValue: "No universities found for this speciality.",
            } as never)}
          </Typography>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map((u) => (
              <Grid
                key={`${u.id}`}
                size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}
              >
                <UniversityCard university={u} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </AppLayout>
  );
};

export default SpecialityUniversitiesPage;

