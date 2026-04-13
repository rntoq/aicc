"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Divider, Icon, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { PublicUniversity } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import {BANNER_PLACEHOLDER_IMAGE} from "@/utils/constants";
import {AttachMoneyOutlined, BedOutlined, MilitaryTechOutlined} from "@mui/icons-material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

type UniversityCardProps = {
  university: PublicUniversity;
  href?: string;
};

export function UniversityCard({ university, href }: UniversityCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const localeKey = locale as keyof PublicUniversity["name"];
  const [imgSrc, setImgSrc] = useState(university.logo || BANNER_PLACEHOLDER_IMAGE);

  const title =
    university.short_name?.[localeKey] ?? "";

  const subtitle =
    university.name?.[localeKey] ??
    "";

  return (
    <Box
      onClick={href ? () => router.push(href) : undefined}
      sx={{
        height: "100%",
        border: "1px solid #E0E0E0",
        p: 3,
        backgroundColor: "background.paper",
        ...(href ? { cursor: "pointer" } : {}),
      }}
    >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                <Image
                  src={imgSrc}
                  alt={title}
                  width={60}
                  height={60}
                  onError={() => setImgSrc(BANNER_PLACEHOLDER_IMAGE)}
                />
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


            <Typography variant="subtitle2" color="text.primary" sx={{ mt: 1 }}>{t("information")}:</Typography>
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
                <Box component="li" sx={styles.listItem}>
                  <Icon component={BedOutlined} sx={{ fontSize: "16px" }}/>{t("dormitory")}
                </Box>
              )}
              {university.military_faculty && (
                <Box component="li" sx={styles.listItem}>
                  <Icon component={MilitaryTechOutlined} sx={{ fontSize: "16px" }}/>{t("military_faculty")}
                </Box>
              )}
              {university.price && (
                <Box component="li" sx={styles.listItem}>
                  <Icon component={AttachMoneyOutlined} sx={{ fontSize: "16px" }}/>{t("price")}: {university.price} тг
                </Box>
              )}
              {university.specialities_count && (
                <Box component="li" sx={styles.listItem}>
                  <Icon component={SchoolOutlinedIcon} sx={{ fontSize: "16px" }}/>{t("specialities")}: {university.specialities_count}
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mt: "auto" }}>
              {/* {university.address && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: "auto" }}>
                  {university.address}
                  </Typography>
              )} */}
              <Link
                href={href ?? ""}
                style={{ textDecoration: "underline", fontSize: "12px", color: "blue", marginLeft: "auto" }}
              >
                {t("more")}
              </Link>
            </Box>
        </Box>
    </Box>
  );
}

const styles = {
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },
};