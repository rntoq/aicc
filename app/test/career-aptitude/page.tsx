"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { api } from "@/lib/api/api";
import QUESTIONS_JSON from "./career_questions.json";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";

const QUESTIONS_PER_STEP = 10;
const TOTAL_STEPS = Math.ceil(QUESTIONS_JSON.length / QUESTIONS_PER_STEP);

const INTEREST_OPTIONS = [
  { ru: "Не нравится", kk: "Ұнамайды", en: "Dislike" },
  { ru: "Скорее не нравится", kk: "Көбіне Ұнамайды", en: "Somewhat dislike" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Скорее нравится", kk: "Көбіне ұнайды", en: "Somewhat like" },
  { ru: "Нравится", kk: "Ұнайды", en: "Like" },
];

const PERSONALITY_OPTIONS = [
  { ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" },
  { ru: "Скорее неточно", kk: "Дәлірек емес", en: "Somewhat inaccurate" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Скорее точно", kk: "Дәлірек", en: "Somewhat accurate" },
  { ru: "Точно", kk: "Дәл", en: "Accurate" },
];

const CareerAptitudeTestPage = () => {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "kk" | "en";
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
        const { data: tests } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", {
          params: { type: "career_aptitude" },
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

        if (!cancelled) {
          setSessionId(session.id);
          setSession("career-aptitude", session.id);
          setBackendQuestionIds((testDetail.questions ?? []).map((q) => q.id));
        }
      } catch {
        // backend unavailable — local-only mode
      }
    };

    void initSession();
    return () => { cancelled = true; };
  }, [setSession]);

  const stepStart = (step - 1) * QUESTIONS_PER_STEP;
  const stepQuestions = QUESTIONS_JSON.slice(stepStart, stepStart + QUESTIONS_PER_STEP);
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
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
    if (!allStepAnswered || submitting) return;
    setSubmitting(true);

    const finish = async () => {
      let backendResult: unknown = null;

      try {
        if (sessionId && backendQuestionIds.length > 0) {
          const count = Math.min(backendQuestionIds.length, QUESTIONS_JSON.length);
          const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS_JSON
            .slice(0, count)
            .map((q, idx) => ({
              question_id: backendQuestionIds[idx],
              scale_value: answers[q.id],
            }));

          await api.post<unknown, BulkAnswerQuizPayload>(
            "/api/v1/quizzes/sessions/bulk-answer/",
            { session_id: sessionId, answers: answersPayload }
          );

          const { data } = await api.post<unknown, FinishQuizSessionVariables>(
            "/api/v1/quizzes/sessions/finish/",
            { session_id: sessionId }
          );
          backendResult = data;
        }
      } catch {
        backendResult = null;
      } finally {
        setResult("career-aptitude", backendResult ?? buildLocalResult());
        router.push("/test");
        setSubmitting(false);
      }
    };

    void finish();
  };

  const buildLocalResult = () => {
    const RIASEC_ORDER = ["R", "I", "A", "S", "E", "C"] as const;
    const part1 = QUESTIONS_JSON.filter((q) => q.part === 1);
    const part2 = QUESTIONS_JSON.filter((q) => q.part === 2);

    const interestScores: Record<string, number> = {};
    for (const cat of RIASEC_ORDER) {
      const qs = part1.filter((q) => q.category === cat);
      const raw = qs.reduce((sum, q) => sum + (answers[q.id] ?? 2), 0);
      interestScores[cat] = Math.round(((raw - qs.length) / (qs.length * 2)) * 100);
    }

    const personalityScores: Record<string, number> = {};
    for (const dim of ["A", "C", "E", "N", "O"]) {
      const qs = part2.filter((q) => q.category === dim);
      const raw = qs.reduce((sum, q) => {
        const v = answers[q.id] ?? 3;
        return sum + (q.reverse_scored ? 6 - v : v);
      }, 0);
      personalityScores[dim] = Math.round(((raw - qs.length) / (qs.length * 4)) * 100);
    }

    const sorted = [...RIASEC_ORDER].sort((a, b) => interestScores[b] - interestScores[a]);
    return {
      test_type: "career_aptitude",
      interest_scores: interestScores,
      personality_scores: personalityScores,
      holland_code: sorted.slice(0, 3).join(""),
      primary_type: sorted.slice(0, 3).join(""),
      summary: null,
    };
  };

  return (
    <>
      <Header />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <StepsHeader
            step={step}
            total={TOTAL_STEPS}
            title={t("career_title")}
            stepLabel={t("step_x_of_y", { step, total: TOTAL_STEPS })}
          />

          <Divider sx={{ mb: 2 }} />

          <Box sx={styles.questionsList}>
            {stepQuestions.map((q) => {
              const text = q.text as { ru: string; kk: string; en: string };
              const isPart1 = q.part === 1;
              const options = isPart1 ? INTEREST_OPTIONS : PERSONALITY_OPTIONS;
              const leftLabel = isPart1
                ? { ru: "Не нравится", kk: "Ұнамайды", en: "Dislike" }
                : { ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" };
              const rightLabel = isPart1
                ? { ru: "Нравится", kk: "Ұнайды", en: "Like" }
                : { ru: "Точно", kk: "Дәл", en: "Accurate" };
              return (
                <LikertWordQuestionCard
                  key={q.id}
                  title={text}
                  value={answers[q.id] ?? null}
                  onChange={(v) => handleAnswer(q.id, v)}
                  leftLabel={leftLabel}
                  rightLabel={rightLabel}
                  options={options}
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
              {t("career_prev")}
            </Button>

            {step < TOTAL_STEPS ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!allStepAnswered}
                sx={styles.navButton}
              >
                {t("career_next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!allStepAnswered || submitting}
                sx={styles.navButton}
              >
                {submitting ? "..." : t("career_submit")}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CareerAptitudeTestPage;

const styles = {
  root: {
    pt: { xs: 15, md: 12 },
    minHeight: "80vh",
  },
  questionsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
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
