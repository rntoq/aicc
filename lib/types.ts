export type UserRole = "student" | "parent" | "institution";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  /** URL или путь к аватару (GET/PATCH /api/v1/auth/me/) */
  avatar?: string | null;
  phone?: string;
  city?: string;
  /** YYYY-MM-DD */
  date_of_birth?: string;
  age?: number;
}

/** Тело PUT/PATCH /api/v1/auth/me/ — все поля опциональны */
export type UpdateMePayload = {
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
  date_of_birth?: string;
  age?: number;
  phone?: string;
  city?: string;
};

export interface LoginPayload {
  email: string;
  password: string;
  guest_session_ids?: number[];
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
  guest_session_ids?: number[];
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshResponse {
  access: string;
}

/** POST /api/v1/auth/change-password/ */
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  /** Django backend requires confirmation */
  new_password_confirm: string;
}

/** POST /api/v1/auth/password-reset/request/ */
export interface PasswordResetRequestPayload {
  email: string;
}

/** POST /api/v1/auth/password-reset/confirm/ */
export interface PasswordResetConfirmPayload {
  token: string;
  new_password: string;
  /** Django backend requires confirmation */
  new_password_confirm: string;
}

/** POST /api/v1/auth/email-verify/request/ */
export interface EmailVerifyRequestPayload {
  email: string;
}

/** POST /api/v1/auth/email-verify/confirm/ */
export interface EmailVerifyConfirmPayload {
  token: string;
}

// ===== Analysis — GET /api/v1/analysis/dashboard/ =====

export interface AnalysisDashboardUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
}

export interface AnalysisDashboardSubscription {
  plan_type: string;
  plan_name: string;
  end_date: string | null;
  is_active: boolean;
}

export interface AnalysisDashboardPlanLimits {
  name: string;
  max_tests: number;
  can_see_detailed_results: boolean;
  can_see_universities: boolean;
  can_use_ai: boolean;
  price: number;
}

export interface AnalysisDashboardStats {
  tests_completed: number;
  tests_available: number;
  mandatory_completed: number;
  mandatory_total: number;
  optional_completed: number;
  can_get_recommendations: boolean;
  holland_primary_code?: string | null;
  disc_primary_style?: string | null;
  stats_last_updated: string;
}

export interface AnalysisDashboardRecentResult {
  test_title: string;
  test_type: string;
  primary_type: string;
  completed_at: string;
}

export interface AnalysisDashboardResponse {
  user: AnalysisDashboardUser;
  subscription: AnalysisDashboardSubscription;
  plan_limits: AnalysisDashboardPlanLimits;
  stats: AnalysisDashboardStats;
  recent_results: AnalysisDashboardRecentResult[];
  /** Уточнить, когда API начнёт отдавать элементы */
  top_recommendations: unknown[];
}

/** GET /api/v1/analysis/reports/{report_id}/ — AnalysisReport в OpenAPI */
export interface AnalysisReportDetail {
  id: number;
  title: string;
  report_data: string;
  summary: string;
  detailed_text: string;
  recommended_careers: string;
  recommended_institutions: string;
  is_premium: boolean;
  created_at: string;
}

/** POST /api/v1/analysis/ai-report/ */
export type AiReportGeneratePayload =
  | Record<string, never>
  | { session_id: number }
  | { session_ids: number[] };

/** POST /api/v1/analysis/ai-chat/ */
export type AiChatPayload = {
  message: string;
};

export type AiChatResponse = Record<string, unknown>;

export type AiReportGenerateResponse = {
  report_id: number | string;
  created_at?: string;
  overall_summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  test_insights?: string[];
  career_suggestions?: Array<{
    name: string;
    fit_score?: number;
    reason?: string;
  }>;
  university_suggestions?: Array<{
    name: string;
    reason?: string;
  }>;
  development_plan?: string;
  [key: string]: unknown;
};

