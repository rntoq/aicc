"use client";

import { useEffect, useRef, useState } from "react";
import { quizServices } from "@/lib/services/quizServices";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";

type UseQuizSessionFlowParams = {
  hydrated: boolean;
  sessionKey: string;
  resolveSlug: () => Promise<string | null>;
  mapQuestionIds?: (ids: number[]) => number[];
  onInitError?: () => void;
};

type UseQuizSessionFlowResult = {
  phase: "quiz" | "result";
  setPhase: (phase: "quiz" | "result") => void;
  initializing: boolean;
  sessionId: number | null;
  backendQuestionIds: number[];
  backendQuestions: { id: number; questionType: string; answers: { code: string }[] }[];
  /**
   * Lazily creates the quiz session (POST /sessions/start/) on first call and
   * caches the id. Call this when finishing the test so we don't create a
   * redundant session on every test open.
   */
  ensureSession: () => Promise<number | null>;
  retake: () => void;
};

export function useQuizSessionFlow({
  hydrated,
  sessionKey,
  resolveSlug,
  mapQuestionIds,
  onInitError,
}: UseQuizSessionFlowParams): UseQuizSessionFlowResult {
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");
  const [initializing, setInitializing] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);
  const [backendQuestions, setBackendQuestions] = useState<
    { id: number; questionType: string; answers: { code: string }[] }[]
  >([]);
  const setSession = useQuizSessionStore((s) => s.setSession);
  const resolveSlugRef = useRef(resolveSlug);
  const mapQuestionIdsRef = useRef(mapQuestionIds);
  const onInitErrorRef = useRef(onInitError);
  const slugRef = useRef<string | null>(null);
  const startingRef = useRef<Promise<number | null> | null>(null);

  useEffect(() => {
    resolveSlugRef.current = resolveSlug;
    mapQuestionIdsRef.current = mapQuestionIds;
    onInitErrorRef.current = onInitError;
  }, [resolveSlug, mapQuestionIds, onInitError]);

  useEffect(() => {
    if (!hydrated) return;

    const st = useQuizSessionStore.getState();
    const retakeFlagKey = `quiz-retake:${sessionKey}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(retakeFlagKey) === "1") {
      sessionStorage.removeItem(retakeFlagKey);
      st.clearSession(sessionKey);
    }
    if (st.isCompleted(sessionKey) && st.getSession(sessionKey)?.result != null) {
      setPhase("result");
      setInitializing(false);
      return;
    }

    let cancelled = false;

    // On open we only fetch the questions (GET /tests/{slug}/).
    // The session itself (POST /sessions/start/) is created later, on finish.
    const initQuestions = async () => {
      setInitializing(true);
      try {
        const slug = await resolveSlugRef.current();
        if (!slug) throw new Error("resolveSlug failed");
        slugRef.current = slug;

        const { body: testDetail, error: detailError } = await quizServices.getTestDetail(slug);
        if (!testDetail || detailError) throw new Error("get detail failed");

        const questions = (testDetail.questions ?? []).map((q) => ({
          id: q.id,
          questionType: q.question_type ?? "",
          answers: (q.answers ?? []).map((a) => ({ code: a.code })),
        }));
        const rawIds = questions.map((q) => q.id);
        const ids = mapQuestionIdsRef.current ? mapQuestionIdsRef.current(rawIds) : rawIds;
        if (!cancelled) {
          setBackendQuestionIds(ids);
          setBackendQuestions(questions);
        }
      } catch {
        if (!cancelled) onInitErrorRef.current?.();
      } finally {
        if (!cancelled) setInitializing(false);
      }
    };

    void initQuestions();
    return () => {
      cancelled = true;
    };
  }, [hydrated, sessionKey, setSession]);

  const ensureSession = async (): Promise<number | null> => {
    if (sessionId != null) return sessionId;
    if (startingRef.current) return startingRef.current;

    const start = (async () => {
      const slug = slugRef.current ?? (await resolveSlugRef.current());
      if (!slug) return null;
      const { body: session, error } = await quizServices.startSession({ test_slug: slug });
      if (error || !session) return null;
      setSessionId(session.id);
      setSession(sessionKey, session.id);
      return session.id;
    })();

    startingRef.current = start;
    try {
      return await start;
    } finally {
      startingRef.current = null;
    }
  };

  const retake = () => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(`quiz-retake:${sessionKey}`, "1");
    window.location.reload();
  };

  return {
    phase,
    setPhase,
    initializing,
    sessionId,
    backendQuestionIds,
    backendQuestions,
    ensureSession,
    retake,
  };
}
