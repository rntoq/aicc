"use client";

import { Box, Button, Container, Divider } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/quizSessionStore";
import { Header } from "@/app/components/layout/Header";
import { StepsHeader } from "../components/StepsHeader";
import { OptionsHeader } from "../components/OptionsHeader";
import { LikertWordQuestionCard } from "../components/RadioQuestionCard";
import { api } from "@/lib/api/api";
import QUESTIONS_JSON from "./career_questions.json";
import type {
  BulkAnswerQuizPayload,
  QuizSession,
  QuizTest,
} from "@/lib/types";

// ─── Question groups ──────────────────────────────────────────────────────────

const RIASEC_ORDER = ["R", "I", "A", "S", "E", "C"] as const;
type RIASECCategory = (typeof RIASEC_ORDER)[number];

const TOTAL_STEPS = 8;

const PART1_QUESTIONS = QUESTIONS_JSON.filter((q) => q.part === 1);
const PART2_QUESTIONS = QUESTIONS_JSON.filter((q) => q.part === 2);

const PART1_BY_CATEGORY: Record<RIASECCategory, typeof PART1_QUESTIONS> = {
  R: PART1_QUESTIONS.filter((q) => q.category === "R"),
  I: PART1_QUESTIONS.filter((q) => q.category === "I"),
  A: PART1_QUESTIONS.filter((q) => q.category === "A"),
  S: PART1_QUESTIONS.filter((q) => q.category === "S"),
  E: PART1_QUESTIONS.filter((q) => q.category === "E"),
  C: PART1_QUESTIONS.filter((q) => q.category === "C"),
};

// ─── Scale definitions ────────────────────────────────────────────────────────

