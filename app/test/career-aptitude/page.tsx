"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { useQuizSessionHydrated } from "@/lib/hooks/useQuizSessionHydrated";
import { useQuizSessionFlow } from "@/lib/hooks/useQuizSessionFlow";
import { CareerResultPanel, type CareerAptitudeResult } from "./careerResultDialog";
import { TestResultActions } from "../../components/tests/TestResultActions";
import { TestHeader } from "../../components/tests/TestHeader";
import { LikertWordQuestionCard } from "../../components/tests/RadioQuestionCard";
import { LoadingScreen } from "../../components/tests/LoadingScreen";
import { useDelayedFlag } from "../../components/tests/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import QUESTIONS_JSON from "./career_questions.json";
import {
  getCurrentLocaleForTranslation,
  translateQuizResultForLocale,
} from "@/lib/utils/quizResultTranslation";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
} from "@/lib/types";

const QUESTIONS_PER_STEP = 10;

const INTEREST_OPTIONS = [
  { ru: "Не нравится", kk: "Ұнамайды", en: "Dislike" },
  { ru: "Скорее не нравится", kk: "Көбіне Ұнамайды", en: "Somewhat dislike" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Скорее нравится", kk: "Көбіне ұнайды", en: "Somewhat like" },
  { ru: "Нравится", kk: "Ұнайды", en: "Like" },
];

const SESSION_KEY = "career-aptitude";

const PERSONALITY_OPTIONS = [
  { ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" },
  { ru: "Скорее неточно", kk: "Дәлірек емес", en: "Somewhat inaccurate" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Скорее точно", kk: "Дәлірек", en: "Somewhat accurate" },
  { ru: "Точно", kk: "Дәл", en: "Accurate" },
];

const CareerAptitudeTestPage = () => {
  const t = useTranslations();
  const hydrated = useQuizSessionHydrated();
  const { setResult } = useQuizSessionStore();
  const finishedResult = useQuizSessionStore((s) => s.getSession(SESSION_KEY)?.result as CareerAptitudeResult | null | undefined);
  const { phase, setPhase, sessionId, backendQuestionIds, initializing, retake } = useQuizSessionFlow({
    hydrated,
    sessionKey: SESSION_KEY,
    resolveSlug: async () => {
      const { body: tests } = await quizServices.listTests({ type: "career_aptitude" });
      return tests?.[0]?.slug ?? null;
    },
    onInitError: () => toast.error(t("toast_test_error")),
  });

  const stepChunks = useMemo(() => {
    const chunks: (typeof QUESTIONS_JSON)[] = [];
    let current: (typeof QUESTIONS_JSON) = [];
    let currentPart: number | null = null;

    for (const q of QUESTIONS_JSON) {
      if (currentPart == null) {
        currentPart = q.part;
        current = [q];
        continue;
      }

      if (q.part !== currentPart) {
        for (let i = 0; i < current.length; i += QUESTIONS_PER_STEP) {
          chunks.push(current.slice(i, i + QUESTIONS_PER_STEP));
        }
        currentPart = q.part;
        current = [q];
        continue;
      }

      current.push(q);
    }

    if (current.length > 0) {
      for (let i = 0; i < current.length; i += QUESTIONS_PER_STEP) {
        chunks.push(current.slice(i, i + QUESTIONS_PER_STEP));
      }
    }

    return chunks;
  }, []);

  const TOTAL_STEPS = stepChunks.length || 1;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const showLoading = useDelayedFlag(phase === "quiz" && (initializing || submitting));

  const stepQuestions =
    stepChunks[Math.max(0, Math.min(step - 1, stepChunks.length - 1))] ?? [];
  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  const optionsHeaderCareer = useMemo(() => {
    const part = stepQuestions[0]?.part;
    if (part == null) return undefined;
    return part === 1 ? INTEREST_OPTIONS : PERSONALITY_OPTIONS;
  }, [stepQuestions]);

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

      if (sessionId && backendQuestionIds.length > 0) {
        const count = Math.min(backendQuestionIds.length, QUESTIONS_JSON.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = QUESTIONS_JSON.slice(0, count).map((q, idx) => ({
          question_id: backendQuestionIds[idx],
          scale_value: answers[q.id],
        }));

        const bulkRes = await quizServices.bulkAnswer({ session_id: sessionId, answers: answersPayload });
        if (!bulkRes.error) {
          const finishRes = await quizServices.finish({ session_id: sessionId } as FinishQuizSessionVariables);
          backendResult = finishRes.body;
        }
      }

      const localizedResult = await translateQuizResultForLocale(
        backendResult ?? buildLocalResult(),
        getCurrentLocaleForTranslation()
      );
      setResult(SESSION_KEY, localizedResult);
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      setPhase("result");
      setSubmitting(false);
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
      if (qs.length === 0) continue;
      const raw = qs.reduce((sum, q) => sum + (answers[q.id] ?? 2), 0);
      interestScores[cat] = Math.round(((raw - qs.length) / (qs.length * 2)) * 100);
    }

    const personalityScores: Record<string, number> = {};
    for (const dim of ["A", "C", "E", "N", "O"]) {
      const qs = part2.filter((q) => q.category === dim);
      if (qs.length === 0) continue;
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

  if (!hydrated) {
    return <LoadingScreen open text={t("toast_test_loading")} />;
  }

  if (phase === "result") {
    const result = (finishedResult ?? null) as CareerAptitudeResult | null;
    return (
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <TestHeader
            step={TOTAL_STEPS}
            totalSteps={TOTAL_STEPS}
            stepLabel={t("step_x_of_y", { step: TOTAL_STEPS, total: TOTAL_STEPS })}
            optionsHeader={PERSONALITY_OPTIONS}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("career_title")}</Box>
          </Box>
          <CareerResultPanel result={result} />
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
            totalSteps={TOTAL_STEPS}
            stepLabel={t("step_x_of_y", { step, total: TOTAL_STEPS })}
            optionsHeader={optionsHeaderCareer}
          />
          <Box sx={styles.pageHeader}>
            <Box sx={styles.pageTitle}>{t("career_title")}</Box>
            {stepQuestions[0]?.part === 1 ? (
              <Box sx={styles.pageHelper}>{t("tests_career-aptitude_helper_interest")}</Box>
            ) : stepQuestions[0]?.part === 2 ? (
              <Box sx={styles.pageHelper}>{t("tests_career-aptitude_helper_personality")}</Box>
            ) : null}
          </Box>

          <Divider sx={styles.dividerBeforeQuestions} />

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

          <Divider sx={styles.dividerBeforeNav} />

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

            {step < TOTAL_STEPS ? (
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
                {submitting ? "..." : t("finish")}
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
  dividerBeforeQuestions: { mb: 2 },
  dividerBeforeNav: { mt: 1, mb: 3 },
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
