"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { analyseServices } from "@/lib/services/analyseServices";
import { ALL_TESTS, TEST_DISPLAY_NAMES, getRecommendedTests } from "@/utils/constants";
import { useQuizSessionStore, type QuizSessionEntry } from "@/lib/store/useQuizStore";
import { useAuth } from "@/lib/store/useAuthStore";
import { useDelayedFlag } from "@/app/components/tests/useDelayedFlag";

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

  const sessions = useSyncExternalStore(
    useQuizSessionStore.subscribe,
    () => useQuizSessionStore.getState().sessions,
    () => EMPTY_SESSIONS
  ) as Partial<Record<string, QuizSessionEntry>>;

  const testIdToSessionKey = (id: string): string => (id === "big-five" ? "bigfive" : id);

  const getCompletedSessionIds = (ids: string[]): number[] => {
    const out: number[] = [];
    for (const id of ids) {
      const key = testIdToSessionKey(id);
      const entry = sessions[key];
      if (entry?.completedAt != null && typeof entry.sessionId === "number" && entry.sessionId > 0) {
        out.push(entry.sessionId);
      }
    }
    return out;
  };

  const requiredRecommendedIds = recommended.filter((x) => x.required).map((x) => x.id);
  const allRequiredDone = requiredRecommendedIds.every((id) => sessions[testIdToSessionKey(id)]?.completedAt != null);
  const recommendedDoneSessionIds = getCompletedSessionIds(recommended.map((x) => x.id));

  const completedAll = Object.entries(sessions)
    .filter(([, e]) => e?.completedAt != null && typeof e.sessionId === "number" && e.sessionId > 0)
    .map(([key, e]) => ({
      key,
      sessionId: (e as QuizSessionEntry).sessionId,
      completedAt: (e as QuizSessionEntry).completedAt ?? 0,
    }));
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
