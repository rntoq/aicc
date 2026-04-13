
import type { ComponentType } from "react";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

export const BASE_URL = "https://dimplom-j8u3.onrender.com";

export const BANNER_PLACEHOLDER_IMAGE = "/images/default.png";

export interface Industry {
  id: string;
  nameKey: string;
  /** First line of description (headline) */
  descKey: string;
  /** Filter category for chips: technology | creative | social | government | engineering */
  filterCategory: string;
  /** MUI icon name for IndustryIconMap */
  iconKey: string;
}

/** Filter categories for the industries block (id → i18n key) */
export const FILTER_CATEGORIES: { id: string; nameKey: string }[] = [
  { id: "all", nameKey: "careers_filter_all" },
  { id: "technology", nameKey: "careers_filter_technology" },
  { id: "creative", nameKey: "careers_filter_creative" },
  { id: "social", nameKey: "careers_filter_social" },
  { id: "government", nameKey: "careers_filter_government" },
  { id: "engineering", nameKey: "careers_filter_engineering" },
];

/** Career industries: name, short description, filter, icon (kept in sync with public/Industries.json) */
export const INDUSTRIES: Industry[] = [
  {
    id: "it_technology",
    nameKey: "it_technology",
    descKey: "desc_it",
    filterCategory: "technology",
    iconKey: "computer",
  },
  {
    id: "design_creative",
    nameKey: "design_creative",
    descKey: "desc_design",
    filterCategory: "creative",
    iconKey: "palette",
  },
  {
    id: "business_management",
    nameKey: "business_management",
    descKey: "desc_business",
    filterCategory: "social",
    iconKey: "business_center",
  },
  {
    id: "marketing_sales",
    nameKey: "marketing_sales",
    descKey: "desc_marketing",
    filterCategory: "creative",
    iconKey: "trending_up",
  },
  {
    id: "finance_accounting",
    nameKey: "finance_accounting",
    descKey: "desc_finance",
    filterCategory: "technology",
    iconKey: "attach_money",
  },
  {
    id: "healthcare_medicine",
    nameKey: "healthcare_medicine",
    descKey: "desc_healthcare",
    filterCategory: "social",
    iconKey: "local_hospital",
  },
  {
    id: "education_training",
    nameKey: "education_training",
    descKey: "desc_education",
    filterCategory: "social",
    iconKey: "school",
  },
  {
    id: "human_resources",
    nameKey: "human_resources",
    descKey: "desc_hr",
    filterCategory: "social",
    iconKey: "people",
  },
  {
    id: "media_communications",
    nameKey: "media_communications",
    descKey: "desc_media",
    filterCategory: "creative",
    iconKey: "tv",
  },
  {
    id: "law_enforcement_security",
    nameKey: "law_enforcement_security",
    descKey: "desc_law_enforcement",
    filterCategory: "government",
    iconKey: "security",
  },
  {
    id: "law_legal",
    nameKey: "law_legal",
    descKey: "desc_law",
    filterCategory: "government",
    iconKey: "gavel",
  },
  {
    id: "engineering_manufacturing",
    nameKey: "engineering_manufacturing",
    descKey: "desc_engineering",
    filterCategory: "engineering",
    iconKey: "engineering",
  },
  {
    id: "transportation_logistics",
    nameKey: "transportation_logistics",
    descKey: "desc_logistics",
    filterCategory: "engineering",
    iconKey: "local_shipping",
  },
  {
    id: "agriculture_environment",
    nameKey: "agriculture_environment",
    descKey: "desc_agriculture",
    filterCategory: "engineering",
    iconKey: "grass",
  },
  {
    id: "skilled_trades_services",
    nameKey: "skilled_trades_services",
    descKey: "desc_trades",
    filterCategory: "engineering",
    iconKey: "build",
  },
  {
    id: "arts_entertainment",
    nameKey: "arts_entertainment",
    descKey: "desc_arts",
    filterCategory: "creative",
    iconKey: "theater_comedy",
  },
  {
    id: "sports_fitness",
    nameKey: "sports_fitness",
    descKey: "desc_sports",
    filterCategory: "social",
    iconKey: "sports_soccer",
  },
  {
    id: "hospitality_tourism",
    nameKey: "hospitality_tourism",
    descKey: "desc_hospitality",
    filterCategory: "social",
    iconKey: "hotel",
  },
];

// ===== Tests metadata (used on tests pages and landing) =====

export interface TestItem {
  id: string;
  name: string;
  icon: ComponentType;
  /** For recommended set: true = обязательный, false = опциональный */
  required?: boolean;
  /** Duration in minutes */
  duration?: number;
  /** Question count (for card display) */
  questions?: number;
  /** Category i18n key for card (tests_${id}_category) */
  categoryKey?: string;
}

/** Recommended set: 3 required + 2 optional (order matters) */
export const RECOMMENDED_TEST_IDS: string[] = [
  "holland",
  "career-aptitude",
  "big-five",
  "photo-career",
  "typefinder-16",
];

export const ALL_TESTS: TestItem[] = [
  {
    id: "holland",
    name: "Holland Code (RIASEC)",
    icon: PsychologyOutlinedIcon,
    required: true,
    duration: 8,
    questions: 48,
  },
  {
    id: "career-aptitude",
    name: "Career Aptitude Test",
    icon: FavoriteBorderOutlinedIcon,
    required: true,
    duration: 12,
    questions: 94,
  },
  {
    id: "big-five",
    name: "Big Five Personality (OCEAN)",
    icon: PersonOutlinedIcon,
    required: true,
    duration: 10,
    questions: 74,
  },
  {
    id: "photo-career",
    name: "Photo Career Quiz",
    icon: PhotoCameraOutlinedIcon,
    duration: 7,
    questions: 30,
  },
  {
    id: "disc",
    name: "DiSC Assessment",
    icon: PersonOutlineOutlinedIcon,
    duration: 5,
    questions: 38,
  },
  {
    id: "eq",
    name: "Emotional Intelligence (EQ)",
    icon: EmojiEmotionsOutlinedIcon,
    duration: 8,
    questions: 55,
  },
  {
    id: "leadership",
    name: "Leadership Style Assessment",
    icon: PersonOutlineOutlinedIcon,
    duration: 8,
    questions: 36,
  },
  {
    id: "enneagram",
    name: "Enneagram Personality Test",
    icon: StarBorderOutlinedIcon,
    duration: 10,
    questions: undefined,
  },
  {
    id: "typefinder-16",
    name: "16 Types (TypeFinder)",
    icon: PersonOutlineOutlinedIcon,
    duration: 12,
    questions: undefined,
  },
  {
    id: "strengths",
    name: "Personal Strengths Test",
    icon: StarBorderOutlinedIcon,
    duration: 10,
    questions: undefined,
  },
];

export const getTestById = (id: string): TestItem | undefined =>
  ALL_TESTS.find((t) => t.id === id);

export const getRecommendedTests = (): TestItem[] =>
  RECOMMENDED_TEST_IDS.map((id) => getTestById(id)).filter(
    (t): t is TestItem => t != null
  );

