import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type {
  AnswerQuizQuestionPayload,
  AnswerQuizQuestionResponse,
  BulkAnswerQuizPayload,
  BulkAnswerQuizResponse,
  FinishQuizSessionVariables,
  QuickQuizResult,
  QuizCategory,
  QuizListParams,
  QuizMyResultsResponse,
  QuizResult,
  QuizSession,
  QuizSessionsListItem,
  QuizSessionsListParams,
  QuizTest,
  QuizTestDetail,
  QuizTestType,
  QuizTestTypeMetaResponse,
  StartQuizSessionVariables,
  SubmitQuickQuizVariables,
} from "@/lib/types";

type ServiceResult<T> = { body: T | null; error: unknown | null };

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function compactParams<T extends Record<string, unknown>>(params?: T): Record<string, unknown> {
  if (!params) return {};
  const out: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    out[key] = value;
  });
  return out;
}

async function fetchQuizTestDetail(testSlug: string): Promise<ServiceResult<QuizTestDetail>> {
  const { body, error } = await api.get<QuizTestDetail>(`/api/v1/quizzes/tests/${testSlug}/`);
  return { body: body?.data ?? null, error };
}

// --------------------------------------------------
// Quizzes: tests, categories, test-types
// --------------------------------------------------

export const useQuizTests = (params?: QuizListParams): UseQueryResult<QuizTest[], unknown> => {
  const qp = compactParams(params as Record<string, unknown> | undefined);
  return useQuery({
    queryKey: ["quizzes", "tests", qp],
    queryFn: async () => {
      const { body, error } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", { params: qp });
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useQuizTest = (testSlug: string | null): UseQueryResult<QuizTestDetail, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "tests", "detail", testSlug],
    queryFn: async () => {
      const { body, error } = await api.get<QuizTestDetail>(`/api/v1/quizzes/tests/${testSlug}/`);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
    enabled: !!testSlug,
  });
};

export const useQuizCategories = (): UseQueryResult<QuizCategory[], unknown> => {
  return useQuery({
    queryKey: ["quizzes", "categories"],
    queryFn: async () => {
      const { body, error } = await api.get<QuizCategory[]>("/api/v1/quizzes/categories/");
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useQuizTestTypes = (): UseQueryResult<QuizTestTypeMetaResponse, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "test-types"],
    queryFn: async () => {
      const { body, error } = await api.get<QuizTestTypeMetaResponse>("/api/v1/quizzes/test-types/");
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

// --------------------------------------------------
// Quizzes: quick/<test_type> (JSON-based tests)
// --------------------------------------------------

export const useQuickQuizResult = (
  testType: QuizTestType | null
): UseQueryResult<QuickQuizResult, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "quick", "result", testType],
    queryFn: async () => {
      const { body, error } = await api.get<QuickQuizResult>(`/api/v1/quizzes/quick/${testType}/result/`);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
    enabled: !!testType,
  });
};

export const useSubmitQuickQuiz = (): UseMutationResult<
  QuickQuizResult,
  unknown,
  SubmitQuickQuizVariables
> => {
  return useMutation({
    mutationFn: async ({ testType, body }) => {
      const { body: res, error } = await api.post<QuickQuizResult, Record<string, unknown>>(
        `/api/v1/quizzes/quick/${testType}/submit/`,
        body
      );
      if (error) throw error;
      if (!res) throw new Error("Empty response body");
      return res.data;
    },
  });
};

// --------------------------------------------------
// Quizzes: full session flow (/sessions/*, /my-results/)
// --------------------------------------------------

export const useQuizSessions = (
  params?: QuizSessionsListParams
): UseQueryResult<QuizSessionsListItem[], unknown> => {
  const qp = compactParams(params as Record<string, unknown> | undefined);
  return useQuery({
    queryKey: ["quizzes", "sessions", qp],
    queryFn: async () => {
      const { body, error } = await api.get<QuizSessionsListItem[]>("/api/v1/quizzes/sessions/", {
        params: qp,
      });
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useQuizSession = (
  sessionId: number | string | null
): UseQueryResult<QuizSession, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "sessions", "detail", sessionId],
    queryFn: async () => {
      const { body, error } = await api.get<QuizSession>(`/api/v1/quizzes/sessions/${sessionId}/`);
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
    enabled: sessionId != null && sessionId !== "",
  });
};

export const useQuizMyResults = (): UseQueryResult<QuizMyResultsResponse, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "my-results"],
    queryFn: async () => {
      const { body, error } = await api.get<QuizMyResultsResponse>("/api/v1/quizzes/my-results/");
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useStartQuizSession = (): UseMutationResult<
  QuizSession,
  unknown,
  StartQuizSessionVariables
> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { body, error } = await api.post<QuizSession, StartQuizSessionVariables>(
        "/api/v1/quizzes/sessions/start/",
        payload
      );
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useAnswerQuizQuestion = (): UseMutationResult<
  AnswerQuizQuestionResponse,
  unknown,
  AnswerQuizQuestionPayload
> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { body, error } = await api.post<AnswerQuizQuestionResponse, AnswerQuizQuestionPayload>(
        "/api/v1/quizzes/sessions/answer/",
        payload
      );
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useBulkAnswerQuiz = (): UseMutationResult<
  BulkAnswerQuizResponse,
  unknown,
  BulkAnswerQuizPayload
> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { body, error } = await api.post<BulkAnswerQuizResponse, BulkAnswerQuizPayload>(
        "/api/v1/quizzes/sessions/bulk-answer/",
        payload
      );
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

export const useFinishQuizSession = (): UseMutationResult<
  QuizResult,
  unknown,
  FinishQuizSessionVariables
> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { body, error } = await api.post<QuizResult, FinishQuizSessionVariables>(
        "/api/v1/quizzes/sessions/finish/",
        payload
      );
      if (error) throw error;
      if (!body) throw new Error("Empty response body");
      return body.data;
    },
  });
};

