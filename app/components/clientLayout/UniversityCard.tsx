"use client";

import Link from "next/link";
import { Box, Divider, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { PublicUniversity } from "@/lib/types";
import Image from "next/image";
import {BANNER_PLACEHOLDER_IMAGE} from "@/lib/constants";

type UniversityCardProps = {
  university: PublicUniversity;
  href?: string;
};

export function UniversityCard({ university, href }: UniversityCardProps) {
  const locale = useLocale();
  const t = useTranslations();
  const localeKey = locale as keyof PublicUniversity["name"];

  const title =
    university.short_name?.[localeKey] ??
    university.short_name?.ru ??
    university.name?.[localeKey] ??
    university.name?.ru ??
    university.name?.en ??
    "";

  const subtitle =
    university.name?.[localeKey] ??
    university.name?.ru ??
    university.name?.en ??
    "";

  return (
    <Box
      sx={{
        height: "100%",
        border: "1px solid #E0E0E0",
        p: 3,
        backgroundColor: "background.paper"
      }}
    >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                <Image src={ university.logo || BANNER_PLACEHOLDER_IMAGE} alt={title} width={60} height={60} />
                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }} noWrap>
                        {title} 
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: "12px" }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            <Divider />


            <Typography variant="subtitle2" color="text.primary" sx={{ mt: 1 }}>{t("information")}</Typography>
            <Box
              component="ul"
              sx={{
                mb: 1,
                pl: 2,
                display: "grid",
                gap: 0.5,
                color: "text.primary",
                fontSize: 13,
              }}
            >
              {university.dormitory && (
                <Box component="li">
                  {t("dormitory")}
                </Box>
              )}
              {university.military_faculty && (
                <Box component="li">
                  {t("military_faculty")}
                </Box>
              )}
              {university.price && (
                <Box component="li">
                  {t("price")}: {university.price} тг
                </Box>
              )}
              {university.specialities_count && (
                <Box component="li">
                  {t("specialities")}: {university.specialities_count}
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mt: "auto" }}>
              {university.address && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: "auto" }}>
                  {university.address}
                  </Typography>
              )}
              <Link href={university.url || ""} target="_blank" style={{ textDecoration: "underline" , fontSize: "12px", color: "blue" }}> {t("more")}</Link>
            </Box>
        </Box>
    </Box>
  );
}

