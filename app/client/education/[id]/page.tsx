"use client";

import { useMemo } from "react";
import { Box, Button, Divider, Icon, Link, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { AppLayout } from "@/app/components/layout/AppLayout";
import type { PublicSpeciality, PublicUniversity } from "@/lib/types";
import SPECIALITIES_JSON from "@/public/jsons/specialities.json";
import UNIVERSITIES_JSON from "@/public/jsons/universities.json";
import { useInstitutions } from "@/lib/services/careerServices";
import Image from "next/image";
import { BANNER_PLACEHOLDER_IMAGE } from "@/utils/constants";
import { AttachMoneyOutlined, BedOutlined, LocationOnOutlined, MilitaryTechOutlined } from "@mui/icons-material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { useQuery } from "@tanstack/react-query";
import { institutionServices } from "@/lib/services/careerServices";

const listsUniversity = (s: PublicSpeciality, u: PublicUniversity) => {
  const shortEn = (u.short_name?.en ?? "").trim();
  if (!shortEn) return false;
  return (s.Universities ?? []).some((name) => name.trim() === shortEn);
};

const UniversitySpecialitiesPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const idParam = typeof params.id === "string" ? params.id : "";
  const id = Number.parseInt(idParam, 10);
  const universities = useMemo(
    () => UNIVERSITIES_JSON as Array<PublicUniversity & { slug?: string }>,
    []
  );
  const institutionSlug = useMemo(() => {
    const current = universities.find((u) => u.id === id);
    return current?.slug ?? null;
  }, [universities, id]);

  useInstitutions();
  useQuery({
    queryKey: ["institutions", "detail", idParam],
    queryFn: async () => {
      const { body, error } = await institutionServices.getInstitution(institutionSlug as string);
      if (error) throw error;
      return body;
    },
    enabled: !!idParam && !!institutionSlug,
  });
  useQuery({
    queryKey: ["institutions", "programs", idParam],
    queryFn: async () => {
      const { body, error } = await institutionServices.listInstitutionPrograms(institutionSlug as string);
      if (error) throw error;
      return body;
    },
    enabled: !!idParam && !!institutionSlug,
  });

  const university = useMemo(
    () => universities.find((u) => u.id === id) ?? null,
    [universities, id]
  );

  const specialities = useMemo(() => SPECIALITIES_JSON as PublicSpeciality[], []);

  const universityTitle =
    university?.short_name?.[locale as keyof PublicUniversity["short_name"]] ??
    university?.name?.[locale as keyof PublicUniversity["name"]] ??
    idParam;

  const filteredSpecialities = useMemo(() => {
    if (!university) return [];

    return specialities.filter((s) => listsUniversity(s, university));
  }, [specialities, university]);

  const localeKey = locale as keyof PublicUniversity["name"];
  const title = university?.short_name?.[localeKey] ?? "";
  const subtitle = university?.name?.[localeKey] ?? "";
  const logoSrc = university?.logo || BANNER_PLACEHOLDER_IMAGE;

  return (
    <AppLayout title={universityTitle}>
      <Box sx={styles.page}>
        <Button
          component={NextLink}
          href="/client/education"
          startIcon={<ArrowBackRoundedIcon />}
          sx={styles.backButton}
        >
          {t("back")}
        </Button>

        {!university ? (
          <Typography variant="body2" color="text.secondary">
            {t("education_university_not_found")}
          </Typography>
        ) : (
            <Box sx={styles.card}>
              <Box sx={styles.cardContent}>
                <Box sx={styles.cardHeader}>
                  <Image src={logoSrc} alt={title} width={100} height={100} />
                  <Box sx={styles.titleBlock}>
                    <Typography component="h2" variant="h2" sx={styles.title}>
                      {title}
                    </Typography>
                    <Typography component="h6" variant="h6" color="text.secondary">
                      {subtitle}
                    </Typography>
                  </Box>
                  <Link
                    href={university.url || ""}
                    target="_blank"
                    underline="always"
                    sx={styles.moreLink}
                  >
                    {t("more")}
                  </Link>
                </Box>

                <Divider />

                <Typography variant="subtitle2" color="text.primary" sx={styles.infoTitle}>
                  {t("information")}:
                </Typography>
                <Box component="ul" sx={styles.infoList}>
                  {university.dormitory && (
                    <Box component="li" sx={styles.listItem}>
                      <Icon component={BedOutlined} sx={{ fontSize: "16px" }} />
                      {t("dormitory")}
                    </Box>
                  )}
                  {university.military_faculty && (
                    <Box component="li" sx={styles.listItem}>
                      <Icon component={MilitaryTechOutlined} sx={{ fontSize: "16px" }} />
                      {t("military_faculty")}
                    </Box>
                  )}
                  {university.price && (
                    <Box component="li" sx={styles.listItem}>
                      <Icon component={AttachMoneyOutlined} sx={{ fontSize: "16px" }} />
                      {t("price")}: {university.price} тг
                    </Box>
                  )}
                  {university.address && (
                    <Box component="li" sx={styles.listItem}>
                      <Icon component={LocationOnOutlined} sx={{ fontSize: "16px" }} />
                      {t("address")}: {university.address}
                    </Box>
                  )}
                  {university.specialities_count && (
                    <Box component="li" sx={styles.listItem}>
                      <Icon component={SchoolOutlinedIcon} sx={{ fontSize: "16px" }} />
                      {t("specialities")}: {university.specialities_count}
                    </Box>
                  )}
                </Box>

                {filteredSpecialities.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t("education_no_specialities")}
                  </Typography>
                ) : (
                  <Box sx={styles.section}>
                    <Typography variant="subtitle2" color="text.primary">
                      {t("education_specialities_subtitle")}
                    </Typography>
                    {filteredSpecialities.map((s) => (
                      <Box key={s.id} sx={styles.specialityRow}>
                        <Typography component="span" variant="body2">
                          {s.name?.[locale as keyof PublicSpeciality["name"]]}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary">
                          —
                        </Typography>
                        <Link
                          component={NextLink}
                          href={`/client/education?speciality=${encodeURIComponent(String(s.id))}`}
                          underline="always"
                          sx={styles.codeLink}
                        >
                          {t("code")}: {s.code}
                        </Link>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>  
        )}
      </Box>
    </AppLayout>
  );
};

export default UniversitySpecialitiesPage;

const styles = {
  page: { display: "flex", 
    flexDirection: "column", 
    gap: 2 
  },
  backButton: { 
    alignSelf: "flex-start" 
  },
  card: {
    border: "1px solid #E0E0E0",
    p: 3,
    borderRadius: 1,
    backgroundColor: "background.paper",
  },
  cardContent: { 
    display: "flex", 
    flexDirection: "column", 
    gap: 1.2 
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 2,
  },
  titleBlock: { 
    display: "flex", 
    flexDirection: "column", 
    textAlign: "left",
    gap: 2,
  },
  title: { 
    fontWeight: 800, 
    lineHeight: 1.2,
  },
  infoTitle: { 
    mt: 1 
  },
  infoList: {
    mb: 1,
    pl: 2,
    display: "grid",
    gap: 0.5,
    color: "text.primary",
    fontSize: 13,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },
  footer: { 
    display: "flex", 
    alignItems: "flex-end", 
    justifyContent: "space-between", 
    gap: 2 
  },
  moreLink: {
    fontSize: "16px", 
    marginLeft: "auto", 
    color: "blue",  
  },
  section: { 
    display: "flex", 
    flexDirection: "column", 
    gap: 1.5 
  },
  specialityRow: { 
    display: "flex", 
    alignItems: "center", 
    gap: 1, 
    flexWrap: "wrap" 
  },
  codeLink: { 
    fontSize: 16, 
    fontWeight: 300 
  },
};