// --------------------------------------------------
// Non-React service functions (same endpoints)
// --------------------------------------------------

export const quizServices = {
  async listTests(params?: QuizListParams): Promise<ServiceResult<QuizTest[]>> {
    const { body, error } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", {
      params: compactParams(params as unknown as Record<string, unknown> | undefined),
    });
    return { body: body?.data ?? null, error };
  },

  async getTest(testSlug: string): Promise<ServiceResult<QuizTestDetail>> {
    return fetchQuizTestDetail(testSlug);
  },

  /** GET /api/v1/quizzes/tests/{test_slug}/ — алиас getTest (полный TestDetail с questions). */
  async getTestDetail(testSlug: string): Promise<ServiceResult<QuizTestDetail>> {
    return fetchQuizTestDetail(testSlug);
  },

  async listCategories(): Promise<ServiceResult<QuizCategory[]>> {
    const { body, error } = await api.get<QuizCategory[]>("/api/v1/quizzes/categories/");
    return { body: body?.data ?? null, error };
  },

  async listTestTypes(): Promise<ServiceResult<QuizTestTypeMetaResponse>> {
    const { body, error } = await api.get<QuizTestTypeMetaResponse>("/api/v1/quizzes/test-types/");
    return { body: body?.data ?? null, error };
  },

  async myResults(): Promise<ServiceResult<QuizMyResultsResponse>> {
    const { body, error } = await api.get<QuizMyResultsResponse>("/api/v1/quizzes/my-results/");
    return { body: body?.data ?? null, error };
  },

  async listSessions(params?: QuizSessionsListParams): Promise<ServiceResult<QuizSessionsListItem[]>> {
    const { body, error } = await api.get<QuizSessionsListItem[]>("/api/v1/quizzes/sessions/", {
      params: compactParams(params as unknown as Record<string, unknown> | undefined),
    });
    return { body: body?.data ?? null, error };
  },

  async getSession(sessionId: number | string): Promise<ServiceResult<QuizSession>> {
    const { body, error } = await api.get<QuizSession>(`/api/v1/quizzes/sessions/${sessionId}/`);
    return { body: body?.data ?? null, error };
  },

  async startSession(payload: StartQuizSessionVariables): Promise<ServiceResult<QuizSession>> {
    const { body, error } = await api.post<QuizSession, StartQuizSessionVariables>(
      "/api/v1/quizzes/sessions/start/",
      payload
    );
    return { body: body?.data ?? null, error };
  },

  async answer(payload: AnswerQuizQuestionPayload): Promise<ServiceResult<AnswerQuizQuestionResponse>> {
    const { body, error } = await api.post<AnswerQuizQuestionResponse, AnswerQuizQuestionPayload>(
      "/api/v1/quizzes/sessions/answer/",
      payload
    );
    return { body: body?.data ?? null, error };
  },

  async bulkAnswer(payload: BulkAnswerQuizPayload): Promise<ServiceResult<BulkAnswerQuizResponse>> {
    const { body, error } = await api.post<BulkAnswerQuizResponse, BulkAnswerQuizPayload>(
      "/api/v1/quizzes/sessions/bulk-answer/",
      payload
    );
    return { body: body?.data ?? null, error };
  },

  async finish(payload: FinishQuizSessionVariables): Promise<ServiceResult<QuizResult>> {
    const { body, error } = await api.post<QuizResult, FinishQuizSessionVariables>(
      "/api/v1/quizzes/sessions/finish/",
      payload
    );
    return { body: body?.data ?? null, error };
  },
};

