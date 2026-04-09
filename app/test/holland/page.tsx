"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import QUESTIONS_JSON from "./holland_questions.json";
import { TestHeader } from "../components/TestHeader";
import { OptionQuestionCard } from "../components/OptionQuestionCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  HollandSessionFinishResponse,
  QuizResult,
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
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(initializing);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      setInitializing(true);
      try {
        const { body: tests, error: listError } = await quizServices.listTests({ type: "holland" });
        const slug = tests?.[0]?.slug ?? null;
        if (!slug || listError) throw new Error("listTests failed");

        const { body: session, error: startError } = await quizServices.startSession({ test_slug: slug });
        const { body: testDetail, error: detailError } = await quizServices.getTestDetail(slug);
        if (!session || !testDetail || startError || detailError) throw new Error("start/get detail failed");

        if (!cancelled) {
          setSessionId(session.id);
          setSession("holland", session.id);
          setBackendQuestionIds((testDetail.questions ?? []).map((q) => q.id));
        }
      } catch {
        if (!cancelled) toast.error(t("toast_test_error"));
      } finally {
        if (!cancelled) setInitializing(false);
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
      summary: undefined,
      created_at: new Date().toISOString(),
    };
  };

  const handleSubmit = async (finalAnswers?: Record<string, number>) => {
    const usedAnswers = finalAnswers ?? answers;
    if (Object.keys(usedAnswers).length !== TOTAL) return;

    let backendResult: HollandSessionFinishResponse | null = null;
    if (sessionId && backendQuestionIds.length > 0) {
      const count = Math.min(backendQuestionIds.length, QUESTIONS.length);
      const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS.slice(0, count).map((q, index) => ({
        question_id: backendQuestionIds[index],
        scale_value: usedAnswers[q.id],
      }));

      const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
      if (!bulkRes.error) {
        const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
        backendResult = finishRes.body as unknown as HollandSessionFinishResponse;
      }
    }

    setResult("holland", backendResult ?? buildLocalResult(usedAnswers));
    if (backendResult) toast.success(t("toast_test_success"));
    else toast.error(t("toast_test_error"));
    router.push("/test");
  };

  const handleAnswerChange = (value: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);
    const isLast = currentQuestionIndex === TOTAL - 1;

    if (!isLast) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < TOTAL - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const canFinish = Object.keys(answers).length === TOTAL;

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            answered={answeredCount}
            totalQuestions={TOTAL}
          />
          <Box sx={styles.header}>
            <Typography component="h2" variant="h2" sx={styles.title}>
              {t("holland_title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("holland_subtitle")}
            </Typography>
          </Box>

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
              {t("back")}
            </Button>
            {currentQuestionIndex < TOTAL - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!currentAnswer}
                sx={styles.navButton}
              >
                {t("next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => void handleSubmit()}
                disabled={!canFinish}
                sx={styles.navButton}
              >
                {t("finish")}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HollandTestPage;

const styles = {
  root: {
    pt: { xs: 3, md: 3 },
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
