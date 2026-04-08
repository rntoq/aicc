"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
} from "@/lib/types";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import STRENGTHS_DATA from "./personal_strength_questions.json";

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

export default function StrengthsTestPage() {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "kk" | "en";
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();

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
  const showLoading = useDelayedFlag(initializing || submitting);

  const expectedCount = questions.length;

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = questions.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  useEffect(() => {
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
        setSession("strengths", session.id);
        setBackendQuestionIds(allBackendIds);
      }

      if (!cancelled) setInitializing(false);
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [expectedCount, setSession]);

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

      setResult("strengths", backendResult ?? placeholder);
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      router.push("/test");
      setSubmitting(false);
    };

    void finish();
  };

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Header />
      <Box component="main" sx={{ pt: { xs: 15, md: 12 }, minHeight: "80vh" }}>
        <Container maxWidth="md">
          <StepsHeader
            step={step}
            total={STEPS_COUNT}
            title={t("tests_strengths_name") as string}
            subtitle={t("tests_strengths_subtitle")}
            stepLabel={t("step_x_of_y", { step, total: STEPS_COUNT })}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

          <Divider sx={{ mt: 3, mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 4, mb: 6 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handlePrev}
              disabled={step === 1 || submitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {t("holland_back")}
            </Button>

            {step < STEPS_COUNT ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!allStepAnswered || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {t("holland_next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!allStepAnswered || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {submitting ? "..." : t("holland_finish")}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

