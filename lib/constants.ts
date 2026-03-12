
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
