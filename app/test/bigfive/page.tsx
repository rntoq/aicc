"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { OptionsHeader } from "../components/OptionsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { api } from "@/lib/api/api";
import QUESTIONS_JSON from "./bigfive_questions.json";
import type {
  BigFiveSessionFinishResponse,
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";

const QUESTIONS_PER_STEP = 12;
const STEPS_COUNT = Math.ceil(QUESTIONS_JSON.length / QUESTIONS_PER_STEP); // 74 → 7 steps

const BIGFIVE_OPTIONS = [
  { ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" },
  { ru: "Скорее неточно", kk: "Дәлірек емес", en: "Somewhat inaccurate" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Скорее точно", kk: "Дәлірек", en: "Somewhat accurate" },
  { ru: "Точно", kk: "Дәл", en: "Accurate" },
];

const BigFiveTestPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        const { data: tests } = await api.get<QuizTest[]>(
          "/api/v1/quizzes/tests/",
          { params: { type: "big_five" } }
        );
        const slug = tests[0]?.slug;
        if (!slug) return;

        const { data: session } = await api.post<QuizSession, StartQuizSessionVariables>(
          "/api/v1/quizzes/sessions/start/",
          { test_slug: slug }
        );

        const { data: testDetail } = await api.get<{ questions: { id: number }[] }>(
          `/api/v1/quizzes/tests/${slug}/`
        );

        if (!cancelled) {
          setSessionId(session.id);
          setSession("bigfive", session.id);
          setBackendQuestionIds((testDetail.questions ?? []).map((q) => q.id));
        }
      } catch {
        // backend unavailable – continue in local-only mode
      }
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [setSession]);

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = QUESTIONS_JSON.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  const localeKey = locale as "ru" | "kk" | "en";

  const scaleLabels: [string, string, string, string, string] = [
    BIGFIVE_OPTIONS[0][localeKey] ?? BIGFIVE_OPTIONS[0].ru,
    BIGFIVE_OPTIONS[1][localeKey] ?? BIGFIVE_OPTIONS[1].ru,
    BIGFIVE_OPTIONS[2][localeKey] ?? BIGFIVE_OPTIONS[2].ru,
    BIGFIVE_OPTIONS[3][localeKey] ?? BIGFIVE_OPTIONS[3].ru,
    BIGFIVE_OPTIONS[4][localeKey] ?? BIGFIVE_OPTIONS[4].ru,
  ];

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (step < STEPS_COUNT) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    const totalAnswered = Object.keys(answers).length;
    if (totalAnswered < QUESTIONS_JSON.length) return;
    setSubmitting(true);

    const finish = async () => {
      let backendResult: BigFiveSessionFinishResponse | null = null;

      try {
        if (sessionId && backendQuestionIds.length > 0) {
          const count = Math.min(backendQuestionIds.length, QUESTIONS_JSON.length);
          const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS_JSON.slice(0, count).map(
            (q, index) => ({
              question_id: backendQuestionIds[index],
              scale_value: answers[q.id],
            })
          );

          await api.post<unknown, BulkAnswerQuizPayload>(
            "/api/v1/quizzes/sessions/bulk-answer/",
            { session_id: sessionId, answers: answersPayload }
          );

          const { data } = await api.post<BigFiveSessionFinishResponse, FinishQuizSessionVariables>(
            "/api/v1/quizzes/sessions/finish/",
            { session_id: sessionId }
          );
          backendResult = data;
        }
      } catch {
        backendResult = null;
      } finally {
        if (backendResult) {
          setResult("bigfive", backendResult);
        }
        router.push("/test");
        setSubmitting(false);
      }
    };

    void finish();
  };

  return (
    <>
      <Header />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <StepsHeader
            step={step}
            total={STEPS_COUNT}
            title={t("bigfive_title")}
            subtitle={t("bigfive_subtitle")}
            stepLabel={t("step_x_of_y", { step, total: STEPS_COUNT })}
          />

          <OptionsHeader options={scaleLabels} />
          <Divider sx={{ mb: 1 }} />

          <Box sx={styles.questionsList}>
            {stepQuestions.map((q) => {
              const text = q.text as { ru: string; kk: string; en: string };
              return (
                <LikertWordQuestionCard
                  key={q.id}
                  title={text}
                  value={answers[q.id] ?? null}
                  onChange={(v) => handleAnswer(q.id, v)}
                  leftLabel={{ ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" }}
                  rightLabel={{ ru: "Точно", kk: "Дәл", en: "Accurate" }}
                  options={BIGFIVE_OPTIONS}
                />
              );
            })}
          </Box>

          <Divider sx={{ mt: 1, mb: 3 }} />

          <Box sx={styles.navigation}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handlePrev}
              disabled={step === 1}
              sx={styles.navButton}
            >
              {t("bigfive_prev")}
            </Button>

            {step < STEPS_COUNT ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!allStepAnswered}
                sx={styles.navButton}
              >
                {t("bigfive_next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!allStepAnswered || submitting}
                sx={styles.navButton}
              >
                {submitting ? "..." : t("bigfive_submit")}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BigFiveTestPage;

const styles = {
  root: {
    pt: { xs: 15, md: 12 },
    minHeight: "80vh",
  },
  questionsList: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    mt: 2,
    mb: 2,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    mt: 4,
    mb: 6,
  },
  navButton: {
    borderRadius: 2,
    px: 3,
  },
};
