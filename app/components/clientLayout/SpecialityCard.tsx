"use client";

import Link from "next/link";
import { Box, Chip, Typography } from "@mui/material";
import { useLocale } from "next-intl";
import type { PublicSpeciality } from "@/lib/types";

type SpecialityCardProps = {
  speciality: PublicSpeciality;
  href: string;
};

export function SpecialityCard({ speciality, href }: SpecialityCardProps) {
  const locale = useLocale();
  const localeKey = locale as keyof PublicSpeciality["name"];

  const title =
    speciality.name?.[localeKey] ??
    speciality.name?.ru ??
    speciality.name?.en ??
    "";

  return (
    <Box
      component={Link}
      href={href}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        width: "100%",
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        px: 2,
        py: 1.5,
        textDecoration: "none",
        color: "inherit",
        backgroundColor: "background.paper"
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          lineHeight: 1.25,
          minWidth: 0,
        }}
      >
        {title}
      </Typography>

      <Chip
        size="small"
        label={speciality.code}
        variant="outlined"
        sx={{ flexShrink: 0, fontWeight: 600 }}
      />
    </Box>
  );
}

