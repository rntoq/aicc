"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { useQuizSessionHydrated } from "@/lib/hooks/useQuizSessionHydrated";
import { useQuizSessionFlow } from "@/lib/hooks/useQuizSessionFlow";
import { TestHeader } from "../../components/tests/TestHeader";
import { LikertWordQuestionCard } from "../../components/tests/RadioQuestionCard";
import { LoadingScreen } from "../../components/tests/LoadingScreen";
import { useDelayedFlag } from "../../components/tests/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import {
  getCurrentLocaleForTranslation,
  translateQuizResultForLocale,
} from "@/lib/utils/quizResultTranslation";
import QUESTIONS_JSON from "./bigfive_questions.json";
import type {
  BigFiveSessionFinishResponse,
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
} from "@/lib/types";
import { BigFiveResultPanel } from "./bigfiveResultDialog";
import { TestResultActions } from "../../components/tests/TestResultActions";

const SESSION_KEY = "bigfive";

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
  const hydrated = useQuizSessionHydrated();
  const { setResult } = useQuizSessionStore();
  const finishedResult = useQuizSessionStore((s) => s.getSession(SESSION_KEY)?.result as BigFiveSessionFinishResponse | null | undefined);
  const { phase, setPhase, sessionId, backendQuestionIds, initializing, retake } = useQuizSessionFlow({
    hydrated,
    sessionKey: SESSION_KEY,
    resolveSlug: async () => {
      const { body: tests, error } = await quizServices.listTests({ type: "big_five" });
      if (error) return null;
      return tests?.[0]?.slug ?? null;
    },
    onInitError: () => toast.error(t("toast_test_error")),
  });
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const showLoading = useDelayedFlag(phase === "quiz" && (initializing || submitting));

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

      if (sessionId && backendQuestionIds.length > 0) {
        const count = Math.min(backendQuestionIds.length, QUESTIONS_JSON.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS_JSON.slice(0, count).map((q, index) => ({
          question_id: backendQuestionIds[index],
          scale_value: answers[q.id],
        }));

        const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
        if (!bulkRes.error) {
          const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
          backendResult = finishRes.body as unknown as BigFiveSessionFinishResponse;
        }
      }

      if (backendResult) {
        const localizedResult = await translateQuizResultForLocale(
          backendResult,
          getCurrentLocaleForTranslation()
        );
        setResult(SESSION_KEY, localizedResult);
        toast.success(t("toast_test_success"));
        setPhase("result");
      } else {
        toast.error(t("toast_test_error"));
      }
      setSubmitting(false);
    };

    void finish();
  };

  if (!hydrated) {
    return <LoadingScreen open text={t("toast_test_loading")} />;
  }

  if (phase === "result") {
    const result = (finishedResult ?? null) as BigFiveSessionFinishResponse | null;
    return (
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={STEPS_COUNT}
            totalSteps={STEPS_COUNT}
            stepLabel={t("step_x_of_y", { step: STEPS_COUNT, total: STEPS_COUNT })}
            optionsHeader={scaleLabels}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("bigfive_title")}</Box>
          </Box>
          <BigFiveResultPanel result={result} />
          <TestResultActions
            onRetake={retake}
          />
        </Container>
      </Box>
    );
  }

  return (
    <>
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={step}
            totalSteps={STEPS_COUNT}
            stepLabel={t("step_x_of_y", { step, total: STEPS_COUNT })}
            optionsHeader={scaleLabels}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("bigfive_title")}</Box>
            <Box sx={styles.pageHelper}>{t("tests_big-five_helper")}</Box>
          </Box>
          <Divider sx={styles.dividerTop} />

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

          <Divider sx={styles.dividerBottom} />

          <Box sx={styles.navigation}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handlePrev}
              disabled={step === 1}
              sx={styles.navButton}
            >
              {t("back")}
            </Button>

            {step < STEPS_COUNT ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!allStepAnswered}
                sx={styles.navButton}
              >
                {t("next")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!allStepAnswered || submitting}
                sx={styles.navButton}
              >
                {submitting ? "..." : t("submit")}
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
    pt: 3,
    minHeight: "80vh",
  },
  pageHeader: {
    mb: 3,
    textAlign: "center" as const,
  },
  pageTitle: {
    mb: 0.75,
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  pageHelper: {
    color: "text.secondary",
  },
  dividerTop: { mb: 1 },
  dividerBottom: { mt: 1, mb: 3 },
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
