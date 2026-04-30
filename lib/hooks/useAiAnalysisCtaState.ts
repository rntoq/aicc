"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { analyseServices } from "@/lib/services/analyseServices";
import { quizServices } from "@/lib/services/quizServices";
import { ALL_TESTS, TEST_DISPLAY_NAMES, getRecommendedTests } from "@/utils/constants";
import { useQuizSessionStore, type QuizSessionEntry } from "@/lib/store/useQuizStore";
import { useAuth } from "@/lib/store/useAuthStore";
import { useDelayedFlag } from "@/app/components/tests/useDelayedFlag";
import { normalizeQuizSessionStoreKey } from "@/lib/utils/syncCompletedQuizSessions";

const EMPTY_SESSIONS: Partial<Record<string, QuizSessionEntry>> = {};
export const MAX_CUSTOM_SELECT = 4;

type I18n = {
  selectToastMax: string;
  authRequiredBody: string;
  generateError: string;
  generateSuccess: (values: { reportId: number }) => string;
  selectToastNeed4: string;
  generateLoading: string;
};

type Params = {
  isRecommended: boolean;
  skipAuthCheck?: boolean;
  i18n: I18n;
};

export function useAiAnalysisCtaState({ isRecommended, skipAuthCheck = false, i18n }: Params) {
  const router = useRouter();
  const recommended = getRecommendedTests();
  const hydrated = useAuth((s) => s.hydrated);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const showAnalysisLoading = useDelayedFlag(generatingAnalysis, 450);
  const [apiCompletedSessions, setApiCompletedSessions] = useState<
    Array<{ key: string; sessionId: number; completedAt: number }>
  >([]);

  const sessions = useSyncExternalStore(
    useQuizSessionStore.subscribe,
    () => useQuizSessionStore.getState().sessions,
    () => EMPTY_SESSIONS
  ) as Partial<Record<string, QuizSessionEntry>>;

  useEffect(() => {
    let cancelled = false;

    const loadCompletedSessions = async () => {
      if (!hydrated || !isAuthenticated) {
        if (!cancelled) setApiCompletedSessions([]);
        return;
      }
      const { body, error } = await quizServices.listSessions({ completed: true });
      if (cancelled) return;
      if (error || !body?.length) {
        setApiCompletedSessions([]);
        return;
      }

      const latestByKey = new Map<string, { sessionId: number; completedAt: number }>();
      for (const row of body as Array<{
        id?: number;
        is_completed?: boolean;
        test_slug?: string;
        test_type?: string;
        completed_at?: string;
        created_at?: string;
      }>) {
        if (!row?.is_completed || typeof row.id !== "number") continue;
        const key = normalizeQuizSessionStoreKey(String(row.test_slug ?? ""), String(row.test_type ?? ""));
        const ts = Date.parse(row.completed_at ?? row.created_at ?? "") || 0;
        const prev = latestByKey.get(key);
        if (!prev || ts > prev.completedAt || (ts === prev.completedAt && row.id > prev.sessionId)) {
          latestByKey.set(key, { sessionId: row.id, completedAt: ts });
        }
      }

      setApiCompletedSessions(
        Array.from(latestByKey.entries()).map(([key, value]) => ({
          key,
          sessionId: value.sessionId,
          completedAt: value.completedAt,
        }))
      );
    };

    void loadCompletedSessions();
    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated]);

  const testIdToSessionKey = (id: string): string => (id === "big-five" ? "bigfive" : id);

  const sourceCompletedByKey = isAuthenticated
    ? Object.fromEntries(
        apiCompletedSessions.map((x) => [
          x.key,
          { sessionId: x.sessionId, completedAt: x.completedAt },
        ])
      )
    : sessions;

  const getCompletedSessionIds = (ids: string[]): number[] => {
    const out: number[] = [];
    for (const id of ids) {
      const key = testIdToSessionKey(id);
      const entry = sourceCompletedByKey[key] as
        | { sessionId?: number; completedAt?: number | null }
        | undefined;
      if (entry?.completedAt != null && typeof entry.sessionId === "number" && entry.sessionId > 0) {
        out.push(entry.sessionId);
      }
    }
    return out;
  };

  const requiredRecommendedIds = recommended.filter((x) => x.required).map((x) => x.id);
  const allRequiredDone = requiredRecommendedIds.every((id) => {
    const entry = sourceCompletedByKey[testIdToSessionKey(id)] as
      | { completedAt?: number | null }
      | undefined;
    return entry?.completedAt != null;
  });
  const recommendedDoneSessionIds = getCompletedSessionIds(recommended.map((x) => x.id));

  const completedAll = Object.entries(sourceCompletedByKey)
    .filter(([, e]) => (e as { completedAt?: number | null })?.completedAt != null)
    .map(([key, e]) => {
      const entry = e as { sessionId?: number; completedAt?: number | null };
      return {
        key,
        sessionId: entry.sessionId ?? 0,
        completedAt: entry.completedAt ?? 0,
      };
    })
    .filter((e) => e.sessionId > 0);
  completedAll.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  const canGenerateFromCustom = completedAll.length >= MAX_CUSTOM_SELECT;

  const completedCustomTests = completedAll
    .map((e) => {
      const testId = e.key === "bigfive" ? "big-five" : e.key;
      const test = ALL_TESTS.find((t0) => t0.id === testId);
      if (!test) return null;
      return {
        testId,
        sessionId: e.sessionId,
        completedAt: e.completedAt,
        name: TEST_DISPLAY_NAMES[testId] ?? test.name,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  const [customSelectedIds, setCustomSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isRecommended) return;
    if (customSelectedIds.length > 0) return;
    if (completedCustomTests.length < MAX_CUSTOM_SELECT) return;
    setCustomSelectedIds(completedCustomTests.slice(0, MAX_CUSTOM_SELECT).map((x) => x.testId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecommended, completedCustomTests.length]);

  const customSelectedSessionIds = customSelectedIds
    .map((id) => completedCustomTests.find((x) => x.testId === id)?.sessionId)
    .filter((x): x is number => typeof x === "number" && x > 0);

  const toggleCustomSelect = (id: string) => {
    if (!customSelectedIds.includes(id) && customSelectedIds.length >= MAX_CUSTOM_SELECT) {
      toast.info(i18n.selectToastMax);
      return;
    }
    setCustomSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_CUSTOM_SELECT) return prev;
      return [...prev, id];
    });
  };

  const getErrorDetail = (error: unknown): string | null => {
    const maybeAxios = error as AxiosError<{ detail?: unknown }> | undefined;
    const detail = maybeAxios?.response?.data?.detail;
    return typeof detail === "string" && detail.trim() ? detail : null;
  };

  const handleGenerateAnalysis = async (sessionIds: number[]) => {
    if (generatingAnalysis) return;
    if (!skipAuthCheck && !hydrated) return;
    if (!skipAuthCheck && !isAuthenticated) {
      toast.info(i18n.authRequiredBody);
      router.push("/login");
      return;
    }
    if (!sessionIds || sessionIds.length === 0) {
      toast.error(i18n.generateError);
      return;
    }
    setGeneratingAnalysis(true);
    const { body, error } = await analyseServices.createAiReport({ session_ids: sessionIds });
    if (error || !body?.report_id) {
      toast.error(getErrorDetail(error) ?? i18n.generateError);
      setGeneratingAnalysis(false);
      return;
    }
    const reportId =
      typeof body.report_id === "number" ? body.report_id : Number(body.report_id);
    toast.success(i18n.generateSuccess({ reportId }));
    setGeneratingAnalysis(false);
  };

  const handleGenerateCustom = async () => {
    if (customSelectedSessionIds.length !== MAX_CUSTOM_SELECT) {
      toast.error(i18n.selectToastNeed4);
      return;
    }
    await handleGenerateAnalysis(customSelectedSessionIds);
  };

  return {
    generatingAnalysis,
    showAnalysisLoading,
    allRequiredDone,
    recommendedDoneSessionIds,
    canGenerateFromCustom,
    completedCustomTests,
    customSelectedIds,
    customSelectedSessionIds,
    toggleCustomSelect,
    handleGenerateAnalysis,
    handleGenerateCustom,
    loadingText: i18n.generateLoading,
  };
}
