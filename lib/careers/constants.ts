/**
 * Industries and professions data (API-ready structure).
 * i18n: careers_industry_{id}, careers_industry_desc_{id}, careers_industry_tags_{id}
 */

export interface Industry {
  id: string;
  nameKey: string;
  /** First line of description (headline) */
  descKey: string;
  /** Second line (tags, e.g. "Разработка, данные, ИИ") */
  tagsKey: string;
  /** Filter category for chips: technology | creative | social | government | engineering */
  filterCategory: string;
  /** MUI icon name for IndustryIconMap */
  iconKey: string;
  /** Optional: top profession title keys for hover tooltip */
  topProfessionKeys?: string[];
}

export interface Profession {
  id: string;
  titleKey: string;
  shortDescKey: string;
  salaryRange: string;
  demandKey: string;
  matchPercent?: number;
  industryId: string;
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
    tagsKey: "careers_industry_tags_it",
    filterCategory: "technology",
    iconKey: "computer",
    topProfessionKeys: ["careers_prof_title_frontend", "careers_prof_title_data_analyst", "careers_prof_title_backend"],
  },
  {
    id: "design",
    nameKey: "careers_industry_design",
    descKey: "careers_industry_desc_design",
    tagsKey: "careers_industry_tags_design",
    filterCategory: "creative",
    iconKey: "palette",
    topProfessionKeys: ["careers_prof_title_ux_designer"],
  },
  {
    id: "business",
    nameKey: "careers_industry_business",
    descKey: "careers_industry_desc_business",
    tagsKey: "careers_industry_tags_business",
    filterCategory: "social",
    iconKey: "business_center",
    topProfessionKeys: ["careers_prof_title_product_manager"],
  },
  {
    id: "marketing",
    nameKey: "careers_industry_marketing",
    descKey: "careers_industry_desc_marketing",
    tagsKey: "careers_industry_tags_marketing",
    filterCategory: "creative",
    iconKey: "trending_up",
  },
  {
    id: "finance",
    nameKey: "careers_industry_finance",
    descKey: "careers_industry_desc_finance",
    tagsKey: "careers_industry_tags_finance",
    filterCategory: "technology",
    iconKey: "attach_money",
  },
  {
    id: "healthcare",
    nameKey: "careers_industry_healthcare",
    descKey: "careers_industry_desc_healthcare",
    tagsKey: "careers_industry_tags_healthcare",
    filterCategory: "social",
    iconKey: "local_hospital",
  },
  {
    id: "education",
    nameKey: "careers_industry_education",
    descKey: "careers_industry_desc_education",
    tagsKey: "careers_industry_tags_education",
    filterCategory: "social",
    iconKey: "school",
  },
  {
    id: "hr",
    nameKey: "careers_industry_hr",
    descKey: "careers_industry_desc_hr",
    tagsKey: "careers_industry_tags_hr",
    filterCategory: "social",
    iconKey: "people",
  },
  {
    id: "media",
    nameKey: "careers_industry_media",
    descKey: "careers_industry_desc_media",
    tagsKey: "careers_industry_tags_media",
    filterCategory: "creative",
    iconKey: "tv",
  },
  {
    id: "government",
    nameKey: "careers_industry_government",
    descKey: "careers_industry_desc_government",
    tagsKey: "careers_industry_tags_government",
    filterCategory: "government",
    iconKey: "account_balance",
  },
  {
    id: "military",
    nameKey: "careers_industry_military",
    descKey: "careers_industry_desc_military",
    tagsKey: "careers_industry_tags_military",
    filterCategory: "government",
    iconKey: "military_tech",
  },
  {
    id: "law_enforcement",
    nameKey: "careers_industry_law_enforcement",
    descKey: "careers_industry_desc_law_enforcement",
    tagsKey: "careers_industry_tags_law_enforcement",
    filterCategory: "government",
    iconKey: "security",
  },
  {
    id: "law",
    nameKey: "careers_industry_law",
    descKey: "careers_industry_desc_law",
    tagsKey: "careers_industry_tags_law",
    filterCategory: "government",
    iconKey: "gavel",
  },
  {
    id: "engineering",
    nameKey: "careers_industry_engineering",
    descKey: "careers_industry_desc_engineering",
    tagsKey: "careers_industry_tags_engineering",
    filterCategory: "engineering",
    iconKey: "engineering",
  },
  {
    id: "logistics",
    nameKey: "careers_industry_logistics",
    descKey: "careers_industry_desc_logistics",
    tagsKey: "careers_industry_tags_logistics",
    filterCategory: "engineering",
    iconKey: "local_shipping",
  },
  {
    id: "agriculture",
    nameKey: "careers_industry_agriculture",
    descKey: "careers_industry_desc_agriculture",
    tagsKey: "careers_industry_tags_agriculture",
    filterCategory: "engineering",
    iconKey: "grass",
  },
  {
    id: "trades",
    nameKey: "careers_industry_trades",
    descKey: "careers_industry_desc_trades",
    tagsKey: "careers_industry_tags_trades",
    filterCategory: "engineering",
    iconKey: "build",
  },
  {
    id: "arts",
    nameKey: "careers_industry_arts",
    descKey: "careers_industry_desc_arts",
    tagsKey: "careers_industry_tags_arts",
    filterCategory: "creative",
    iconKey: "theater_comedy",
  },
  {
    id: "sports",
    nameKey: "careers_industry_sports",
    descKey: "careers_industry_desc_sports",
    tagsKey: "careers_industry_tags_sports",
    filterCategory: "social",
    iconKey: "sports_soccer",
  },
  {
    id: "hospitality",
    nameKey: "careers_industry_hospitality",
    descKey: "careers_industry_desc_hospitality",
    tagsKey: "careers_industry_tags_hospitality",
    filterCategory: "social",
    iconKey: "hotel",
  },
];

/** IDs of industries to highlight as "recommended" when user has test result (first 3) */
export const RECOMMENDED_INDUSTRY_IDS = ["it", "design", "business"];

/** Sample top-5 professions for personal result block (replace with API later) */
export const SAMPLE_RECOMMENDED_PROFESSIONS: Profession[] = [
  {
    id: "frontend",
    titleKey: "careers_prof_title_frontend",
    shortDescKey: "careers_prof_desc_frontend",
    salaryRange: "500k–1.5M ₸",
    demandKey: "careers_demand_high",
    matchPercent: 92,
    industryId: "it",
  },
  {
    id: "data_analyst",
    titleKey: "careers_prof_title_data_analyst",
    shortDescKey: "careers_prof_desc_data_analyst",
    salaryRange: "450k–1.2M ₸",
    demandKey: "careers_demand_high",
    matchPercent: 88,
    industryId: "it",
  },
  {
    id: "ux_designer",
    titleKey: "careers_prof_title_ux_designer",
    shortDescKey: "careers_prof_desc_ux_designer",
    salaryRange: "400k–1.2M ₸",
    demandKey: "careers_demand_high",
    matchPercent: 85,
    industryId: "design",
  },
  {
    id: "product_manager",
    titleKey: "careers_prof_title_product_manager",
    shortDescKey: "careers_prof_desc_product_manager",
    salaryRange: "600k–1.8M ₸",
    demandKey: "careers_demand_high",
    matchPercent: 82,
    industryId: "it",
  },
  {
    id: "backend",
    titleKey: "careers_prof_title_backend",
    shortDescKey: "careers_prof_desc_backend",
    salaryRange: "500k–1.5M ₸",
    demandKey: "careers_demand_high",
    matchPercent: 79,
    industryId: "it",
  },
];

export const MAX_INDUSTRIES_SELECT = 5;
