export type UserRole = "student" | "parent" | "institution";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  city?: string;
  date_of_birth?: string;
  age?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  age?: number;
  phone?: string;
  city?: string;
  role?: UserRole;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshResponse {
  access: string;
}

// ===== Careers / Industries =====

/**
 * Backend/API Industry type (from `/api/v1/...`).
 * Note: differs from `PublicIndustry` which comes from `public/Industries.json`.
 */
export interface Industry {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

// ===== Holland quiz result (finish session) =====

export interface HollandScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface HollandSessionFinishResponse {
  id: number;
  test_title: string;
  test_type: "holland";
  scores: HollandScores;
  primary_type: string;
  secondary_type: string;
  summary: string;
  detailed_report: string;
  created_at: string;
}


// ===== Professions =====

export interface Profession {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

// ===== Public JSON datasets (stored in /public) =====

export type LocalizedText = {
  ru: string | null;
  kk: string | null;
  en: string | null;
};

export type SalaryKzt = {
  min: number | null;
  max: number | null;
  average: number | null;
};

export type ProfessionDemandLevel =
  | "low"
  | "medium"
  | "high"
  | "very_high"
  | (string & {});

/**
 * From `public/professions.json`
 */
export type PublicProfession = {
  id: string;
  name: LocalizedText;
  /** Industry id used for grouping/filtering (e.g. `it_technology`) */
  industry: string;
  /** Specialty codes (e.g. `B049`) */
  specialties: string[];
  demand_level: ProfessionDemandLevel;
  salary_kzt: SalaryKzt;
  description?: LocalizedText;
};

/**
 * From `public/specialities.json`
 */
export type PublicSpeciality = {
  code: string;
  name: LocalizedText;
};

/**
 * From `public/universities.json`
 */
export type PublicUniversity = {
  logo: string | null;
  code: string;
  region: number | null;
  military_faculty: boolean | null;
  dormitory: boolean | null;
  price: number | null;
  paid: boolean | null;
  url: string | null;
  consult_landing_url: string | null;
  /** Count of specialities/programs in the university */
  specialities_count: number | null;
  name: LocalizedText;
  short_name: LocalizedText;
  address: string | null;
};

/**
 * From `public/Industries.json`
 */
export type PublicIndustry = {
  id: string;
  name: LocalizedText;
  professions_count: number;
};