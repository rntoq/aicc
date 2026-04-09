"use client";

import { useMemo, useState } from "react";
import { Box, Link, TextField, Typography } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { AppLayout } from "@/app/components/layout/AppLayout";
import type { PublicSpeciality } from "@/lib/types";
import SPECIALITIES_JSON from "@/public/specialities.json";
import { useInstitutions } from "@/lib/services/careerServices";

const EducationPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [q, setQ] = useState("");

  // Backend institutions list (used for future UI; keep JSON data as-is).
  useInstitutions();

  const specialities = useMemo(() => SPECIALITIES_JSON as PublicSpeciality[], []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return specialities;

    return specialities.filter((s) => {
      const name = s.name?.[locale as keyof PublicSpeciality["name"]] ?? "";
      return s.code.toLowerCase().includes(query) || name.toLowerCase().includes(query);
    });
  }, [q, specialities, locale]);

  return (
    <AppLayout title={t("education")}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {t(
              "education_specialities_subtitle",
              { defaultValue: "Choose a speciality to see universities." } as never
            )}
          </Typography>
        </Box>

        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search", { defaultValue: "Search" } as never)}
          fullWidth
        />

        {filtered.map((s) => (
          <Box key={s.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {s.name?.[locale as keyof PublicSpeciality["name"]]} -
            <Link
              href={`/client/education/${encodeURIComponent(String(s.id))}`}
              style={{
                textDecoration: "underline",
                color: "blue",
                fontSize: "16px",
                fontWeight: "300",
              }}
            >
              {t("code")}: {s.code}
            </Link>
          </Box>
        ))}
      </Box>
    </AppLayout>
  );
};

export default EducationPage;

