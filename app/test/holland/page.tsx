"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import QUESTIONS_JSON from "./holland_questions.json";
import { ProgressBar } from "../components/ProgressBar";
import { OptionQuestionCard } from "../components/OptionQuestionCard";
import { Header } from "@/app/components/layout/Header";
import { api } from "@/lib/api/api";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  HollandSessionFinishResponse,
  QuizResult,
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";

type HollandQuestion = {
  id: string;
  text: { ru: string; kk: string; en: string } | string;
  category: string;
  weight: number;
};

const QUESTIONS = QUESTIONS_JSON as HollandQuestion[];
const TOTAL = QUESTIONS.length; // 48

const RIASEC_CATEGORIES = ["R", "I", "A", "S", "E", "C"] as const;

const HollandTestPage = () => {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "kk" | "en";
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        const { data: tests } = await api.get<QuizTest[]>(
          "/api/v1/quizzes/tests/",
          { params: { type: "holland" } }
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
          setSession("holland", session.id);
          setBackendQuestionIds((testDetail.questions ?? []).map((q) => q.id));
        }
      } catch {
        // backend unavailable – local fallback will be used
      }
    };

    void initSession();
    return () => { cancelled = true; };
  }, [setSession]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] ?? null;
  const answeredCount = Object.keys(answers).length;
  const progress = TOTAL ? Math.round((answeredCount / TOTAL) * 100) : 0;

  const questionText =
    typeof currentQuestion.text === "string"
      ? currentQuestion.text
      : currentQuestion.text[locale] ?? currentQuestion.text.ru;

  const likertOptions = [1, 2, 3, 4, 5].map((v) =>
    t(`holland_likert_${v}` as Parameters<typeof t>[0])
  );

  const buildLocalResult = (usedAnswers: Record<string, number>): QuizResult => {
    const scores: Record<string, number> = {};
    for (const cat of RIASEC_CATEGORIES) {
      const qs = QUESTIONS.filter((q) => q.category === cat);
      scores[cat] = qs.reduce((sum, q) => sum + (usedAnswers[q.id] ?? 3), 0);
    }
    const sorted = [...RIASEC_CATEGORIES].sort((a, b) => scores[b] - scores[a]);
    const hollandCode = sorted.slice(0, 3).join("");
    return {
      id: Date.now(),
      test_type: "holland",
      test_title: t("holland_title") as string,
      scores,
      holland_code: hollandCode,
      primary_type: sorted[0],
      summary: null,
      created_at: new Date().toISOString(),
    } as QuizResult;
  };

  const handleSubmit = async (finalAnswers?: Record<string, number>) => {
    const usedAnswers = finalAnswers ?? answers;
    if (Object.keys(usedAnswers).length !== TOTAL) return;

    let backendResult: HollandSessionFinishResponse | null = null;

    try {
      if (sessionId && backendQuestionIds.length > 0) {
        const count = Math.min(backendQuestionIds.length, QUESTIONS.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS.slice(0, count).map(
          (q, index) => ({
            question_id: backendQuestionIds[index],
            scale_value: usedAnswers[q.id],
          })
        );

        await api.post<unknown, BulkAnswerQuizPayload>(
          "/api/v1/quizzes/sessions/bulk-answer/",
          { session_id: sessionId, answers: answersPayload }
        );

        const { data } = await api.post<HollandSessionFinishResponse, FinishQuizSessionVariables>(
          "/api/v1/quizzes/sessions/finish/",
          { session_id: sessionId }
        );
        backendResult = data;
      }
    } catch {
      backendResult = null;
    } finally {
      setResult("holland", backendResult ?? buildLocalResult(usedAnswers));
      router.push("/test");
    }
  };

  const handleAnswerChange = (value: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);
    const isLast = currentQuestionIndex === TOTAL - 1;
    const allDone = Object.keys(updatedAnswers).length === TOTAL;

    if (isLast && allDone) {
      void handleSubmit(updatedAnswers);
    } else if (!isLast) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < TOTAL - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <>
      <Header />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <Box sx={styles.header}>
            <Typography component="h2" variant="h2" sx={styles.title}>
              {t("holland_title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("holland_subtitle")}
            </Typography>
          </Box>

          <ProgressBar
            progress={progress}
            current={answeredCount}
            total={TOTAL}
          />

          <OptionQuestionCard
            questionNumber={currentQuestionIndex + 1}
            questionText={questionText}
            options={likertOptions}
            value={currentAnswer}
            onChange={handleAnswerChange}
          />

          <Box sx={styles.navigation}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              sx={styles.navButton}
            >
              {t("holland_back")}
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!currentAnswer}
              sx={styles.navButton}
            >
              {t("holland_next")}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HollandTestPage;

const styles = {
  root: {
    pt: { xs: 15, md: 12 },
    minHeight: "80vh",
  },
  header: {
    mb: 4,
    textAlign: "center",
  },
  title: {
    mb: 1,
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    mt: 4,
  },
  navButton: {
    borderRadius: 2,
    px: 3,
  },
};
