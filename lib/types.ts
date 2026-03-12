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
  specialities: string[];
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

// ===== Quizzes (tests, categories, sessions) =====

export type QuizTestType =
  | "holland"
  | "disc"
  | "big_five"
  | "photo"
  | "career_aptitude"
  | "values"
  | "skills"
  | "eq"
  | "vark"
  | "motivation"
  | "strengths"
  | (string & {});

export type QuizTier = "core" | "additional" | (string & {});

export type QuizListParams = {
  type?: QuizTestType;
  tier?: QuizTier;
  mandatory?: boolean;
  free?: boolean;
};

export interface QuizTest {
  id: number;
  title: string;
  slug: string;
  description: string;
  category_name: string;
  category_type: QuizTestType;
  tier: QuizTier;
  is_mandatory: boolean;
  weight: number;
  price: number;
  icon: string;
  color: string;
  duration_minutes: number;
  is_free: boolean;
  total_questions: number;
}

export interface QuizCategory {
  id: number;
  name: string;
  slug: string;
  test_type: QuizTestType;
  tier: QuizTier;
  description: string;
  icon: string;
  color: string;
  is_free: boolean;
  is_mandatory: boolean;
  price: number;
  weight: number;
  order: number;
  tests: QuizTest[];
}

export interface QuizTestTypeMeta {
  name: string;
  question_type: "scale" | "image_pair" | "single" | (string & {});
  submit_field: "scale_value" | "answer_id" | "answer_code" | (string & {});
  submit_example?: Record<string, unknown>;
  scales?: string[];
  scale_range?: {
    min: number;
    max: number;
  };
  min_value?: number;
  max_value?: number;
  example?: unknown;
  [key: string]: unknown;
}

export type QuizTestTypeMetaResponse = Record<QuizTestType, QuizTestTypeMeta>;

export interface QuizSession {
  id: number;
  test_slug: string;
  test_type: QuizTestType;
  completed: boolean;
  progress?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export type QuizSessionsListItem = QuizSession & {
  result_id?: number | null;
};

export type QuizSessionsListParams = {
  completed?: boolean;
  type?: QuizTestType;
};

export interface QuizMyResultsResponse {
  total_tests_available: number;
  total_tests_completed: number;
  mandatory_completed: number;
  mandatory_total: number;
  can_get_recommendations: boolean;
  results: unknown[];
}

export interface QuizResult {
  id: number;
  test_title: string;
  test_type: QuizTestType;
  scores?: Record<string, number>;
  primary_type?: string;
  secondary_type?: string | null;
  summary?: string;
  detailed_report?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface QuickQuizPayload {
  test_type: QuizTestType;
  questions: unknown[];
  meta?: Record<string, unknown>;
}

export type QuickQuizResult = QuizResult;

export type SubmitQuickQuizVariables = {
  testType: QuizTestType;
  body: Record<string, unknown>;
};

export type StartQuizSessionVariables = {
  test_slug: string;
};

export type AnswerQuizQuestionPayload =
  | {
      session_id: number | string;
      question_id: number | string;
      scale_value: number;
    }
  | {
      session_id: number | string;
      question_id: number | string;
      answer_id: number | string;
    }
  | {
      session_id: number | string;
      question_id: number | string;
      answer_code: string;
    };

export interface AnswerQuizQuestionResponse {
  status: string;
  answered: number;
  total: number;
  progress: number;
  [key: string]: unknown;
}

export interface BulkAnswerQuizPayload {
  session_id: number | string;
  answers: {
    question_id: number | string;
    scale_value?: number;
    answer_id?: number | string;
    answer_code?: string;
  }[];
}

export interface BulkAnswerQuizResponse {
  status: string;
  saved: number;
  errors: unknown[];
  total_questions: number;
  answered: number;
  [key: string]: unknown;
}

export type FinishQuizSessionVariables = {
  session_id: number | string;
};
