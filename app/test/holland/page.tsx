"use client";

import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useHollandStore } from "@/lib/store/hollandStore";
import QUESTIONS_JSON from "./holland_questions.json";
import { QuestionCard } from "./components/QuestionCard";
import { ProgressBar } from "./components/ProgressBar";
import { useTestsStore } from "@/lib/store/testsStore";
import { Header } from "@/app/components/layout/Header";
import { api } from "@/lib/api/api";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  HollandSessionFinishResponse,
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";

const HollandTestPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setResult } = useHollandStore();
  const { setCompleted } = useTestsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        // 1) Получаем Holland-тест и его slug
        const { data: tests } = await api.get<QuizTest[]>(
          "/api/v1/quizzes/tests/",
          { params: { type: "holland" } }
        );
        const slug = tests[0]?.slug;
        if (!slug) return;

        // 2) Стартуем сессию
        const { data: session } = await api.post<
          QuizSession,
          StartQuizSessionVariables
        >("/api/v1/quizzes/sessions/start/", { test_slug: slug });

        // 3) Получаем вопросы с бэкенда, чтобы знать их numeric id
        const { data: testDetail } = await api.get<{
          questions: { id: number }[];
        }>(`/api/v1/quizzes/tests/${slug}/`);

        if (!cancelled) {
          setSessionId(session.id);
          setBackendQuestionIds(
            (testDetail.questions ?? []).map((q) => q.id)
          );
        }
      } catch {
        // Если бэкенд недоступен — просто работаем в локальном режиме.
      }
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalQuestions = QUESTIONS_JSON.length;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const currentQuestion = QUESTIONS_JSON[currentQuestionIndex] as any;
  const currentAnswer = answers[currentQuestion.id] || null;
  const progress = totalQuestions
    ? Math.round((Object.keys(answers).length / totalQuestions) * 100)
    : 0;

  const handleAnswerChange = (value: number) => {
    // Сохраняем ответ
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(updatedAnswers);
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const allAnsweredAfter =
      Object.keys(updatedAnswers).length === totalQuestions;

    if (isLastQuestion && allAnsweredAfter) {
      handleSubmit(updatedAnswers);
    } else if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async (finalAnswers?: typeof answers) => {
    const usedAnswers = finalAnswers ?? answers;
    if (Object.keys(usedAnswers).length !== totalQuestions) return;
    setIsSubmitting(true);
    try {
      let backendResult: HollandSessionFinishResponse | null = null;
      let bulkPayload: BulkAnswerQuizPayload | null = null;

      if (
        sessionId &&
        backendQuestionIds.length === totalQuestions
      ) {
        const answersPayload: BulkAnswerQuizPayload["answers"] =
          QUESTIONS_JSON.map((q: any, index: number) => ({
            question_id: backendQuestionIds[index],
            scale_value: usedAnswers[q.id],
          }));

        bulkPayload = {
          session_id: sessionId,
          answers: answersPayload,
        };

        await api.post<unknown, BulkAnswerQuizPayload>(
          "/api/v1/quizzes/sessions/bulk-answer/",
          bulkPayload
        );

        const { data } = await api.post<
          HollandSessionFinishResponse,
          FinishQuizSessionVariables
        >("/api/v1/quizzes/sessions/finish/", {
          session_id: sessionId,
        });

        backendResult = data;
      }

      setResult({
        finishedAt: Date.now(),
        payload: {
          answers: usedAnswers,
          sessionId,
          bulkPayload,
          backendResult,
        },
      });
      useTestsStore.getState().setCompleted("holland");
      router.push("/test");
    } finally {
      setIsSubmitting(false);
    }
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
          current={Object.keys(answers).length}
          total={totalQuestions}
        />

        <QuestionCard
          question={currentQuestion}
          value={currentAnswer}
          onChange={handleAnswerChange}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
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
