"use client";

import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import Link from "next/link";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import TheaterComedyOutlinedIcon from "@mui/icons-material/TheaterComedyOutlined";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import type { Industry } from "@/lib/careers/constants";
import { useRouter } from "next/navigation";

const INDUSTRY_ICON_MAP: Record<string, React.ReactNode> = {
  computer: <ComputerOutlinedIcon />,
  palette: <PaletteOutlinedIcon />,
  business_center: <BusinessCenterOutlinedIcon />,
  trending_up: <TrendingUpRoundedIcon />,
  attach_money: <AttachMoneyOutlinedIcon />,
  local_hospital: <LocalHospitalOutlinedIcon />,
  school: <SchoolOutlinedIcon />,
  people: <PeopleOutlinedIcon />,
  tv: <TvOutlinedIcon />,
  account_balance: <AccountBalanceOutlinedIcon />,
  military_tech: <MilitaryTechOutlinedIcon />,
  security: <SecurityOutlinedIcon />,
  gavel: <GavelOutlinedIcon />,
  engineering: <EngineeringOutlinedIcon />,
  local_shipping: <LocalShippingOutlinedIcon />,
  grass: <GrassOutlinedIcon />,
  build: <BuildOutlinedIcon />,
  theater_comedy: <TheaterComedyOutlinedIcon />,
  sports_soccer: <SportsSoccerOutlinedIcon />,
  hotel: <HotelOutlinedIcon />,
};

export type TranslateFn = (key: string) => string;

type IndustryCardProps = {
  industry: Industry;
  t: TranslateFn;
  isRecommended?: boolean;
};

export function IndustryCard({ industry, t, isRecommended = false }: IndustryCardProps) {
  const icon = INDUSTRY_ICON_MAP[industry.iconKey] ?? <BusinessCenterOutlinedIcon />;
  const router = useRouter();
  return (
    <Box
      onClick={() => router.push(`/app/careers/${industry.id}`)}
      sx={styles.card}
    >
      <Box sx={styles.cardContent}>
        {isRecommended && (
          <Chip
            size="small"
            icon={<StarOutlineRoundedIcon sx={styles.starIcon} />}
            label={t("careers_recommended_badge")}
            sx={styles.recommendedChip}
          />
        )}
        <Box sx={styles.iconBox}>
          {icon}
        </Box>
        <Typography variant="subtitle1" sx={styles.title}>
          {t(industry.nameKey)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={styles.desc}>
          {t(industry.descKey)}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={styles.tags}>
          {t(industry.tagsKey)}
        </Typography>
      </Box>
    </Box>
  );
}

const styles = {
  card: {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    height: "100%",
    borderRadius: 2,
    border: "1px solid #e0e0e0",
    bgcolor: "background.paper",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:hover": {
      border: "1px solid #7f7fd5",
      boxShadow: 1,
    },
  },
  cardContent: {
    p: 2,
    "&:last-child": { pb: 2 },
  },
  starIcon: { fontSize: 14 },
  recommendedChip: {
    mb: 1.5,
    fontWeight: 600,
    bgcolor: "warning.light",
    color: "warning.dark",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 1.5,
    bgcolor: "action.hover",
    color: "text.secondary",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 1.5,
  },
  title: { fontWeight: 600, mb: 0.5 },
  desc: { lineHeight: 1.4, mb: 0.5 },
  tags: { opacity: 0.9 },
};