const INTEREST_OPTIONS = [
  { ru: "Не нравится", kk: "Ұнамайды", en: "Dislike" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Нравится", kk: "Ұнайды", en: "Like" },
];

const PERSONALITY_OPTIONS = [
  { ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" },
  { ru: "Скорее неточно", kk: "Дәлірек емес", en: "Somewhat inaccurate" },
  { ru: "Нейтрально", kk: "Бейтарап", en: "Neutral" },
  { ru: "Скорее точно", kk: "Дәлірек", en: "Somewhat accurate" },
  { ru: "Точно", kk: "Дәл", en: "Accurate" },
];

const CATEGORY_META: Record<RIASECCategory, { ru: string; kk: string; en: string; icon: string }> = {
  R: { ru: "Строительство", kk: "Құрылыс", en: "Building", icon: "🏗️" },
  I: { ru: "Аналитика", kk: "Аналитика", en: "Thinking", icon: "🔬" },
  A: { ru: "Творчество", kk: "Шығармашылық", en: "Creating", icon: "🎨" },
  S: { ru: "Помощь", kk: "Көмек", en: "Helping", icon: "🤝" },
  E: { ru: "Предпринимательство", kk: "Кәсіпкерлік", en: "Persuading", icon: "💼" },
  C: { ru: "Организация", kk: "Ұйымдастыру", en: "Organizing", icon: "📊" },
};

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ─── Backend session init ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        const { data: tests } = await api.get<QuizTest[]>("/api/v1/quizzes/tests/", {
          params: { type: "career_aptitude" },
        });
        const slug = tests[0]?.slug;
        if (!slug) return;

        const { data: session } = await api.post<QuizSession, { test_slug: string }>(
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Derive current step questions ──────────────────────────────────────
  const isPart1 = step <= 6;
  const categoryForStep = isPart1 ? RIASEC_ORDER[step - 1] : null;

  const stepQuestions = useMemo(() => {
    if (isPart1 && categoryForStep) return PART1_BY_CATEGORY[categoryForStep];
    if (step === 7) return PART2_QUESTIONS.slice(0, 10);
    return PART2_QUESTIONS.slice(10);
  }, [step, isPart1, categoryForStep]);

  const allStepAnswered = stepQuestions.every((q) => answers[q.id] != null);

  // ─── Scale options and labels for current step ───────────────────────────
  const currentOptions = isPart1 ? INTEREST_OPTIONS : PERSONALITY_OPTIONS;
  const scaleLabels = currentOptions.map((o) => o[locale] ?? o.ru);

  const leftLabel = isPart1
    ? { ru: "Не нравится", kk: "Ұнамайды", en: "Dislike" }
    : { ru: "Неточно", kk: "Дәл емес", en: "Inaccurate" };
  const rightLabel = isPart1
    ? { ru: "Нравится", kk: "Ұнайды", en: "Like" }
    : { ru: "Точно", kk: "Дәл", en: "Accurate" };

  // ─── Step subtitle: category name for Part 1, generic for Part 2 ────────
  const stepSubtitle = (() => {
    if (isPart1 && categoryForStep) {
      const meta = CATEGORY_META[categoryForStep];
      return `${meta.icon} ${meta[locale] ?? meta.ru}`;
    }
    return t("career_part2_subtitle");
  })();

  // ─── Handlers ─────────────────────────────────────────────────────────────
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

  const handleSubmit = async () => {
    if (!allStepAnswered) return;
    setSubmitting(true);

    try {
      if (sessionId && backendQuestionIds.length > 0) {
        const ordered = [...PART1_QUESTIONS, ...PART2_QUESTIONS];
        const count = Math.min(backendQuestionIds.length, ordered.length);
        const answersPayload: BulkAnswerQuizPayload["answers"] = ordered
          .slice(0, count)
          .map((q, idx) => ({
            question_id: backendQuestionIds[idx],
            scale_value: answers[q.id],
          }));

        await api.post<unknown, BulkAnswerQuizPayload>(
          "/api/v1/quizzes/sessions/bulk-answer/",
          { session_id: sessionId, answers: answersPayload }
        );

        const { data } = await api.post<unknown, { session_id: number }>(
          "/api/v1/quizzes/sessions/finish/",
          { session_id: sessionId }
        );
        setResult("career-aptitude", data);
      } else {
        setResult("career-aptitude", buildLocalResult());
      }

      router.push("/test");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Local scoring fallback ───────────────────────────────────────────────
  const buildLocalResult = () => {
    const interestScores: Record<string, number> = {};
    for (const cat of RIASEC_ORDER) {
      const qs = PART1_BY_CATEGORY[cat];
      const raw = qs.reduce((sum, q) => sum + (answers[q.id] ?? 2), 0);
      interestScores[cat] = Math.round(((raw - qs.length) / (qs.length * 2)) * 100);
    }

    const personalityScores: Record<string, number> = {};
    for (const dim of ["A", "C", "E", "N", "O"]) {
      const qs = PART2_QUESTIONS.filter((q) => q.dimension === dim);
      const raw = qs.reduce((sum, q) => {
        const v = answers[q.id] ?? 3;
        return sum + (q.reverse_scored ? 6 - v : v);
      }, 0);
      personalityScores[dim] = Math.round(((raw - qs.length) / (qs.length * 4)) * 100);
    }

    const sorted = RIASEC_ORDER.slice().sort((a, b) => interestScores[b] - interestScores[a]);
    return {
      test_type: "career_aptitude",
      interest_scores: interestScores,
      personality_scores: personalityScores,
      holland_code: sorted.slice(0, 3).join(""),
      primary_type: sorted.slice(0, 3).join(""),
      summary: null,
    };
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <Box component="main" sx={styles.root}>
        <Container maxWidth="md">
          <StepsHeader
            step={step}
            total={TOTAL_STEPS}
            title={t("career_title")}
            subtitle={stepSubtitle}
            stepLabel={t("step_x_of_y", { step, total: TOTAL_STEPS })}
          />

          <OptionsHeader options={scaleLabels} />
          <Divider sx={{ mb: 1 }} />

          <Box sx={styles.questionsList}>
            {stepQuestions.map((q) => {
              const text = q.text as { ru: string; kk: string; en: string };
              return (
                <LikertWordQuestionCard
                  key={q.id}
                  title={text}
                  value={answers[q.id] ?? null}
                  onChange={(v) => handleAnswer(q.id, v)}
                  leftLabel={leftLabel}
                  rightLabel={rightLabel}
                  options={currentOptions}
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
