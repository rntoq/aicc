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
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";

const HollandTestPage = () => {
  const t = useTranslations();
  const locale = useLocale();
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

        const { data: session } = await api.post<
          QuizSession,
          StartQuizSessionVariables
        >("/api/v1/quizzes/sessions/start/", { test_slug: slug });

        const { data: testDetail } = await api.get<{
          questions: { id: number }[];
        }>(`/api/v1/quizzes/tests/${slug}/`);

        if (!cancelled) {
          setSessionId(session.id);
          setSession("holland", session.id);
          setBackendQuestionIds(
            (testDetail.questions ?? []).map((q) => q.id)
          );
        }
      } catch {
        // backend unavailable – continue in local-only mode
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
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const localeKey = locale as "ru" | "kk" | "en";
  const questionText =
    typeof currentQuestion.text === "string"
      ? currentQuestion.text
      : currentQuestion.text?.[localeKey] ??
        currentQuestion.text?.ru ??
        currentQuestion.text?.en ??
        "";
  const likertOptions = [1, 2, 3, 4, 5].map((v) =>
    t(`holland_likert_${v}` as any)
  );

  const handleAnswerChange = (value: number) => {
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
    let backendResult: HollandSessionFinishResponse | null = null;

    if (sessionId && backendQuestionIds.length === totalQuestions) {
      const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS_JSON.map(
        (q: any, index: number) => ({
          question_id: backendQuestionIds[index],
          scale_value: usedAnswers[q.id],
        })
      );

      await api.post<unknown, BulkAnswerQuizPayload>(
        "/api/v1/quizzes/sessions/bulk-answer/",
        { session_id: sessionId, answers: answersPayload }
      );

      const { data } = await api.post<
        HollandSessionFinishResponse,
        FinishQuizSessionVariables
      >("/api/v1/quizzes/sessions/finish/", {
        session_id: sessionId,
      });

      backendResult = data;
      setResult("holland", backendResult);
    }

    router.push("/test");
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
          total={totalQuestions}
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