/** GET /api/v1/analysis/profile/ */
export type AnalysisProfile = {
  id: number;
  user_name: string;
  holland_scores: string;
  holland_type: string;
  mbti_type: string;
  mbti_scores: string;
  strengths: string;
  interests: string;
  values: string;
  ai_summary: string;
  ai_career_suggestions: string;
  last_updated: string;
};

// ===== Careers / Industries =====

/**
 * Backend/API Industry type (from `/api/v1/...`).
 * Note: differs from the public JSON dataset in `public/Industries.json`.
 */
export interface Industry {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

export type CareersDemand = "low" | "medium" | "high" | "very_high" | (string & {});

export type CareersListParams = {
  category?: string;
  demand?: CareersDemand;
  education?: string;
  search?: string;
  holland?: string;
  limit?: number;
};

export type ProfessionListParams = {
  /** Industry ID or code */
  industry?: string | number;
  search?: string;
  demand?: CareersDemand;
  limit?: number;
  page?: number;
};

export type PaginatedResponse<T> = {
  count: number;
  total_pages: number;
  current_page: number;
  limit: number;
  results: T[];
};

export type CareerCategory = {
  id?: number;
  name: string;
  slug: string;
};

export type Career = {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  category?: string | CareerCategory;
  industry?: number | string | Industry;
  demand?: CareersDemand;
  education?: string;
  holland?: string;
};

export type CareerRecommendation = {
  id?: number;
  career?: Career;
  profession?: Profession;
  score?: number;
  reason?: string;
};

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

// ===== Big Five quiz result (finish session) =====

export interface BigFiveScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface BigFiveSessionFinishResponse {
  id: number;
  test_title: string;
  test_slug: string;
  test_type: "big_five";
  /** Raw scores per dimension (0–100 scale from backend) */
  scores: BigFiveScores;
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

/**
 * From `public/professions.json`
 */
export type PublicProfession = {
  id: string;
  name: LocalizedText;
  /** Industry id used for grouping/filtering (e.g. `it_technology`) */
  industry: string;
  /**
   * Specialty references.
   *
   * Старый формат: массив кодов (e.g. `"B049"`).
   * Новый формат: массив объектов `{ code: string; id: number }`, где `id` — ссылка на speciality.
   * Поддерживаем оба варианта для совместимости.
   */
  specialities: Array<string | { code: string; id: number }>;
  demand_level: CareersDemand;
  salary_kzt: {
    min: number | null;
    max: number | null;
    average: number | null;
  };
  description?: LocalizedText;
};

/**
 * From `public/specialities.json`
 */
export type PublicSpeciality = {
  id: number;
  code: string;
  name: LocalizedText;
  /** List of university short_name.en values for this speciality */
  Universities?: string[];
};

/**
 * From `public/universities.json`
 */
export type PublicUniversity = {
  id: number;
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

/** Вариант ответа внутри вопроса (GET /quizzes/tests/{slug}/) */
export interface QuizAnswerOption {
  id: number;
  code: string;
  text: string;
  scale?: string;
  points?: number;
  order?: number;
}

/** QuestionTypeEnum в OpenAPI, напр. single */
export type QuizQuestionTypeEnum = "single" | (string & {});

export interface QuizQuestion {
  id: number;
  text: string;
  question_type: QuizQuestionTypeEnum;
  scale?: string;
  order?: number;
  answers: QuizAnswerOption[];
  scale_info?: string;
}

/**
 * GET /api/v1/quizzes/tests/{test_slug}/ — TestDetail в OpenAPI (метаданные + questions).
 * total_questions в схеме указан как string; на практике может приходить число.
 */
export interface QuizTestDetail extends Omit<QuizTest, "total_questions"> {
  total_questions: number | string;
  questions: QuizQuestion[];
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
    }
  | {
      session_id: number | string;
      question_id: number | string;
      text_answer: string;
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
    text_answer?: string;
  }[];
}

// ===== Payments =====

export type PaymentPlanType = "basic" | "premium" | (string & {});
export type PaymentPeriod = "monthly" | "yearly" | (string & {});

export type PaymentSubscribePayload = {
  plan_type: PaymentPlanType;
  period: PaymentPeriod;
};

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
