import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type {
  AnswerQuizQuestionPayload,
  AnswerQuizQuestionResponse,
  BulkAnswerQuizPayload,
  BulkAnswerQuizResponse,
  FinishQuizSessionVariables,
  QuickQuizPayload,
  QuickQuizResult,
  QuizCategory,
  QuizListParams,
  QuizMyResultsResponse,
  QuizResult,
  QuizSession,
  QuizSessionsListItem,
  QuizSessionsListParams,
  QuizTest,
  QuizTestType,
  QuizTestTypeMetaResponse,
  QuizTier,
  StartQuizSessionVariables,
  SubmitQuickQuizVariables,
} from "@/lib/types";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function compactParams<T extends Record<string, unknown>>(
  params?: T
): Record<string, unknown> {
  if (!params) return {};
  const out: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    out[key] = value;
  });
  return out;
}

// --------------------------------------------------
// Quizzes: tests, categories, test-types
// --------------------------------------------------

export const useQuizTests = (
  params?: QuizListParams
): UseQueryResult<QuizTest[], unknown> => {
  const qp = compactParams(params as Record<string, unknown> | undefined);
  return useQuery({
    queryKey: ["quizzes", "tests", qp],
    queryFn: async () => {
      const { data } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", {
        params: qp,
      });
      return data;
    },
  });
};

export const useQuizTest = (
  testSlug: string | null
): UseQueryResult<QuizTest, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "tests", "detail", testSlug],
    queryFn: async () => {
      const { data } = await api.get<QuizTest>(
        `/api/v1/quizzes/tests/${testSlug}/`
      );
      return data;
    },
    enabled: !!testSlug,
  });
};

export const useQuizCategories = (): UseQueryResult<
  QuizCategory[],
  unknown
> => {
  return useQuery({
    queryKey: ["quizzes", "categories"],
    queryFn: async () => {
      const { data } = await api.get<QuizCategory[]>(
        "/api/v1/quizzes/categories/"
      );
      return data;
    },
  });
};

export const useQuizTestTypes = (): UseQueryResult<
  QuizTestTypeMetaResponse,
  unknown
> => {
  return useQuery({
    queryKey: ["quizzes", "test-types"],
    queryFn: async () => {
      const { data } = await api.get<QuizTestTypeMetaResponse>(
        "/api/v1/quizzes/test-types/"
      );
      return data;
    },
  });
};

// --------------------------------------------------
// Quizzes: quick/<test_type> (JSON-based tests)
// --------------------------------------------------

export const useQuickQuiz = (
  testType: QuizTestType | null
): UseQueryResult<QuickQuizPayload, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "quick", "test", testType],
    queryFn: async () => {
      const { data } = await api.get<QuickQuizPayload>(
        `/api/v1/quizzes/quick/${testType}/`
      );
      return data;
    },
    enabled: !!testType,
  });
};

export const useQuickQuizResult = (
  testType: QuizTestType | null
): UseQueryResult<QuickQuizResult, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "quick", "result", testType],
    queryFn: async () => {
      const { data } = await api.get<QuickQuizResult>(
        `/api/v1/quizzes/quick/${testType}/result/`
      );
      return data;
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
      const { data } = await api.post<QuickQuizResult, Record<string, unknown>>(
        `/api/v1/quizzes/quick/${testType}/submit/`,
        body
      );
      return data;
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
      const { data } = await api.get<QuizSessionsListItem[]>(
        "/api/v1/quizzes/sessions/",
        { params: qp }
      );
      return data;
    },
  });
};

export const useQuizSession = (
  sessionId: number | string | null
): UseQueryResult<QuizSession, unknown> => {
  return useQuery({
    queryKey: ["quizzes", "sessions", "detail", sessionId],
    queryFn: async () => {
      const { data } = await api.get<QuizSession>(
        `/api/v1/quizzes/sessions/${sessionId}/`
      );
      return data;
    },
    enabled: sessionId != null && sessionId !== "",
  });
};

export const useQuizMyResults = (): UseQueryResult<
  QuizMyResultsResponse,
  unknown
> => {
  return useQuery({
    queryKey: ["quizzes", "my-results"],
    queryFn: async () => {
      const { data } = await api.get<QuizMyResultsResponse>(
        "/api/v1/quizzes/my-results/"
      );
      return data;
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
      const { data } = await api.post<QuizSession, StartQuizSessionVariables>(
        "/api/v1/quizzes/sessions/start/",
        payload
      );
      return data;
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
      const { data } = await api.post<
        AnswerQuizQuestionResponse,
        AnswerQuizQuestionPayload
      >("/api/v1/quizzes/sessions/answer/", payload);
      return data;
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
      const { data } = await api.post<
        BulkAnswerQuizResponse,
        BulkAnswerQuizPayload
      >("/api/v1/quizzes/sessions/bulk-answer/", payload);
      return data;
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
      const { data } = await api.post<QuizResult, FinishQuizSessionVariables>(
        "/api/v1/quizzes/sessions/finish/",
        payload
      );
      return data;
    },
  });
};

