"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { api } from "@/lib/api/api";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  LocalizedText,
  QuizResult,
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import STRENGTHS_DATA from "./personal-strength/personal_strength_questions.json";

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

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => Number(a.id) - Number(b.id));
  }, [questions]);

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

  const expectedCount = sortedQuestions.length;

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = sortedQuestions.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        const { data: tests } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", {
          params: { type: "strengths" },
        });
        const slug = tests[0]?.slug;
        if (!slug) return;

        const { data: session } = await api.post<QuizSession, StartQuizSessionVariables>(
          "/api/v1/quizzes/sessions/start/",
          { test_slug: slug }
        );

        const { data: testDetail } = await api.get<{ questions: { id: number }[] }>(
          `/api/v1/quizzes/tests/${slug}/`
        );

        const allBackendIds = (testDetail.questions ?? []).map((q) => q.id);

        if (!cancelled && allBackendIds.length === expectedCount) {
          setSessionId(session.id);
          setSession("strengths", session.id);
          setBackendQuestionIds(allBackendIds);
        }
      } catch {
        // Backend unavailable — still allow placeholder completion.
      }
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
      try {
        if (sessionId && backendQuestionIds.length === expectedCount) {
          const answersPayload: BulkAnswerQuizPayload["answers"] = sortedQuestions.map((q, idx) => ({
            question_id: backendQuestionIds[idx],
            scale_value: answers[q.id] ?? 3,
          }));

          await api.post<unknown, BulkAnswerQuizPayload>("/api/v1/quizzes/sessions/bulk-answer/", {
            session_id: sessionId,
            answers: answersPayload,
          });

          const { data } = await api.post<QuizResult, FinishQuizSessionVariables>(
            "/api/v1/quizzes/sessions/finish/",
            { session_id: sessionId }
          );

          backendResult = data;
        }
      } catch {
        backendResult = null;
      } finally {
        const placeholder: QuizResult = {
          id: Date.now(),
          test_title:
            locale === "ru"
              ? data.test?.title?.ru ?? "Personal Strengths"
              : locale === "kk"
                ? data.test?.title?.kk ?? "Personal Strengths"
                : data.test?.title?.en ?? "Personal Strengths",
          test_type: "strengths",
          summary:
            locale === "ru"
              ? "Результат не удалось получить с сервера. Проверьте доступность backend и повторите позже."
              : locale === "kk"
                ? "Серверден нәтижені алу мүмкін болмады. Backend қолжетімділігін тексеріп, кейінірек қайталаңыз."
                : "Could not fetch the result from the server. Please check backend availability and try again later.",
          created_at: new Date().toISOString(),
        };

        setResult("strengths", backendResult ?? placeholder);
        router.push("/test");
        setSubmitting(false);
      }
    };

    void finish();
  };

  return (
    <>
      <Header />
      <Box component="main" sx={{ pt: { xs: 15, md: 12 }, minHeight: "80vh" }}>
        <Container maxWidth="md">
          <StepsHeader
            step={step}
            total={STEPS_COUNT}
            title={t("tests_strengths_name") as string}
            subtitle={locale === "ru" ? "Оцените, насколько каждое утверждение отражает ваши сильные стороны" : undefined}
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
              {locale === "ru" ? "Назад" : locale === "kk" ? "Артқа" : "Back"}
            </Button>

            {step < STEPS_COUNT ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!allStepAnswered || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {locale === "ru" ? "Далее" : locale === "kk" ? "Келесі" : "Next"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!allStepAnswered || submitting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {submitting ? "..." : locale === "ru" ? "Завершить" : locale === "kk" ? "Аяқтау" : "Finish"}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

