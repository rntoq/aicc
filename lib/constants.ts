
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

/** 20 career industries: name, short description, filter, icon */
export const INDUSTRIES: Industry[] = [
  {
    id: "it_technology",
    nameKey: "industry_it_technology",
    descKey: "industry_desc_it",
    filterCategory: "technology",
    iconKey: "computer",
  },
  {
    id: "design_creative",
    nameKey: "industry_design_creative",
    descKey: "industry_desc_design",
    filterCategory: "creative",
    iconKey: "palette",
  },
  {
    id: "business_management",
    nameKey: "industry_business_management",
    descKey: "industry_desc_business",
    filterCategory: "social",
    iconKey: "business_center",
  },
  {
    id: "marketing_sales",
    nameKey: "industry_marketing_sales",
    descKey: "industry_desc_marketing",
    filterCategory: "creative",
    iconKey: "trending_up",
  },
  {
    id: "finance_accounting",
    nameKey: "industry_finance_accounting",
    descKey: "industry_desc_finance",
    filterCategory: "technology",
    iconKey: "attach_money",
  },
  {
    id: "healthcare_medicine",
    nameKey: "industry_healthcare_medicine",
    descKey: "industry_desc_healthcare",
    filterCategory: "social",
    iconKey: "local_hospital",
  },
  {
    id: "education_training",
    nameKey: "industry_education_training",
    descKey: "industry_desc_education",
    filterCategory: "social",
    iconKey: "school",
  },
  {
    id: "human_resources",
    nameKey: "industry_human_resources",
    descKey: "industry_desc_hr",
    filterCategory: "social",
    iconKey: "people",
  },
  {
    id: "media_communications",
    nameKey: "industry_media_communications",
    descKey: "industry_desc_media",
    filterCategory: "creative",
    iconKey: "tv",
  },
  {
    id: "government",
    nameKey: "industry_government",
    descKey: "industry_desc_government",
    filterCategory: "government",
    iconKey: "account_balance",
  },
  {
    id: "military",
    nameKey: "industry_military",
    descKey: "industry_desc_military",
    filterCategory: "government",
    iconKey: "military_tech",
  },
  {
    id: "law_enforcement_security",
    nameKey: "industry_law_enforcement_security",
    descKey: "industry_desc_law_enforcement",
    filterCategory: "government",
    iconKey: "security",
  },
  {
    id: "law_legal",
    nameKey: "industry_law_legal",
    descKey: "industry_desc_law",
    filterCategory: "government",
    iconKey: "gavel",
  },
  {
    id: "engineering_manufacturing",
    nameKey: "industry_engineering_manufacturing",
    descKey: "industry_desc_engineering",
    filterCategory: "engineering",
    iconKey: "engineering",
  },
  {
    id: "transportation_logistics",
    nameKey: "industry_transportation_logistics",
    descKey: "industry_desc_logistics",
    filterCategory: "engineering",
    iconKey: "local_shipping",
  },
  {
    id: "agriculture_environment",
    nameKey: "industry_agriculture_environment",
    descKey: "industry_desc_agriculture",
    filterCategory: "engineering",
    iconKey: "grass",
  },
  {
    id: "skilled_trades_services",
    nameKey: "industry_skilled_trades_services",
    descKey: "industry_desc_trades",
    filterCategory: "engineering",
    iconKey: "build",
  },
  {
    id: "arts_entertainment",
    nameKey: "industry_arts_entertainment",
    descKey: "industry_desc_arts",
    filterCategory: "creative",
    iconKey: "theater_comedy",
  },
  {
    id: "sports_fitness",
    nameKey: "industry_sports_fitness",
    descKey: "industry_desc_sports",
    filterCategory: "social",
    iconKey: "sports_soccer",
  },
  {
    id: "hospitality_tourism",
    nameKey: "industry_hospitality_tourism",
    descKey: "industry_desc_hospitality",
    filterCategory: "social",
    iconKey: "hotel",
  },
];
