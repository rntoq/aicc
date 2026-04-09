"use client";

import { Box, Button, CircularProgress, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import PHOTO_DATA from "./photo_questions.json";
import { PhotoPair, type PhotoQuestion } from "../components/PhotoPair";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import { TestHeader } from "../components/TestHeader";
import { quizServices } from "@/lib/services/quizServices";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizResult,
} from "@/lib/types";

const PhotoCareerQuizPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(initializing || isSubmitting);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestions, setBackendQuestions] = useState<
    { id: number; answers: { code: string }[] }[]
  >([]);

  const PHOTO_QUESTIONS: PhotoQuestion[] =
    (PHOTO_DATA as { PHOTO_QUESTIONS?: PhotoQuestion[] }).PHOTO_QUESTIONS ?? [];

  const [answers, setAnswers] = useState<Record<string, "optionA" | "optionB">>({});

  const allAnswered =
    PHOTO_QUESTIONS.length > 0 &&
    Object.keys(answers).length === PHOTO_QUESTIONS.length;

  const buildLocalResult = (id: number): QuizResult => {
    // Use backend scale names so dialog normalizes both formats consistently
    const RIASEC_TO_SCALE: Record<string, string> = {
      R: "Building", I: "Thinking", A: "Creating",
      S: "Helping",  E: "Persuading", C: "Organizing",
    };
    const counts: Record<string, number> = {
      Building: 0, Thinking: 0, Creating: 0,
      Helping: 0, Persuading: 0, Organizing: 0,
    };

    for (const q of PHOTO_QUESTIONS) {
      const selected = answers[q.id];
      if (!selected) continue;
      const optionId = selected === "optionA" ? q.optionA.id : q.optionB.id;
      const letter = optionId.split("_")[0]; // "R", "I", "A", "S", "E", "C"
      const scaleName = RIASEC_TO_SCALE[letter];
      if (scaleName) counts[scaleName] += 1;
    }

    const total = Math.max(1, PHOTO_QUESTIONS.length);
    const scores: Record<string, number> = {};
    for (const [scale, count] of Object.entries(counts)) {
      scores[scale] = Math.round((count / total) * 100);
    }

    // Build holland code from RIASEC letters sorted by score
    const riasecLetters = ["R", "I", "A", "S", "E", "C"] as const;
    const sorted = [...riasecLetters].sort(
      (a, b) => (scores[RIASEC_TO_SCALE[b]] ?? 0) - (scores[RIASEC_TO_SCALE[a]] ?? 0)
    );
    const code = sorted.slice(0, 3).join("");

    return {
      id,
      test_title: t("photo_resultTitle"),
      test_type: "photo",
      scores,
      primary_type: code,
      secondary_type: null,
      summary: undefined,
      detailed_report: undefined,
      created_at: new Date().toISOString(),
    };
  };

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      setInitializing(true);
      const { body: tests } = await quizServices.listTests({ type: "photo" });
      const slug = tests?.[0]?.slug ?? null;
      if (!slug) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const { body: session } = await quizServices.startSession({ test_slug: slug });
      const { body: testDetail } = await quizServices.getTestDetail(slug);
      if (!session || !testDetail) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const questions = (testDetail.questions ?? []).map((q) => ({
        id: q.id,
        answers: (q.answers ?? []).map((a) => ({ code: a.code })),
      }));

      if (!cancelled && questions.length > 0) {
        setSessionId(session.id);
        setSession("photo-career", session.id);
        setBackendQuestions(questions);
      }
      if (!cancelled) setInitializing(false);
    };

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [setSession]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setIsSubmitting(true);

    const finish = async () => {
      let backendResult: QuizResult | null = null;

      if (
        sessionId &&
        backendQuestions.length > 0 &&
        PHOTO_QUESTIONS.length > 0
      ) {
        const maxCount = Math.min(backendQuestions.length, PHOTO_QUESTIONS.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = [];

        for (let i = 0; i < maxCount; i++) {
          const q = PHOTO_QUESTIONS[i];
          const selected = answers[q.id];
          if (!selected) continue;

          const backendQuestion = backendQuestions[i];
          const backendAnswers = backendQuestion.answers ?? [];
          const backendAnswer =
            selected === "optionA" ? backendAnswers[0] : backendAnswers[1];
          if (!backendAnswer) continue;

          answersPayload.push({
            question_id: backendQuestion.id,
            answer_code: backendAnswer.code,
          });
        }

        if (answersPayload.length > 0) {
          const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
          if (!bulkRes.error) {
            const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
            backendResult = finishRes.body;
          }
        }
      }

      const resultToSave = backendResult ?? buildLocalResult(Date.now());
      setResult("photo-career", resultToSave);
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      router.push("/test");
      setIsSubmitting(false);
    };

    void finish();
  };

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="xl" sx={styles.container}>
          <TestHeader
            answered={Object.keys(answers).length}
            totalQuestions={PHOTO_QUESTIONS.length}
          />
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Box sx={{ mb: 0.5, fontSize: "1.25rem", fontWeight: 700 }}>{t("tests_photo-career_name") as string}</Box>
            <Box style={{ color: "rgba(0,0,0,0.6)" }}>{t("tests_photo-career_subtitle")}</Box>
          </Box>
          {PHOTO_QUESTIONS.map((question) => {
            const questionAnswer = answers[question.id] || null;
            return (
              <PhotoPair
                key={question.id}
                question={question}
                selected={questionAnswer}
                onSelect={(option) =>
                  setAnswers((prev) => ({ ...prev, [question.id]: option }))
                }
              />
            );
          })}

          {allAnswered && (
            <Box sx={styles.submitContainer}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={styles.submitButton}
              >
                {isSubmitting ? <CircularProgress size={20} /> : t("finish")}
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default PhotoCareerQuizPage;

const styles = {
  root: {
    pt: { xs: 3, md: 3 },
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: { xs: 2, md: 4 },
  },
  submitContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: { xs: 4, md: 6 },
    position: "sticky" as const,
    bottom: 0,
    bgcolor: "background.default",
    zIndex: 10,
    mt: 4,
  },
  submitButton: {
    borderRadius: 2,
    px: 6,
    py: 1.5,
    fontSize: "1.125rem",
    fontWeight: 600,
  },
};

