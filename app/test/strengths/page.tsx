"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { TestHeader } from "../../components/tests/TestHeader";
import { LikertWordQuestionCard } from "../../components/tests/RadioQuestionCard";
import { LoadingScreen } from "../../components/tests/LoadingScreen";
import { useDelayedFlag } from "../../components/tests/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { useQuizSessionHydrated } from "@/lib/hooks/useQuizSessionHydrated";
import StrengthsResultPanel from "./strengthsResultDialog";
import { TestResultActions } from "../../components/tests/TestResultActions";
import STRENGTHS_DATA from "./personal_strength_questions.json";
import { TEST_DISPLAY_NAMES } from "@/utils/constants";

const SESSION_KEY = "strengths";
const PAGE_TITLE = TEST_DISPLAY_NAMES.strengths;

const STEPS_COUNT = 5;
const QUESTIONS_PER_STEP = 20;

type StrengthsQuestion = {
  id: number;
  text: LocalizedText;
};

type StrengthsData = {
  test?: {
    title?: LocalizedText;
  };
  questions?: StrengthsQuestion[];
  scale?: {
    labels?: Record<string, LocalizedText>;
  };
};

const styles = {
  root: { pt: 3, minHeight: "80vh" },
  pageHeader: { mb: 3, textAlign: "center" as const },
  pageTitle: { mb: 0.75, fontSize: "1.25rem", fontWeight: 700 },
  pageHelper: { color: "text.secondary" },
  questionsColumn: { display: "flex", flexDirection: "column" as const, gap: 2 },
  dividerBeforeQuestions: { mb: 2 },
  dividerAfterQuestions: { mt: 3, mb: 2 },
  navRow: { display: "flex", justifyContent: "space-between", gap: 2, mt: 4, mb: 6 },
  navButton: { borderRadius: 2, px: 3 },
};

export default function StrengthsTestPage() {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "kk" | "en";
  const hydrated = useQuizSessionHydrated();
  const { setSession, setResult } = useQuizSessionStore();
  const finishedResult = useQuizSessionStore((s) => s.getSession(SESSION_KEY)?.result as QuizResult | null | undefined);
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");

  const data = STRENGTHS_DATA as unknown as StrengthsData;
  const questions = data.questions ?? [];

  const labels = (data.scale?.labels ?? {}) as Record<string, LocalizedText>;
  const emptyLabel: LocalizedText = { ru: "", kk: "", en: "" };
  const scaleOptions = useMemo<LocalizedText[]>(
    () => [1, 2, 3, 4, 5].map((n) => labels[String(n)] ?? emptyLabel),
    [labels]
  );
  const leftLabel = labels["1"] ?? emptyLabel;
  const rightLabel = labels["5"] ?? emptyLabel;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(phase === "quiz" && (initializing || submitting));

  const expectedCount = questions.length;

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = questions.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  useEffect(() => {
    if (!hydrated) return;

    const st = useQuizSessionStore.getState();
    if (st.isCompleted(SESSION_KEY) && st.getSession(SESSION_KEY)?.result != null) {
      setPhase("result");
      setInitializing(false);
      return;
    }

    let cancelled = false;

    const initSession = async () => {
      setInitializing(true);
      // Backend test: category_type = "personal_strengths", slug = "personal-strengths-character"
      const preferredSlug = "personal-strengths-character";

      // Try direct slug first (most stable).
      let slug: string | null = preferredSlug;

      // If backend slug changes, fallback to list by type.
      const { error: preflightErr } = await quizServices.getTestDetail(preferredSlug);
      if (preflightErr) {
        const { body: testsPrimary } = await quizServices.listTests({ type: "personal_strengths" });
        slug = testsPrimary?.[0]?.slug ?? null;

        if (!slug) {
          const { body: testsFallback } = await quizServices.listTests({ type: "strengths" });
          slug = testsFallback?.[0]?.slug ?? null;
        }
      }

      if (!slug) return;

      const { body: session } = await quizServices.startSession({ test_slug: slug });
      const { body: testDetail } = await quizServices.getTestDetail(slug);
      if (!session || !testDetail) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const allBackendIds = (testDetail.questions ?? []).map((q) => q.id);

      if (!cancelled && allBackendIds.length === expectedCount) {
        setSessionId(session.id);
        setSession(SESSION_KEY, session.id);
        setBackendQuestionIds(allBackendIds);
      }

      if (!cancelled) setInitializing(false);
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [hydrated, expectedCount, setSession]);

  const handlePrev = () => {
    if (step <= 1 || submitting) return;
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!allStepAnswered || submitting) return;
    if (step < STEPS_COUNT) setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!allStepAnswered || submitting) return;
    setSubmitting(true);

    const finish = async () => {
      let backendResult: QuizResult | null = null;
      if (sessionId && backendQuestionIds.length === expectedCount) {
        const answersPayload: BulkAnswerQuizPayload["answers"] = questions.map((q, idx) => ({
          question_id: backendQuestionIds[idx],
          scale_value: answers[q.id] ?? 3,
        }));

        const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
        if (!bulkRes.error) {
          const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
          backendResult = finishRes.body;
        }
      }

      const placeholder: QuizResult = {
        id: Date.now(),
        test_title: data.test?.title?.[locale] ?? data.test?.title?.en ?? "Personal Strengths",
        test_type: "personal_strengths",
        summary:
          t("result_fetch_failed"),
        created_at: new Date().toISOString(),
      };

      setResult(SESSION_KEY, backendResult ?? placeholder);
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      setPhase("result");
      setSubmitting(false);
    };

    void finish();
  };

  if (!hydrated) {
    return <LoadingScreen open text={t("toast_test_loading")} />;
  }

  if (phase === "result") {
    const result = (finishedResult ?? null) as QuizResult | null;
    return (
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={STEPS_COUNT}
            totalSteps={STEPS_COUNT}
            stepLabel={t("step_x_of_y", { step: STEPS_COUNT, total: STEPS_COUNT })}
            optionsHeader={scaleOptions}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{PAGE_TITLE}</Box>
          </Box>
          <StrengthsResultPanel result={result} />
          <TestResultActions />
        </Container>
      </Box>
    );
  }

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={step}
            totalSteps={STEPS_COUNT}
            stepLabel={t("step_x_of_y", { step, total: STEPS_COUNT })}
            optionsHeader={scaleOptions}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{PAGE_TITLE}</Box>
            <Box sx={styles.pageHelper}>{t("tests_strengths_helper")}</Box>
          </Box>

          <Divider sx={styles.dividerBeforeQuestions} />

          <Box sx={styles.questionsColumn}>
            {stepQuestions.map((q) => (
              <LikertWordQuestionCard
                key={q.id}
                title={q.text}
                value={answers[q.id] ?? null}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                leftLabel={leftLabel}
                rightLabel={rightLabel}
                options={scaleOptions}
              />
            ))}
          </Box>

          <Divider sx={styles.dividerAfterQuestions} />

          <Box sx={styles.navRow}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handlePrev}
              disabled={step === 1 || submitting}
              sx={styles.navButton}
            >
              {t("back")}
            </Button>

            {step < STEPS_COUNT ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!allStepAnswered || submitting}
                sx={styles.navButton}
              >
                {t("next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!allStepAnswered || submitting}
                sx={styles.navButton}
              >
                {submitting ? "..." : t("finish")}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

