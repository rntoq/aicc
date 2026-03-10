/**
 * Industries and professions data (API-ready structure).
 * i18n: careers_industry_{id}, careers_industry_desc_{id}
 */

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
    id: "it",
    nameKey: "careers_industry_it",
    descKey: "careers_industry_desc_it",
    filterCategory: "technology",
    iconKey: "computer",
  },
  {
    id: "design",
    nameKey: "careers_industry_design",
    descKey: "careers_industry_desc_design",
    filterCategory: "creative",
    iconKey: "palette",
  },
  {
    id: "business",
    nameKey: "careers_industry_business",
    descKey: "careers_industry_desc_business",
    filterCategory: "social",
    iconKey: "business_center",
  },
  {
    id: "marketing",
    nameKey: "careers_industry_marketing",
    descKey: "careers_industry_desc_marketing",
    filterCategory: "creative",
    iconKey: "trending_up",
  },
  {
    id: "finance",
    nameKey: "careers_industry_finance",
    descKey: "careers_industry_desc_finance",
    filterCategory: "technology",
    iconKey: "attach_money",
  },
  {
    id: "healthcare",
    nameKey: "careers_industry_healthcare",
    descKey: "careers_industry_desc_healthcare",
    filterCategory: "social",
    iconKey: "local_hospital",
  },
  {
    id: "education",
    nameKey: "careers_industry_education",
    descKey: "careers_industry_desc_education",
    filterCategory: "social",
    iconKey: "school",
  },
  {
    id: "hr",
    nameKey: "careers_industry_hr",
    descKey: "careers_industry_desc_hr",
    filterCategory: "social",
    iconKey: "people",
  },
  {
    id: "media",
    nameKey: "careers_industry_media",
    descKey: "careers_industry_desc_media",
    filterCategory: "creative",
    iconKey: "tv",
  },
  {
    id: "government",
    nameKey: "careers_industry_government",
    descKey: "careers_industry_desc_government",
    filterCategory: "government",
    iconKey: "account_balance",
  },
  {
    id: "military",
    nameKey: "careers_industry_military",
    descKey: "careers_industry_desc_military",
    filterCategory: "government",
    iconKey: "military_tech",
  },
  {
    id: "law_enforcement",
    nameKey: "careers_industry_law_enforcement",
    descKey: "careers_industry_desc_law_enforcement",
    filterCategory: "government",
    iconKey: "security",
  },
  {
    id: "law",
    nameKey: "careers_industry_law",
    descKey: "careers_industry_desc_law",
    filterCategory: "government",
    iconKey: "gavel",
  },
  {
    id: "engineering",
    nameKey: "careers_industry_engineering",
    descKey: "careers_industry_desc_engineering",
    filterCategory: "engineering",
    iconKey: "engineering",
  },
  {
    id: "logistics",
    nameKey: "careers_industry_logistics",
    descKey: "careers_industry_desc_logistics",
    filterCategory: "engineering",
    iconKey: "local_shipping",
  },
  {
    id: "agriculture",
    nameKey: "careers_industry_agriculture",
    descKey: "careers_industry_desc_agriculture",
    filterCategory: "engineering",
    iconKey: "grass",
  },
  {
    id: "trades",
    nameKey: "careers_industry_trades",
    descKey: "careers_industry_desc_trades",
    filterCategory: "engineering",
    iconKey: "build",
  },
  {
    id: "arts",
    nameKey: "careers_industry_arts",
    descKey: "careers_industry_desc_arts",
    filterCategory: "creative",
    iconKey: "theater_comedy",
  },
  {
    id: "sports",
    nameKey: "careers_industry_sports",
    descKey: "careers_industry_desc_sports",
    filterCategory: "social",
    iconKey: "sports_soccer",
  },
  {
    id: "hospitality",
    nameKey: "careers_industry_hospitality",
    descKey: "careers_industry_desc_hospitality",
    filterCategory: "social",
    iconKey: "hotel",
  },
];
