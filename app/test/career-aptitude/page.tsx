"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { LoadingScreen } from "../components/LoadingScreen";
import { useDelayedFlag } from "../components/useDelayedFlag";
import { quizServices } from "@/lib/services/quizServices";
import QUESTIONS_JSON from "./career_questions.json";
import type {
  BulkAnswerQuizPayload,
  FinishQuizSessionVariables,
  StartQuizSessionVariables,
} from "@/lib/types";

const QUESTIONS_PER_STEP = 10;

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

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [backendQuestionIds, setBackendQuestionIds] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const showLoading = useDelayedFlag(initializing || submitting);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      setInitializing(true);
      const { body: tests } = await quizServices.listTests({ type: "career_aptitude" });
      const slug = tests?.[0]?.slug ?? null;
      if (!slug) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      const { body: session } = await quizServices.startSession({ test_slug: slug } as StartQuizSessionVariables);
      const { body: testDetail } = await quizServices.getTestDetail(slug);
      if (!session || !testDetail) {
        if (!cancelled) toast.error(t("toast_test_error"));
        if (!cancelled) setInitializing(false);
        return;
      }

      if (!cancelled) {
        setSessionId(session.id);
        setSession("career-aptitude", session.id);
        setBackendQuestionIds((testDetail.questions ?? []).map((q) => q.id));
      }
      if (!cancelled) setInitializing(false);
    };

    void initSession();
    return () => { cancelled = true; };
  }, [setSession]);

  const stepQuestions =
    stepChunks[Math.max(0, Math.min(step - 1, stepChunks.length - 1))] ?? [];
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

      setResult("career-aptitude", backendResult ?? buildLocalResult());
      if (backendResult) toast.success(t("toast_test_success"));
      else toast.error(t("toast_test_error"));
      router.push("/test");
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
      <LoadingScreen open={showLoading} text={t("toast_test_loading")} />
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
