"use client";

import { Box, Button, CircularProgress, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import PHOTO_DATA from "./photo_questions.json";
import { PhotoPair, type PhotoQuestion } from "../components/PhotoPair";
import { Header } from "@/app/components/layout/Header";
import { api } from "@/lib/api/api";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  QuizResult,
  QuizSession,
  QuizTest,
  StartQuizSessionVariables,
} from "@/lib/types";

const PhotoCareerQuizPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setSession, setResult } = useQuizSessionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const buildLocalResult = (): QuizResult => {
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
      id: Date.now(),
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
      try {
        const { data: tests } = await api.get<QuizTest[]>(
          "/api/v1/quizzes/tests/",
          { params: { type: "photo" } }
        );

        const slug = tests[0]?.slug;
        if (!slug) return;

        const { data: session } = await api.post<
          QuizSession,
          StartQuizSessionVariables
        >("/api/v1/quizzes/sessions/start/", { test_slug: slug });

        const { data: testDetail } = await api.get<{
          questions: { id: number; answers: { code: string }[] }[];
        }>(`/api/v1/quizzes/tests/${slug}/`);

        const questions = testDetail.questions ?? [];

        if (!cancelled && questions.length > 0) {
          setSessionId(session.id);
          setSession("photo-career", session.id);
          setBackendQuestions(questions);
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

  const handleSubmit = () => {
    if (!allAnswered) return;
    setIsSubmitting(true);

    const finish = async () => {
      let backendResult: QuizResult | null = null;

      try {
        if (
          sessionId &&
          backendQuestions.length > 0 &&
          PHOTO_QUESTIONS.length > 0
        ) {
          const maxCount = Math.min(
            backendQuestions.length,
            PHOTO_QUESTIONS.length
          );
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
            await api.post<unknown, BulkAnswerQuizPayload>(
              "/api/v1/quizzes/sessions/bulk-answer/",
              { session_id: sessionId, answers: answersPayload }
            );

            const { data } = await api.post<
              QuizResult,
              FinishQuizSessionVariables
            >("/api/v1/quizzes/sessions/finish/", {
              session_id: sessionId,
            });

            backendResult = data;
          }
        }
      } catch {
        // backend unavailable — fallback to local scoring
        backendResult = null;
      } finally {
        const resultToSave = backendResult ?? buildLocalResult();
        setResult("photo-career", resultToSave);
        router.push("/test");
        setIsSubmitting(false);
      }
    };

    void finish();
  };

  return (
    <>
      <Header />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="xl" sx={styles.container}>
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
                {isSubmitting ? <CircularProgress size={20} /> : t("holland_finish")}
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
    pt: { xs: 15, md: 12 },
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

